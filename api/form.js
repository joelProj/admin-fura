const express = require('express');
const router = express.Router();
// DB
const Form = require('../models/form.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');

// API DEFINITIONS
router.get('/forms/:id', getForm);
router.get('/forms', listForms);
router.post('/forms', addForm);
router.put('/forms/:id', updateForm);
router.delete('/forms/:id', removeForm);

// API ROUTINES
async function listForms(req, res, next){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = await Form.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const forms = await Form.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).lean().exec();
	res.send(forms);
}

async function getForm(req, res, next){
	var data = await Form.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	
	res.send(data);
}

async function updateForm(req, res, next){
	if(!req.body.name || !req.body.name.length) return res.status(500).send({error: 'Name required'});
	
	//Check id already exists
	var firstForm = await Form.findOne({name: req.body.name}).lean().exec();
	if(firstForm && firstForm._id != req.body._id) return res.status(500).send({error: 'name already exists'});

	const data = await Form.findByIdAndUpdate(req.body._id, req.body);
	res.send(data);
}

async function addForm(req, res, next) {
	if(!req.body || !req.body.name || !req.body.name.length) return res.status(500).send({error: 'Missing parameters'});
	
	//Check id already exists
	var count = await Form.find({name: req.body.name}).count().exec();
	if(count > 0) return res.status(500).send({error: 'name already exists'});

	const data = await Form.create(req.body);
	res.send(data);
}

async function removeForm(req, res, next){
        // Find all answers with form this ID and delete them (keep database coherent)
        var deleteQuestions = await Question.find({form:req.params.id}).select('_id').lean().exec();
        
        for (var i=0; i<deleteQuestions.length; i++) {
            // Find Question's answers and remove
            var deleteAnswers = await Answer.find({quest:deleteQuestions[i]._id}).select('_id').lean().exec();
            for (var j=0; i<deleteAnswers.length; j++) {
                await Answer.findByIdAndRemove(deleteAnswers[i]._id).exec();
            }
            
            // Delete question
            await Question.findByIdAndRemove(deleteQuestions[i]._id).exec();
        }
        
        await Form.findByIdAndRemove(req.params.id).exec();
        res.send({});
}

module.exports = router;

