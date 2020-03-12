const io = require('socket.io-client');

let cache = {
  correctAnswer: {},
  question: {
    sent: [],
  },
  score: {done: false},
  teams: [],
};

const game = io.connect('http://localhost:3001/game');
game.on('question', question => saveQuestion(question));
game.on('score', score => cache.score = score);
game.on('end', score => endGame(score));



module.exports = exports = {};

exports.game = game;

exports.joinGame = (teamName, participants=null) => {
  console.log('------joinGame----------');
  cache.teams.push(teamName);
  game.emit('join', { team: teamName, participants: participants });
  return 'you have joined barfly'; // should return welcome message to confirm joining of game
};

exports.getQuestion = (teamName) => {
  console.log(cache.question);
  if(cache.score.done) {
    let finalScore = cache.teams.map(name => `${name}: ${cache.score[name]}`);
    return `game over. final score is ${finalScore}`;
  }
  //logic here is preventing a team from answering same question repeatedly
  return cache.question.sent.includes(teamName) ? 
    'still waiting for other team' : 
    {question: cache.question.question, //string - the question
      options: cache.question.options, //array of options with A,B,C,D preceding. correct answer hidden from API
      score: cache.score};
};

exports.guess = (teamName, answer) => {
  console.log('GUESS');
  console.log(cache);
  console.log(cache.question.sent);
  if (!!cache.question.sent && cache.question.sent.includes(teamName)) { return 'you already answered!'; }
  cache.question.sent.push(teamName);
  console.log('---------------------------------');
  console.log(`${teamName} has guessed ${answer}`);
  console.log('the correct answer is ', cache.question.correct);
  let guess = (answer.toUpperCase() === cache.question.correct);
  game.emit('guess', {team:teamName, guess:guess});
  return guess;
};

exports.currentScore = () => cache.score;

function saveQuestion(raw) {
  let index = Math.floor(Math.random() * 4);
  let arr = raw.incorrect_answers;
  arr.splice(index, 0, raw.correct_answer);
  //putting the answer into the incorrect answer arr at a random index
  let letters = ['A', 'B', 'C', 'D'];
  arr = arr.map( (elem, i) => `${letters[i]}: ${elem}`);
  //putting cooresponding letters at the start of each option
  let question = {
    question: raw.question,
    options: arr,
    correct: correctAnswer(index), //calculated answer of A,B,C, or D
    sent: [], //tracking who question is sent to so people can't cheat
  };
  cache.question = question;
  console.log('SAVE QUES');
  console.log(cache.question);
}

function correctAnswer(index) {
  //comparing guess to correct answer index to determine correctness
  let answer;
  switch (index) {
  case 0:
    answer = 'A';
    break;
  case 1:
    answer = 'B';
    break;
  case 2:
    answer = 'C';
    break;
  case 3:
    answer = 'D';
    break;
  }
  return answer;
}

function endGame(score) {
  cache.score.done = true;
  cache.question =  false;
  game.close();
}

