var mongoose = require('mongoose');
var validator = require('validator');

var newSchema = new mongoose.Schema({
  // user type
  email: {
		type: String,
		validator: email => validator.isEmail(email),
		required: true
  },
  validationToken: { type: String },
  password: { type: String }, // digested

  type: {
      type: 'String',
      enum: ['Retail', 'Wholesale'],
      default: 'Retail'
  },

  // info

  name: { type: String },
  lastName: String,
  phone: String,

  company: { type: Boolean, default: false },

  billing: {
    nif: String,
    equivalence: Boolean,
    communitaryNIF: String,
    address: String,
    city: String,
    zip: String
    // country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' }
  },

  delivery: {
    name: String, // contact
    address: String,
    city: String,
    zip: String,
    // country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    // region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
    phone: String
  },

  registered : { type: Date, default: Date.now }
}, {
    collection: 'customers'
});

module.exports = mongoose.model('Customer', newSchema);
