var getBuiltIn = require('./get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';
