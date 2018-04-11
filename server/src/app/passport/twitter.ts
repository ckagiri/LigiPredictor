import { Strategy as TwitterStrategy } from 'passport-twitter';

import { IUserModel, UserModel as User } from '../../db/models/user.model';

export function updateTwitterProfile(user: IUserModel, profile: any, token: string, done: any) {
  const email = ('').toLowerCase();
  if (!user.imageUrl) {
    user.imageUrl = profile.photos[0].value;
  }

  user.twitter = {
    id: profile,
    username:  profile.screen_name,
    displayName: profile.displayName,
    imageUrl:  profile.photos[0].value,
    token: profile,
    // email,
  };

  user.save((err: any) => {
    if (err) {
      return done(err, null);
    }
    return done(null, user);
  });
}

export function createTwitterUser(profile: any, token: any, done: any) {
  const name = (profile.username).toLowerCase();
  const email = (profile.emails || '').toLowerCase();

  User.findOne({ email }).exec()
    .catch((err) => {
      console.error('twitter', err);
      return done(err);
    })
    .then((existingUser) => {
      if (existingUser) {
        if (!existingUser.twitter || !existingUser.twitter.id) {
          updateTwitterProfile(existingUser, profile, token, done);
          return;
        } else {
          return done('that user already has a twitter id attached.');
        }
      } else {
        return done('no user found with that email address.');
      }
    });
}

export const twitterStrategy = (config: any) => {
  const twitterOptions = {
    consumerKey: 'JiHaZkqYmvEOrpeDwEyQ3LxSQ',
    consumerSecret: '5U3ReYGVHlHZMxbo7shYebDiqI5wJAZlPuINiB9GlWdwkeCsw4',
    callbackURL: `https://${config.hostname}/api/v2/auth/twitter/callback`,
  };

  return new TwitterStrategy(
    twitterOptions,
    (accessToken: string, tokenSecret: string, profile: any, done: any) => {

      console.log('profile', profile);

      User.findOne({ 'twitter.id': profile.id }).exec()
        .catch((err) => {
          console.log(err);
          return done(err);
        })
        .then((user) => {
          if (user) {
            updateTwitterProfile(user, profile, accessToken, done);
          } else {
            createTwitterUser(profile, accessToken, done);
          }
        });
    });
};
