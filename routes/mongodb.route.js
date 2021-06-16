var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");
const Neo4jquery = require("../mongodb_query/neo4jquery");
const AuthMiddleWare = require("../middleware/auth")

router.post("/category/neo4j",async(req,res)=>{
    try {
        const result = await Neo4jquery.postCategory(req.body.name,req.body.id,req.body.parentId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.post("/product/neo4j",async(req,res)=>{
    try {
        const result = await Neo4jquery.postProduct(req.body.productId,req.body.categoryId,req.body.shopId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.post("/shop/neo4j",async(req,res)=>{
    try {
        const result = await Neo4jquery.postShop(req.body.shopId,req.body.shopName);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.post("/with/neo4j",async(req,res)=>{
    try {
        const result = await Neo4jquery.postWith(req.body.itemaId,req.body.itembId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/with/neo4j",async(req,res)=>{
    try {
        const result = await Neo4jquery.getWith(req.body.itemaId,req.body.skip,req.body.limit);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
// category 
router.get("/category",async(req,res)=>{
    try {
        const result = await Dbquery.getCategory_v2(req.body.level || req.query.level,req.body.parent||req.query.parent);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/category/findbyname",async(req,res)=>{
    try {
        const result = await Dbquery.findcategorybyname(req.body.name);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/category/:categoryId",async(req,res)=>{
    try {
        const result = await Dbquery.getCategory(req.params.categoryId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.post("/category",async(req,res)=>{
    try {
        const result =await Dbquery.postCategory(req.body.name,req.body.parent);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/category/noibat",async(req,res)=>{
    try{
        const result = await Dbquery.getByCategory(req.params.categoryId,1 * req.body.skip,1 * req.body.limit);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
// product
router.get("/product/category/:categoryId",async(req,res)=>{
    try{
        const result = await Dbquery.getByCategory(req.params.categoryId,req.body.skip,req.body.limit);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/product/noibat",async(req,res)=>{
    try{
        const result = await Dbquery.getNoiBat(req.body.skip,req.body.limit);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/product/:productId",async(req,res)=>{
    try{
        const result = await Dbquery.getDetail(req.params.productId);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
}); 
router.get("/product/search",async(req,res)=>{
    res.status(200).json("goo");
})
router.post("/product",AuthMiddleWare.isShop,async(req,res)=>{
    try{
        const result = await Dbquery.postProduct(req.decoded['id'],req.body.shopId,req.body.categoryId,req.body.name,req.body.option_attributes,req.body.price);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
// reviews for shop or product
router.post("/review",AuthMiddleWare.isAuth,async(req,res)=>{
    try{
        const result = await Dbquery.postReview(req.decoded['id'],req.objectId,req.star);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
//todo
router.get("/review/:objectId",async(req,res)=>{
    res.status(200).json("ok");
})
//create shop
router.post("/shop",AuthMiddleWare.isShop,async(req,res)=>{
    try{
        req.body.userId = req.decoded['id'];
        const result = await Dbquery.postShop(req.body.userId,req.body.shopName);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})


module.exports = router;