"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const rxjs_1 = require("rxjs");
const season_updater_1 = require("../../../src/app/schedulers/footballApi/season.updater");
const footballApiProvider_1 = require("../../../src/common/footballApiProvider");
let provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA;
let newDbSeason = () => {
    return {
        _id: 'a',
        currentMatchRound: 1,
        externalReference: {
            [provider]: { id: 1
            }
        }
    };
};
let newApiSeason = () => {
    return {
        id: 1,
        currentMatchRound: 2,
    };
};
let dbSeason = newDbSeason();
let apiSeason = newApiSeason();
let dbSeasons = [dbSeason];
let apiSeasons = [apiSeason];
let seasonConverterStub;
let seasonRepoStub;
let seasonUpdater;
describe('SeasonUpdater', () => {
    beforeEach(() => {
        seasonConverterStub = {
            provider,
            from: () => { }
        };
        seasonRepoStub = {
            Provider: provider,
            findByIdAndUpdate$: () => { return rxjs_1.Observable.of(dbSeason); },
            getByExternalIds$: () => {
                return rxjs_1.Observable.of(dbSeasons);
            }
        };
        seasonUpdater = new season_updater_1.SeasonUpdater(seasonRepoStub);
    });
    describe('updateCurrentMatchRound', () => {
        it('should get seasons by externalId', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(seasonRepoStub, 'getByExternalIds$');
            yield seasonUpdater.updateCurrentMatchRound(apiSeasons);
            let externalIds = [].map.call(apiSeasons, n => n.id);
            expect(spy).to.have.been.calledOnce
                .and.to.have.been.calledWith(sinon.match(externalIds));
        }));
        it('should update currentRound of season if different from stored', () => __awaiter(this, void 0, void 0, function* () {
            let spy = sinon.spy(seasonRepoStub, 'findByIdAndUpdate$');
            let res = yield seasonUpdater.updateCurrentMatchRound(apiSeasons);
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith(sinon.match(dbSeason._id));
        }));
        it('should not update currentRound if similar', () => __awaiter(this, void 0, void 0, function* () {
            let apiSeason = newApiSeason();
            apiSeason.currentMatchRound = 1;
            let spy = sinon.spy(seasonRepoStub, 'findByIdAndUpdate$');
            yield seasonUpdater.updateCurrentMatchRound([apiSeason]);
            expect(spy).not.to.have.been.called;
        }));
    });
});
//# sourceMappingURL=season.updater.spec.js.map