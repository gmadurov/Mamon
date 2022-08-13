var isCallable = require('./is-callable');

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};
