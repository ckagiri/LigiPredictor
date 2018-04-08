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

const { String, Mixed } = Schema.Types;

export const teamSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  shortName: { type: String, trim: true },
  code: { type: String },
  aliases: { type: [String] },
  crestUrl: { type: String },
  externalReference: { type: Mixed }  
});

export const TeamModel = model<ITeamModel>('Team', teamSchema);