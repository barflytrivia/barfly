'use strict';

const express = require('express');
const gameRouter = express.Router();
const player = require('../player-model');

gameRouter.get('/:name/:participants/joingame', handleJoinGame);
gameRouter.get('/:name/nextquestion', handleNextQuestion);
gameRouter.get('/:name/sendanswer/:guess', handleSendAnswer);
gameRouter.get('/score', handleGetScore);

function handleJoinGame(req, res, next){
  console.log('handleJoinGame-----------')
  const message = player.joinGame(req.params.name, req.params.participants);
  console.log(message);
  res.status(200).send(message);
}

function handleNextQuestion(req, res, next){
  console.log('handleNextQuestion----------');
  let response = player.getQuestion(req.params.name);
  //check if response is string (waiting for players) or obj (new question)
  if(typeof response === 'object') {
    let formatted =
      `CURRENT SCORE: ${JSON.stringify(response.score)}
      QUESTION: ${response.question} 
      ${response.options[0]}
      ${response.options[1]}
      ${response.options[2]}
      ${response.options[3]}`;
    res.status(200).send(formatted);
  }
  else { res.status(200).send(response); }
}

function handleSendAnswer(req, res, next) {
  console.log('handleSendAnswer----------');
  let message = player.guess(req.params.name, req.params.guess);
  res.status(200).send(message);
}

function handleGetScore(req, res) {
  console.log('handleGetScore');
  let score = player.currentScore();
  console.log('-----------------------');
  console.log(score);
  console.log(typeof score);
  res.status(200).send(score);
}

module.exports = gameRouter;