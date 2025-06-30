import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Heading, Text, Stack, Flex, Icon, Button, Link } from '@chakra-ui/react';
import { FaInstagram, FaUsers, FaTasks, FaComments, FaChalkboardTeacher } from 'react-icons/fa';
import LoadingScreen from './LoadingScreen';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

function AboutPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ChakraProvider>
            <Box p={8} bg="gray.100" minH="100vh">
                <Stack spacing={10} align="center">
                    {/* Hero Section */}
                    <MotionBox
                        textAlign="center"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Heading fontSize="4xl" color="blue.600">Welcome to Stew</Heading>
                        <Text fontSize="lg" color="gray.600" mt={4} maxW="600px">
                            Your all-in-one collaborative study platform. Manage tasks, study together, share resources, and track your progress.
                        </Text>
                    </MotionBox>

                    {/* Features Section */}
                    <GridFeatures />

                    {/* Vision Section */}
                    <MotionBox
                        maxW="800px"
                        p={6}
                        bg="white"
                        borderRadius="md"
                        boxShadow="lg"
                        textAlign="center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Heading fontSize="2xl" color="blue.500">Our Vision</Heading>
                        <Text mt={4} color="gray.600">
                            We aim to make studying easier, more enjoyable, and effective through collaborative learning and smart tools that help you stay organized and motivated.
                        </Text>
                    </MotionBox>

                    {/* Instagram Link */}
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Flex alignItems="center" mt={4}>
                            <Link href="https://www.instagram.com/iesx.z_c/" isExternal display="flex" alignItems="center" color="blue.600">
                                <Icon as={FaInstagram} w={6} h={6} mr={2} />
                                <Text>Follow me on Instagram</Text>
                            </Link>
                        </Flex>
                    </MotionBox>

                    {/* Call to Action */}
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Button colorScheme="blue" size="lg" onClick={() => console.log('Navigate to Signup')}>
                            Get Started
                        </Button>
                    </MotionBox>
                </Stack>
            </Box>
        </ChakraProvider>
    );
}

const GridFeatures = () => {
    const features = [
        {
            icon: FaUsers,
            title: "Group Collaboration",
            description: "Create study groups, add members, and work together on shared goals."
        },
        {
            icon: FaTasks,
            title: "Task Management",
            description: "Organize tasks with deadlines, track progress, and set goals for effective study sessions."
        },
        {
            icon: FaComments,
            title: "Real-Time Chat",
            description: "Chat with group members in real-time, share ideas, and stay connected."
        },
        {
            icon: FaChalkboardTeacher,
            title: "Interactive Flashcards & AI Doubt Solving",
            description: "Test your knowledge by creating flashcards, and keep track of your study materials. "
        }
    ];

    return (
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="center" justify="center">
            {features.map((feature, index) => (
                <MotionBox
                    key={index}
                    p={5}
                    maxW="300px"
                    bg="white"
                    borderRadius="lg"
                    boxShadow="lg"
                    textAlign="center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon as={feature.icon} w={12} h={12} color="blue.500" />
                    <Heading fontSize="xl" mt={4} color="gray.700">{feature.title}</Heading>
                    <Text mt={2} color="gray.500">{feature.description}</Text>
                </MotionBox>
            ))}
        </Stack>
    );
};

export default AboutPage;
