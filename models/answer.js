const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

const Schema = mongoose.model('Answer', mongoose.Schema({
    
    //deviceId: { type: String, required: true },
    group: { type: String, required: true },
    value: { type: String, required: true },
    question: { type: ObjectId, ref: 'Question', required: true },
    date: { type: Date, default: Date.now }

},
{ collection: 'answers' }));

module.exports = Schema;