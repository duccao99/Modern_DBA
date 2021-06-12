const router = require('express').Router();
const productModel = require('../models/product.model');
const neo4jDriver = require('neo4j-driver');
const neo4jConfig = require('../config/neo4j.config');

// xem danh sach san pham - mongodb
router.get('/', async function (req, res) {
  const products = await productModel.find({});

  if (products.length === 0) {
    return res.status(404).json({
      message: 'Product not found!'
    });
  }

  return res.json({
    products
  });
});

// them 1 san pham

router.post('/', async function (req, res) {
  if (
    !req.body.proName ||
    !req.body.avatarUrl ||
    !req.body.price ||
    !req.body.category
  ) {
    return res.status(400).json({ message: 'Invalid data post!' });
  }

  const product = {
    proName: req.body.proName,
    avatarUrl: req.body.avatarUrl,
    price: +req.body.price,
    category: req.body.category
  };

  const ret_add = await productModel.create(product);

  return res.json({
    ret_add_product: ret_add
  });
});

// product detail neo4j
router.get('/:id', async function (req, res) {
  const id = +req.params.id;

  neo4jConfig.getPersonName((er, data) => {
    console.log(data);

    return res.json({
      data: data
    });
  });
});

module.exports = router;
