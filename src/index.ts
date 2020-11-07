import express from "express";
import { createServer } from "http";
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const port = 8000

const io = new Server(server);

const activeSockets: string[] = []

app.get("/", (req, res) => {
    res.send(`<h1>Hello World</h1>`);
});

io.on("connection", (socket) => {
    const extSocket = activeSockets.find(extSocket => extSocket === socket.id)

    if (!extSocket) activeSockets.push(socket.id);


    socket.emit("update-user-list", ())
})

server.listen(port, () => {
    console.log(`Server listening on port:${port}`);

})