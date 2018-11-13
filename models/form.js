const mongoose = require('mongoose');

const Schema = mongoose.model('Form', mongoose.Schema({

    name: { type: String, required: true },
    date: { type: Date, default: Date.now }

},
{ collection: 'forms' }));

module.exports = Schema;
    