"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.seasonSchema = new mongoose_1.Schema({
    // league: {
    //   name: { type: Schema.Types.String, required: true },
    //   slug: { type: Schema.Types.String, required: true },
    //   id: { type: Schema.Types.ObjectId, ref: "League", index: true, required: true }
    // },
    name: { type: mongoose_1.Schema.Types.String, required: true },
    slug: { type: mongoose_1.Schema.Types.String, required: true, trim: true },
    year: { type: mongoose_1.Schema.Types.Number, required: true },
    caption: { type: mongoose_1.Schema.Types.String },
    currentMatchRound: { type: mongoose_1.Schema.Types.Number },
    currentGameRound: { type: mongoose_1.Schema.Types.Number },
    numberOfRounds: { type: mongoose_1.Schema.Types.Number },
    numberOfTeams: { type: mongoose_1.Schema.Types.Number },
    numberOfGames: { type: mongoose_1.Schema.Types.Number },
    seasonStart: { type: mongoose_1.Schema.Types.Date },
    seasonEnd: { type: mongoose_1.Schema.Types.Date },
    externalReference: { type: mongoose_1.Schema.Types.Mixed }
});
exports.SeasonModel = mongoose_1.model('Season', exports.seasonSchema);
//# sourceMappingURL=season.model.js.map