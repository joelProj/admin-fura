const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

const Schema = mongoose.model('Question', mongoose.Schema({

    form: { type: ObjectId, ref: 'Form', required: true },
    id_fura: { type: String, required: true },
    default: { type: String, required: true },
    text: { type: String, required: true },
    // timer: { type: Number, required: false, min: [0, 'Value must be positive'], default:0},
    timer: { type: Number, required: true}, //amount of seconds
    answers: { type: String, required: true },
    date: { type: Date, default: Date.now }

},
{ collection: 'questions' }));

module.exports = Schema;
    
