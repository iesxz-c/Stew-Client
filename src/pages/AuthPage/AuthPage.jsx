import React, { useState } from 'react';
import { Tabs, Flex, TabList, TabPanels, Tab, TabPanel, Box, VStack, Input, Button, Text } from '@chakra-ui/react';
import './AuthPage.css';
const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Flex className='auth-background' alignItems="center" justifyContent="center" h="100vh">
      <Box 
        p={8} 
        w={600} 
        maxW="md" 
        bg="rgba(255, 255, 255, 0.9)" // Soft white background
        borderRadius="md" 
        boxShadow="lg" 
        zIndex="1"
        backdropFilter="blur(5px)" // Optional: add a blur effect
      >
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
                <Button colorScheme="teal">Login</Button>
                {message && <Text color="red.500">{message}</Text>}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button colorScheme="teal">Register</Button>
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
