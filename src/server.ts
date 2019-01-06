import { createServer } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';

import { SocketManager, User, KolkoIKrzyzykRooms } from './socket_manager'

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = socketIo(server);

const socketManager = new SocketManager();

server.listen(port, () => {
  console.log('Running server on port %s', port);
});

io.on('connection', (socket: socketIo.Socket) => {
  console.log('a user connected');

  socket.on('userHash', (userHash: string, fn) => {
    let user: User;

    if (userHash)
      user = socketManager.updateUser(socket.id, userHash);
    
    if (!userHash || !user) {
      userHash = Math.random().toString(16).substring(2, 12);
      user = socketManager.addUser(socket.id, userHash);
      fn(user.hash);
    }
 
    if (!user.name)
      io.in(socket.id).emit('getUserName', user.name); 
  });

  socket.on('setUserName', (userName) => {
    const user = socketManager.getUserBySocketId(socket.id);
    user.name = userName;
    socket.emit('nameSet');
  });

  socket.on('getRoomList', (fn) => {
    fn(socketManager.getRoomList());
  });

  socket.on('addToWaitingRoom', (userHash: string, fn) => {
    const users = socketManager.addUserToWaitingRoom(userHash);
    fn(users);
  });
});

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./client/index.html'));
});