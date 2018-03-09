"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const configPath = '../../src/config/environment/index';
let config = require(configPath);
function reloadConfig() {
    delete require.cache[require.resolve(configPath)];
    return require(configPath);
}
describe('config', () => {
    it('should select development when NODE_ENV=null', () => {
        process.env.NODE_ENV = null;
        config = reloadConfig();
        chai_1.expect(config.env).to.equal('development');
        chai_1.expect(config.mongo).to.exist;
    });
    it('should select development when NODE_ENV=development', function () {
        process.env.NODE_ENV = 'development';
        config = reloadConfig();
        chai_1.expect(config.env).to.equal('development');
        chai_1.expect(config.mongo).to.exist;
        chai_1.expect(config.port).to.exist;
        chai_1.expect(config.port).to.equal(3000);
    });
    describe('isProduction', function () {
        it('should get true when NODE_ENV is production.', function () {
            process.env.NODE_ENV = 'production';
            config = reloadConfig();
            chai_1.expect(config.isProduction()).to.equal(true);
        });
        it('should get false when NODE_ENV is development.', function () {
            process.env.NODE_ENV = 'development';
            config = reloadConfig();
            chai_1.expect(config.isProduction()).to.equal(false);
        });
    });
});
//# sourceMappingURL=config.spec.js.map