var express = require('express');
var bodyParser = require('body-parser');

// API ROUTINES
var customerRouter = require('./customer');
var postRouter = require('./post');
var productRouter = require('./product');
var shopRouter = require('./shop');

var summaryRouter = require('./summary');

// ROUTER
var router = express.Router();
router.use('/api', bodyParser.json({limit: '10mb'}));

// ROUTES
router.use('/api', customerRouter);
router.use('/api', postRouter);
router.use('/api', productRouter);
router.use('/api', shopRouter);

router.use('/api', summaryRouter);

// Error handling
router.use('/api', function(err, req, res, next){
	if(!err) return res.send('');
	res.status(500).send({error: err.message || err});
});

// EXPORT
module.exports = router;
