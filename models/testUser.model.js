const mongoose = require("mongoose");
const testUserSchema = new mongoose.Schema({
  username: {
    type: String,
  },

  half_life: {
    half_name: {
      type: String,
    },
  },
});

const testUserModel = mongoose.model(testUserSchema);
module.exports = testUserModel;
