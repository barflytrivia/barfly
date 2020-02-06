'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users-model.js');
const auth = require('./middleware/basic-auth-middleware.js');
// const token = require('./middleware/bearer-auth-middleware.js');
// const acl = require('./middleware/acl-middleware.js');
const oauth = require('./middleware/oauth/google.js');

//routes

//signup
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

//signin
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

//oauth
authRouter.get('/oauth', oauth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.status(200).send(req.token);
  // res.send('i am responding');
});

//other routes acl protected 

module.exports = authRouter;