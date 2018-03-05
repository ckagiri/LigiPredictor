"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
require("mocha");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const index_1 = require("../src/index");
let LeagueTest = class LeagueTest extends index_1.Unit {
    static before() {
    }
    static after() {
    }
    "big is true with big number"() {
        console.log("  UnitTest big is true with big number");
        chai_1.assert(this.big(200));
    }
};
__decorate([
    mocha_typescript_1.test
], LeagueTest.prototype, "big is true with big number", null);
LeagueTest = __decorate([
    mocha_typescript_1.suite
], LeagueTest);
//# sourceMappingURL=league.js.map