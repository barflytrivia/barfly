'use strict';

const express = require('express');
const gameRouter = express.Router();
const player = require('../player-model');

gameRouter.get('/joingame', handleJoinGame);
gameRouter.get('/:name/nextquestion', handleNextQuestion);
gameRouter.get('/:name/sendanswer/:guess', handleSendAnswer);

function handleJoinGame(req, res, next){
  res.status(200).send('Joining Game...');
}

function handleNextQuestion(req, res, next){
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
  let message = player.guess(req.params.name, req.params.guess);
  res.status(200).send(message);
}

module.exports = gameRouter;