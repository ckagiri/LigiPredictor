import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
import { Observable } from 'rxjs';

import { newLeagues } from '../fixtures/testData/league_data';
import { LeagueController } from "../../src/app/api/league/league.controller";
import { ILeagueService } from '../../src/app/api/league/league.service';
import { ILeague } from '../../src/db/models/league.model';

let mockLeagueService: any = {
  getAllLeagues$(): Observable<ILeague[]> { return Observable.of(newLeagues as ILeague[]) }
};

describe.only('League Controller', () => {
  it('should get all leagues', () => {
    let res = { status(stat) { return this; },
      json(result) {
        expect(result).to.be.an.instanceof(Array);
        expect((<ILeague>result[0]).name).to.equal("test123");
      }
    };
    let spy = sinon.spy(mockLeagueService, 'getAllLeagues$');
    const leagueController = new LeagueController(mockLeagueService);

    leagueController.list(<any>{}, <any>res);
    
    expect(spy).to.have.been.called;
    spy.restore();
  })
})
