var mongoose = require('mongoose');

var newSchema = new mongoose.Schema({
	active: { type: Boolean, default: false },

	name: String,
	description: String,

	type: {
			type: String,
			enum: ['Coffee', 'Course', 'Equipment', 'Merchandising'],
			required: true
	},

	images: [ {
		url: String,
		description: String,
		index: Number
	} ],

	price: { type: Number, default: 0 },
	vat: { type: Number, default: 15 },
	weight: { type: Number, default: 0 } // in grams
}, {
		collection: 'products'
});

module.exports = mongoose.model('Product', newSchema);
