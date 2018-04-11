import { Application, Handler, NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';

import { generateToken, jwtStrategy, getUserInfo } from './passport/jwt';
import { IUserModel, UserModel as User } from '../db/models/user.model';

export interface IAuthorization {
  router: Router;
  init(express: Application);
  requireAuthentication(): Handler;
  requireAdmin(): Handler;
}

import { facebookStrategy } from './passport/facebook';
import { googleStrategy } from './passport/google';
import { twitterStrategy } from './passport/twitter';
import { localStrategy } from './passport/local';

const hostname = '';

export class Authorization implements IAuthorization {
  public router: Router;

  constructor() {
    this.router = Router();
    passport.serializeUser((user: IUserModel, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });

    const config = { hostname };
    
    passport.use(localStrategy);
    passport.use(googleStrategy(config));
    passport.use(facebookStrategy(config));
    passport.use(twitterStrategy(config));
    passport.use(jwtStrategy);
  }

  private register(req: Request, res: Response, next: NextFunction) {
    if (!req.body.password) {
      return res.status(422).send({ error: 'You must enter a password.' });
    }
    const password = req.body.password;

    if (!req.body.email) {
      return res.status(422).send({ error: 'You must specify an email address.' });
    }
    const email = req.body.email;
    
    const user = new User({
      email,
      password
    });

    User.findOne({ email }, (err, existingUser) => {
      if (err) { return next(err); }

      if (existingUser) {
        return res.status(409).send({ error: 'Account with that email address already exists.' });
      }

      user.save((err, user) => {
        if (err) {
          console.error('authorization', err);
          return next(err);
        }

        const userInfo = getUserInfo(user);

        res.status(201).json({
          token: generateToken(userInfo),
          user: userInfo,
        });
      });
    });
  }

  private login(req: Request, res: Response, next: NextFunction) {
    const userInfo = getUserInfo(req['user']);
    res.status(200).json({
      token: generateToken(userInfo),
      user: userInfo,
    });
  }

  public init(express: Application): void {
    express.use(passport.initialize());

    this.router.post('/register', this.register);
    this.router.post('/login', this.requireLogin(), this.login);
    this.router.get('/google', this.googleAuthentication(), this.login);
    this.router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), this.callback);
    this.router.get('/facebook', this.facebookAuthentication(), this.login);
    this.router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), this.callback);
    this.router.get('/twitter', this.twitterAuthentication(), this.login);
    this.router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), this.callback);
    this.router.post('/protected', this.requireAuthentication(), (req, res) => {
      res.send({ content: 'success' });
    });
    this.router.post('/adminonly', this.requireAuthentication(), this.requireAdmin(), (req, res) => {
      res.send({ content: 'success' });
    });
  }

  public googleAuthentication(): Handler {
    return passport.authenticate('google', {
      session: true,
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
      ],
    });
  }

  public facebookAuthentication(): Handler {
    return passport.authenticate('facebook', {
      session: true,
    });
  }

  public twitterAuthentication(): Handler {
    return passport.authenticate('twitter', {
      session: false,
    });
  }

  public callback(req: Request, res: Response, next: NextFunction): void {
    if (req['user']) {
      const userInfo = getUserInfo(req['user']);
      const token = generateToken(userInfo);
      res.redirect('/auth?token=' + token);
    } else {
      res.redirect('/login');
    }
  }

  public requireLogin(): Handler {
    return passport.authenticate('local', { session: false });
  }

  public requireAuthentication(): Handler {
    return passport.authenticate('jwt', { session: false });
  }

  public requireAdmin(): Handler {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req['user'];

      User.findById(user._id, (err, foundUser) => {

        if (err) {
          res.status(422).json({ error: 'No user found.' });
          return next(err);
        }

        if (foundUser.isAdmin) {
          return next();
        }

        res.status(401).json({ error: 'You are not authorized to view this content' });
        return next('Unauthorized');
      });
    };
  }
}