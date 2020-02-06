'use strict';

const superagent = require('superagent');
const Users = require('../../models/users-model.js');

// const ID = process.env.GOOGLE_CLIENT_ID;
const ID = '867850787554-fi8f426d3p685fl6pjjt6qb1h8jlv2le.apps.googleusercontent.com';
const SECRET = 'XfSvjA_yKse_hKI4D3wBBelG';
const tokenServer = 'https://www.googleapis.com/oauth2/v4/token';
const apiServer = 'https://www.googleapis.com/oauth2/v3/userinfo/'; //this has changed from plus route
const redirect = 'http://localhost:3000/oauth';

const authorize = (req, res, next) => {
  let code = req.query.code;
  console.log('(1) CODE:', code);

  return superagent.post(tokenServer)
    .type('form')
    .send({
      code: code,
      client_id: ID,
      client_secret: SECRET,
      redirect_uri: redirect,
      grant_type: 'authorization_code',
    })
    .then( response => {
      console.log('hello')
      let access_token = response.body.access_token;
      console.log('(2) ACCESS TOKEN:', access_token);
      return access_token;
    })
    .then(token => {
      return superagent.get(apiServer)
        .set('Authorization', `Bearer ${token}`)
        .then( response => {
          let user = response.body;
          user.access_token = token;
          console.log('(3) GOOGLEUSER', user);
          return user;
        });
    })
    .then(oauthUser => {
      console.log('(4) CREATE ACCOUNT');
      console.log(oauthUser.email);
      return Users.createFromOAuth(oauthUser);
    })
    .then(actualRealUser => {
      console.log('(5) ALMOST ...', actualRealUser);
      req.token = actualRealUser.generateToken();
      next();
    })
    .catch(error => error);


};

module.exports = authorize;