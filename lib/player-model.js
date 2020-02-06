const io = require('socket.io-client');

let cache = {
  correctAnswer: {},
  question: {},
  score: {},
  messages: {},
};

const game = io.connect('http://localhost:3001/game');
game.on('message', (payload) => {
  let team = payload.team || false;
  if (team) {
    cache.messages[team].push(payload.message);
    console.log(cache.messages);
    return;
  }
  else {
    let keys = Object.keys(cache.messages);
    keys.forEach(key => cache.messages[key].push(payload.message));
    console.log(cache.messages);
    return;
  }
});
game.on('question', question => saveQuestion(question));
game.on('score', score => cache.score = score);
game.on('end', score => endGame(score));



module.exports = exports = {};

exports.joinGame = (teamName, participants=2) => {
  cache.messages[teamName] = [];
  game.emit('join', { team: teamName, participants: participants });
  setTimeout(serveMessages, 1000, teamName); // should return welcome message to confirm joining of game
};

exports.getQuestion = (teamName) => {
  //logic here is preventing a team from answering same question repeatedly
  return cache.question.sent.includes(teamName) ? 
    'still waiting for other team' : 
    {question: cache.question.question, //string - the question
      options: cache.question.options, //array of options with A,B,C,D preceding. correct answer hidden from API
      score: cache.score};
};

exports.guess = (teamName, answer) => {
  if (cache.question.sent.includes(teamName)) { return 'you already answered!'; }
  cache.questions.sent.push(teamName);
  let guess = (answer === cache.question.correct);
  game.emit('guess', {team:teamName, guess:guess});
  setTimeout(serveMessages, 1000, teamName); //should return with result of guess
};

function serveMessages(teamName) { 
  let response = cache.messages[teamName]; 
  cache.messages[teamName] = [];
  return response;
}

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
  cache.question =  `THE GAME HAS ENDED, FINAL SCORE: ${score}`;
  game.close();
}

