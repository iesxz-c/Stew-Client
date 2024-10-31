import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Heading,
  List,
  ListItem,
  ListIcon,
  Divider,
  Flex,
  Spinner,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon, AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import axios from 'axios';
import GroupChat from './GroupChat'; // Import GroupChat component

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null); // State for selected group
  const toast = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/groups/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      setError('Error fetching groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName) return;

    try {
      const response = await axios.post('http://localhost:5000/groups', {
        name: groupName,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setGroups([...groups, { id: response.data.group_id, name: groupName }]);
      setGroupName('');
      toast({
        title: "Group Created",
        description: "You have successfully created the group.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError('Error creating group');
      toast({
        title: "Error",
        description: "Failed to create group.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleJoinGroup = async (groupId, groupName) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/groups/join',
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log(response.data.message);
      setSelectedGroupId(groupId); // Set the selected group for chat
      toast({
        title: "Joined Group",
        description: "You have successfully joined the group.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to join group.";
      console.error('Error joining group:', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:5000/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(groups.filter(group => group.id !== groupId));
      toast({
        title: "Group Deleted",
        description: "You have successfully deleted the group.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError('Error deleting group');
      toast({
        title: "Error",
        description: "Failed to delete group.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Heading as="h2" size="lg" mb={4}>
        Manage Your Groups
      </Heading>
      <Divider mb={4} />
      <Stack spacing={4}>
        <Input
          placeholder="Search groups"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          borderColor="teal.500"
        />
        <Flex>
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            borderColor="teal.500"
            mr={2}
          />
          <Button
            colorScheme="teal"
            onClick={handleCreateGroup}
            isDisabled={!groupName}
          >
            Create Group
          </Button>
        </Flex>
      </Stack>

      {loading ? (
        <Flex justify="center" mt={4}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      ) : (
        <List spacing={3} mt={4}>
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <ListItem key={group.id} p={2} borderWidth={1} borderRadius="md" boxShadow="md">
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <ListIcon as={CheckCircleIcon} color="teal.500" />
                    <Text flex="1">{group.name}</Text>
                  </Flex>
                  <Flex>
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Join Group"
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      onClick={() => handleJoinGroup(group.id, group.name)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete Group"
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteGroup(group.id)}
                    />
                    <IconButton
                      icon={<ExternalLinkIcon />}
                      aria-label="Open Group"
                      colorScheme="blue"
                      size="sm"
                      ml={2}
                      onClick={() => setSelectedGroupId(group.id)} // Set selected group for chat
                    />
                  </Flex>
                </Flex>
              </ListItem>
            ))
          ) : (
            <Text>No groups found.</Text>
          )}
        </List>
      )}

      {/* Render GroupChat Component if a group is selected */}
      {selectedGroupId && (
        <GroupChat groupId={selectedGroupId} userId={1} /> // Replace 1 with actual user ID
      )}
    </Box>
  );
};

export default Groups;
