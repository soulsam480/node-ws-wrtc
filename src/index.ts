import { Server, Socket } from 'socket.io';
import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = new Server(server);

interface User {
  name: string;
  id: string;
}

let activeSockets: User[] = [];

io.on('connection', (socket: Socket) => {
  let existingSocket: User;
  socket.on('add-user', (data: any) => {
    existingSocket = {
      name: data.name,
      id: socket.id,
    };

    if (!activeSockets.find((el) => el.id === existingSocket.id)) {
      activeSockets.push(existingSocket);
    }

    socket.emit('update-user-list', {
      users: activeSockets.filter(
        (existingSocket) => existingSocket.id !== socket.id,
      ),
    });

    socket.broadcast.emit('update-user-list', {
      users: [existingSocket],
    });
  });

  socket.on('call-user', (data: any) => {
    socket.to(data.to).emit('call-made', {
      offer: data.offer,
      user: data.user,
    });
  });

  socket.on('make-answer', (data: any) => {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer,
      user: data.user,
    });
  });

  socket.on('make-rejection', (data: any) => {
    socket.to(data.to).emit('rejected', {
      socket: socket.id,
      user: data.user,
    });
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (existingSocket) => existingSocket.id !== socket.id,
    );
    socket.broadcast.emit('remove-user', {
      socketId: socket.id,
    });
  });
});

process.on('uncaughtException', (e) => {
  console.log(e);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  console.log(e);
  process.exit(1);
});
