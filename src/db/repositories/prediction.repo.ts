import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { ScorePoints } from '../models/userScore.model';

import { IPrediction, IPredictionModel, PredictionModel, PredictionStatus } from '../models/prediction.model';
import { FixtureStatus, IFixture } from '../models/fixture.model';
import { IBaseRepository, BaseRepository } from './base.repo';
import { IFixtureRepository, FixtureRepository } from './fixture.repo';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';
import { IPredictor, VosePredictor } from '../../common/predictor';

export interface IPredictionRepository extends IBaseRepository<IPrediction> {
  findOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]): Observable<IPrediction>;  
  findOneOrCreate$({ userId, fixtureId }: { userId: string, fixtureId: string }): Observable<IPrediction>;
  findOneAndUpsert$({ userId, fixtureId }: { userId: string, fixtureId: string }, choice: any): Observable<IPrediction>;
}

export class PredictionRepository extends BaseRepository<IPrediction> implements IPredictionRepository {
  private fixtureRepo: IFixtureRepository;

  static getInstance() {
    return new PredictionRepository(FixtureRepository.getInstance(ApiProvider.LIGI), VosePredictor.getInstance());
  }

  constructor(fixtureRepo: IFixtureRepository, private randomPredictor: IPredictor) {
    super(PredictionModel)
    this.fixtureRepo = fixtureRepo;
  }
  
  findOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string|string[]) {
    let query: any = {
      user: userId, season: seasonId, gameRound, hasJoker: true
    }
    return super.findOne$(query)
      .flatMap(currentJoker => {
        let newJokerFixtureId: string;
        if(pick instanceof Array) {
          if(currentJoker) {
            return Observable.of(currentJoker)
          } else {
            newJokerFixtureId = pick[Math.floor(Math.random() * pick.length)];	
            return this.pickJoker$(userId, currentJoker, newJokerFixtureId, true)	
          }
        } else {
          newJokerFixtureId = pick;
          if(currentJoker && currentJoker.status === PredictionStatus.PROCESSED) {
            return Observable.throw(new Error('Joker prediction already processed'));
          }
          return this.pickJoker$(userId, currentJoker, newJokerFixtureId, false)	
        }
      })
  }

  private pickJoker$ (userId: string, currentJoker: IPrediction, newJokerFixtureId: string, autoPicked: boolean) { 
    let newJokerFixture: IFixture;   
    return this.fixtureRepo.findById$(newJokerFixtureId)
      .flatMap(fixture => {
        if(!fixture) { 
          return Observable.throw(new Error('Fixture does not exist')); 
        }
        newJokerFixture = fixture;
			  if(autoPicked || newJokerFixture.status === FixtureStatus.SCHEDULED || newJokerFixture.status === FixtureStatus.TIMED) {
          return super.findOne$({ user: userId, fixture: newJokerFixtureId})
        }
        return Observable.throw(new Error('Fixture not scheduled'))
      })
      .catch((error: any) => {
				return Observable.throw(error);
			})
      .flatMap((newJokerPrediction: IPrediction) => {
        let { slug: fixtureSlug, season, gameRound, odds } = newJokerFixture;    
        let newJoker: IPrediction;        
        if(!newJokerPrediction) {
          let randomMatchScore = this.getRandomMatchScore(odds);
          newJoker = {
            user: userId, fixture: newJokerFixtureId, fixtureSlug, season, gameRound,
            hasJoker: true, jokerAutoPicked: autoPicked, choice: randomMatchScore
          }
        } else {
          newJoker = newJokerPrediction;
          newJoker.hasJoker = true;
          newJoker.jokerAutoPicked = autoPicked;
        }
        let predictionJokers: IPrediction[] = [newJoker];
        if(currentJoker) {
          currentJoker.hasJoker = false;
          predictionJokers.push(currentJoker)
        }
        return this.insertMany$(predictionJokers)
      })
      .flatMap(predictions => {
        return Observable.from(predictions);
      })
      .filter(prediction => {
        return prediction.fixture.toString() === newJokerFixture.id
      })
      .first();
  }

  private getRandomMatchScore(odds: any) {
		let score = this.randomPredictor.predict(odds);
		let { goalsHomeTeam, goalsAwayTeam } = score;
		return {
			goalsHomeTeam, goalsAwayTeam,
			isComputerGenerated: true
		}
	}

  findOneOrCreate$({ userId, fixtureId }: { userId: string, fixtureId: string }) {
    return Observable.of(<IPrediction>{})
  }  

  findOneAndUpsert$({ userId, fixtureId }: { userId: string, fixtureId: string }, choice: any) {
    return Observable.of(<IPrediction>{})    
  }
}