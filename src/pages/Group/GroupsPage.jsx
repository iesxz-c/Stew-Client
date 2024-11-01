import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    List,
    ListItem,
    ListIcon,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MdChat } from 'react-icons/md';
import axios from 'axios';

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
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

    return (
        <Box p={5}>
            <FormControl mb={5}>
                <FormLabel>Create a new group</FormLabel>
                <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                />
                <Button mt={3} colorScheme="teal" onClick={createGroup}>
                    Create Group
                </Button>
            </FormControl>
            {error && <Box color="red.500">{error}</Box>}
            <List spacing={3}>
                {groups.map((group) => (
                    <ListItem key={group.group_id}>
                        <Box d="flex" justifyContent="space-between" alignItems="center">
                            <Box>{group.name}</Box>
                            <Box>
                                <IconButton
                                    as={Link}
                                    to={`/chatroom/${group.group_id}`}
                                    aria-label="Chat Room"
                                    icon={<MdChat />}
                                    colorScheme="blue"
                                    mr={2}
                                />
                                <Button
                                    colorScheme="red"
                                    onClick={() => deleteGroup(group.group_id)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    colorScheme="green"
                                    onClick={() => joinGroup(group.group_id)}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default GroupsPage;
