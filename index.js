const app = require('fastify')({}); //no options set

app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(3000, () => console.log('app is listening on 3000'));