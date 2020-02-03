const io = require('socket.io')(3001);
io ? console.log('server socketed') : console.log('server not connected');

const game = io.of('/game');
const players = [];

game.on('connection', (socket) => {
  console.log('game CHANNEL', socket.id);

  socket.on('join', room => {
    console.log('joined', room);
    socket.join(room);
    game.to(room).emit('message', `${room} has joined the game`);
    players.push(room);
    players.length > 1 ? playersReady() : waiting();
  });

});

function waiting() {
  game.emit('message', 'your team is alone right now. Waiting for another team to join.......');
}

function playersReady() {
  game.emit('message', `${players.length} teams have joined the game`);
  game.emit('begin?');
}

