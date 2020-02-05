'use strict';

const superagent = require('superagent');
const Users = require('../users-model.js');

const ID = process.env.GOOGLE_CLIENT_ID;
const SECRET = process.env.GOOGLE_CLIENT_SECRET;
const tokenServer = 'https://www.googleapis.com/oauth2/v4/token';
const apiServer = 'https://www.googleapis.com/oauth2/v3/userinfo/'; //this has changed from plus route
const redirect = 'http://localhost:3000/oauth';

const authorize = (req) => {

  let code = req.query.code;
  console.log('(1) CODE:', code);

  return superagent.post(tokenServer)
    .type('form')
    .send({
      code: code,
      client_id: ID,
      client_secret: SECRET,
      redirect_uri: `${redirect}/oauth`,
      grant_type: 'authorization_code',
    })
    .then( response => {
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
      return Users.createFromOAuth(oauthUser);
    })
    .then(actualRealUser => {
      console.log('(5) ALMOST ...', actualRealUser);
      return actualRealUser.generateToken();
    })
    .catch(error => error);


};

module.exports = {authorize};