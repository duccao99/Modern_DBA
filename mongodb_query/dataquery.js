const { MongoClient } = require('mongodb');
var config = require('../config/mongodb.config');
const uri = config.mongodb;
var ObjectID = require('mongodb').ObjectID;

let getDetail = async(data)=>{
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("product").findOne({'_id': ObjectID(data.productId)})
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
} 

let getByCategory = async(categoryId,skip = 0, limit = 30)=>{
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("product").find({"breadcrumbs.category_id" : { $in : [categoryId]}}).skip(skip).limit(limit).toArray()
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}

let getDetailCategory = async(categoryId) => {
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("category").findOne({'id':categoryId})
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}
module.exports ={
    getDetail:getDetail,
    getByCategory:getByCategory,
    getDetailCategory:getDetailCategory
}