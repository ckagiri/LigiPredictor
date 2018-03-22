import { Schema, Model, model } from 'mongoose';

import { IEntity } from './base.model';

export interface ITeam extends IEntity {}

export const teamSchema = new Schema({

});

export const TeamModel = model('Team', teamSchema);