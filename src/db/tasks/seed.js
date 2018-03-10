"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const mongoose = require("mongoose");
// This try-catch is added so that it is possible to set a watch
// on the mocha runner. Every time the test runs, it will try
// to create the add the model again
function seed() {
    const League = mongoose.model('League', new mongoose.Schema({
        name: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        slug: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        code: {
            type: mongoose.SchemaTypes.String,
            default: ''
        }
    }));
    const x = mongoose.model('League');
    const seedData = require('../tasks/seedData/seed-leagues');
    const seeder = require('./mongoose-seeder');
    mongoose.connect('mongodb://localhost:27017/ligi-predictor-test1');
    mongoose.connection.on('open', () => {
        seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
            .then(function (dbData) {
        }).catch(function (err) {
            console.log(err);
        });
        seeder.seed(seedData, { dropDatabase: true, dropCollections: true }, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('done');
            // User.count(function(err, count) {
            //     if(err) return done(err);
            //     count.should.be.equal(2);
            //     done();
            // });
        });
        // League.remove({}, () => {
        //   console.log('cleared')
        //   const seeder = require('mongoose-seeder');
        //   seeder.seed(seedData, { dropDatabase: true, dropCollections: true })
        //   .then(function(dbData: any){
        //     console.log(dbData)   
        //   }).catch(function(err: any){
        //     console.log(err);
        //   });
        //   const league = {
        //     name: 'English Premier League',
        //     slug: 'english_premier_league',
        //     code: 'epl'
        //   };
        //   const l = new League(league);
        // l.save((err) => {
        //   if (err) {
        //     console.log(err.message)
        //   } else {
        //     console.log("chalo")
        //   }
        // });
    });
}
seed();
//# sourceMappingURL=seed.js.map