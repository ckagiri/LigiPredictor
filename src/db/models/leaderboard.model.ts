import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeaderboard extends IEntity {}

export interface ILeaderboardModel extends ILeaderboard, Document {}

const leaderboardSchema = new Schema({

});

export const LeaderboardModel = model<ILeaderboardModel>('Leaderboard', leaderboardSchema);