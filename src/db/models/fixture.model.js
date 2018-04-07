"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var FixtureStatus;
(function (FixtureStatus) {
    FixtureStatus["SCHEDULED"] = "SCHEDULED";
    FixtureStatus["TIMED"] = "TIMED";
    FixtureStatus["IN_PLAY"] = "IN_PLAY";
    FixtureStatus["CANCELED"] = "CANCELED";
    FixtureStatus["POSTPONED"] = "POSTPONED";
    FixtureStatus["FINISHED"] = "FINISHED";
})(FixtureStatus = exports.FixtureStatus || (exports.FixtureStatus = {}));
const { String, Number, Date, Boolean, ObjectId, Mixed } = mongoose_1.Schema.Types;
exports.fixtureSchema = new mongoose_1.Schema({
    season: { type: ObjectId, ref: 'Season', index: true, required: true },
    slug: { type: String, required: true, trim: true },
    matchRound: { type: Number, required: true },
    gameRound: { type: Number },
    date: { type: Date, required: true },
    homeTeam: {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        crestUrl: { type: String },
        id: { type: ObjectId, ref: 'Team', index: true, required: true }
    },
    awayTeam: {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        crestUrl: { type: String },
        id: { type: ObjectId, ref: 'Team', index: true, required: true }
    },
    status: {
        type: String, required: true,
        enum: ['SCHEDULED', 'TIMED', 'IN_PLAY', 'CANCELED', 'POSTPONED', 'FINISHED']
    },
    result: {
        goalsHomeTeam: { type: Number },
        goalsAwayTeam: { type: Number }
    },
    odds: {
        homeWin: { type: Number, default: 1 },
        awayWin: { type: Number, default: 1 },
        draw: { type: Number, default: 1 }
    },
    venue: { type: String, trim: true },
    allPredictionsProcessed: { type: Boolean, default: false },
    externalReference: { type: Mixed }
});
exports.FixtureModel = mongoose_1.model('Fixture', exports.fixtureSchema);
//# sourceMappingURL=fixture.model.js.map