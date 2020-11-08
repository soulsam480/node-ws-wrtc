import { Server } from "socket.io";
import express from "express";

const PORT = process.env.PORT || 3000;

const app = express()

const server = app.use("/", (req, res) => res.send("<p>connected</p>")).listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = new Server(server);


let activeSockets: string[] = []


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
    /*     socket.on("text-data", (data: any) => {
            console.log(data.text)
        }) */

    socket.on("disconnect", () => {
        activeSockets = activeSockets.filter(
            existingSocket => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
            socketId: socket.id
        });
    });

})


process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});
process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});