const router = require('express').Router();
const proModel = require('../models/product.model');
const expressHandlebars = require('express-handlebars');
const handlebars = require('handlebars');
const chalk = require('chalk');
const executionTime = require('execution-time')();

// const products = [
//   {
//     proName: 'a',
//     price: 123,
//     category: 'aasd'
//   },
//   {
//     proName: 'a',
//     price: 123,
//     category: 'aasd'
//   }
// ];

router.get('/', async function (req, res) {
  executionTime.start();
  const products = await proModel.find({});

  let product_ret = [];

  // console.log(products);

  for (let i = 0; i < products.length; ++i) {
    const templateProName = handlebars.compile('{{this.proName}}');
    const retProName = templateProName({ proName: products[i].proName });

    const templatePrice = handlebars.compile('{{this.price}}');
    const retPrice = templatePrice({ price: products[i].price });

    const templateCategory = handlebars.compile('{{this.category}}');
    const retCategory = templateCategory({ category: products[i].category });

    const templateAvatarUrl = handlebars.compile('{{this.avatarUrl}}');
    const retAvatarUrl = templateAvatarUrl({
      avatarUrl: products[i].avatarUrl
    });

    const templateProId = handlebars.compile('{{this.proId}}');
    const retProId = templateProId({
      proId: products[i]._id
    });

    product_ret.push({
      proId: retProId,
      proName: retProName,
      price: retPrice,
      category: retCategory,
      avatarUrl: retAvatarUrl
    });
  }

  const retTime = executionTime.stop();

  console.log(
    chalk.yellowBright(
      `Load all product - MongoDB execution time is: ` + retTime.time
    )
  );

  res.render('vwHome/HomePage', {
    layout: 'layout',
    products: product_ret,
    allowedProtoProperties: true,
    allowedProtoMethods: true
  });
});

module.exports = router;
