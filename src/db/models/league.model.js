"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.leagueSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true },
    slug: { type: mongoose_1.Schema.Types.String, required: true },
    code: { type: mongoose_1.Schema.Types.String, default: '' }
});
exports.LeagueModel = mongoose_1.model('League', exports.leagueSchema);
//# sourceMappingURL=league.model.js.map