const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  proName: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
