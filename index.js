// const io = const io = require('socket.io-client');
const app = require('fastify')({}); //no options set
const start = require('./lib/player.js');

app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/start', function (req, res) {
  start();
  console.log('anything');
  console.log(start());
  res.send('hello world');
});

app.listen(3000, () => console.log('app is listening on 3000'));