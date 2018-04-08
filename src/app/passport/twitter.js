"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_twitter_1 = require("passport-twitter");
const user_model_1 = require("../../db/models/user.model");
function updateTwitterProfile(user, profile, token, done) {
    const email = ('').toLowerCase();
    if (!user.imageUrl) {
        user.imageUrl = profile.photos[0].value;
    }
    user.twitter = {
        id: profile,
        username: profile.screen_name,
        displayName: profile.displayName,
        imageUrl: profile.photos[0].value,
        token: profile,
    };
    user.save((err) => {
        if (err) {
            return done(err, null);
        }
        return done(null, user);
    });
}
exports.updateTwitterProfile = updateTwitterProfile;
function createTwitterUser(profile, token, done) {
    const name = (profile.username).toLowerCase();
    const email = (profile.emails || '').toLowerCase();
    user_model_1.UserModel.findOne({ email }).exec()
        .catch((err) => {
        console.error('twitter', err);
        return done(err);
    })
        .then((existingUser) => {
        if (existingUser) {
            if (!existingUser.twitter || !existingUser.twitter.id) {
                updateTwitterProfile(existingUser, profile, token, done);
                return;
            }
            else {
                return done('that user already has a twitter id attached.');
            }
        }
        else {
            return done('no user found with that email address.');
        }
    });
}
exports.createTwitterUser = createTwitterUser;
exports.twitterStrategy = (config) => {
    const twitterOptions = {
        consumerKey: 'JiHaZkqYmvEOrpeDwEyQ3LxSQ',
        consumerSecret: '5U3ReYGVHlHZMxbo7shYebDiqI5wJAZlPuINiB9GlWdwkeCsw4',
        callbackURL: `https://${config.hostname}/api/v2/auth/twitter/callback`,
    };
    return new passport_twitter_1.Strategy(twitterOptions, (accessToken, tokenSecret, profile, done) => {
        console.log('profile', profile);
        user_model_1.UserModel.findOne({ 'twitter.id': profile.id }).exec()
            .catch((err) => {
            console.log(err);
            return done(err);
        })
            .then((user) => {
            if (user) {
                updateTwitterProfile(user, profile, accessToken, done);
            }
            else {
                createTwitterUser(profile, accessToken, done);
            }
        });
    });
};
//# sourceMappingURL=twitter.js.map