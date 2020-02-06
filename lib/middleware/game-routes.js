'use strict';

const express = require('express');
const gameRouter = express.Router();


gameRouter.get('/joingame', handleJoinGame);
gameRouter.get('/nextquestion', handleNextQuestion);
gameRouter.get('/sendanswer', handleSendAnswer);

function handleJoinGame(req, res, next){
  res.status(200).send('Joining Game...');
}

function handleNextQuestion(req, res, next){
  res.status(200).send('Get Next Question...');
}

function handleSendAnswer(req, res, next) {
  res.status(200).send('Sending Answer...');
}

module.exports = gameRouter;