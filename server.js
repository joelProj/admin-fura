var config = require('./config.js');
var mongoose = require('mongoose');
global.Promise = require('bluebird');
mongoose.Promise = Promise;
var express = require('express');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var auth = require('./lib/auth.js');
var throttle = require('lodash.throttle');
var apiRouter = require('./api');
var path = require('path');

function log(...args){
	console.log(new Date().toJSON(), "|", ...args);
}

function logError(...args){
	console.error(new Date().toJSON(), "|", ...args);
}

// MAIN ROUTINE
function startServer(){
	var server = express();

	// Enforce https://

	if(config.ENFORCE_HTTPS) {
		server.use(function(req, res, next) {
			if(config.DEBUG) return next();
			else if(req.headers['x-forwarded-proto'] != 'https')
				return res.redirect('https://' + req.headers.host + req.url);
			else
				return next();
		});
	}

	if(config.ALLOW_CORS) {
		server.use(function(req, res, next){
			res.setHeader('Access-Control-Allow-Origin', '*');
			next();
		});
	}

	if(config.ALLOW_CERTBOT) {
		server.get('/.well-known/acme-challenge/:challenge', (req, res) => {
			res.sendFile(path.resolve('./build/.well-known/acme-challenge/' + req.params.challenge));
		});
	}

	// LEGACY HTTP METHODS
	server.use(methodOverride('X-HTTP-Method'));
	server.use(methodOverride('X-HTTP-Method-Override'));
	server.use(methodOverride('X-Method-Override'));

	// API
	server.use(cookieParser());
	server.use(auth.check);
	server.use(apiRouter);

	// STATIC FILES
	server.get('/', function(req, res){
		res.end(`<!DOCTYPE html>
			<html lang="en">
					<head>
							<meta charset="utf-8">
							<meta http-equiv="X-UA-Compatible" content="IE=edge">
							<meta name="viewport" content="width=device-width, initial-scale=1">
							<link href="/vendor.css" rel="stylesheet" />
							<title>Right Side Coffee</title>
					</head>
					<body ng-app="admin">
							<div ui-view></div>
							<script src="/vendor.js"></script>
							<script src="/app.bundle.js"></script>
					</body>
			</html>`);
	});
	server.get('/vendor.js', function(req, res){
		res.sendFile(path.resolve('./node_modules/ng-admin/build/ng-admin.min.js'), {maxAge: 1000 * 60 * 60 * 24 * 4});
	});
	server.get('/vendor.css', function(req, res){
		res.sendFile(path.resolve('./node_modules/ng-admin/build/ng-admin.min.css'), {maxAge: 1000 * 60 * 60 * 24 * 4});
	});
	server.get('/app.bundle.js', function(req, res){
		res.sendFile(path.resolve('./build/app.bundle.js'), {maxAge: 1000 * 60 * 60 * 1});
	});

	server.use(function(req, res){ res.status(404).send(''); });

	server.listen(config.HTTP_PORT, function() {
		log(config.APP_NAME + " listening on port " + config.HTTP_PORT);
	});

	startDatabase();
	initTerminationHandlers();
}

// MONGODB START
function startDatabase(){
	if(!config.MONGODB_URI) return;

	// Check that the server is listening
	var socket = new require('net').Socket();
	var mongoUri = require('url').parse(config.MONGODB_URI);

	new Promise(function(resolve, reject){
		var timeout = 4000;
		socket.setTimeout(timeout, function() {
			reject();
			socket.destroy();
		});
		socket.connect(mongoUri.port, mongoUri.hostname, function() {
			// THE PORT IS LISTENING
			resolve();
		});
		socket.on('data', function() {
			resolve();
		});
		socket.on('error', function(e) {
			logError("-----");
			logError("ERROR: The MongoDB Server is not available");
			logError(e.toString ? e.toString() : e);
			logError("-----");
			reject();
			socket.destroy();
			process.exit();
		});
	})
	.then(function(){
		// MongoDB Event Handlers
		mongoose.connection.on('connecting', onDbConnecting);
		mongoose.connection.on('error', onDbConnectionError);
		mongoose.connection.on('connected', onDbConnected);
		mongoose.connection.once('open', onDbConnectionOpen);
		mongoose.connection.on('reconnected', onDbReconnected);
		mongoose.connection.on('disconnected', throttle(onDbDisconnected, 1000, {leading: true}));

		// Connect
		mongoose.connect(config.MONGODB_URI, {server: {auto_reconnect:true}});
	})
	.catch(function(){});
}

function onDbConnecting() {
	log('Connecting to MongoDB...');
}
function onDbConnectionError(error) {
	logError('Error in MongoDB connection: ' + error);
	mongoose.disconnect();
}
function onDbConnected() {
	log('MongoDB connected');
}
function onDbConnectionOpen() {
	log('MongoDB connection opened', "\n");
}
function onDbReconnected() {
	log('MongoDB reconnected', "\n");
}
function onDbDisconnected() {
	log('MongoDB disconnected!', "\n");
	mongoose.connect(config.MONGODB_URI, {server: {auto_reconnect:true}});
}

// TERMINATION HANDLERS
function initTerminationHandlers(){
	process.on('exit', function() { terminator(); });

	var signals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
		'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGTERM' //, 'SIGUSR2'
	];

	// Removed 'SIGPIPE' from the list - bugz 852598.
	signals.forEach(function(element) {
			process.on(element, function() { terminator(element); });
	});
}

// TERMINATION CALLBACK
function terminator(signal){
	if(!signal || typeof signal != "string") return log('The app is terminating...');

	mongoose.disconnect(); // graceful shutdown
	log('Received %s...', signal);
	process.exit(1);
}

// INIT
startServer();
