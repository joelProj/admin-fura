var express = require('express');
var router = express.Router();
const wrap = require('../lib/wrap.js');
// var Busboy = require('busboy');
// DB
var Product = require('../models/product.js');

// Google Cloud auth
// var gcloud = require('gcloud').storage({
//   projectId: config.GC_PROJECT_ID,
//   keyFilename: config.GC_KEY_FILE
// });
// var imagesBucket = gcloud.bucket('rightside-images');


// API DEFINITIONS
router.get('/products/:id', [ wrap(getProduct) ]);
router.get('/products', [ wrap(listProducts) ]);
router.post('/products', [ wrap(addProduct) ]);
router.put('/products/:id', [ wrap(updateProduct) ]);
router.delete('/products/:id', [ wrap(removeProduct) ]);

// router.post('/products/:id/images', [ uploadProductImage ]);
// router.put('/products/:id/images/:filename', [ promoteProductImage ]);
// router.delete('/products/:id/images/:filename', [ removeProductImage ]);


// API ROUTINES

function* listProducts(req, res){
	const perPage = parseInt(req.query._perPage);
	const start = (parseInt(req.query._page) - 1) * perPage;
	const sortBy = (req.query._sortDir == 'ASC' ? '' : '-') + req.query._sortField;

	const count = yield Product.count(JSON.parse(req.query._filters || '{}')).exec();
	res.set("X-Total-Count", count);

	const products = yield Product.find(JSON.parse(req.query._filters || '{}')).sort(sortBy).skip(start).limit(perPage).exec();
	res.send(products);
}

function* getProduct(req, res){
	const data = yield Product.findById(req.params.id).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* updateProduct(req, res){
	if(req.body.images){
		req.body.images = req.body.images.map((img, index) => {
			img.index = index;
			return img;
		});
	}

	const data = yield Product.findByIdAndUpdate(req.params.id, req.body).lean().exec();
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* addProduct(req, res) {
	if(req.body.images){
		req.body.images = req.body.images.map((img, index) => {
			img.index = index;
			return img;
		});
	}

	const data = yield Product.create(req.body)
	if(!data) return res.status(404).send('Not found');
	res.send(data);
}

function* removeProduct(req, res){
	yield Product.findByIdAndRemove(req.params.id).exec();
	res.send();
}


// IMAGES AVAILABLE
// function uploadProductImage(req, res) {
//   if(!req.params.id) return res.send({error: "Parámetros inválidos"});
//
//   var uploadReadStream = new Busboy({ headers: req.headers });
//
//   uploadReadStream.on('file', function(fieldname, fileStream, filename, encoding, mimetype) {
//     var imgName = Date.now() + path.extname(filename);
//     var remoteWriteStream = imagesBucket.file(imgName).createWriteStream();
//     fileStream.pipe(remoteWriteStream);
//
//     remoteWriteStream.on('error', function(err) {
//       console.log("%s | FILE TRANSFER ERROR: %s", (new Date()).toJSON(), err);
//       res.send({error: "No se ha podido procesar el archivo"});
//     });
//     remoteWriteStream.on('finish', function() {
//       // DONE UPLOADING
//       Product.findByIdAndUpdate(req.params.id, {$addToSet: {images: 'https://storage.googleapis.com/rightside-images/' + imgName}}, {new: true}).exec()
//       .then(function(producte){
//         if(!producte) {
//           // NO EXISTEIX
//           imagesBucket.file(req.params.id + path.extname(filename)).delete(function(){});
//           return res.send({error: "Parámetros inválidos"});
//         }
//         res.send({image: 'https://storage.googleapis.com/rightside-images/' + imgName});
//       }, function(err){
//         return res.status(500).send({error: 'No se ha podido añadir la imagen', err: err});
//       });
//     });
//   });
//   uploadReadStream.on('error', function(err) {
//     console.log("%s | UPLOAD ERROR: %s", (new Date()).toJSON(), err);
//     res.send({error: "No se ha podido procesar el archivo"});
//   });
//   return req.pipe(uploadReadStream);
// }

// function promoteProductImage(req, res){
//   Product.findById(req.params.id).exec()
//   .then(function(product){
//     if(!product) throw "Parámetros inválidos";
//     if(!product.images.length) return res.send({});
//     product = product.toObject();
//
//     for(let i = 0; i < product.images.length; i++) {
//       if(product.images[i].indexOf(req.params.filename) > 0){
//         let img = product.images.splice(i, 1);
//         product.images.unshift(img[0]);
//         Product.findByIdAndUpdate(req.params.id, {images: product.images}).exec()
//         .then(function(){
//           res.send({});
//         }, function(err){
//           res.send({error: err && err.message || err});
//         });
//       }
//     }
//     return res.send({});
//   }, function(err){
//     return res.status(500).send({error: 'No se ha podido añadir la imagen', err: err});
//   });
// }

// function removeProductImage(req, res){
//   Product.findById(req.params.id).exec()
//   .then(function(product){
//     if(!product) throw "Parámetros inválidos";
//     if(!product.images.length) return res.send({});
//     product = product.toObject();
//
//     for(let i = 0; i < product.images.length; i++) {
//       if(product.images[i].indexOf(req.params.filename) > 0){
//         imagesBucket.file(req.params.filename).delete(function(){});
//         product.images.splice(i, 1);
//         Product.findByIdAndUpdate(req.params.id, {images: product.images}).exec()
//         .then(function(){
//           res.send({});
//         }, function(err){
//           res.send({error: err && err.message || err});
//         });
//       }
//     }
//     return res.send({});
//   }, function(err){
//     return res.status(500).send({error: 'No se ha podido añadir la imagen', err: err});
//   });
// }

module.exports = router;
