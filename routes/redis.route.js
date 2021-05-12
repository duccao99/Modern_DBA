const router = require("express").Router();
const redis = require("redis");
const client = redis.createClient();

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

module.exports = router;
