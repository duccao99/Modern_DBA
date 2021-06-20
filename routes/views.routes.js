var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");
const Neo4jquery = require("../mongodb_query/neo4jquery");
const AuthMiddleWare = require("../middleware/auth");
const crypto = require('crypto');


const redis = require("redis");
const client = redis.createClient({
    host: 'redis-19009.c253.us-central1-1.gce.cloud.redislabs.com',
    port: 19009,
    password: '0EUqKArE2aWKf6sO0UihOtIJaNAx96Qi'
});


router.get("/detail/:productId",async(req,res)=>{
    try {
        const result = await Dbquery.getDetail(req.params.productId);
        const pwith = await Neo4jquery.getWith(req.params.productId);
        var cok = req.cookies.accessId
        if(cok){
            res.cookie('accessId', cok, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
        // res.status(200).send({"ok":1});
        } else {
        // console.log("no");
            var cok = crypto.randomBytes(48).toString('hex')
            res.cookie('accessId', cok, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
            // req.session.accessId = token
            // res.end("success")
        }
        client.lrange(`${cok}`,0,-1, async (err, list_result) => {
            if (err) throw err;
            if (list_result) {
              const temp = JSON.parse(JSON.stringify(await Dbquery.getDetail(req.params.productId)));
              var result_h = []
              list_result.forEach(function (item, index) {
                result_h.push(JSON.parse(item));
              });
              var listid = []
              result_h.forEach(function(item){
                listid.push(item['_id'])
              })
              if(!listid.includes(temp['_id'])){
                client.rpush(`${cok}`,JSON.stringify(temp));
              }
              client.ltrim(`${cok}`,-4,-1);
              client.expire(`${cok}`, 60 * 60 * 24)
              return res.render('detail',{result,pwith,result_h});
              // console.log(result)
              //res.status(200).json(result);
              // res.status(200).send({
              //     jobs: JSON.parse(result),
              //     message: "data retrieved from the cache"
              // });
            } else {
              const product = await Dbquery.getDetail(req.params.productId);
              // redisClient.setex(`${cok}`, 600, JSON.stringify(result));
              client.rpush(`${cok}`,JSON.stringify(product));
              var result_h = []
              return res.render('detail',{result,pwith,result_h});
              //res.status(200).json(result);
              // res.status(200).send({
              //     jobs: result,
              //     message: "cache miss"
              // });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/common/:categoryId",async(req,res)=>{
    try {
        // const categoryId = req.params.categoryId;
        // const skip = req.query.skip || 0;
        // const limit = req.query.limit || 10;
        // client.get(`${categoryId}:${skip}:${limit}`, async (err, product) => {
        //     if (err) throw err;
    
        //     if (product) {
        //         console.log("cache");
        //         const category = await Dbquery.getCategory(req.params.categoryId);
        //         product = JSON.parse(product)
        //         return res.render('common',{category,product});
        //         // res.status(200).send({
        //         //     jobs: JSON.parse(result),
        //         //     message: "data retrieved from the cache"
        //         // });
        //     } else {
        //         const category = await Dbquery.getCategory(categoryId);
        //         const product = await Dbquery.getByCategory(categoryId);
        //         client.setex(`${categoryId}:${skip}:${limit}`, 600, JSON.stringify(product));
        //         console.log(product)
        //         return res.render('common',{category,product});
        //         // res.status(200).send({
        //         //     jobs: result,
        //         //     message: "cache miss"
        //         // });
        //     }
        // });
        
        const category = await Dbquery.getCategory(req.params.categoryId);
        const product = await Dbquery.getByCategory(req.params.categoryId);
        return res.render('common',{category,product});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
module.exports = router;