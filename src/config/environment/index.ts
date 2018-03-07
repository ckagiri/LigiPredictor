import _ = require('lodash');

export interface Configurations {
  env: string;
  root: string;
  port:number;
  mongo:{
    options: {
      db:{
          safe:boolean;
      }
    };
    uri: string;
  };
  ip:string;
	TOKEN_SECRET: string;
	FACEBOOK_SECRET: string;
	GOOGLE_SECRET: string;
	TWITTER_KEY: string;
	TWITTER_SECRET: string;
  api_providers: {
    api_football_data: {
      name: string,
      apiKey: string
    },
    sports_open_data: {
      name: string,
      apiKey: string
    }
  };
  isProduction: Function;
  isDevelopment: Function;
  isTest: Function;
}

function parseValues(value) {
  let val = value;
  try {
    val = JSON.parse(value);
  } catch (ignore) {
    // Check for any other well-known strings that should be "parsed"
    if (value === 'undefined'){
      val = void 0;
    }
  }
  return val;
};


function requireProcessEnv(name: any) {
  if (!parseValues(process.env[name])) {
    process.env[name] = 'development';
  }
  return process.env[name];
}

export const config: Configurations = _.extend(
  {},
  require('./all'),
  require('./' + requireProcessEnv('NODE_ENV'))
);

config.isProduction = function() {
  return this.env === 'production';
};

config.isDevelopment = function() {
  return this.env === 'development';
};

config.isTest = function(){
  return this.env === 'test';
};

module.exports = config;