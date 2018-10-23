const express = require('express');
const router = express.Router();
const wrap = require('../lib/wrap.js');
// DB
const Shop = require('../models/shop.js');

// API DEFINITIONS
router.get('/shops/:id', [ wrap(getShop) ]);
router.get('/shops', [ wrap(listShops) ]);
router.post('/shops', [ wrap(addShop) ]);
router.put('/shops/:id', [ wrap(updateShop) ]);
router.delete('/shops/:id', [ wrap(removeShop) ]);

// API ROUTINES
function* listShops(req, res){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = yield Shop.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const shops = yield Shop.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(shops);
}

function* getShop(req, res){
	const data = yield Shop.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* updateShop(req, res){
	req.body.date = new Date();

	const data = yield Shop.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* addShop(req, res) {
	req.body.date = new Date();

	const data = yield Shop.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* removeShop(req, res){
	yield Shop.findByIdAndRemove(req.params.id).exec();
	res.send();
}

module.exports = router;
