"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const favicon = require("serve-favicon");
const authorization_1 = require("./authorization");
const api_router_1 = require("./api.router");
class ExpressApp {
    static create() {
        return new ExpressApp(new authorization_1.Authorization()).express;
    }
    constructor(authorization) {
        this.express = express();
        this.middleware();
        authorization.init(this.express);
        this.routes(authorization);
    }
    middleware() {
        this.express.disable('etag');
        this.express.use(this.nocache);
        this.express.use(logger('dev'));
        this.express.use(favicon(__dirname + '/favicon.ico'));
        this.express.use(bodyParser.json({ limit: '50mb' }));
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }
    nocache(req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    }
    routes(authorization) {
        this.express.use('/auth/v1', authorization.router);
        this.express.use('/api', api_router_1.ApiRouter.create(authorization).router);
    }
}
exports.App = { create: () => ExpressApp.create() };
exports.default = exports.App;
//# sourceMappingURL=app.js.map