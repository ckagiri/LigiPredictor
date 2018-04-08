"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../../db/models/user.model");
function updateGoogleProfile(user, profile, token, done) {
    console.log('updateGoogle', profile);
    const email = (profile.emails[0].value || '').toLowerCase();
    const l = profile._json.image.url.length - 6;
    if (!user.imageUrl) {
        user.imageUrl = profile._json.image.url.substring(0, l);
    }
    user.google = {
        id: profile.id,
        name: profile.displayName,
        imageUrl: profile._json.image.url.substring(0, l),
        profileUrl: profile._json.url,
        token,
        email,
    };
    user.save((err) => {
        if (err) {
            return done(err, null);
        }
        return done(null, user);
    });
}
exports.updateGoogleProfile = updateGoogleProfile;
function createGoogleUser(profile, token, done) {
    console.log('createGoogle', profile);
    const name = (profile.name.givenName + profile.name.familyName).toLowerCase();
    const email = (profile.emails[0].value || '').toLowerCase();
    user_model_1.UserModel.findOne({ email }).exec()
        .catch((err) => {
        console.error('google', err);
        return done(err);
    })
        .then((existingUser) => {
        if (existingUser) {
            if (!existingUser.google || !existingUser.google.id) {
                updateGoogleProfile(existingUser, profile, token, done);
                return;
            }
            else {
                return done('that user already has a google id attached.');
            }
        }
        else {
            return done('no user found with that email address.');
        }
    });
}
exports.createGoogleUser = createGoogleUser;
exports.googleStrategy = (config) => {
    const googleOptions = {
        clientID: '1077201542905-63tc1p61pntcu90si4s036tgecrl8ptj.apps.googleusercontent.com',
        clientSecret: 'hrwtCyAfU0gQcHM3esPRH_FR',
        callbackURL: `https://${config.hostname}/api/v2/auth/google/callback`,
    };
    return new passport_google_oauth20_1.Strategy(googleOptions, (accessToken, refreshToken, profile, done) => {
        user_model_1.UserModel.findOne({ 'google.id': profile.id }).exec()
            .catch((err) => {
            console.error('google', err);
            return done(err);
        })
            .then((user) => {
            if (user) {
                updateGoogleProfile(user, profile, accessToken, done);
            }
            else {
                createGoogleUser(profile, accessToken, done);
            }
        });
    });
};
//# sourceMappingURL=google.js.map