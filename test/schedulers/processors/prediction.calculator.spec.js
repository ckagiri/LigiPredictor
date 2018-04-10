"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const prediction_calculator_1 = require("../../../src/app/schedulers/prediction.calculator");
let calculator = prediction_calculator_1.default.getInstance();
describe('PredictionCalculator', function () {
    describe('calculateScore for result: 3 0', () => {
        it('should be correct for choice 2 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 2, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 4,
                APoints: 4,
                BPoints: 0,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 1 0', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 1, goalsAwayTeam: 0 });
            chai_1.expect(scorePoints).to.eql({
                points: 4,
                APoints: 5,
                BPoints: -1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 1,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -1
            });
        });
        it('should be correct for choice 4 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 4, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 5,
                APoints: 4,
                BPoints: 1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 1,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 2 0', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 2, goalsAwayTeam: 0 });
            chai_1.expect(scorePoints).to.eql({
                points: 5,
                APoints: 5,
                BPoints: 0,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 1,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 3 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 3, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 7,
                APoints: 7,
                BPoints: 0,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 3,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 3 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 3, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: 6,
                APoints: 7,
                BPoints: -1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 3,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -1
            });
        });
        it('should be correct for choice 3 0', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 3, goalsAwayTeam: 0 });
            chai_1.expect(scorePoints).to.eql({
                points: 10,
                APoints: 8,
                BPoints: 2,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 4,
                GoalDifferencePoints: 1,
                ExactScorePoints: 1,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 5 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 3, goalsAwayTeam: 0 }, { goalsHomeTeam: 5, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: 3,
                APoints: 4,
                BPoints: -1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 1,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -2
            });
        });
    });
    describe('calculateScore for result: 1 1', () => {
        it('should be correct for choice 1 0', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 1, goalsAwayTeam: 0 });
            chai_1.expect(scorePoints).to.eql({
                points: 1,
                APoints: 1,
                BPoints: 0,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 1,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 2 0', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 2, goalsAwayTeam: 0 });
            chai_1.expect(scorePoints).to.eql({
                points: 0,
                APoints: 0,
                BPoints: 0,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 3 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 3, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 0,
                APoints: 1,
                BPoints: -1,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 1,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -1
            });
        });
        it('should be correct for choice 2 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 2, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 1,
                APoints: 1,
                BPoints: 0,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 1,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 2 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 2, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: 5,
                APoints: 4,
                BPoints: 1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 1,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 1 1', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 1, goalsAwayTeam: 1 });
            chai_1.expect(scorePoints).to.eql({
                points: 8,
                APoints: 6,
                BPoints: 2,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 2,
                GoalDifferencePoints: 1,
                ExactScorePoints: 1,
                TeamScoreMinusPoints: 0
            });
        });
        it('should be correct for choice 3 3', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 1 }, { goalsHomeTeam: 3, goalsAwayTeam: 3 });
            chai_1.expect(scorePoints).to.eql({
                points: 3,
                APoints: 4,
                BPoints: -1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 1,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -2
            });
        });
    });
    describe('calculateScore for result: 1 0', () => {
        it('should be correct for choice 3 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 0 }, { goalsHomeTeam: 3, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: 3,
                APoints: 4,
                BPoints: -1,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 1,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -2
            });
        });
        it('should be correct for choice 4 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 0 }, { goalsHomeTeam: 4, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: 2,
                APoints: 4,
                BPoints: -2,
                MatchOutcomePoints: 4,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -2
            });
        });
        it('should be correct for choice 3 3', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 0 }, { goalsHomeTeam: 3, goalsAwayTeam: 3 });
            chai_1.expect(scorePoints).to.eql({
                points: -2,
                APoints: 0,
                BPoints: -2,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -2
            });
        });
        it('should be correct for choice 0 2', () => {
            let scorePoints = calculator.calculateScore({ goalsHomeTeam: 1, goalsAwayTeam: 0 }, { goalsHomeTeam: 0, goalsAwayTeam: 2 });
            chai_1.expect(scorePoints).to.eql({
                points: -1,
                APoints: 0,
                BPoints: -1,
                MatchOutcomePoints: 0,
                TeamScorePlusPoints: 0,
                GoalDifferencePoints: 0,
                ExactScorePoints: 0,
                TeamScoreMinusPoints: -1
            });
        });
    });
});
//# sourceMappingURL=prediction.calculator.spec.js.map