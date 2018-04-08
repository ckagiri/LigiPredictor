import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { IUserModel, UserModel as User } from '../../db/models/user.model';

export function updateGoogleProfile(user: IUserModel, profile: any, token: string, done: any) {
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

  user.save((err: any) => {
    if (err) {
      return done(err, null);
    }
    return done(null, user);
  });
}

export function createGoogleUser(profile: any, token: any, done: any) {
  console.log('createGoogle', profile);
  const name = (profile.name.givenName + profile.name.familyName).toLowerCase();
  const email = (profile.emails[0].value || '').toLowerCase();

  User.findOne({ email }).exec()
    .catch((err) => {
      console.error('google', err);
      return done(err);
    })
    .then((existingUser) => {
      if (existingUser) {
        if (!existingUser.google || !existingUser.google.id) {
          updateGoogleProfile(existingUser, profile, token, done);
          return;
        } else {
          return done('that user already has a google id attached.');
        }
      } else {
        return done('no user found with that email address.');
      }
    });
}

export const googleStrategy = (config: any) => {
  const googleOptions = {
    clientID: '1077201542905-63tc1p61pntcu90si4s036tgecrl8ptj.apps.googleusercontent.com',
    clientSecret: 'hrwtCyAfU0gQcHM3esPRH_FR',
    callbackURL: `https://${config.hostname}/api/v2/auth/google/callback`,
  };

  return new GoogleStrategy(
    googleOptions,
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      User.findOne({ 'google.id': profile.id }).exec()
        .catch((err) => {
          console.error('google', err);
          return done(err);
        })
        .then((user) => {
          if (user) {
            updateGoogleProfile(user, profile, accessToken, done);
          } else {
            createGoogleUser(profile, accessToken, done);
          }
        });
    });
};
