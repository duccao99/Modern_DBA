const router = require('express').Router();
const redis = require('redis');
const db = redis.createClient();
const proModel = require('../models/product.model');
const handlebars = require('handlebars');

/*
 * Command
    1. sadd key value - add data
    2. smembers key - get all data
    3. FLUSHDB - clear db
*/
router.get('/', async function (req, res) {
  db.smembers('cart_id:3:pro_id', async (er, ret) => {
    if (er) {
      return res.status(500).json({
        message: er
      });
    } else {
      const cart = ret;
      console.log(ret);
      let cart_data = [];

      for (let i = 0; i < cart.length; ++i) {
        const pro = await proModel.find({
          _id: cart[i]
        });

        const templateProName = handlebars.compile('{{this.proName}}');
        const retProName = templateProName({ proName: pro[0].proName });

        const templatePrice = handlebars.compile('{{this.price}}');
        const retPrice = templatePrice({ price: pro[0].price });

        const templateCategory = handlebars.compile('{{this.category}}');
        const retCategory = templateCategory({ category: pro[0].category });

        const templateAvatarUrl = handlebars.compile('{{this.avatarUrl}}');
        const retAvatarUrl = templateAvatarUrl({
          avatarUrl: pro[0].avatarUrl
        });

        const templateProId = handlebars.compile('{{this.proId}}');
        const retProId = templateProId({
          proId: pro[0]._id
        });

        cart_data.push({
          proId: retProId,
          proName: retProName,
          price: retPrice,
          category: retCategory,
          avatarUrl: retAvatarUrl
        });
      }
      console.log(cart_data);

      return res.render('vwCart/vwCart', {
        layout: 'layout',
        cart: cart_data
      });
    }
  });
});

router.get('/add-to-cart', async function (req, res) {
  res.render('vwCart/vwAddToCart', {
    layout: 'layout'
  });
});

router.post('/', async function (req, res) {
  if (!req.body.user_id || !req.body.pro_id) {
    return res.status(400).json({
      message: 'Invalid data post!'
    });
  }

  const data = {
    user_id: req.body.user_id,
    cart_id: 1,
    pro_id: req.body.pro_id
  };

  db.sadd(`cart_id:3:pro_id`, data.pro_id, (er, ret_proId) => {
    if (er) {
      return res.status(500).json({
        message: er
      });
    } else {
      db.sadd(`cart_id:3:user_id`, data.user_id, (er, ret_userId) => {
        if (er) {
          return res.status(500).json({
            message: er
          });
        } else {
          return res.json({
            ret_add_proId: ret_proId,
            ret_add_userId: ret_userId
          });
        }
      });
    }
  });
});

module.exports = router;
