const io = require('socket.io-client');
const prompt = require('prompt');

const game = io.connect('http://localhost:3001/game');
const joinGame = (teamName) => game.emit('join', teamName);
game.on('message', message => console.log(message));

prompt.start();

prompt.get(['team-name'], function (err, result) {
  if (err) { return onErr(err); }
  console.log(result);
  console.log('  Team Name: ' + result['team-name']);
  joinGame(result['team-name']);
});

function onErr(err) {
  console.log(err);
  return 1;
}