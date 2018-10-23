var mongoose = require('mongoose');

var newSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  thumbnail: { type: String, required: true },
  title: { type: String, required: true },

	blocks: [
		{
			type: {
				type: String,
				enum: ['title', 'paragraph', 'quote', 'image', 'images', 'divider'],
				required: true
			},
			text: String,
			url1: String,
			url2: String,
			index: Number // used for sorting entries
		}
	]
}, {
    collection: 'posts'
});

module.exports = mongoose.model('Post', newSchema);
