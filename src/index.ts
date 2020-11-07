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
    const extSockets = io.
})

server.listen(port, () => {
    console.log(`Server listening on port:${port}`);

})