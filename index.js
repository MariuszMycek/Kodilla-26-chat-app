const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', socket => {
  socket.on('join', name => {
    usersService.addUser({
      id: socket.id,
      name
    });
    io.emit('update', {
      users: usersService.getAllUsers()
    });
    socket.broadcast.emit('message', {
      text: `User ${name} has connected to chat.`,
      from: 'Server message'
    });
  });
});

io.on('connection', socket => {
  socket.on('disconnect', () => {
    if (usersService.getUserById(socket.id)) {
      const { name } = usersService.getUserById(socket.id);
      socket.broadcast.emit('message', {
        text: `User ${name} has disconnected from chat.`,
        from: 'Server message'
      });
    }
    usersService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: usersService.getAllUsers()
    });
  });
});

io.on('connection', socket => {
  socket.on('message', message => {
    const { name } = usersService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
