"use client";

import {useEffect, useState} from "react";
import useSocket from "@/socket/useSocket";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

type MessageType = {
    sender: string;
    content: string;
}

export default function Chatpage() {
    const socket = useSocket();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if(!socket) return;

        socket.on("chat", (data: MessageType) => {
            setMessages(prev => [...prev, data]);
        })
    }, [socket]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {sender: `User: ${socket?.id}`, content: input.trim()};
        socket?.emit("chat", newMessage);
        setInput("");
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-semibold">💬 TeamHub Chat</h1>

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
