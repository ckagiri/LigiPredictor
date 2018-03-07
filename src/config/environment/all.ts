import path = require('path');

module.exports = {  
    // Development specific configuration
    // ==================================
    env: 'development',
    
    // Root path of server
    rootPath: path.normalize(__dirname + '/../../../')
  }