const router = require("express").Router();
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");

const base_data = [
  {
    cart_id: 1,
    user_id: 1,
    pro_id: 1,
  },
  {
    cart_id: 2,
    user_id: 2,
    pro_id: 2,
  },
];

router.get("/", function (req, res) {
  client.on("error", function (er) {
    console.log(er, "host: " + client.host, "\nport: " + client.port);
  });

  client.set("key", "value", redis.print);
  client.hset("hash key", "hash test 1", "value", redis.print);
  client.hset(["hash key 2", "hash test 2", "value 2"], redis.print);

  client.quit(function (er, res) {
    console.log("Exiting from quit command");
  });

  res.json({
    message: "redis api",

    redis_host: client.host,
    redis_port: client.port,
  });
});

router.get("/search", function (req, res) {
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
            JSON.stringify({ source: "Redis Cache", ...responseJSON })
          );
          // Send JSON response to client
          return res
            .status(200)
            .json({ source: "Wikipedia API", ...responseJSON });
        })
        .catch((err) => {
          return res.json(err);
        });
    }
  });
});

module.exports = router;
