import { Strategy as FacebookStrategy } from 'passport-facebook';

import { IUserModel, UserModel as User } from '../../db/models/user.model';

export function updateFacebookProfile(user: IUserModel, profile: any, token: string, done: any) {
  console.log('updateFacebook', profile);
  const email = ((profile && profile.emails && profile.emails.length && profile.emails.length > 0) ?
    profile.emails[0].value || '' : '').toLowerCase();
  if (!user.imageUrl) {
    user.imageUrl = 'https://graph.facebook.com/' + profile.id + '/picture?width=720&height=720';
  }

  user.facebook = {
    id: profile.id,
    name: profile.displayName,
    imageUrl: 'https://graph.facebook.com/' + profile.id + '/picture?width=720&height=720',
    profileUrl: profile.profileUrl,
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

export function createFacebookUser(profile: any, token: any, done: any) {
  console.log('createFacebook', profile);
  const name = (profile.name.givenName + profile.name.familyName).toLowerCase();
  const email = ((profile.emails && profile.emails.length && profile.emails.length > 0) ? profile.emails[0].value || '' : '').toLowerCase();

  User.findOne({ email }).exec()
    .catch((err) => {
      console.error('facebook', err);
      return done(err);
    })
    .then((existingUser) => {
      if (existingUser) {
        if (!existingUser.facebook || !existingUser.facebook.id) {
          updateFacebookProfile(existingUser, profile, token, done);
          return;
        } else {
          return done('that user already has a facebook id attached.');
        }
      } else {
        return done('no user found with that email address.');
      }
    });
}

export const facebookStrategy = (config: any) => {
  const facebookOptions = {
    clientID: '536783853090244',
    clientSecret: '406d3884d23a0e1c5456ecf693684e32',
    callbackURL: `https://${config.hostname}/api/v2/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email', 'name', 'gender', 'hometown', 'link'],
  };

  return new FacebookStrategy(
    facebookOptions,
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      User.findOne({ 'facebook.id': profile.id }).exec()
        .catch((err) => {
          console.log(err);
          return done(err);
        })
        .then((user) => {
          if (user) {
            updateFacebookProfile(user, profile, accessToken, done);
          } else {
            createFacebookUser(profile, accessToken, done);
          }
        });
    });
};
