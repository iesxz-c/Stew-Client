import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from '@chakra-ui/react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const [username, setUsername] = useState(user.username || '');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('email', email);

      const response = await axios.put('http://localhost:5000/edit_profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);  // Update user data in the parent
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb={3} />
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} mb={3} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSave}>Save</Button>
          <Button onClick={onClose} ml={3}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
