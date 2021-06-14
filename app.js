const express = require("express");
const cors = require("cors");
const path = require('path');
const responseTime = require("response-time");

const app = express();
// const bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(responseTime());

app.use('/assets', express.static('assets'));

app.get("/", function (req, res) {
  res.json({ message: "hi" });
});

// app.use("/api/redis", require("./routes/redis.route"));
app.use("/2287",(req,res)=>{
  res.sendFile(path.join(__dirname, './assets/html/2287index.html'));
})
app.use("/api/2287",require("./routes/mongodb.route"));

const PORT = 1212 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`The URL: http://localhost:${PORT}`);
});
