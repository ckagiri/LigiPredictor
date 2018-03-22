import { Schema, Model, model } from 'mongoose';

import { IEntity } from './base.model';

export interface ISeason extends IEntity {}

export const seasonSchema = new Schema({
  // league: {
  //   name: { type: Schema.Types.String, required: true },
  //   slug: { type: Schema.Types.String, required: true },
  //   id: { type: Schema.Types.ObjectId, ref: "League", index: true, required: true }
  // },
  name: { type: Schema.Types.String, required: true },
  slug: { type: Schema.Types.String, required: true, trim: true },
  year: { type: Schema.Types.Number, required: true },
  caption: { type: Schema.Types.String },
  currentMatchRound: { type: Schema.Types.Number },
  currentGameRound: { type: Schema.Types.Number },
	numberOfRounds: { type: Schema.Types.Number },
	numberOfTeams: { type: Schema.Types.Number },
	numberOfGames: { type: Schema.Types.Number },
	seasonStart: { type: Schema.Types.Date },
	seasonEnd: { type: Schema.Types.Date },
  externalReference: { type: Schema.Types.Mixed }
});

export const SeasonModel = model('Season', seasonSchema);