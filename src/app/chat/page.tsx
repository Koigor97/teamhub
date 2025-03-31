"use client";

import {useEffect, useState} from "react";
import useSocket from "@/socket/useSocket";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const ROOMS = ["general", "random", "dev"]

type MessageType = {
    sender: string;
    content: string;
}

export default function Chatpage() {
    const socket = useSocket();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState("");
    const [room, setRoom] = useState("");

    useEffect(() => {
        if(!socket) return;

        // #TODO: Fetch message history from the backend for the selected room
        // step 1: Call the API route to fetch messages for the current room
        fetch(`/api/messages?room=${room}`)
            .then(res => res.json())
            .then((data: MessageType[]) => {
                setMessages(data);
            });

        // Let the server know which room it is
        socket.emit("join-room", room);

        // 1️⃣ Listening for messages FROM the server
        socket.on("chat", (data: MessageType) => {
            setMessages(prev => [...prev, data]);
        })

        return () => {
            socket.off("chat");
        }
    }, [socket, room]);

    // 2️⃣ Sending messages TO the server
    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {sender: `User: ${socket?.id}`, content: input.trim()};
        socket?.emit("chat", {room, message: newMessage});
        setInput("");
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">💬 TeamHub Chat</h1>

            {/* Room Selector */}
            <div className="flex gap-2">
                {ROOMS.map((r) => (
                    <Button key={r} variant={r === room ? "default" : "outline"} onClick={() => {
                        setMessages([]); // Clear old messages
                        setRoom(r);
                    }}>
                        #{r}
                    </Button>
                ))}
            </div>

            <div className="bg-muted p-4 rounded h-64 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                        <span className="font-medium">{msg.sender}: </span>
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
}
