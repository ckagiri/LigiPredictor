import { expect } from 'chai';
const configPath = '../../src/config/environment/index';
import {Configurations}  from '../../src/config/environment/index';
let config: Configurations = require(configPath);

function reloadConfig(){
  delete require.cache[require.resolve(configPath)];
  return require(configPath);
}

describe('config', () => {
  
  it('should select development when NODE_ENV=null', () => {
    process.env.NODE_ENV = null;
    config = reloadConfig();    
    expect(config.env).to.equal('development');
    expect(config.mongo).to.exist;
  })

  it('should select development when NODE_ENV=development', function() {
    process.env.NODE_ENV = 'development';
    config = reloadConfig();
    expect(config.env).to.equal('development');
    expect(config.mongo).to.exist;
    expect(config.port).to.exist;
    expect(config.port).to.equal(3000);
  });

  describe('isProduction', function() {
    it('should get true when NODE_ENV is production.', function() {
      process.env.NODE_ENV = 'production';
      config = reloadConfig();
      expect(config.isProduction()).to.equal(true);
    });

    it('should get false when NODE_ENV is development.', function() {
      process.env.NODE_ENV = 'development';
      config = reloadConfig();
      expect(config.isProduction()).to.equal(false);
    });
  });
})