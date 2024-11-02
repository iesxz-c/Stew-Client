import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    List,
    ListItem,
    IconButton,
    useToast,
    Spinner,
    Heading,
    Text,
    VStack,
    HStack,
    Divider,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MdChat } from 'react-icons/md';
import axios from 'axios';

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const toast = useToast();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:5000/all_groups', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGroups(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/create_group', {
                group_name: groupName,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast({
                title: "Group created.",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setGroupName('');
            fetchGroups();
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
            toast({
                title: "Error creating group.",
                description: error.response?.data?.error || "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const joinGroup = async (groupId) => {
        try {
            const response = await axios.post(`http://localhost:5000/join_group/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast({
                title: "Joined group.",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchGroups();
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
            toast({
                title: "Error joining group.",
                description: error.response?.data?.error || "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete_group/${groupId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast({
                title: "Group deleted.",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchGroups();
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
            toast({
                title: "Error deleting group.",
                description: error.response?.data?.error || "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box p={5} maxW="600px" mx="auto">
            <Heading mb={5} textAlign="center" color="teal.600">Groups</Heading>
            <VStack spacing={5} align="stretch">
                <FormControl>
                    <FormLabel>Search Groups</FormLabel>
                    <Input
                        placeholder="Search by group name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Create a new group</FormLabel>
                    <HStack>
                        <Input
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                        />
                        <Button colorScheme="teal" onClick={createGroup}>
                            Create
                        </Button>
                    </HStack>
                </FormControl>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Spinner size="xl" color="teal.500" />
                    </Box>
                ) : (
                    <List spacing={3}>
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <ListItem key={group.group_id}>
                                    <Box
                                        p={4}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        boxShadow="sm"
                                        _hover={{ boxShadow: "md" }}
                                        transition="0.2s ease"
                                    >
                                        <HStack justify="space-between">
                                            <Text fontWeight="bold" color="gray.700">{group.name}</Text>
                                            <HStack spacing={3}>
                                                <IconButton
                                                    as={Link}
                                                    to={`/chatroom/${group.group_id}`}
                                                    aria-label="Chat Room"
                                                    icon={<MdChat />}
                                                    colorScheme="blue"
                                                />
                                                <Button
                                                    colorScheme="green"
                                                    size="sm"
                                                    onClick={() => joinGroup(group.group_id)}
                                                >
                                                    Join
                                                </Button>
                                                <Button
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => deleteGroup(group.group_id)}
                                                >
                                                    Delete
                                                </Button>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                </ListItem>
                            ))
                        ) : (
                            <Text color="gray.500" textAlign="center">No groups found.</Text>
                        )}
                    </List>
                )}
            </VStack>
        </Box>
    );
};

export default GroupsPage;
