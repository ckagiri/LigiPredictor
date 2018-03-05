"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnv() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
        return process.env.NODE_ENV;
    }
    // default environment
    return 'development';
}
exports.getEnv = getEnv;
function isEnv(env) {
    return getEnv() === env;
}
exports.isEnv = isEnv;
function isProduction() {
    return isEnv('production') === true;
}
exports.isProduction = isProduction;
function isTest() {
    return isEnv('test') === true;
}
exports.isTest = isTest;
function isDevelopment() {
    return isEnv('development') === true;
}
exports.isDevelopment = isDevelopment;
//# sourceMappingURL=environment.js.map