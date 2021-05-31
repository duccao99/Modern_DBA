const router = require('express').Router();

router.get('/add-to-cart', async function (req, res) {
  res.render('vwCart/vwAddToCart', {
    layout: 'layout'
  });
});

router.post('/', async function (req, res) {
  const data = {
    user_id: req.body.user_id,
    cart_id: 1,
    pro_id: req.body.pro_id
  };
});

module.exports = router;
