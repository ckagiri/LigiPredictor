"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const index_1 = require("../../config/environment/index");
require('../models/league.model');
require('../models/season.model');
require('../models/team.model');
function seed() {
    const seedData = require('../tasks/seedData/seed-epl17');
    const seeder = require('./mongoose-seeder');
    mongoose.connect(index_1.config.mongo.uri);
    mongoose.connection.on('open', () => {
        console.log('seeding db..');
        seeder.seed(seedData, { dropDatabase: true, dropCollections: true }, function (err) {
            if (err) {
                console.log(err);
            }
            mongoose.connection.close();
            console.log('seeding done');
        });
    });
}
seed();
//# sourceMappingURL=seed.js.map