"use strict";
// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const chai_1 = require("chai");
function doWork() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}
before("start server", () => __awaiter(this, void 0, void 0, function* () {
    // Run express?
    console.log("start server");
    yield doWork();
    console.log("server started");
}));
after("kill server", () => __awaiter(this, void 0, void 0, function* () {
    // Kill the server.
    console.log("kill server");
    yield doWork();
    console.log("server killed");
}));
describe("vanilla bdd", () => {
    it("test", () => __awaiter(this, void 0, void 0, function* () {
        yield console.log("  vanilla bdd test");
    }));
});
suite("vanilla tdd", () => {
    test("test", () => __awaiter(this, void 0, void 0, function* () {
        yield console.log("  vanilla tdd test");
    }));
});
let UnitTest = class UnitTest extends index_1.Unit {
    "big is true with big number"() {
        console.log("  UnitTest big is true with big number");
        chai_1.assert(this.big(200));
    }
    "big is false with small number"() {
        console.log("  UnitTest big is false with small number");
        chai_1.assert(!this.big(50));
    }
};
__decorate([
    test
], UnitTest.prototype, "big is true with big number", null);
__decorate([
    test
], UnitTest.prototype, "big is false with small number", null);
UnitTest = __decorate([
    suite
], UnitTest);
suite("nested class suite", () => {
    let NestedTest = class NestedTest {
        "a test"() {
            console.log("  nested class suite NestedTest a test");
        }
    };
    __decorate([
        test
    ], NestedTest.prototype, "a test", null);
    NestedTest = __decorate([
        suite
    ], NestedTest);
});
//# sourceMappingURL=test.js.map