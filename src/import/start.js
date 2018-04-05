"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_1 = require("./apiFootballData/run");
const index_1 = require("../config/environment/index");
const db = require("../db/index");
function start() {
    db.init(index_1.config.mongo.uri, (err => {
        if (err == null) {
            run_1.apiFootballDataImporter.start();
        }
    }));
}
start();
//# sourceMappingURL=start.js.map