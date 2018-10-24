// session utilities
var config = require('../config');
var basicAuth = require('basic-auth');

var tokens = [];
setInterval(function(){
	for(var i = 0; i < tokens.length; i++){
		if(tokens[i].expiration > Date.now()) continue;
		// expired
		tokens.splice(i, 1);
		i--;
	}
}, 1000 * 60 * 60);

exports.check = function(req, res, next) {
	if(config.DEBUG && !config.HTTP_USER && !config.HTTP_PASSWORD) return next(); // done
	else if(req.cookies && req.cookies.token) {
		for(var i = 0; i < tokens.length; i++){
			if(tokens[i].token == req.cookies.token){
				if(tokens[i].expiration > Date.now()) return next(); // done
				// expired
				tokens.splice(i, 1);
				break;
			}
		}
	}

	var user = basicAuth(req);
	if(!user || !user.name || !user.pass) {
		res.set('WWW-Authenticate', 'Basic realm=Twins Backend');
		res.status(401).send({error: 'No has iniciado sesión'});
	}
	else if(!exports.isValidLogin(user.name, user.pass)) {
		res.set('WWW-Authenticate', 'Basic realm=Twins Backend');
		res.status(401).send({error: 'No has iniciado sesión'});
	}
	else { // AUTH OK
		var token = exports.generateToken();
		tokens.push({ expiration: Date.now() + config.AUTH_PERIOD, token: token});
		res.cookie('token', token, { httpOnly: true, secure: !config.DEBUG });
		next();
	}
};

exports.isValidLogin = function(user, password){
	if(user && password && user == config.HTTP_USER && password == config.HTTP_PASSWORD)
		return true;
	else
		return false;
};

exports.generateToken = function(){
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(generateRandomString());
	return shasum.digest('hex');
};

function generateRandomString(){
	var len = 15;
  var seed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  var result = "", rnd;

  for(let i = 0; i < len; i++){
    for(let i = 0; i < Math.floor(Math.random() * 1.8e8); i++) ;
    rnd = Math.floor(Math.random() * seed.length);
    result += seed[rnd]
  }
  return result;
}
