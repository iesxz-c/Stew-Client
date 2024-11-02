import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Input, Button, Box, VStack } from '@chakra-ui/react';

const ChatRoom = () => {
    const { groupId } = useParams();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            } else {
                console.error('Failed to fetch username:', response.statusText);
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        if (username) {
            const token = localStorage.getItem('token');

            const newSocket = io('http://localhost:5000', {
                transports: ['websocket'],
                auth: { token }, // Pass the token for authentication
            });

            newSocket.on('connect', () => {
                newSocket.emit('join', { auth: { token }, username, group_id: groupId });
            });

            newSocket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            setSocket(newSocket);

            return () => {
                newSocket.emit('leave', { auth: { token }, username, group_id: groupId });
                newSocket.disconnect();
            };
        }
    }, [groupId, username]);

    const sendMessage = () => {
        if (inputMessage.trim() !== '' && socket) {
            socket.emit('message', { auth: { token: localStorage.getItem('token') }, content: inputMessage, group_id: groupId });
            setInputMessage('');
        }
    };

    return (
        <VStack spacing={4}>
            <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
                {messages.map((msg, index) => (
                    <Box key={index} mb={2}>
                        {msg}
                    </Box>
                ))}
            </Box>
            <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>Send</Button>
        </VStack>
    );
};

export default ChatRoom;