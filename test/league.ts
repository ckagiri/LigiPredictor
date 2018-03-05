process.env.NODE_ENV = 'test';

import "mocha";
import {suite, test} from "mocha-typescript";
import { assert } from "chai";

import { Unit } from "../src/index";

@suite class LeagueTest extends Unit {
    public static before() {

    }

    public static after() {

    }

    @test "big is true with big number"() {
        console.log("  UnitTest big is true with big number");
        assert(this.big(200));
    }
    
}