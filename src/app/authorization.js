"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport = require("passport");
const jwt_1 = require("./passport/jwt");
const user_model_1 = require("../db/models/user.model");
const facebook_1 = require("./passport/facebook");
const google_1 = require("./passport/google");
const twitter_1 = require("./passport/twitter");
const local_1 = require("./passport/local");
const hostname = '';
class Authorization {
    constructor() {
        this.router = express_1.Router();
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => {
            user_model_1.UserModel.findById(id, (err, user) => {
                done(err, user);
            });
        });
        const config = { hostname };
        passport.use(local_1.localStrategy);
        passport.use(google_1.googleStrategy(config));
        passport.use(facebook_1.facebookStrategy(config));
        passport.use(twitter_1.twitterStrategy(config));
        passport.use(jwt_1.jwtStrategy);
    }
    register(req, res, next) {
        if (!req.body.password) {
            return res.status(422).send({ error: 'You must enter a password.' });
        }
        const password = req.body.password;
        if (!req.body.email) {
            return res.status(422).send({ error: 'You must specify an email address.' });
        }
        const email = req.body.email;
        const user = new user_model_1.UserModel({
            email,
            password
        });
        user_model_1.UserModel.findOne({ email }, (err, existingUser) => {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                return res.status(409).send({ error: 'Account with that email address already exists.' });
            }
            user.save((err, user) => {
                if (err) {
                    console.error('authorization', err);
                    return next(err);
                }
                const userInfo = jwt_1.getUserInfo(user);
                res.status(201).json({
                    token: jwt_1.generateToken(userInfo),
                    user: userInfo,
                });
            });
        });
    }
    login(req, res, next) {
        const userInfo = jwt_1.getUserInfo(req['user']);
        res.status(200).json({
            token: jwt_1.generateToken(userInfo),
            user: userInfo,
        });
    }
    init(express) {
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
    googleAuthentication() {
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
    facebookAuthentication() {
        return passport.authenticate('facebook', {
            session: true,
        });
    }
    twitterAuthentication() {
        return passport.authenticate('twitter', {
            session: false,
        });
    }
    callback(req, res, next) {
        if (req['user']) {
            const userInfo = jwt_1.getUserInfo(req['user']);
            const token = jwt_1.generateToken(userInfo);
            res.redirect('/auth?token=' + token);
        }
        else {
            res.redirect('/login');
        }
    }
    requireLogin() {
        return passport.authenticate('local', { session: false });
    }
    requireAuthentication() {
        return passport.authenticate('jwt', { session: false });
    }
    requireAdmin() {
        return (req, res, next) => {
            const user = req['user'];
            user_model_1.UserModel.findById(user._id, (err, foundUser) => {
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
exports.Authorization = Authorization;
//# sourceMappingURL=authorization.js.map