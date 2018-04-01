import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ScorePoints } from '../models/userScore.model';

import { IPrediction, IPredictionModel, PredictionModel } from '../models/prediction.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IPredictionRepository extends IBaseRepository<IPrediction> {
  getOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]): Observable<IPrediction>;  
  findOneOrCreate$(userId: string, fixtureId: string): Observable<IPrediction>;
  findOneByUserAndFixture$(userId: string, fixtureId: string): Observable<IPrediction>;
}

export class PredictionRepository extends BaseRepository<IPrediction> implements IPredictionRepository {
  private _baseRepo: IBaseRepository<IPredictionModel>;

  static getInstance() {
    return new PredictionRepository();
  }

  constructor() {
    super(PredictionModel)
  }

  getOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]) {
    return Observable.of(<IPrediction>{})
  }

  findOneOrCreate$(userId: string, fixtureId: string){
    return Observable.of(<IPrediction>{})
  }  

  findOneByUserAndFixture$(userId: string, fixtureId: string) {
    return Observable.of(<IPrediction>{})
  } 
}