import React, { useEffect, useState } from 'react';
import { Box, Flex, Avatar, Text,Grid, Button, VStack, Input, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import ChangePasswordModal from './ChangePasswordModal'; // Import the ChangePasswordModal component
import { AiFillEdit } from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';

function HomePage() {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', username: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // State for edit profile modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
   // State for change password modal
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setEditData({
          name: response.data.name,
          email: response.data.email,
          username: response.data.username,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchProfile();
  }, []);

  const handleEditProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(editData).forEach((key) => formData.append(key, editData[key]));
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await axios.put('http://localhost:5000/edit_profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.user);
      setIsEditProfileOpen(false);
      toast({
        title: "Profile updated.",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error.",
        description: 'Error updating profile',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleProfilePictureChange = (event) => {
    if (event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const getProfilePictureUrl = () => {
    if (profilePicture) {
      return URL.createObjectURL(profilePicture); // Temporary URL for newly selected image
    }
    return user?.profile_picture 
      ? `http://localhost:5000/uploads/${user.profile_picture}`
      : ''; // URL from backend or empty string if no profile picture
  };
  const handleNavigate =(path) =>{
    navigate(path);
  }

  return (
    <Flex p={8}>
      <Box w="250px" mr={8}>
        {isLoading ? ( // Conditional rendering based on loading state
          <Flex justify="center" align="center" height="100%">
            <Spinner size="xl" color="blue.500" /> {/* Styled Spinner */}
          </Flex>
        ) : (
          <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
            <VStack align="start" spacing={4}>
              <Box position="relative">
                <Flex ml={10} align="center" justify="center"> 
                  <Avatar size="xl" src={getProfilePictureUrl()} />
                </Flex>
                <IconButton 
                  icon={<EditIcon />} 
                  aria-label="Edit Profile Picture" 
                  size="md" 
                  colorScheme="" 
                  color={"black"}
                  onClick={() => setIsEditProfileOpen(true)} 
                  position="absolute" 
                  top="0" 
                  right="0"
                />
                <Input 
                  type="file" 
                  id="fileInput" 
                  accept="image/*" 
                  hidden 
                  onChange={handleProfilePictureChange} 
                />
              </Box>
              <Text fontSize="lg" fontWeight="bold" alignSelf={"center"} mr={7} mt={2}>
                {user?.name}
              </Text>
              <Text fontSize="md" color="gray.500">
                Email : {user?.email}
              </Text>
              <Text fontSize="md" color="gray.500">
                Username : {user?.username}
              </Text>
            </VStack>
          </Box>
        )}
  
      <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} mt={4}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Box 
              bg="blue.100" 
              p={4} 
              borderRadius="md" 
              textAlign="center" 
              cursor="pointer"
            >
              F-cards

            </Box>
            <Box 
              bg="pink.100" 
              p={4} 
              borderRadius="md" 
              textAlign="center" 
              cursor="pointer"
              onClick={()=>handleNavigate('/groups')}
            >
              Groups
            </Box>
            <Box 
              bg="yellow.100" 
              p={4} 
              borderRadius="md" 
              textAlign="center" 
              cursor="pointer"
            
            >
              Messages
            </Box>
            <Box 
              bg="green.100" 
              p={4} 
              borderRadius="md" 
              textAlign="center" 
              cursor="pointer"
            >
              Issues??
            </Box>
          </Grid>
        </Box>
      </Box>
     




      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Existing avatar */}
            <Flex mb={4} align="center" alignItems={"center"} >

              <Avatar size="xl" alignSelf={"center"} src={getProfilePictureUrl()} />
              <Text ml={3}>{user?.name}</Text>

            </Flex>

            <Input 
              placeholder="Name" 
              value={editData.name} 
              onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
              mb={3} 
            />
            <Input 
              placeholder="Email" 
              value={editData.email} 
              onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
              mb={3} 
            />
            <Input 
              placeholder="Username" 
              value={editData.username} 
              onChange={(e) => setEditData({ ...editData, username: e.target.value })} 
              mb={3} 
            />
            <Text mb={2}>Change Profile Picture:</Text>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleProfilePictureChange} 
            />
            <Button onClick={() => setIsChangePasswordOpen(true)} mt={3} colorScheme="blue">Change Password</Button>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleEditProfile}>Save Changes</Button>
            <Button onClick={() => setIsEditProfileOpen(false)} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Include the ChangePasswordModal component */}
      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </Flex>
    
  );
}

export default HomePage;
