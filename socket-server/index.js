"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
io.on("connection", function (socket) {
    console.log("✅", socket.id);
    socket.on("chat", function (data) { return io.emit("chat", data); });
});
server.listen(8800, function () { return console.log("Socket.IO server running on 8800"); });
