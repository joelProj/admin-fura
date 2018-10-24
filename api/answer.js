const express = require('express');
const router = express.Router();
// DB
const Answer = require('../models/answer.js');

// API DEFINITIONS
router.get('/answers/:id', getAnswer);
router.get('/answers', listAnswers);

// API ROUTINES
async function listAnswers(req, res, next){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = await Answer.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const answers = await Answer.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(answers);
}

async function getAnswer(req, res, next){
	const data = await Answer.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

module.exports = router;
