const express = require('express');
const router = express.Router();
const wrap = require('../lib/wrap.js');
// DB
const Post = require('../models/post.js');

// API DEFINITIONS
router.get('/posts/:id', [ wrap(getPost) ]);
router.get('/posts', [ wrap(listPosts) ]);
router.post('/posts', [ wrap(addPost) ]);
router.put('/posts/:id', [ wrap(updatePost) ]);
router.delete('/posts/:id', [ wrap(removePost) ]);

// API ROUTINES
function* listPosts(req, res){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = yield Post.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const posts = yield Post.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(posts);
}

function* getPost(req, res){
	const data = yield Post.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* updatePost(req, res){
	req.body.date = new Date();

	const data = yield Post.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* addPost(req, res) {
	req.body.date = new Date();

	const data = yield Post.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* removePost(req, res){
	yield Post.findByIdAndRemove(req.params.id).exec();
	res.send();
}

module.exports = router;
