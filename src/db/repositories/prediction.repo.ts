import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ScorePoints } from '../models/userScore.model';

import { IPrediction, IPredictionModel, PredictionModel } from '../models/prediction.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IPredictionRepository extends IBaseRepository<IPrediction> {
  findOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]): Observable<IPrediction>;  
  findOneOrCreate$({ userId, fixtureId}: {userId: string, fixtureId: string }): Observable<IPrediction>;
  findOne$({ userId, fixtureId}: {userId: string, fixtureId: string }): Observable<IPrediction>;  
  findOneAndUpdateOrCreate$({ userId, fixtureId}: {userId: string, fixtureId: string }, choice: any): Observable<IPrediction>;
}

export class PredictionRepository extends BaseRepository<IPrediction> implements IPredictionRepository {
  private _baseRepo: IBaseRepository<IPredictionModel>;

  static getInstance() {
    return new PredictionRepository();
  }

  constructor() {
    super(PredictionModel)
  }

  findOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]) {
    return Observable.of(<IPrediction>{})
  }

  findOne$({ userId, fixtureId}: {userId: string, fixtureId: string }) {
    return super.findOne$({ userId, fixtureId });
  }  

  findOneOrCreate$({ userId, fixtureId}: {userId: string, fixtureId: string }) {
    return Observable.of(<IPrediction>{})
  }  

  findOneAndUpdateOrCreate$({ userId, fixtureId}: {userId: string, fixtureId: string }, choice: any) {
    return Observable.of(<IPrediction>{})    
  }
}