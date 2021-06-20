const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const crypto = require('crypto');
var bodyParser = require('body-parser');
// session redis
const Dbquery = require("./mongodb_query/dataquery");
const session = require('express-session');
app.use(session({
  secret:"bao2287",
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))
// const RedisStore = require('connect-redis')(session);
// const redis = require('redis');
// // const redisClient  = redis.createClient()
// const redisClient  = redis.createClient({
//   host: 'redis-19009.c253.us-central1-1.gce.cloud.redislabs.com',
//   port: 19009,
//   password: '0EUqKArE2aWKf6sO0UihOtIJaNAx96Qi'
// });
// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'bao2287',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//       secure: false, // if true only transmit cookie over https
//       httpOnly: false, // if true prevent client side JS from reading the cookie 
//       maxAge: 1000 * 60 * 10 // session max age in miliseconds
//   }
// }))
// app.get("/getses/:productId", async (req, res) => {
//   try {
//     // console.log(req.cookies)
//     const isbn = req.params.productId;
//     // const sess = req.session;
//     var cok = req.cookies.accessId
//     // console.log(cok)
//     if(cok){
//       console.log(cok)
//       // res.status(200).send({"ok":1});
//     } else {
//       // console.log("no");
//       var cok = crypto.randomBytes(48).toString('hex')
//       res.cookie('accessId', cok)
//         // req.session.accessId = token
//         // res.end("success")
//     }
//     // console.log(cok)
//     // console.log(req.session.accessId)
//     redisClient.lrange(`${cok}`,0,-1, async (err, list_result) => {
//         if (err) throw err;
//         if (list_result) {
//           const temp = JSON.parse(JSON.stringify(await Dbquery.getDetail(isbn)));
//           var result = []
//           list_result.forEach(function (item, index) {
//             result.push(JSON.parse(item));
//           });
//           var listid = []
//           result.forEach(function(item){
//             listid.push(item['_id'])
//           })
//           if(!listid.includes(temp['_id'])){
//             redisClient.rpush(`${cok}`,JSON.stringify(temp));
//           }
//           // console.log(result)
//           res.status(200).json(result);
//           // res.status(200).send({
//           //     jobs: JSON.parse(result),
//           //     message: "data retrieved from the cache"
//           // });
//         } else {
//           console("part1")
//           const result = await Dbquery.getDetail(isbn);
//           // redisClient.setex(`${cok}`, 600, JSON.stringify(result));
//           redisClient.rpush(`${cok}`,JSON.stringify(result));
//           res.status(200).json(result);
//           // res.status(200).send({
//           //     jobs: result,
//           //     message: "cache miss"
//           // });
//         }
//     });
//   } catch(err) {
//       res.status(500).send({message: err.message});
//   }
// });
// app.get("/setses", (req, res) => {
//   require('crypto').randomBytes(48, function(err, buffer) {
//     var token = buffer.toString('hex');
//     req.session.accessId = token
//     res.end("success")
//   });
// });



// 
const multer  = require('multer')
const upload = multer();

const responseTime = require("response-time");
app.use(responseTime());

// const bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(responseTime());

// app.use('/check',upload.any(),(req,res)=>{
//   console.log(req);
//   res.status(200).json("g1");
// })
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
app.use("/api/redis",require("./routes/2287redis"));
const PORT = 1212 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`The URL: http://localhost:${PORT}`);
});
