const express = require('express');
const router = express.Router();
const wrap = require('../lib/wrap.js');
// DB
const Customer = require('../models/customer.js');

// API DEFINITIONS
router.get('/customers/:id', [ wrap(getCustomer) ]);
router.get('/customers', [ wrap(listCustomers) ]);
router.post('/customers', [ wrap(addCustomer) ]);
router.put('/customers/set/:type', [ wrap(setCustomerType) ]);
router.put('/customers/:id', [ wrap(updateCustomer) ]);
router.delete('/customers/:id', [ wrap(removeCustomer) ]);

// API ROUTINES
function* listCustomers(req, res){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = yield Customer.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const customers = yield Customer.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(customers);
}

function* getCustomer(req, res){
	const data = yield Customer.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* updateCustomer(req, res){
	const data = yield Customer.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* addCustomer(req, res) {
	const data = yield Customer.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* removeCustomer(req, res){
	yield Customer.findByIdAndRemove(req.params.id).exec();
	res.send();
}

function* setCustomerType(req, res){
	const data = yield Customer.update({_id: {$in: req.body.customers}}, { type: req.params.type == 'wholesale' ? 'Wholesale' : 'Retail' }).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

module.exports = router;
