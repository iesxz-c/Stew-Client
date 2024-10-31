import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from '@chakra-ui/react';
import axios from 'axios';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/change_password', { old_password: oldPassword, new_password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Old Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} mb={3} />
          <Input placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleChangePassword}>Update Password</Button>
          <Button onClick={onClose} ml={3}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
