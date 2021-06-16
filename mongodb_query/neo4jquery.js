const neo4j = require('neo4j-driver')
var config = require('../config/mongodb.config');
const nuri = config.neo4j;
const { MongoClient } = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config/mongodb.config');
const uri = config.mongodb;

let postCategory = async(name,id,parent=null)=>{
    try{
        // const client = new MongoClient(uri, { useUnifiedTopology: true } );
        // await client.connect({native_parser:true});
        // if(parent){
        //     var parentnode = await client.db("qtcsdlhd").collection("category").findOne({'_id':ObjectID(parent)});
        // }
        // const currentnode = await client.db("qtcsdlhd").collection("category").findOne({'name':name});
        const driver = neo4j.driver(nuri, neo4j.auth.basic("neo4j", "123456"))
        const session = driver.session()
        var checkcurrent = await session.run(
            `match (a:Category {name: $name }) return a`,
            { name: name}
          );
        if(checkcurrent['records'].length){
            await driver.close()
            return {}
        }
        if(parent){
            var create = await session.run(
                `CREATE (a:Category {name: $name,id: $id})`,
                { name: name ,id: id}
              );
            const query = `  
                MATCH
                    (a:Category),
                    (b:Category)
                    WHERE a.id = $id AND b.id = $pid
                    CREATE (a)-[r:IS_IN]->(b)
                    RETURN type(r)
                `
            var result = await session.run(
                query,
                { name: name ,id: id,pid: parent}
              )
        }
        else{
            const query = `
                CREATE (a:Category {name: $name, id: $id}) return a;  
                `
            var result = await session.run(
                query,
                { name: name,id: id}
              )
        }
        //const singleRecord = result.records[0]
        //const node = singleRecord.get(0)
        // console.log(node.properties.name)
        await driver.close()
        return result
    } catch(err){
        throw err;
    }
} 
let postProduct = async(productId,categoryId,shopId)=>{
    try{
        const driver = neo4j.driver(nuri, neo4j.auth.basic("neo4j", "123456"))
        const session = driver.session()
        var checkcurrent = await session.run(
            `match (a:Product {id: $id }) return a`,
            { id: productId}
          );
        if(checkcurrent['records'].length){
            await driver.close()
            return {}
        }
        const product_shop = await session.run(
            `CREATE (a:Product {id: $id})`,
            { id: productId}
          );
        const p_s_query = `  
            MATCH
                (a:Product),
                (b:Shop)
                WHERE a.id = $pid AND b.id = $sid
                CREATE (a)-[r:IN]->(b)
                RETURN type(r)
            `
        var result = await session.run(
            p_s_query,
            { pid: productId ,sid: shopId}
          )
        const query = `  
            MATCH
                (a:Product),
                (b:Category)
                WHERE a.id = $pid AND b.id = $cid
                CREATE (a)-[r:BELONG]->(b)
                RETURN type(r)
            `
        var result = await session.run(
            query,
            { pid: productId ,cid: categoryId}
          )
        await driver.close()
        return result
    } catch(err){
        throw err;
    }
}
let postShop = async(shopId,ShopName)=>{
    try{
        const driver = neo4j.driver(nuri, neo4j.auth.basic("neo4j", "123456"))
        const session = driver.session()
        var checkcurrent = await session.run(
            `match (a:Shop {id: $id }) return a`,
            { id: shopId}
          );
        if(checkcurrent['records'].length){
            await driver.close()
            return {}
        }
        const result = await session.run(
            `CREATE (a:Shop {id: $id,name: $name}) return a`,
            { id: shopId,name: ShopName}
          );
        await driver.close()
        return result
    } catch(err){
        throw err;
    }
}
let postWith = async(itemaId,itembId)=>{
    try{
        const driver = neo4j.driver(nuri, neo4j.auth.basic("neo4j", "123456"))
        const session = driver.session()
        var checkcurrent = await session.run(
            `match(n)-[:WITH]-(m) where n.id=$id1 and m.id=$id2 return n,m`,
            { id1: itemaId,id2: itembId}
          );
        if(checkcurrent['records'].length){
            const result = await session.run(
                `match(n)-[r:WITH]-(m) where n.id=$id1 and m.id=$id2 set r.time = r.time + 1 return n,m
                `,
                { id1: itemaId,id2: itembId}
              );
            await driver.close()
            return result
        }
        const result = await session.run(
            `match(n),(m) where n.id=$id1 and m.id=$id2 CREATE (n)-[:WITH{time:1}]->(m) return n,m
            `,
            { id1: itemaId,id2: itembId}
          );
        await driver.close()
        return result
    } catch(err){
        throw err;
    }
}
let getWith = async(itemaId,skip=0,limit=20)=>{
    try{
        const driver = neo4j.driver(nuri, neo4j.auth.basic("neo4j", "123456"))
        const session = driver.session()
        const id_result = await session.run(
            `MATCH (a:Product{id:$id1})-[r:WITH*1..2]-(b:Product) where all(w in r where w.time =4 )  RETURN distinct b.id 
            `,
            { id1: itemaId}
          );
        await driver.close()
        var p_list = []
        id_result['records'].forEach(element => p_list.push(ObjectID(element['_fields'][0])));
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("product").find({"_id" : { $in : p_list}}).skip(1 * skip).limit(1 * limit).toArray()
        await client.close();
        return result
    } catch(err){
        throw err;
    }
} 
module.exports = {
    postCategory:postCategory,
    postProduct:postProduct,
    postShop:postShop,
    postWith:postWith,
    getWith:getWith
}