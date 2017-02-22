const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8080;
let users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
  console.log('new connection made');

//  When new socket joins
    socket.on('join', (data) => {
      console.log(data); // nickname
      console.log(users);
      socket.nickname = data.nickname;
      users[socket.nickname] = socket;
      let userObj = {
          nickname: data.nickname,
          socketid: socket.id
      }
      users.push(userObj);
      io.emit('all-users', users);
    })

    socket.on('get-users', () => {
        socket.emit('all-users', users)
    })

    socket.on('send-message', (data) => {
        // socket.broadcast.emit('message-received', data);
        io.emit('message-received', data)
    })

    socket.on('send-like', (data) => {
        console.log(data)
        socket.broadcast.to(data.like).emit('user-liked', data);

    })

//    disconnect from socket
    socket.on('disconnect', () => {
        users = users.filter((item) => {
            return item.nickname !== socket.nickname;
        });
        io.emit('all-users', users)
    })

    socket.on('join-private', (data) => {
        socket.join('private')
        console.log(data.nickname + ' joined private')
    })

    socket.on('private-chat', (data) => {
        socket.broadcast.to('private').emit('show-message', data.message)
    })
});

server.listen(port, function() {
  console.log("Listening on port " + port);
});