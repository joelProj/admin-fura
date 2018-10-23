var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: { type: String, required: true },

  address: { type: String, required: true },
  zip: { type: String, required: true },
  city: { type: String, required: true },

  image: { type: String, required: true }
}, {
    collection: 'shops'
});

module.exports = mongoose.model('Shop', schema);
