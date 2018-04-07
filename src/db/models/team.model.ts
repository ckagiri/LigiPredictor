import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ITeam extends IEntity {
  name: string;
  slug?: string;
  shortName?: string;
  code?: string;
  aliases?: string[]; 
  crestUrl?: string;
  externalReference?: any
}

interface ITeamModel extends ITeam, Document { }

export const teamSchema = new Schema({
  name: { type: Schema.Types.String, required: true, trim: true },
  slug: { type: Schema.Types.String, required: true, trim: true },
  shortName: { type: Schema.Types.String, trim: true },
  code: { type: Schema.Types.String },
  aliases: { type: [Schema.Types.String] },
  crestUrl: { type: Schema.Types.String },
  externalReference: { type: Schema.Types.Mixed }  
});

export const TeamModel = model<ITeamModel>('Team', teamSchema);