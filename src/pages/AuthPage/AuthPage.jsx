import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Flex, TabList, TabPanels, Tab, TabPanel, Box, VStack, Input, Button, Text, Heading } from '@chakra-ui/react';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      setMessage(response.data.message);
      setMessage('Registration Successful.. Login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful');
      navigate('/home');  // Redirect on successful login
    } catch (error) {
      setMessage('Invalid username or password');
    }
  };

  return (
    <Flex className="auth-background" alignItems="center" justifyContent="center" h="100vh">
      <Box 
        p={8} 
        w={600} 
        maxW="md" 
        bg="rgba(255, 255, 255, 0.9)" 
        borderRadius="md" 
        boxShadow="lg" 
        zIndex="1"
        backdropFilter="blur(5px)"
      >
        <VStack spacing={6} align="center" mb={4}>
          <Heading as="h1" size="lg" color="teal.600">
            Stew
          </Heading>
        </VStack>
        
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4}>
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={handleLogin} colorScheme="teal">Login</Button>
                {message && <Text color="red.500">{message}</Text>}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button onClick={handleRegister} colorScheme="teal">Register</Button>
                {message && <Text color="red.500">{message}</Text>}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default AuthPage;
