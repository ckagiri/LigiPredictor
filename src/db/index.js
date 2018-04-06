"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.init = (mongoUri, cb, options = { drop: false }) => {
    cb = cb || function () { };
    mongoose.connect(mongoUri, function (err) {
        if (options.drop) {
            mongoose.connection.db.dropDatabase(function (err) {
                cb(err);
            });
        }
        else {
            cb(err);
        }
    });
};
exports.drop = function () {
    return mongoose.connection.db.dropDatabase();
};
exports.close = function () {
    return mongoose.connection.close();
};
//# sourceMappingURL=index.js.map