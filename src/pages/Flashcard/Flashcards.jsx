import React, { useState, useEffect } from 'react';
import {
  Container, Input, Button, VStack, Box, Heading, Text, SimpleGrid, Spinner, FormControl,
  FormLabel, Textarea, InputGroup, InputLeftElement, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import AxiosInstance from './AxiosInstance';

const Flashcards = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get('/flashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFlashcard = async () => {
    try {
      await AxiosInstance.post('/flashcards/create', { title: newTitle, content: newContent });
      setNewTitle('');
      setNewContent('');
      fetchFlashcards();
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const startEditing = (flashcard) => {
    setEditingFlashcard(flashcard);
    setNewTitle(flashcard.title);
    setNewContent(flashcard.content);
  };

  const updateFlashcard = async () => {
    if (editingFlashcard) {
      try {
        await AxiosInstance.put(`/flashcards/edit/${editingFlashcard.id}`, {
          title: newTitle,
          content: newContent,
        });
        setEditingFlashcard(null);
        setNewTitle('');
        setNewContent('');
        fetchFlashcards();
      } catch (error) {
        console.error('Error updating flashcard:', error);
      }
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await AxiosInstance.delete(`/flashcards/delete/${id}`);
      fetchFlashcards();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    searchFlashcards(e.target.value);
  };

  const searchFlashcards = async (title) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`/flashcards/search?title=${title}`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error searching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlashcard(null);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  return (
    <Container maxW="container.lg">
      <VStack spacing={4} align="stretch">
        <Heading>Flashcards</Heading>

        {/* Create Flashcard Form */}
        <Box p={4} border="1px" borderRadius="md" borderColor="gray.300" boxShadow="md">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter flashcard title"
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter flashcard content"
            />
          </FormControl>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={createFlashcard}
            mt={4}
          >
            Create Flashcard
          </Button>
        </Box>

        {/* Search Bar */}
        <InputGroup mt={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search flashcards"
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <Spinner size="xl" />
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mt={6}>
            {flashcards.map((flashcard) => (
              <Box
                key={flashcard.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="md"
                transition="0.3s"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                bg="white"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="auto"
                onClick={() => openModal(flashcard)} // Open modal on click
              >
                <Box flexGrow={1}>
                  <Text fontSize="xl" fontWeight="bold">{flashcard.title}</Text>
                  <Text mt={2} noOfLines={3}>{flashcard.content}</Text>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete flashcard"
                    icon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from triggering modal
                      deleteFlashcard(flashcard.id);
                    }}
                    mr={2}
                  />
                  <IconButton
                    colorScheme="yellow"
                    aria-label="Edit flashcard"
                    icon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from triggering modal
                      startEditing(flashcard);
                    }}
                  />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Modal for viewing flashcard details */}
      {selectedFlashcard && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedFlashcard.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{selectedFlashcard.content}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Flashcards;
