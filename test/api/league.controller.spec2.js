"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
// import server from "../../src/server";
// import * as supertest from "supertest";
// const agent = supertest.agent( server );
describe('League Controller', () => {
    before('clearData', (done) => {
        let promises = [];
        for (let i in mongoose.connection.collections) {
            promises.push(mongoose.connection.collections[i].remove(function (err) { }));
        }
        Promise.all(promises).then(() => done());
    });
    // xit('bla', () => {
    //   UserModel.remove({}, (err) => {
    //     mongoose.disconnect();
    //     done();
    //   });
    // })
});
//# sourceMappingURL=league.controller.spec2.js.map