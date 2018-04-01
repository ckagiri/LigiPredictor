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
const events_1 = require("events");
class FinishedFixturesScheduler extends events_1.EventEmitter {
    constructor(taskRunner, finishedFixturesProcessor, eventMediator) {
        super();
        this.taskRunner = taskRunner;
        this.finishedFixturesProcessor = finishedFixturesProcessor;
        this.eventMediator = eventMediator;
        this._processing = false;
        this._running = false;
        this.RUN_INTERVAL = 10 * 60 * 60 * 1000;
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            this._running = true;
            while (this._running) {
                yield this.taskRunner.run({
                    whenToExecute: this.RUN_INTERVAL,
                    context: this,
                    task: () => __awaiter(this, void 0, void 0, function* () {
                        yield Promise.resolve(); //processFinishedFixtures;
                        this.emit('task:executed');
                    })
                });
            }
        });
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve().then(() => {
                this._running = false;
                this.emit('stopped');
            });
        });
        this.processFinishedFixtures = () => {
            // if _processing return
            // let fs = await fixtureRepo.findAllFinishedWithPendingPredictions$();
            // await processPredictions(fs);
        };
        this.processPredictions = (finishedFixtures) => __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(finishedFixtures) && finishedFixtures.length) {
                yield this.finishedFixturesProcessor.processPredictions(finishedFixtures);
                // await leaderboardUpdater.updateScores(finishedFixtures)
                //await leaderboardUpdater.updateRankigs()
                //await leaderboardUpdater.markLeaderboardsAsRefreshed()
                //await finishedFixturesProcessor.setToTrueAllPredictionsProcessed(fixtures)
            }
            this.eventMediator.publish('predictions:processed');
        });
        this.eventMediator.addListener('process:predictions', this.processPredictions);
    }
    get IsRunning() {
        return this._running;
    }
    get IsProcessing() {
        return this._processing;
    }
}
exports.FinishedFixturesScheduler = FinishedFixturesScheduler;
//# sourceMappingURL=finishedFixtures.scheduler.js.map