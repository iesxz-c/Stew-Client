// context/SocketContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = io('http://localhost:5000'); // Adjust the URL as needed

    useEffect(() => {
        // Connect the socket
        socket.connect();

        return () => {
            // Disconnect the socket on unmount
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
