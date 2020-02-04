const io = require('socket.io')(3001);
io ? console.log('server socketed') : console.log('server not connected');

const superagent = require('superagent');

const game = io.of('/game');
const memory = {
  participants: 0,
  score: {},
};


game.on('connection', (socket) => {
  console.log('game CHANNEL', socket.id);
  socket.on('join', room => {
    console.log('joined', room);
    socket.join(room);
    game.to(room).emit('message', `${room} has joined the game`);
    memory.participants += 1;
    memory.score[room] = 0;
    memory.participants > 1 ? playersReady() : waiting();
  });

  socket.on('guess', payload => {
    //need to add logic that 'waits' for both teams to submit answer
    console.log('a guess has been noticed');
    console.log('--------------------------');
    if(payload.guess) {
      let team = payload.team;
      memory.score[team] += 1;
      game.to(team).emit('correct', memory.score);
    }
    else {
      let team = payload.team;
      game.to(team).emit('incorrect', memory.score);
    }
    poseQuestion(payload.all);
  });
});

function waiting() {
  game.emit('message', 'your team is alone right now. Waiting for another team to join.......');
}

function playersReady() {
  game.emit('message', `${memory.participants} teams have joined the game`);
  game.emit('begin?'); //need to complete logic here to allow more than 2 players
  getQuestions();
}

function getQuestions() {
  const category = Math.floor(Math.random() * 24 + 9);
  const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`;
  superagent.get(url)
    .then( result => {
      console.log(JSON.parse(result.text));
      let questions = JSON.parse(result.text).results;
      poseQuestion(questions);
      return;
    });
}

function poseQuestion(questions) {
  //no timing yet, unsure whether it's best to put the timing logic in this file or in player.js
  if(questions.length === 0) { return endTheGame(memory.score); }
  let current = questions.shift();
  game.emit('question', {current:current, all:questions});
}

function endTheGame(score) {
  game.emit('end', score);
}



