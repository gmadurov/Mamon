var global = require('./global');
var isCallable = require('./is-callable');
var inspectSource = require('./inspect-source');

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));
