const io = require('socket.io')(3001);
io ? console.log('server socketed') : console.log('server not connected');

const superagent = require('superagent');

const game = io.of('/game');
const memory = {
  player1: true,
  score: {},
  guesses: {},
  readyCount: 0,
  participants: 2,
};

game.on('connection', (socket) => {
  console.log('game CHANNEL', socket.id);

  socket.on('join', payload => {
    console.log('joining the game');
    let team = payload.team;
    console.log(team, ' joined barfly');
    game.emit('message', {message:'you have joined the game', team:team});
    if(payload.participants) memory.participants = Number.parseInt(payload.participants);
    console.log('participants: ', memory.participants);
    memory.readyCount += 1;
    memory.score[team] = 0;
    memory.guesses = 0;
    console.log(memory);
    memory.participants === memory.readyCount ? initiate() : waiting();
  });

  socket.on('setup', players => memory.participants = Number.parseInt(players) );

  socket.on('guess', payload => {
    console.log(payload);
    let team = payload.team;
    if(payload.guess) {
      memory.score[team] += 1;
      memory.guesses += 1;
      game.emit('message', {team:team, message:'your guess was correct!'});
    }
    else {
      memory.guesses += 1;
      game.emit('message', {team:team, message:'your guess was incorrect :('});
    }
    memory.guesses % memory.participants === 0 ?  endTurn(memory.score) : game.emit('message', {team:team, message:'awaiting the other team(s)....'});
  });
});

function waiting() {
  game.emit('message', 'waiting for more teams....');
  console.log('still waiting????')
}

async function initiate() {
  console.log('initiate');
  let questions = await getQuestions();
  console.log(questions);
  memory.questions = questions;
  poseQuestion();
}

async function getQuestions() {
  const category = Math.floor(Math.random() * 24 + 9);
  const url = `https://opentdb.com/api.php?amount=2&category=${category}&difficulty=medium&type=multiple`;
  return superagent.get(url)
    .then( result => {
      return Promise.resolve(JSON.parse(result.text).results);
    });
}

function poseQuestion() {
  if(memory.questions.length === 0) { return endTheGame(memory.score); }
  let current = memory.questions.shift();
  game.emit('question', current);
}

function endTurn(score) {
  console.log(score);
  game.emit('score', score);
  poseQuestion();
}

function endTheGame(score) {
  game.emit('end', score);
  io.close();
}



