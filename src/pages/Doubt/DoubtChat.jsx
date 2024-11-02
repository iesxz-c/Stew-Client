import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  Spinner,
  Fade,
  useToast,
  IconButton,
  Tooltip,
  HStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000";

const DoubtChat = () => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [charCount, setCharCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Warning",
        description: "Question cannot be empty.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/ask`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(response.data.answer);
      setQuestion("");
      setCharCount(0); // Reset character count after submission
      fetchHistory();
      toast({
        title: "Success",
        description: "Your question has been submitted!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on Enter key
      handleSubmit();
    }
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setModalOpen(false);
  };

  const clearInput = () => {
    setQuestion("");
    setCharCount(0);
  };

  const filteredHistory = history.filter((entry) =>
    entry.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VStack spacing={4} align="stretch" maxW="600px" mx="auto" p={4}>
      <Fade in>
        <Textarea
          placeholder="Ask your question here..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setCharCount(e.target.value.length); // Update character count
          }}
          onKeyDown={handleKeyDown} // Capture Enter key
          size="lg"
          variant="outline"
          borderColor="blue.300"
          focusBorderColor="blue.500"
          borderRadius="md"
          boxShadow="md"
          _hover={{ borderColor: "blue.400" }}
        />
        <Text fontSize="sm" color="gray.500" textAlign="right">{charCount}/500</Text> {/* Character counter */}
      </Fade>
      <HStack spacing={2} justifyContent="flex-end">
        <Tooltip label="Clear input" aria-label="A tooltip">
          <IconButton
            icon={<FaTrash />}
            colorScheme="red"
            onClick={clearInput}
            aria-label="Clear"
          />
        </Tooltip>
        <Tooltip label="Submit your question" aria-label="A tooltip">
          <IconButton
            icon={<FaPaperPlane />}
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            aria-label="Send"
          />
        </Tooltip>
      </HStack>
      {loading && <Spinner size="lg" />}
      {answer && (
        <Fade in>
          <Box p={4} bg="blue.100" borderRadius="md" boxShadow="lg">
            <Text fontWeight="bold" color="blue.800">Answer:</Text>
            <Text>{answer}</Text>
          </Box>
        </Fade>
      )}
      
      {/* Search Bar */}
      <Input
        placeholder="Search by question..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="md"
        borderColor="blue.300"
        focusBorderColor="blue.500"
        borderRadius="md"
        boxShadow="md"
        _hover={{ borderColor: "blue.400" }}
      />

      <Box>
        <Text fontSize="lg" fontWeight="bold">Previous Doubts:</Text>
        {loading ? (
          <Spinner />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  p={6}
                  bg="white"
                  borderRadius="md"
                  borderBottom="1px solid #eee"
                  boxShadow="md"
                  onClick={() => openModal(entry)}
                  cursor="pointer"
                  height="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  overflow={"hidden"}
                  transition="border 0.3s, transform 0.3s" // Add transition for border and transform
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "lg",
                    border: "1px solid blue", // Change border color on hover
                  }}
                >
                  <Text fontWeight="bold"><strong>Q:</strong> {entry.question}</Text>
                  <Text><strong>A:</strong> {entry.answer}</Text>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Modal for full view */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent as={motion.div} initial={{ y: "-100vh", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100vh", opacity: 0 }} transition={{ duration: 0.3 }}>
          <ModalHeader>Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEntry && (
              <>
                <Text><strong>Question:</strong> {selectedEntry.question}</Text>
                <Text><strong>Answer:</strong> {selectedEntry.answer}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DoubtChat;
