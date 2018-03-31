import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ScorePoints {
  points: number;
  pointsFor: number;
  pointsAgainst: number;
  MatchOutcomePoints: number;
  GoalDifferencePoints: number;
  TeamScorePoints: number;
}

export interface IUserScore extends IEntity {
  leaderboard: string;
  user: string;
  fixtures?: string[];
  predictions?: string[]
  points: number;
  pointsFor: number;
  pointsAgainst: number;
  MatchOutcomePoints: number;
  GoalDifferencePoints: number;
  TeamScorePoints: number;
  pointsExcludingJoker?: number;
  pointsOld?: number;
  pointsNew?: number;
  positionOld?: number;
  positionNew?: number;
}

export interface IUserScoreModel extends IUserScore, Document {}

const userScoreSchema = new Schema({
});

export const UserScoreModel = model<IUserScoreModel>('UserScore', userScoreSchema);