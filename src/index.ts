import { Server } from "socket.io";

const io = new Server();
let activeSockets: string[] = []

io.listen(3000);

io.on("connection", (socket) => {
    const existingSocket = activeSockets.find(
        existingSocket => existingSocket === socket.id
    );

    if (!existingSocket) {
        activeSockets.push(socket.id)

        socket.emit("update-user-list", {
            users: activeSockets.filter(
                existingSocket => existingSocket !== socket.id
            )
        })

        socket.broadcast.emit("update-user-list", {
            users: [socket.id]
        })
    }
    socket.on("call-user", (data: any) => {
        socket.to(data.to).emit("call-made", {
            offer: data.offer,
            socket: socket.id
        });
    });

    socket.on("make-answer", (data: any) => {
        socket.to(data.to).emit("answer-made", {
            socket: socket.id,
            answer: data.answer
        });
    });
    socket.on("text-data", (data: any) => {
        console.log(data.text)
    })

    socket.on("disconnect", () => {
        activeSockets = activeSockets.filter(
            existingSocket => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
            socketId: socket.id
        });
    });

})



/* import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
    console.log("yolo");

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })
    ws.send('ho!')
}) */

