var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var Customer = require('../models/customer.js');
// var Purchase = require('../models/purchase.js');

// API DEFINITIONS
router.get('/summary', [ getSummary ]);


// API ROUTINES

function getSummary(req, res){
	var cb = {};

	Promise.all([
		Customer.count({ registered: {$gte: new Date(new Date().getFullYear(), 0, 1)} }),
		// Purchase.find({ date: {$gte: new Date(new Date().getFullYear(), 0, 1)} })
		// 	.select('amount shipping').lean().exec(),
		// Purchase.count({ status: 'Pending' }),
		// Purchase.count({ status: 'Processing' })
	])
	.spread(function(customers, purchases, pending, processing){
		cb.result = {
			customers,
			purchases: purchases.length,
			pending,
			processing
		};
		cb.result.revenue = purchases.reduce(function(prev, p){
			return prev + (p.amount||0);
		}, 0);

		res.send(cb.result);
	})
	.catch(function(err){
		console.log(err);
		res.status(500).send({error: err.toString ? err.toString() : err});
	});
}

module.exports = router;
