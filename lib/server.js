'use strict';

const app = require('fastify')();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
app.register(require('fastify-formbody')); //equivalent to express.urlencoded
app.register(require('fastify-static'), {
  root: path.join(process.cwd(), 'public'),
  prefix: '/',
});

// const errorHandler = require('./middleware/error.js');
// const notFound = require('./middleware/404.js');
// const authRouter = require('./auth/router.js');

app.use(cors());
app.use(morgan('dev'));

//Routes
// app.use(authRouter);

//Error Routes
// app.use(notFound);
// app.use(errorHandler);

app.post('/myroute', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = {

  start: (port) => {     
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));},
  server: app,
};