'use strict';

const server = require('./lib/server.js');
const socket = require('./lib/trivia-server');

require('dotenv').config();
// const mongoose = require('mongoose');

// const mongooseOptions = {
//   useNewUrlParser:true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// };

// mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
server.start(3000);