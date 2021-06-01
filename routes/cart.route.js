const router = require('express').Router();
const redis = require('redis');
const db = redis.createClient();

/*
 * Command
    1. sadd key value - add data
    2. smembers key - get all data
    3. FLUSHDB - clear db
*/

router.get('/add-to-cart', async function (req, res) {
  res.render('vwCart/vwAddToCart', {
    layout: 'layout'
  });
});

router.get('/', async function (req, res) {});

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
