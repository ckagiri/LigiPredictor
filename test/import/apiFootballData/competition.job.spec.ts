import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { CompetitionJob } from '../../../src/import/apiFootballData/competition.job';
import { SeasonRepository } from '../../../src/db/repositories/season.repo';
import { FootballApiProvider } from '../../../src/common/footballApiProvider';
// teamRepo findByNameAndUpdate
// seasonRepo findByExternalIdAndUpdate

// builds 2 repos and compId;
// start zips 2 above; adds fixturesJob to queue; Consolelog