import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Input, HStack, IconButton, Spinner, Text, Box, VStack } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const ChatRoom = () => {
    const { groupId } = useParams();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/profile', {
                headers: { 'Authorization': `Bearer ${token} `},
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setLoading(false);
            } else {
                console.error('Failed to fetch username:', response.statusText);
                setLoading(false);
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        if (username) {
            const token = localStorage.getItem('token');
            const newSocket = io('http://localhost:5000', {
                transports: ['websocket'],
                auth: { token },
            });

            newSocket.on('connect', () => {
                newSocket.emit('join', { auth: { token }, username, group_id: groupId });
            });

            newSocket.on('message', (message) => {
                const newMessage = {
                    sender: message.type === "notification" ? "System" : message.sender,
                    content: message.content,
                    type: message.type
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
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
            socket.emit('message', {
                auth: { token: localStorage.getItem('token') },
                content: inputMessage,
                group_id: groupId,
                sender: username
            });
            setInputMessage('');
        }
    };

    if (loading) {
        return <Spinner size="xl" color="teal.500" />;
    }

    return (
        <VStack spacing={4} w="100%" h="100vh" p={4} overflow="hidden">
            <Box w="100%" h="85%" p={4} borderWidth="1px" borderRadius="lg" overflowY="auto" bg="gray.50" boxShadow="md">
    {messages.map((msg, index) => (
        <Box
            key={index}
            mb={2}
            w="fit-content"
            p={3}
            borderRadius="md"
            bg={msg.type === "notification" ? "gray.200" : "teal.100"}
            border={msg.type === "notification" ? "1px solid gray.300" : "none"}
            boxShadow="md"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            transition="all 0.2s"
        >
            <Box fontWeight={msg.type === "notification" ? "normal" : "bold"} color={msg.type === "notification" ? "gray.600" : "gray.800"}>
                {msg.sender}
            </Box>
            <Box>{msg.content}</Box>
        </Box>
    ))}
</Box>

            <Box w="100%" position="relative" mt="auto">
                <HStack position="fixed"
                    bottom="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="75%"
                    p={2}
                    borderWidth="1px"
                    borderRadius="full"
                    bg="white"
                    boxShadow="md">
                    <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        variant="unstyled"
                        px={4}
                        flex="1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                                e.preventDefault(); 
                            }
                        }}
                    />
                    <IconButton
                        icon={<ArrowForwardIcon />}
                        colorScheme="teal"
                        onClick={sendMessage}
                        aria-label="Send message"
                        borderRadius="full"
                    />
                </HStack>
            </Box>
        </VStack>
    );
};

export default ChatRoom;