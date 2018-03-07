module.exports = {
    env: 'development',
    port: process.env.PORT || 3000,
    mongo: {
      uri: 'mongodb://localhost:27017/test123-dev'
    }
  }