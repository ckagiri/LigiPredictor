import { Document, Model, model, Schema } from 'mongoose';

export interface ILeague {
  name: string;
  slug: string;
  code: string;
}

export interface ILeagueModel extends ILeague, Document {  
}

export const leagueSchema = new Schema({
  name: {
    type:  Schema.Types.String,
    required: true
  },
  slug: {
    type: Schema.Types.String,
    required: true
  },
  code: {
    type: Schema.Types.String,
    default: ''
  }
});

export const League: Model<ILeagueModel> = model<ILeagueModel>('League', leagueSchema);