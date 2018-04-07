"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.teamSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true, trim: true },
    slug: { type: mongoose_1.Schema.Types.String, required: true, trim: true },
    shortName: { type: mongoose_1.Schema.Types.String, trim: true },
    code: { type: mongoose_1.Schema.Types.String },
    aliases: { type: [mongoose_1.Schema.Types.String] },
    crestUrl: { type: mongoose_1.Schema.Types.String },
    externalReference: { type: mongoose_1.Schema.Types.Mixed }
});
exports.TeamModel = mongoose_1.model('Team', exports.teamSchema);
//# sourceMappingURL=team.model.js.map