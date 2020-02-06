'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');
const authRouter = require('./auth/router.js');
const gameRouter = require('./middleware/game-routes.js');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Routes
app.use(authRouter);
app.use(gameRouter);

//Error Routes
app.use(notFound);
app.use(errorHandler);

module.exports = {

  start: (port) => {     
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));},
  server: app,
};