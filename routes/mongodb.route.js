var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");
const AuthMiddleWare = require("../middleware/auth")


// category 
router.get("/category",async(req,res)=>{
    try {
        const result = await Dbquery.getCategoryLevel1();
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
//to do
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
        const result = await Dbquery.getByCategory(req.params.categoryId,1 * req.body.skip,1 * req.body.limit);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/product/noibat",async(req,res)=>{
    try{
        const result = await Dbquery.getNoiBat(1 * req.body.skip,1 * req.body.limit);
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
// router.post("/initshop",AuthMiddleWare.isAuth,async(req,res)=>{
//     try{
//         req.body.userId = req.decoded['id'];
//         const result = await Dbquery.postShop(req.body);
//         return res.status(200).json(result);
//     } catch(error){
//         console.log(error);
//         return res.status(500).json(error);
//     }
// })


module.exports = router;