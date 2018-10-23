const mongoose = require('mongoose');

const Schema = mongoose.model('Question', mongoose.Schema({

    questionnaire: { type: String, required: true },
    id_fura: { type: String, required: true },
    group: { type: String, required: true },
    text: { type: String, required: true },
    options: {
        type: [{ type: String, required: true }],
        default: []
	},
    date: { type: Date, default: Date.now }

},
{ collection: 'questions' }));

module.exports = Schema;
    