import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Toolbar from './Toolbar';
import Whiteboard from './Whiteboard';

const Integ = () => {
  return (
    <Flex 
      direction="column" 
      height="100vh" 
      bg="gray.50" 
    >

      <Box 
        as="header" 
        bg="white" 
        shadow="md" 
        zIndex={10}
        position="sticky" 
        top="0" 
      >
        <Toolbar />
      </Box>


      <Box 
        flex="1" 
        p={4} 
        bg="gray.100" 
        borderRadius="lg" 
        boxShadow="base" 
        overflow="hidden" 
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Whiteboard />
      </Box>
    </Flex>
  );
};

export default Integ;
