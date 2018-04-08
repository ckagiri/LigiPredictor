"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { String, Mixed } = mongoose_1.Schema.Types;
exports.teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    code: { type: String },
    aliases: { type: [String] },
    crestUrl: { type: String },
    externalReference: { type: Mixed }
});
exports.TeamModel = mongoose_1.model('Team', exports.teamSchema);
//# sourceMappingURL=team.model.js.map