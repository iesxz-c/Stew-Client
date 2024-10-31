import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext/AuthContext'; // Adjust the import based on your Auth context
import { useSocket } from '../../context/SocketContext/SocketContext'; // Adjust the import based on your Socket context
import { Box, Button, Input, Text } from '@chakra-ui/react';

const GroupChat = ({ groupId }) => {
    const { userId } = useAuth(); // Get userId from auth context
    const socket = useSocket(); // Initialize Socket.io
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]); // Initialize as an empty array

    useEffect(() => {
        // Fetch initial messages when component mounts
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/groups/${groupId}/messages`);
                console.log("Response data:", response.data); // Log the response data

                // Check if response data is an array
                if (Array.isArray(response.data)) {
                    setMessages(response.data); // Set messages if it's an array
                } else {
                    console.error("Expected an array but got:", response.data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    console.error("Response headers:", error.response.headers);
                }
            }
        };

        fetchMessages();

        // Socket listener for incoming messages
        socket.on('receive_message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off('receive_message');
        };
    }, [groupId, socket]);

    const sendMessage = async () => {
        console.log("Sending message:", messageContent); // Log the message content

        // Check if message content and userId are available
        if (!messageContent.trim() || !userId) {
            console.log("Message content is empty or user ID is not available.");
            return;
        }

        const newMessage = { content: messageContent, user_id: userId, group_id: groupId };

        try {
            const response = await axios.post(`/groups/${groupId}/messages`, newMessage);
            console.log("Message sent successfully:", response.data); // Log the response
            setMessages((prevMessages) => [...prevMessages, response.data]); // Add the new message to the state
            setMessageContent(''); // Clear the input field
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Box>
            <Text fontSize="xl">Group Chat</Text>
            <Box>
                {messages.map((msg, index) => (
                    <Text key={index}>
                        {msg.user_id}: {msg.content}
                    </Text>
                ))}
            </Box>
            <Input
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
            />
            <Button onClick={sendMessage}>Send</Button>
        </Box>
    );
};

export default GroupChat;
