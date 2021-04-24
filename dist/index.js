"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 3000;
const app = express_1.default();
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new socket_io_1.Server(server);
let activeSockets = [];
io.on('connection', (socket) => {
    let existingSocket;
    socket.on('add-user', (data) => {
        existingSocket = {
            name: data.name,
            id: socket.id,
        };
        if (!activeSockets.find((el) => el.id === existingSocket.id)) {
            activeSockets.push(existingSocket);
        }
        socket.emit('update-user-list', {
            users: activeSockets.filter((existingSocket) => existingSocket.id !== socket.id),
        });
        socket.broadcast.emit('update-user-list', {
            users: [existingSocket],
        });
    });
    socket.on('call-user', (data) => {
        socket.to(data.to).emit('call-made', {
            offer: data.offer,
            user: data.user,
        });
    });
    socket.on('make-answer', (data) => {
        socket.to(data.to).emit('answer-made', {
            socket: socket.id,
            answer: data.answer,
            user: data.user,
        });
    });
    socket.on('disconnect', () => {
        activeSockets = activeSockets.filter((existingSocket) => existingSocket.id !== socket.id);
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
//# sourceMappingURL=index.js.map