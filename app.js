require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const responseTime = require('response-time');
const app = express();
const expressHandlebarsSections = require('express-handlebars-sections');
const expressSession = require('express-session');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

require('express-async-errors');
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(responseTime());

app.engine(
  'hbs',
  expressHandlebars({
    extname: '.hbs',
    layoutsDir: 'views/_layouts',
    partialsDir: 'views/_partials',
    helpers: {
      section: expressHandlebarsSections()
    }
  })
);

app.set('view engine', 'hbs');
app.use(
  expressSession({
    secret: 'sc',
    resave: false,
    saveUninitialized: true,
    authUser: {}
  })
);

require('./config/mongoose.config');

app.use('/2287', (req, res) => {
  res.sendFile(path.join(__dirname, './assets/html/2287index.html'));
});
app.use('/api/2287', require('./routes/mongodb.route'));

app.use('/', require('./routes/home.route'));
app.use('/api/onboarding', require('./routes/onboard.route'));
app.use('/api/product', require('./routes/product.route'));
app.use('/api/cart', require('./routes/cart.route'));

app.use(function (er, req, res, next) {
  console.log(er.stack);
  return res.status(500).json({
    message: er.stack
  });
});

const PORT = 1212 || process.env.PORT;
app.listen(PORT, function () {
  console.log(`The URL: http://localhost:${PORT}`);
});
