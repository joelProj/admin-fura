Promise = require('bluebird');
const express = require('express');
const router = express.Router();
// DB
const Answer = require('../models/answer.js');
const Question = require('../models/question.js');

// API DEFINITIONS
router.get('/answers/:id', getAnswer);
router.get('/answers', listAnswers);

// API ROUTINES
async function listAnswers(req, res, next){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;



	if(req.query._filters){
		const validId = await Question.findOne(JSON.parse(req.query._filters || '{}')).select('_id').lean().exec();

		const count = await Answer.count({quest: validId}).exec();
		res.set("X-Total-Count", count);
	
		var answers = await Answer.find({quest: validId}).sort(sortBy).skip(start).limit(perPage).lean().exec();
	}
	else{
		const count = await Answer.count({}).exec();
		res.set("X-Total-Count", count);
	
		var answers = await Answer.find({}).sort(sortBy).skip(start).limit(perPage).lean().exec();
	}

	res.send(answers);
}

async function getAnswer(req, res, next){
	const data = await Answer.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

module.exports = router;
