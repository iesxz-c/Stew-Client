import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
    Input, HStack, IconButton, Spinner, Box, VStack, Text, Image, Link, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure
} from '@chakra-ui/react';
import { ArrowForwardIcon, AttachmentIcon } from '@chakra-ui/icons';
import { FaPaperclip } from 'react-icons/fa';
import FileUpload from './Fileupload';

const ChatRoom = () => {
    const { groupId } = useParams();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [groupFiles, setGroupFiles] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();

    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            } else {
                console.error('Failed to fetch username:', response.statusText);
            }
            setLoading(false);
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
                setMessages(prev => [...prev, newMessage]);
            });
            setSocket(newSocket);
            return () => {
                newSocket.emit('leave', { auth: { token }, username, group_id: groupId });
                newSocket.disconnect();
            };
        }
    }, [groupId, username]);

    useEffect(() => {
        const fetchGroupFiles = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:5000/group_files/${groupId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                setGroupFiles(data);
            } catch (err) {
                console.error("Failed to fetch group files", err);
            }
        };
        if (groupId) fetchGroupFiles();
    }, [groupId]);

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

    const renderMessageContent = (content) => {
        if (typeof content !== 'string') return content;
        if (content.match(/\.(jpeg|jpg|png|gif)$/i)) {
            return <Image src={`http://localhost:5000/uploads/group_${groupId}/${content}`} alt="shared" maxW="300px" borderRadius="md" />;
        } else if (content.match(/\.(pdf)$/i)) {
            return <Link href={`http://localhost:5000/uploads/group_${groupId}/${content}`} isExternal color="teal.600">📄 View PDF</Link>;
        } else {
            return content;
        }
    };

    if (loading) return <Spinner size="xl" color="teal.500" />;

    return (
        <VStack spacing={4} w="100%" h="100vh" p={4} overflow="hidden" position="relative">
            {/* Floating icon for Shared Files Modal */}
            <IconButton
                icon={<AttachmentIcon />}
                aria-label="Shared Files"
                position="absolute"
                top={2}
                right={4}
                zIndex={10}
                onClick={onOpen}
                bg="whiteAlpha.800"
                _hover={{ bg: 'gray.200' }}
            />

            {/* Shared Files Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Shared Files</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {groupFiles.length === 0 ? (
                            <Text color="gray.500">No files shared in this group yet.</Text>
                        ) : (
                            groupFiles.map((url, i) => {
                                const fileName = decodeURIComponent(url.split('/').pop());
                                const isImage = url.match(/\.(jpeg|jpg|png|gif)$/i);
                                const isPDF = url.match(/\.pdf$/i);
                                return (
                                    <Box key={i} mb={3}>
                                        {isImage ? (
                                            <Image src={`http://localhost:5000${url}`} alt={fileName} maxW="200px" borderRadius="md" />
                                        ) : isPDF ? (
                                            <Link href={`http://localhost:5000${url}`} isExternal color="teal.600">📄 {fileName}</Link>
                                        ) : (
                                            <Link href={`http://localhost:5000${url}`} isExternal color="blue.600">📎 {fileName}</Link>
                                        )}
                                    </Box>
                                );
                            })
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Upload Modal */}
            <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload a File</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FileUpload groupId={groupId} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Chat Messages */}
            <Box w="100%" h="70%" p={4} borderWidth="1px" borderRadius="lg" overflowY="auto" bg="gray.50" boxShadow="md">
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
                        <Box mt={2}>{renderMessageContent(msg.content)}</Box>
                    </Box>
                ))}
            </Box>

            {/* Chat Input */}
            <Box w="100%" position="relative" mt="auto">
                <HStack
                    position="fixed"
                    bottom="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="75%"
                    p={2}
                    borderWidth="1px"
                    borderRadius="full"
                    bg="white"
                    boxShadow="md"
                >
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
                        icon={<FaPaperclip />}
                        aria-label="Upload File"
                        variant="ghost"
                        size="sm"
                        onClick={onUploadOpen}
                        _hover={{ filter: 'brightness(0.75)' }}
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