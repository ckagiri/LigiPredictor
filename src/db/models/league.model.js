"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { String } = mongoose_1.Schema.Types;
exports.leagueSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    code: { type: String, default: '' }
});
exports.LeagueModel = mongoose_1.model('League', exports.leagueSchema);
//# sourceMappingURL=league.model.js.map