const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

const Schema = mongoose.model('Answer', mongoose.Schema({
    
    uuid: { type: String, required: true },
    userCode: { type: String, default: "-" },
    quest: { type: ObjectId, ref: 'Question', required: true },
    group: { type: String, default: "-" },
    value: { type: String, required: true },
    date: { type: Date, default: Date.now }

},
{ collection: 'answers' }));

module.exports = Schema;