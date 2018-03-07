"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function parseValues(value) {
    let val = value;
    try {
        val = JSON.parse(value);
    }
    catch (ignore) {
        // Check for any other well-known strings that should be "parsed"
        if (value === 'undefined') {
            val = void 0;
        }
    }
    return val;
}
;
function requireProcessEnv(name) {
    if (!parseValues(process.env[name])) {
        process.env[name] = 'development';
    }
    return process.env[name];
}
exports.config = _.extend({}, require('./all'), require('./' + requireProcessEnv('NODE_ENV')));
exports.config.isProduction = function () {
    return this.env === 'production';
};
exports.config.isDevelopment = function () {
    return this.env === 'development';
};
exports.config.isTest = function () {
    return this.env === 'test';
};
module.exports = exports.config;
//# sourceMappingURL=index.js.map