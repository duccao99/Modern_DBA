const express = require("express");
const cors = require("cors");
const path = require('path');
var bodyParser = require('body-parser');
const responseTime = require("response-time");

const multer  = require('multer')
const upload = multer();

const app = express();
// const bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(responseTime());

app.use('/check',upload.any(),(req,res)=>{
  console.log(req);
  res.status(200).json("g1");
})
app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'assets/views'));
app.set('view engine', 'jade');


// app.get("/", function (req, res) {
//   res.json({ message: "hi" });
// });
app.use('/',require("./routes/views.routes"));
// app.use("/api/redis", require("./routes/redis.route"));
app.use("/2287",(req,res)=>{
  res.sendFile(path.join(__dirname, './assets/html/2287index.html'));
})
app.use("/api/2287",require("./routes/mongodb.route"));

const PORT = 1212 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`The URL: http://localhost:${PORT}`);
});
