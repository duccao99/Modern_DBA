const mongoose = require('mongoose');
const url = process.env.MONGO_CLOUD_URL;

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (er) => {
    if (er) {
      console.log('Cannot connect to mongo cloud!');
      console.log(er);
    } else {
      console.log('Connected to mongo cloud');
    }
  }
);
