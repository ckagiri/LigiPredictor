import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as path from 'path';
const chalk = require('chalk');

import { routes as apiRoutes } from './apiRoutes';
const config = require('../config/environment/index');

const globalMiddleware = require('./middleware/global.middleware');
(<any>mongoose).Promise = global.Promise;    
const app = express();
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use((req, res, next) => {
  if (req.query.id) {
    req.query._id = req.query.id
    delete req.query.id
  }
  next()
})
app.use((req, res, next) => {
	if (req.path.substr(-1) == '/' && req.path.length > 1) {
		var query = req.url.slice(req.path.length);
		res.redirect(301, req.path.slice(0, -1) + query);
	} else {
		next();
	}
});

app.use('/api', apiRoutes);

console.log('About to crank up node');
console.log('PORT=' + config.port);
console.log('NODE_ENV=' + config.env);

mongoose.connect(config.mongo.uri, config.mongo.options);
const db = mongoose.connection;

const server: http.Server = app.listen(config.port, config.ip, () => {
	const host = server.address().address;
  const port = server.address().port;
	console.log(chalk.yellow(`${config.env} Express Server listening on http://localhost:${port}`));
	console.log(chalk.yellow('env = ' + app.get('env') +
		'\n__dirname = ' + __dirname +
		'\nprocess.cwd = ' + process.cwd()));

	db.on('error', (err: any) => {
    console.error(chalk.red(`ERROR CONNECTING TO MONGO: ${err}`));
    console.error(chalk.red(`Please make sure that ${config.mongo.uri} is running.`));
  });

  db.once('open', () => {
    console.info(chalk.green(`Connected to MongoDB: ${config.mongo.uri}`));
  });
});

export { server }
