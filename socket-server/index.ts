import express from "express";
import http from "http";
import {Server} from "socket.io";

const app  = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"}
});

io.on("connection", (socket) => {
    console.log("✅", socket.id);
    socket.on("chat", data => io.emit("chat", data));
});

server.listen(8800, () => console.log("Socket.IO server running on 8800"));
