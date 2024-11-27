import React from 'react';
import { HStack, Button, Box, Text } from '@chakra-ui/react';
import { MdUndo, MdClear } from 'react-icons/md'; 

const Toolbar = () => {
  const handleUndo = () => {
    alert('Undo not implemented');
  };

  const handleClear = () => {
    window.location.reload(); 
  };

  return (
    <Box 
      bg="white" 
      shadow="md" 
      borderRadius="sm" 
      p={4} 
      mx={4} 

    >
      <HStack spacing={6} justify="center">
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          Whiteboard 
        </Text>

        <MdUndo onClick={handleUndo} />

        <MdClear  onClick={handleClear}/>
      </HStack>
    </Box>
  );
};

export default Toolbar;
