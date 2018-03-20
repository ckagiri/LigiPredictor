// import * as mongoose from 'mongoose';
// import { assert } from 'chai';
// import * as sinon from 'sinon';
// import { Observable } from 'rxjs';
// import { ILeague, ILeagueModel, LeagueModel as League } from '../../src/db/models/league.model';
// import { ILeagueRepository, LeagueRepository } from '../../src/db/repositories/league.repo';
// import { LeagueConverter } from '../../src/db/converters/league.converter';
// import { LeagueService } from '../../src/db/services/league.service';
// const league = {
//   name: 'English Premier League',
//   slug: 'english_premier_league',
//   code: 'epl'
// };
// let mockLeagueRepo: ILeagueRepository = {
//   save$(obj: ILeague): Observable<ILeagueModel> {
//     return Observable.create((observer) => {
//       observer.next(new League(league));
//       observer.complete();
//     }); 
//   }
// }
// describe('LeagueService', () => {
//   let service: LeagueService;
//   before(() => {
//     mongoose.connect('mongodb://localhost:27017/test123-test');
//     (<any>mongoose).Promise = global.Promise;
//     service = new LeagueService(LeagueRepository.getInstance(), LeagueConverter.getInstance());
//   });
//   after((done) => {
//     League.remove({}, (err) => {
//       mongoose.disconnect();
//       done();
//     });
//   });
//   it('should save a new league', (done) => {
//     let saveSpy = sinon.spy(mockLeagueRepo, 'save$');
//     service = new LeagueService(mockLeagueRepo, LeagueConverter.getInstance());
//     service.save$(league).subscribe((obj => {
//       assert.isTrue(saveSpy.calledOnce);
//       assert.equal(saveSpy.firstCall.args[0].name, 'English Premier League');
//       assert.equal(obj['name'], 'English Premier League');
//       saveSpy.restore();
//       done();
//     }));   
//   })
//   xit('should really save a new league', (done) => {
//     service.save$(league).subscribe(l => {
//       assert.notEqual(l._id, undefined);
//       assert.equal(l.name, league.name);
//       assert.equal(l.slug, league.slug);
//       assert.equal(l.code, league.code);
//       done();
//     });
//   })
// })
//# sourceMappingURL=league.service.spec.js.map