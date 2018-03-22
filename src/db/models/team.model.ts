import { Schema, Model, model } from 'mongoose';

import { IEntity } from './base.model';

export interface ITeam extends IEntity {}

export const teamSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  slug: { type: Schema.Types.String, required: true, trim: true },
  shortName: { type: Schema.Types.String },
  code: { type: Schema.Types.String },
  aliases: { type: [Schema.Types.String] },
  crestUrl: { type: Schema.Types.String },
  externalReference: { type: Schema.Types.Mixed }  
});

export const TeamModel = model('Team', teamSchema);