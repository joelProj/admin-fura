var coroutine = require('bluebird').coroutine;

module.exports = function wrap(genFn) { // 1
  var coFunc = coroutine(genFn) // 2
  return function (req, res, next) { // 3
    coFunc(req, res, next).catch(next) // 4
  }
};
