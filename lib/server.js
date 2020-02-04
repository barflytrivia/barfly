'use strict';

const app = require('fastify')({});


app.get('/', function (req, res) {
  res.send('hello world');
});

module.exports = {

  start: (port) => {     
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));},
  server: app,
};