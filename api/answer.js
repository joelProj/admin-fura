const express = require('express');
const router = express.Router();
// DB
const Answer = require('../models/answer.js');

// API DEFINITIONS
router.get('/answers/:id', getAnswer);
router.get('/answers', listAnswers);
router.post('/answers', addAnswer);
router.put('/answers/:id', updateAnswer);
router.delete('/answers/:id', removeAnswer);

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

async function updateAnswer(req, res, next){
	req.body.date = new Date();

	const data = await Answer.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function addAnswer(req, res, next) {
	req.body.date = new Date();

	const data = await Answer.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function removeAnswer(req, res, next){
	await Answer.findByIdAndRemove(req.params.id).exec();
	res.send();
}

module.exports = router;
