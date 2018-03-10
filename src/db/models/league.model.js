"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.leagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    }
});
// This try-catch is added so that it is possible to set a watch
// on the mocha runner. Every time the test runs, it will try
// to create the add the model again
exports.LeagueModel = mongoose.model('League', exports.leagueSchema);
//module.exports = LeagueModel;
//# sourceMappingURL=league.model.js.map