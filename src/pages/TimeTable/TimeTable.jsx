import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Container,
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  useToast,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { EditIcon, DeleteIcon } from '@chakra-ui/icons'

function TimeTable() {
  const [timetables, setTimetables] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [color, setColor] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const toast = useToast();

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:5000/timetable/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTimetables(response.data);
    } catch (error) {
      console.error('Failed to fetch timetables:', error);
      toast({
        title: 'Error fetching data',
        description: 'Could not fetch timetables.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCreateOrUpdate = async () => {
    const payload = {
      title,
      description,
      start_time: `${startDate}T${startHour}:${startMinute}:00Z`,
      end_time: `${endDate}T${endHour}:${endMinute}:00Z`,
      color,
    };

    setLoading(true); // Start loading

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/timetable/edit/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast({
          title: 'Success',
          description: 'Timetable updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/timetable/create', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast({
          title: 'Success',
          description: 'Timetable created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      clearForm();
      fetchTimetables();
    } catch (error) {
      console.error('Failed to create or update timetable:', error);
      toast({
        title: 'Error',
        description: 'Failed to create or update timetable.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`http://localhost:5000/timetable/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast({
        title: 'Deleted',
        description: 'Timetable deleted successfully!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      fetchTimetables();
    } catch (error) {
      console.error('Failed to delete timetable:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete timetable.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setDescription(entry.description);
    setStartDate(entry.start_time.split('T')[0]);
    setStartHour(entry.start_time.split('T')[1].split(':')[0]);
    setStartMinute(entry.start_time.split('T')[1].split(':')[1]);
    setEndDate(entry.end_time.split('T')[0]);
    setEndHour(entry.end_time.split('T')[1].split(':')[0]);
    setEndMinute(entry.end_time.split('T')[1].split(':')[1]);
    setColor(entry.color);
    setEditId(entry.id);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setStartHour('');
    setStartMinute('');
    setEndDate('');
    setEndHour('');
    setEndMinute('');
    setColor('');
    setEditId(null);
  };

  return (
    <ChakraProvider>
      <Container maxW="container.lg" p={5}>
        <Heading mb={5}>Timetable Manager</Heading>
        
        {/* Timetable Grid */}
        {loading ? (
          <HStack justify="center" my={10}>
            <Spinner size="xl" />
          </HStack>
        ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={8}> {/* Increased columns and spacing */}
            {timetables.map((entry) => (
              <Box
                key={entry.id}
                p={6} 
                pb={100}
                width="fit-content" 
                height="fit-content"
                borderRadius="lg"
                backgroundColor={entry.color || '#f0f0f0'}
                boxShadow="2xl"
                borderWidth={1}
                borderColor="gray.300"
                transition="0.3s"
                _hover={{ boxShadow: '3xl', transform: 'scale(1.05)' }} 
                position="relative"
                
              >
                <Text fontWeight="bold" fontSize="xl" color="black"> 
                  {entry.title}
                </Text>
                <Text fontSize="md" color="gray.600">{entry.description}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(entry.start_time).toLocaleString()} - {new Date(entry.end_time).toLocaleString()}
                </Text>
                <HStack spacing={4} position="absolute" bottom={4} right={4}>
                  <Button size="md" onClick={() => handleEdit(entry)} colorScheme="blue"> {/* Larger button size */}
                    Edit
                  </Button>
                  <Button size="md" colorScheme="red" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
          
        )}

        {/* Creation/Update Form */}
        <VStack spacing={4} mb={5}>
          <FormControl isRequired>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="filled"
              _focus={{ bg: 'white', borderColor: 'teal.400' }}
              _hover={{ borderColor: 'teal.500' }}
              size="sm"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="filled"
              _focus={{ bg: 'white', borderColor: 'teal.400' }}
              _hover={{ borderColor: 'teal.500' }}
              size="sm"
            />
          </FormControl>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                variant="filled"
                _focus={{ bg: 'white', borderColor: 'teal.400' }}
                _hover={{ borderColor: 'teal.500' }}
                size="sm"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                variant="filled"
                _focus={{ bg: 'white', borderColor: 'teal.400' }}
                _hover={{ borderColor: 'teal.500' }}
                size="sm"
              />
            </FormControl>
          </HStack>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="startTime">Start Time</FormLabel>
              <HStack>
                <Select
                  id="startHour"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  variant="filled"
                  size="sm"
                >
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour < 10 ? `0${hour}` : hour}
                    </option>
                  ))}
                </Select>
                <Select
                  id="startMinute"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  variant="filled"
                  size="sm"
                >
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute < 10 ? `0${minute}` : minute}
                    </option>
                  ))}
                </Select>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
              <HStack>
                <Select
                  id="endHour"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  variant="filled"
                  size="sm"
                >
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour < 10 ? `0${hour}` : hour}
                    </option>
                  ))}
                </Select>
                <Select
                  id="endMinute"
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  variant="filled"
                  size="sm"
                >
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute < 10 ? `0${minute}` : minute}
                    </option>
                  ))}
                </Select>
              </HStack>
            </FormControl>
          </HStack>
          <FormControl isRequired>
            <FormLabel htmlFor="color">Color</FormLabel>
            <Input
              id="color"
              placeholder="Enter color code (e.g., #ff0000)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              variant="filled"
              _focus={{ bg: 'white', borderColor: 'teal.400' }}
              _hover={{ borderColor: 'teal.500' }}
              size="sm"
            />
          </FormControl>
          <Button
            onClick={handleCreateOrUpdate}
            leftIcon={<AddIcon />}
            colorScheme="teal"
            isLoading={loading}
          >
            {editId ? 'Update Timetable' : 'Create Timetable'}
          </Button>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default TimeTable;
