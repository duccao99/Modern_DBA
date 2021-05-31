const router = require('express').Router();
const axios = require('axios');

const redis = require('redis');
const client = redis.createClient();

const base_data = [
  {
    cart_id: 1,
    user_id: 1,
    pro_id: 1
  },
  {
    cart_id: 2,
    user_id: 2,
    pro_id: 2
  }
];

router.get('/', function (req, res) {
  client.on('error', function (er) {
    console.log(er, 'host: ' + client.host, '\nport: ' + client.port);
  });

  client.set('key', 'value', redis.print);
  client.hset('hash key', 'hash test 1', 'value', redis.print);
  client.hset(['hash key 2', 'hash test 2', 'value 2'], redis.print);

  client.quit(function (er, res) {
    console.log('Exiting from quit command');
  });

  res.json({
    message: 'redis api',

    redis_host: client.host,
    redis_port: client.port
  });
});

router.post('/cart/add', function (req, res) {
  const body_data = {
    cart_id: req.body.cart_id,
    user_id: req.body.user_id,
    pro_id: req.body.pro_id
  };
  //  user id
  client.set(
    `cart:${body_data.cart_id}:user_id`,
    body_data.user_id,
    redis.print
  );
  client.set(`cart:${body_data.cart_id}:pro_id`, body_data.pro_id, redis.print);
  client.MGET(
    [`cart:${body_data.cart_id}:pro_id`, `cart:${body_data.cart_id}:user_id`],
    function (er, ret) {
      console.log(ret);
      return res.json({
        data_added: {
          cart_id: body_data.cart_id,
          pro_id: ret[0],
          user_id: ret[1]
        }
      });
    }
  );

  // pro id
});

router.get('/basket/getBasket', function (req, res) {
  const redisConfig = require('../config/redis.config');
  redisConfig.createConnection().then(function (client) {
    client.hgetall('basket', (er, ret) => {
      if (ret) {
        res.json({
          data: ret
        });
      } else {
        res.json({
          er
        });
      }
    });
  });
});

router.post('/basket/add', function (req, res) {
  const redisConfig = require('../config/redis.config');

  redisConfig.createConnection().then(function (client) {
    const basket = JSON.stringify(req.body.basket);
    const basket_cart_id = req.body.basket_cart_id;

    client.hset(basket_cart_id, 'basket', basket, redis.print);

    client.hgetall(basket_cart_id, (er, ret) => {
      if (ret) {
        res.json({
          full_data: ret,
          data: JSON.parse(ret.basket)
        });
      } else {
        res.json({
          er
        });
      }
    });

    client.quit((er, rep) => {
      if (!er) {
        console.log(rep);
      } else {
        console.log(er);
      }
    });
  });
});

router.get('/search', function (req, res) {
  // Extract the query from url and trim trailing spaces
  console.log(req.query);
  const query = req.query.query.trim();
  // Build the Wikipedia API url
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;

  // Try fetching the result from Redis first in case we have it cached
  return client.get(`wikipedia:${query}`, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } else {
      // Key does not exist in Redis store
      // Fetch directly from Wikipedia API
      return axios
        .get(searchUrl)
        .then((response) => {
          const responseJSON = response.data;
          // Save the Wikipedia API response in Redis store
          client.setex(
            `wikipedia:${query}`,
            3600,
            JSON.stringify({ source: 'Redis Cache', ...responseJSON })
          );
          // Send JSON response to client
          return res
            .status(200)
            .json({ source: 'Wikipedia API', ...responseJSON });
        })
        .catch((err) => {
          return res.json(err);
        });
    }
  });
});

module.exports = router;
