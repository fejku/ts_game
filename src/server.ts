import { createServer } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';

import { SocketManager } from './socket_manager'

const app = express();
const port = process.env.PORT || 3001;
const server = createServer(app);
const io = socketIo(server);

const socketManager = new SocketManager();

server.listen(port, () => {
  console.log('Running server on port %s', port);
});

io.on('connection', (socket: socketIo.Socket) => {
  console.log('a user connected');
  // socket.on('message', function(message: any){
  //   console.log(message);
  //   socket.emit('message', message);
  // }); 
  
  // socket.on('userName', (message) => {
  //   console.log(message);
  // })

  socket.on('userHash', (userHash: string) => {
    if (userHash) {
      socketManager.updateUser(socket.id, userHash);
    } else {
      userHash = Math.random().toString(16).substring(2, 12);
      const recivedUserHash = socketManager.addUser(socket.id, userHash);
      io.in(socket.id).emit('userHash', recivedUserHash)
    }

    for (const user of socketManager.Users) {
      console.log(user);
    }
  });

  socket.on('addToRoom', (userHash: string) => {
    socketManager.addUserToRoom(userHash);
  });
});

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('./client/index.html'));
});