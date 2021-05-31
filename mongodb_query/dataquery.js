const { MongoClient, ObjectId } = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config/mongodb.config');
const uri = config.mongodb;

let getDetail = async(productId)=>{
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("product").findOne({'_id': ObjectID(productId)})
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
        const result = await client.db("qtcsdlhd").collection("product").find({"breadcrumbs._id" : { $in : [ObjectID('60a7784b2583962d20be0fbc')]}}).skip(skip).limit(limit).toArray()
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}
let getCategory = async(categoryId) => {
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const result = await client.db("qtcsdlhd").collection("category").findOne({'_id':ObjectID(categoryId)})
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}
let postCategory = async(data)=>{
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        if(data.parent){
            const an = await client.db("qtcsdlhd").collection("category").findOne({'_id':ObjectID(data.parent)});
            var level = an['level'] + 1;
        }
        else{
            var level = 1;
        }
        var document = {
            'name': data.name ,
            'level': level,
            'ancestors':[]
        }
        if(level > 1){
            if(an.ancestors.length){
                an.ancestors.forEach(element => {
                    delete element['ancestors'];
                    document.ancestors.push(element); 
                });
            }
            delete an['ancestors'];
            document.ancestors.push(an);
        }        
        const result = await client.db("qtcsdlhd").collection("category").insertOne(document);
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}
let postProduct = async(data) => {
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const auth = await client.db("qtcsdlhd").collection("Shop").findOne({
            '_id':ObjectID(data.shopId),'userId':ObjectID(data.userId)},
            { projection: { shopName: 1 } })
        if(!auth){
            throw err;
        }
        const category = await client.db("qtcsdlhd").collection("category").findOne({'_id':ObjectID(data.categoryId)})
        var breadcrumbs = []
        category.ancestors.forEach(element => {
            breadcrumbs.push(element); 
        });
        delete category['ancestors'];
        breadcrumbs.push(category);
        breadcrumbs.push({'name' : data.name});
        var op_atr = [];
        data.option_attributes.forEach(element => {
            op_atr.push(JSON.parse(element));
        });
        var document = {
            "name": data.name,
            "description": "description",//data.description,
            "price": 100,//1 * data.price,
            "image": "https://images-na.ssl-images-amazon.com/images/I/715uwlmCWsL.jpg",
            "images": [
                "https://images-na.ssl-images-amazon.com/images/I/6110JInm%2BBL.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/41FuQMh3FUL.jpg"
            ],
            "option_attributes": op_atr,
            "breadcrumbs": breadcrumbs,
            "shop": auth, 
        }
        const result = await client.db("qtcsdlhd").collection("product").insertOne(document)
        const res = await client.db("qtcsdlhd").collection("Shop").updateOne({
            '_id':ObjectID(data.shopId),'userId':ObjectID(data.userId)
        },
        {
            '$push': {"products":{'_id':result.ops[0]._id,'name':result.ops[0].name,"breadcrumbs": result.ops[0].breadcrumbs}}
        })
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}
let postReview = async(data) => {
    try{
        const client = new MongoClient(uri, { useUnifiedTopology: true } );
        await client.connect({native_parser:true});
        const flag = await client.db("qtcsdlhd").collection("review").findOne({
            'object':ObjectID(data.objectId),
            "reviews.user" : { $in : [ObjectID(data.userId)]}         
        }) 
        if(flag){
            // xu li khi da review
            await client.close();
            throw err;
        }
        const rev = {
            "user": ObjectID(data.userId),
            "content": "sp dowr teej",
            "star": 1 * data.star
        };
        const result = await client.db("qtcsdlhd").collection("review").updateOne({
            'object':ObjectID(data.objectId),         
        },{
            "$push":{"reviews":rev},
            "$inc": {"rateValue": 1,"rateCount": rev.star}
        },
        { upsert: true }
        );
        await client.close();
        return result;
    } catch(err){
        throw err;
    }
}

module.exports = {
    getDetail:getDetail,
    getByCategory:getByCategory,
    getCategory:getCategory,
    postCategory:postCategory,
    postProduct:postProduct,
    postReview:postReview
}