import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as path from 'path';
const chalk = require('chalk');

import { config } from '../config/environment/index';
import App from './app';

const app = App.create();

console.log('About to crank up node');
console.log('PORT=' + config.port);
console.log('NODE_ENV=' + config.env);

mongoose.connect(config.mongo.uri, config.mongo.options);
const db = mongoose.connection;

const server = http.createServer(app);
server.listen(config.port, config.ip, () => {
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
