# barfly

Barfly is a bar trivia app. Teams form and compete with each other by answering trivia questions.

## MVP
1. OAuth Login 
2. User/team can join game with a game id
3. Game start/end, length, difficulity managed by a game admin
4. 


## User Stories

### Team
1. As a user, I want to be able to create a profile with a username and password
2. As a user, I want to be able to join a trivia game
3. Create profile with OAuth 
4. Choose team name
5. Make selection for answer to T/F or multiple choice questions


### Admin

1. Create Game and Start Game
2. Choose difficulty
3. Game randomly choose category
4. Set game length, either time or number of questions
5. Be able to re-start the game

### Game

1. Game will initiate by generating a game code that teams can join
2. Game is started by Admin
3. Game will keep score and determine winner
3. Game Scoring:
   - one point for correct answer
   - one additional point for correct answer within first 5 seconds
   - minus one point for incorrect answer within first 5 seconds
   - no penalty for answering beyond 5 seconds
   - 15 second time limit per question



