"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const environment_1 = require("../src/util/environment");
describe.only('environment', () => {
    let keepEnv;
    beforeEach(() => {
        // save the NODE_ENV
        keepEnv = process.env.NODE_ENV;
    });
    afterEach(() => {
        // restore the NODE_ENV
        process.env.NODE_ENV = keepEnv;
    });
    describe('isEnv', () => {
        it(`should match when there's a value`, () => {
            [
                'production',
                'development',
                'test',
            ]
                .forEach(env => {
                process.env.NODE_ENV = env;
                chai_1.assert.isTrue(environment_1.isEnv(env));
            });
        });
        it(`should treat no proces.env.NODE_ENV as it'd be in development`, () => {
            delete process.env.NODE_ENV;
            chai_1.assert.isTrue(environment_1.isEnv('development'));
        });
    });
    describe('isProduction', () => {
        it('should return true if in production', () => {
            process.env.NODE_ENV = 'production';
            chai_1.assert.isTrue(environment_1.isProduction());
        });
        it('should return false if not in production', () => {
            process.env.NODE_ENV = 'test';
            chai_1.assert.isTrue(!environment_1.isProduction());
        });
    });
    describe('isTest', () => {
        it('should return true if in test', () => {
            process.env.NODE_ENV = 'test';
            chai_1.assert.isTrue(environment_1.isTest());
        });
        it('should return true if not in test', () => {
            process.env.NODE_ENV = 'development';
            chai_1.assert.isTrue(!environment_1.isTest());
        });
    });
    describe('isDevelopment', () => {
        it('should return true if in development', () => {
            process.env.NODE_ENV = 'development';
            chai_1.assert.isTrue(environment_1.isDevelopment());
        });
        it('should return true if not in development and environment is defined', () => {
            process.env.NODE_ENV = 'test';
            chai_1.assert.isTrue(!environment_1.isDevelopment());
        });
        it('should make development as the default environment', () => {
            delete process.env.NODE_ENV;
            chai_1.assert.isTrue(environment_1.isDevelopment());
        });
    });
});
//# sourceMappingURL=environment.js.map