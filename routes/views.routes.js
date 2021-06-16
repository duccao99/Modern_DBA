var express = require('express');
var router = express.Router();
const Dbquery = require("../mongodb_query/dataquery");
const Neo4jquery = require("../mongodb_query/neo4jquery");
const AuthMiddleWare = require("../middleware/auth");
const { json } = require('express');

router.get("/detail/:productId",async(req,res)=>{
    try {
        const result = await Dbquery.getDetail(req.params.productId);
        const pwith = await Neo4jquery.getWith(req.params.productId);
        return res.render('detail',{result,pwith});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
router.get("/common/:categoryId",async(req,res)=>{
    try {
        const category = await Dbquery.getCategory(req.params.categoryId);
        const product = await Dbquery.getByCategory(req.params.categoryId);
        return res.render('common',{category,product});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})
module.exports = router;