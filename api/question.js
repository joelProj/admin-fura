const express = require('express');
const router = express.Router();
// DB
const Form = require('../models/form.js');
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

	var questions;

	if(req.query._filters){
		const validID = await Form.findOne(JSON.parse(req.query._filters)).select('_id').lean().exec();

		if(validID){
			const count = await Question.count({form: validID._id}).exec();
			res.set("X-Total-Count", count);
		
			questions = await Question.find({form: validID._id}).sort(sortBy).skip(start).limit(perPage).lean().exec();
			questions.map((quest)=>{
				var def = quest.default;
				quest.text = JSON.parse(quest.text);
				quest.text = quest.text.reduce((prev,curr)=>{
					if(curr.lang == def) return curr.text;
					return prev;
				},'');
				return quest;
			});
		}
		else{
			questions = [];
		}
	}
	else{
		const count = await Question.count({}).exec();
		res.set("X-Total-Count", count);
	
		questions = await Question.find({}).sort(sortBy).skip(start).limit(perPage).lean().exec();
		questions.map((quest)=>{
			var def = quest.default;
			quest.text = JSON.parse(quest.text);
			quest.text = quest.text.reduce((prev,curr)=>{
				if(curr.lang == def) return curr.text;
				return prev;
			},'');
			return quest;
		})
	}
	res.send(questions);
}

async function getQuestion(req, res, next){
	var data = await Question.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	data.text = JSON.parse(data.text);
	data.answers = JSON.parse(data.answers);
	
	res.send(data);
}

async function updateQuestion(req, res, next){
	if(!req.body || !req.body.form || !req.body.form.length || !req.body.id_fura || !req.body.id_fura.length || !req.body.timer || !req.body.default || !req.body.text.length || !req.body.answers.length) return res.status(500).send({error: 'Missing parameters'});
	
	var q = await Question.findOne({id_fura: req.body.id_fura}).lean().exec();
	if(q && q._id != req.body._id) return res.status(500).send({error: 'id_fura already exists'});
	
	//Check timer can't be negative
	if(req.body.timer < 0) return res.status(500).send({error: 'Timer can not be negative'});

	//Check texts and values has same languages
	if(req.body.text.length != req.body.answers.length) return res.status(500).send({error: 'Must have same languages'});
	var textLanguages = req.body.text.map((text)=>{return text.lang;});
	var optionLanguages = req.body.answers.map((option)=>{return option.lang;});
	var sameLanguages = textLanguages.reduce((prev, curr)=>{return prev && optionLanguages.indexOf(curr) != -1;}, true);
		
	if(!sameLanguages) return res.status(500).send({error: 'Must have same languages'});

	//Check texts and values don't have the same language twice
	var repeatedLanguages = textLanguages.reduce((prev, curr)=>{ return prev || textLanguages.indexOf(curr) != textLanguages.lastIndexOf(curr)},false);
	repeatedLanguages = optionLanguages.reduce((prev, curr)=>{ return prev || optionLanguages.indexOf(curr) != optionLanguages.lastIndexOf(curr)},repeatedLanguages);

	if(repeatedLanguages) return res.status(500).send({error: "Can not have a language repeated twice or more"});

	//Check answers have answers
	var noOptions = req.body.answers.reduce((prev, curr)=>{ return prev || !curr.values.length;	}, false);
	if(noOptions) return res.status(500).send({error: "All languages must have some values"});
	
	//Check answers have same length
	var length = req.body.answers[0].values.length;
	var diffLength = req.body.answers.reduce((prev, curr)=>{ return prev || curr.values.length != length; }, false);
	if(diffLength) return res.status(500).send({error: "All languages must have same amount of answers"});

	//Check empty strings
	var emptyText = req.body.text.reduce((prev, curr)=>{return prev || !curr.text.length;}, false);
	var allOptions = req.body.answers.reduce((prev, curr)=>{return prev.concat(curr.values)},[]);
	var emptyOption = allOptions.reduce((prev, curr)=>{return prev || !curr.value.length;}, false);
	if(emptyText || emptyOption) return res.status(500).send({error: "Text camps can't be empty"});

	//Check default exists
	if(textLanguages.indexOf(req.body.default) == -1) return res.status(500).send({error: "Default language must be within text and answers languages"});

	var quest = Object.assign({}, req.body);
	quest.answers = quest.answers.map((answer)=>{
		answer.values = answer.values.map((val)=>{ 
			val.value = val.value.trim().replace(/\s\s+/g, ' ');
			return val;
		});
		return answer;
	});

	quest.text =JSON.stringify(quest.text);
	quest.answers =JSON.stringify(quest.answers);

	const data = await Question.findByIdAndUpdate(req.params.id, quest).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

async function addQuestion(req, res, next) {
	if(!req.body || !req.body.form || !req.body.form.length || !req.body.id_fura || !req.body.id_fura.length || !req.body.timer || !req.body.default || !req.body.text.length || !req.body.answers.length) return res.status(500).send({error: 'Missing parameters'});
	
	//Check id already exists
	var count = await Question.find({id_fura: req.body.id_fura}).count().exec();
	if(count > 0) return res.status(500).send({error: 'id_fura already exists'});
	
	//Check timer can't be negative
	if(req.body.timer < 0) return res.status(500).send({error: 'Timer can not be negative'});

	//Check texts and values has same languages
	if(req.body.text.length != req.body.answers.length) return res.status(500).send({error: 'Must have same languages'});
	var textLanguages = req.body.text.map((text)=>{return text.lang;});
	var optionLanguages = req.body.answers.map((option)=>{return option.lang;});
	var sameLanguages = textLanguages.reduce((prev, curr)=>{return prev && optionLanguages.indexOf(curr) != -1;}, true);
		
	if(!sameLanguages) return res.status(500).send({error: 'Must have same languages'});

	//Check texts and values don't have the same language twice
	var repeatedLanguages = textLanguages.reduce((prev, curr)=>{ return prev || textLanguages.indexOf(curr) != textLanguages.lastIndexOf(curr)},false);
	repeatedLanguages = optionLanguages.reduce((prev, curr)=>{ return prev || optionLanguages.indexOf(curr) != optionLanguages.lastIndexOf(curr)},repeatedLanguages);

	if(repeatedLanguages) return res.status(500).send({error: "Can not have a language repeated twice or more"});

	//Check answers have answers
	var noOptions = req.body.answers.reduce((prev, curr)=>{ return prev || !curr.values.length;	}, false);
	if(noOptions) return res.status(500).send({error: "All languages must have some values"});
	
	//Check answers have same length
	var length = req.body.answers[0].values.length;
	var diffLength = req.body.answers.reduce((prev, curr)=>{ return prev || curr.values.length != length; }, false);
	if(diffLength) return res.status(500).send({error: "All languages must have same amount of answers"});

	//Check empty strings
	var emptyText = req.body.text.reduce((prev, curr)=>{return prev || !curr.text.length;}, false);
	var allOptions = req.body.answers.reduce((prev, curr)=>{return prev.concat(curr.values)},[]);
	var emptyOption = allOptions.reduce((prev, curr)=>{return prev || !curr.value.length;}, false);
	if(emptyText || emptyOption) return res.status(500).send({error: "Text camps can't be empty"});

	//Check default exists
	if(textLanguages.indexOf(req.body.default) == -1) return res.status(500).send({error: "Default language must be within text and answers languages"});

	var quest = Object.assign({}, req.body);
	quest.answers = quest.answers.map((answer)=>{
		answer.values = answer.values.map((val)=>{ 
			val.value = val.value.trim().replace(/\s\s+/g, ' ');
			return val;
		});
		return answer;
	});

	quest.text =JSON.stringify(quest.text);
	quest.answers =JSON.stringify(quest.answers);

	const data = await Question.create(quest);
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
