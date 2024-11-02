import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Circle, Spinner } from '@chakra-ui/react';
import axios from 'axios';

const ScoreCircles = () => {
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
                const response = await axios.get('http://localhost:5000/tasks/scores', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the header
                    },
                });

                const { total_completed, total_tasks, total_score } = response.data;

                setTotalCompleted(total_completed);
                setTotalTasks(total_tasks);
                setTotalScore(total_score);
            } catch (error) {
                console.error('Error fetching scores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Flex justify="center" align="center" height="100%" p={8}>
            {/* Circle for Completed Tasks */}
            <Circle
                size="150px" // Increased size
                color="teal.500"
                position="relative"
                boxShadow="lg"
                borderWidth="2px"
                borderColor="teal.500"
                borderStyle="solid"
                transition="transform 0.3s, border-color 0.3s"
                _hover={{ transform: 'scale(1.05)', borderColor: 'teal.300' }}
                mr={4}
            >
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" letterSpacing="wider">
                    {totalCompleted} / {totalTasks}
                </Text>
                <Text position="absolute" bottom="10px" textAlign="center" fontSize="sm" opacity="0.8" >
                    Completed
                </Text>
            </Circle>

            {/* Circle for Total Score */}
            <Circle
                size="150px" // Increased size
                color="blue.500"
                position="relative"
                boxShadow="lg"
                borderWidth="2px"
                borderColor="blue.500"
                borderStyle="solid"
                transition="transform 0.3s, border-color 0.3s"
                _hover={{ transform: 'scale(1.05)', borderColor: 'blue.300' }}
            >
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" letterSpacing="wider">
                    {totalScore}
                </Text>
                <Text position="absolute" bottom="10px" textAlign="center" fontSize="sm" opacity="0.8">
                    Total Score
                </Text>
            </Circle>
        </Flex>
    );
};

export default ScoreCircles;
