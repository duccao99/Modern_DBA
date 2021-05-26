var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");


//get category by id
router.get("/category/:categoryId",async(req,res)=>{
    try {
        const result = await Dbquery.getCategory(req.params.categoryId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
//post category
router.post("/category",async(req,res)=>{
    try {
        const result =await Dbquery.postCategory(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
//get product by category
router.get("/product/category/:categoryId",async(req,res)=>{
    try{
        const result = await Dbquery.getByCategory(req.params.categoryId,1 * req.body.skip,1 * req.body.limit);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
//get product by id
router.get("/product/:productId",async(req,res)=>{
    try{
        const result = await Dbquery.getDetail(req.params.productId);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
}); 
// post product 
router.post("/product",async(req,res)=>{
    try{
        const result = await Dbquery.postProduct(req.body);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
// post a reviews 
router.post("/review",async(req,res)=>{
    try{
        const result = await Dbquery.postReview(req.body);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
module.exports = router;