import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    navigate('/auth'); // Redirect to the authentication page
  };

  return (
    <Box bg="teal.500" p={1}>
      <Flex justify="space-between" align="center">
        <Box flex="1">
          <Heading size="lg" color="white" textAlign="center">
            Stew
          </Heading>
        </Box>
        <Flex align="center">
          <Button colorScheme="teal" variant="link" onClick={() => navigate('/about')} color="white" mr={4}>
            About
          </Button>
          <Button colorScheme="teal" onClick={handleLogout} color="white">
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
