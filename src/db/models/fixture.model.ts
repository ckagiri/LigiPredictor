import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface IFixture extends IEntity {
}

interface IFixtureModel extends IFixture, Document { }

export const fixtureSchema = new Schema({
});

export const FixtureModel = model<IFixtureModel>('Fixture', fixtureSchema);