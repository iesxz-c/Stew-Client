import React, { useState, useEffect } from 'react';
import {
    ChakraProvider,
    Box,
    Button,
    Input,
    Stack,
    Text,
    Grid,
    GridItem,
    Spinner,
    VStack
} from '@chakra-ui/react';
import { createTask, getTasks, completeTask, deleteTask } from './api';
import TaskCard from './TaskCard';

function Task() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchTasks(storedToken);
        } else {
            console.error('No token found. Please log in.');
        }
    }, []);

    const fetchTasks = async (authToken) => {
        setLoading(true);
        try {
            const response = await getTasks(authToken);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        if (!title || !deadline) {
            console.error('Title and deadline are required.');
            return;
        }

        try {
            const isoDeadline = new Date(deadline).toISOString();
            await createTask({ title, description, deadline: isoDeadline }, token);
            setTitle('');
            setDescription('');
            setDeadline('');
            fetchTasks(token);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await completeTask(taskId, token);
            fetchTasks(token);
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId, token);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <ChakraProvider>
            <Box maxWidth="800px" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="lg">
                <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center" color="blue.600">
                    Task Manager
                </Text>
                <VStack spacing={4} mb={6} align="stretch">
                    <Input
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="outline"
                        size="lg"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #4299e1" }}
                    />
                    <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outline"
                        size="lg"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #4299e1" }}
                    />
                    <Input
                        type="datetime-local"
                        placeholder="Deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        variant="outline"
                        size="lg"
                        bg="gray.50"
                        borderColor="gray.300"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #4299e1" }}
                    />
                    <Button colorScheme="blue" size="lg" onClick={handleCreateTask} w="full">
                        Create Task
                    </Button>
                </VStack>
                <Text fontSize="lg" fontWeight="bold" color="gray.600" mb={4} textAlign="center">
                    Tasks
                </Text>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" size="xl" />
                    </Box>
                ) : (
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                        {tasks.map(task => (
                            <GridItem key={task.id} transition="transform 0.2s" _hover={{ transform: 'scale(1.05)' }}>
                                <TaskCard
                                    task={task}
                                    onComplete={handleCompleteTask}
                                    onDelete={handleDeleteTask}
                                />
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default Task;
