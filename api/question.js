const express = require('express');
const router = express.Router();
// DB
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');

// API DEFINITIONS
router.get('/questions/:id', getQuestion);
router.get('/questions', listQuestions);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', removeQuestion);

// API ROUTINES
async function listQuestions(req, res, next){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = await Question.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const questions = await Question.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(questions);
}

async function getQuestion(req, res, next){
	const data = await Question.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function updateQuestion(req, res, next){
	if(req.body.id_fura){
		var count = await Question.find({id_fura: req.body.id_fura}).count().exec();
		if(count > 0) return res.status(500).send({error: 'id_fura already exists'});
	}
	if(req.body.id_fura && !req.body.id_fura.length) return res.status(500).send({error: "Camp id_fura can't be empty"});
	if(req.body.text && !req.body.text.length) return res.status(500).send({error: "Camp text can't be empty"});
	if(req.body.group && !req.body.group.length) return res.status(500).send({error: "Camp group can't be empty"});
	if(req.body.options && !req.body.options.length) return res.status(500).send({error: "Question must have some options"});
	if(req.body.options){
		var wOption = req.body.options.reduce((prev,curr)=>{if(prev) return prev; else return !curr.length}, false);
		if(wOption) return res.status(500).send({error: "Can't have an empty option"});
	} 

	const data = await Question.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function addQuestion(req, res, next) {
	if(!req.body || !req.body.questionnaire || !req.body.id_fura || !req.body.group || !req.body.text || !req.body.options.length) return res.status(500).send({error: 'Missing parameters'});
	var count = await Question.find({id_fura: req.body.id_fura}).count().exec();
	if(count > 0) return res.status(500).send({error: 'id_fura already exists'});
	const data = await Question.create(req.body);
	res.send(data);
}

async function removeQuestion(req, res, next){
<<<<<<< HEAD
	console.log("question: ", req.params.id);
	// var answers = await Answer.find().lean().exec();
	var answers = await Answer.find({quest: req.params.id}).lean().exec();
	
	console.log("answers: ", answers);

	// await Question.findByIdAndRemove(req.params.id).exec();
	res.send();
=======
        // Find all answers with question this ID and delete them (keep database coherent)
        var deleteAnswers = await Answer.find({quest:req.params.id}).select('_id').lean().exec();
        
        for (var i=0; i<deleteAnswers.length; i++) {
            await Answer.findByIdAndRemove(deleteAnswers[i]._id).exec();
        }
        
        await Question.findByIdAndRemove(req.params.id).exec();
        res.send({});
>>>>>>> 5cb59a1cf216265062328e6bed7c13fe94279ae5
}

module.exports = router;
