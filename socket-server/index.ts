import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("✅", socket.id);

    // #TODO: Join a room based on what the client sends
    // step 1: Listen for a "join-room" event from the frontend
    // https://socket.io/docs/v4/rooms/#joining-and-leaving

    socket.on("join-room", (roomName) => {
        socket.join(roomName); // add this socket to the room
        console.log(`🟡 ${socket.id} joined ${roomName}`);
    });

    // #TODO: Only emit messages to the correct room
    // step 2: Listen for a "chat" event, expecting { room, message }
    // https://socket.io/docs/v4/rooms/#sending-messages-to-a-room

    socket.on("chat", ({ room, message }) => {
        // #TODO: Persist the incoming message to the database
        // step 1: Save the message using Prisma. Reference: https://www.prisma.io/docs/orm/prisma-client/crud#create
        prisma.message.create({
            data: {
                content: message.content,
                room: room,
            },
        }).catch((err) => console.error("DB save error:", err));

        io.to(room).emit("chat", message); // send only to that room
    });
});

server.listen(8800, () => console.log("Socket.IO server running on 8800"));
