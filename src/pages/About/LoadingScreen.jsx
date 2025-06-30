import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box); // ✅ Updated

const LoadingScreen = () => (
    <Flex direction="column" align="center" justify="center" h="100vh" bg="gray.100">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Loading</Text>
        <MotionBox
            bg="blue.500"
            w="20px"
            h="20px"
            borderRadius="full"
            animate={{ y: [0, -20, 0] }}
            transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    </Flex>
);

export default LoadingScreen;
