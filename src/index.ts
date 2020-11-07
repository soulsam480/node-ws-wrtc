import { Server } from "socket.io";

const io = new Server();
const activeSockets: string[] = []
io.listen(4000);

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

