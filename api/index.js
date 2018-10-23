var express = require('express');
var bodyParser = require('body-parser');

// API ROUTINES
var questionRouter = require('./question');
var answerRouter = require('./answer');

// var summaryRouter = require('./summary');

// ROUTER
var router = express.Router();
router.use('/api', bodyParser.json({limit: '10mb'}));

// ROUTES
router.use('/api', questionRouter);
router.use('/api', answerRouter);

// router.use('/api', summaryRouter);

// Error handling
router.use('/api', function(err, req, res, next){
	if(!err) return res.send('');
	res.status(500).send({error: err.message || err});
});

// EXPORT
module.exports = router;
