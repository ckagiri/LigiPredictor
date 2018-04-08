"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const http = require("http");
const chalk = require('chalk');
const index_1 = require("../config/environment/index");
const app_1 = require("./app");
const express = app_1.default.create();
console.log('About to crank up node');
console.log('PORT=' + index_1.config.port);
console.log('NODE_ENV=' + index_1.config.env);
mongoose.connect(index_1.config.mongo.uri, index_1.config.mongo.options);
const db = mongoose.connection;
const server = http.createServer(express);
exports.server = server;
server.listen(index_1.config.port, index_1.config.ip, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(chalk.yellow(`${index_1.config.env} Express Server listening on http://localhost:${port}`));
    console.log(chalk.yellow('env = ' + express.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd()));
    db.on('error', (err) => {
        console.error(chalk.red(`ERROR CONNECTING TO MONGO: ${err}`));
        console.error(chalk.red(`Please make sure that ${index_1.config.mongo.uri} is running.`));
    });
    db.once('open', () => {
        console.info(chalk.green(`Connected to MongoDB: ${index_1.config.mongo.uri}`));
    });
});
//# sourceMappingURL=server.js.map