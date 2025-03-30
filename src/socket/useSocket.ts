import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

export default function useSocket() : Socket | null {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io("http://localhost:8800");
        if (newSocket !== null) setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return socket;
}
