const { Server } = require('socket.io');
const { socketAuth } = require('../middleware/api-auth');

let io;

const users = [];

function userJoin(user) {
  const userExist = users.some((u) => u.id === user.id);

  if (userExist) {
    return console.log('user exist!');
  }
  users.push(user);
}

module.exports = {
  init(server) {
    io = new Server(server);
  },
  connect() {
    if (!io) throw new Error('No socket io server instance');
    io.use(socketAuth).on('connection', (socket) => {
      // join room
      socket.on('joinRoom', () => {
        // welcome current user
        socket.emit('message', 'Welcome to Chat');
        // add user into list
        userJoin(socket.user);
        // broadcast when a user join
        socket.broadcast.emit('message', `${socket.user.name} joined!`);
      });

      // Listen for chat message
      socket.on('chat message', (msg) => {
        io.emit('message', msg);
      });
      // run when client disconnect
      socket.on('disconnect', () => {
        io.emit('message', 'a user has left that chat');
      });
    });
  },
};
