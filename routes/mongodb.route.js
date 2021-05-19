var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");

router.get("/product/category/:categoryId",async(req,res)=>{
    try{
        const result = await Dbquery.getByCategory(1 * req.params.categoryId,req.body.skip,req.body.limit);
        const category = await Dbquery.getDetailCategory(1 * req.params.categoryId);         
        return res.status(200).json({result,category});
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/product/:productId",async(req,res)=>{
    try{
        const result = await Dbquery.getDetail(req.params);
        return res.status(200).json(result);
    } catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
}); 
module.exports = router;