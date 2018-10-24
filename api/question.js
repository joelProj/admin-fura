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
	const data = await Question.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function addQuestion(req, res, next) {
	const data = await Question.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function removeQuestion(req, res, next){
        // Find all answers with question this ID and delete them (keep database coherent)
        var deleteAnswers = await Answer.find({quest:req.params.id}).select('_id').lean().exec();
        
        for (var i=0; i<deleteAnswers.length; i++) {
            await Answer.findByIdAndRemove(deleteAnswers[i]._id).exec();
        }
        
        await Question.findByIdAndRemove(req.params.id).exec();
        res.send({});
}

module.exports = router;
