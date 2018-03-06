"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const league_model_1 = require("../models/league.model");
const base_repo_1 = require("./base.repo");
class LeagueRepository extends base_repo_1.BaseRepository {
    static getInstance() {
        return new LeagueRepository();
    }
    constructor() {
        super(league_model_1.LeagueModel);
    }
}
exports.LeagueRepository = LeagueRepository;
//# sourceMappingURL=league.repo.js.map