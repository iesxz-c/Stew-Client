import React, { useEffect, useState } from 'react';
import { Box, Button, Text, IconButton, Input, VStack, HStack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust the URL as necessary

const GroupBox = () => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchGroups();
    
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const fetchGroups = async () => {
    const response = await axios.get('/api/groups/list', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setGroups(response.data);
  };

  const createGroup = async () => {
    await axios.post('/api/groups', { name: newGroupName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setNewGroupName('');
    fetchGroups();
  };

  const joinGroup = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
    fetchMessages(group.id);
  };

  const fetchMessages = async (groupId) => {
    const response = await axios.get(`/api/groups/${groupId}/messages`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setMessages(response.data.messages);
  };

  const handleSendMessage = () => {
    socket.emit('send_message', {
      content: message,
      group_id: selectedGroup.id,
      user_id: localStorage.getItem('user_id'), // Assuming user_id is stored in localStorage
    });
    setMessage('');
  };

  const handleUploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`/api/groups/${selectedGroup.id}/upload`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setFile(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setMessages([]);
  };

  return (
    <Box width="300px" p="4" borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" mb="4">Create Group</Text>
      <Input 
        placeholder="Group Name" 
        value={newGroupName} 
        onChange={(e) => setNewGroupName(e.target.value)} 
        mb="4" 
      />
      <Button onClick={createGroup}>Create Group</Button>

      {groups.map((group) => (
        <Box key={group.id} p="2" borderWidth="1px" borderRadius="md" mb="2">
          <Text onClick={() => joinGroup(group)}>{group.name}</Text>
        </Box>
      ))}

      {/* Modal for Group */}
      {isModalOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.7)" zIndex="999" p="4">
          <Box position="relative" bg="white" p="4" borderRadius="lg" width="80%" margin="0 auto">
            <IconButton icon={<CloseIcon />} aria-label="Close" onClick={closeModal} position="absolute" top="4" right="4" />
            <Text fontSize="2xl" mb="4">{selectedGroup.name}</Text>
            
            <VStack spacing={4}>
              <HStack>
                <Input 
                  placeholder="Type your message..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </HStack>
              <VStack spacing={2} align="stretch">
                {messages.map((msg, index) => (
                  <Box key={index} p="2" borderWidth="1px" borderRadius="md">
                    <Text>{msg.username}: {msg.content}</Text>
                  </Box>
                ))}
              </VStack>
              <Input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <Button onClick={handleUploadFile}>Upload File</Button>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GroupBox;
