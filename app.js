const express = require("express");
const redis = require("redis");

const cors = require("cors");

const app = express();
const client = redis.createClient();

client.on("error", function (er) {
  console.log(er);
});

client.set("name", "duccao", redis.print);
client.get("name", redis.print);

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.json({ message: "hi" });
});

const PORT = 1212 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`The URL: http://localhost:${PORT}`);
});
