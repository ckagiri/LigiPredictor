import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeaderboard extends IEntity {}

export interface ILeaderboardModel extends ILeaderboard, Document {}

export enum LeaderboardStatus {
  UPDATING_SCORES = 'UPDATING_SCORES',
  UPDATING_RANKINGS = 'UPDATING_RANKINGS',
  REFRESHED = 'REFRESHED'
}

const leaderboardSchema = new Schema({

});

export const LeaderboardModel = model<ILeaderboardModel>('Leaderboard', leaderboardSchema);