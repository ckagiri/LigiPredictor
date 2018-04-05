"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const start_1 = require("./apiFootballData/start");
const index_1 = require("../config/environment/index");
const db = require("../db/index");
function start() {
    db.init(index_1.config.mongo.uri, (err => {
        if (err == null) {
            start_1.apiFootballDataImporter.start();
        }
    }));
}
start();
//# sourceMappingURL=start.js.map