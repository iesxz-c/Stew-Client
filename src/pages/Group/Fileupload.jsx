import React, { useRef, useState } from 'react';
import { Box, Button, Text, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';

const FileUpload = ({ groupId }) => {
    const inputRef = useRef(null);
    const toast = useToast();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file) => {
        if (!file) return;
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await axios.post(`http://localhost:5000/upload/${groupId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast({
                title: 'Upload successful.',
                description: response.data.file_url,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

        } catch (err) {
            toast({
                title: 'Upload failed.',
                description: err.response?.data?.error || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    };

    return (
        <Box
            p={6}
            border="2px dashed teal"
            borderRadius="lg"
            textAlign="center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            cursor="pointer"
            bg="gray.50"
            _hover={{ bg: "gray.100" }}
            onClick={() => inputRef.current.click()}
        >
            <Text mb={2}>Drag & Drop a file here or click to select</Text>
            <Input
                type="file"
                ref={inputRef}
                display="none"
                onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <Button
                colorScheme="teal"
                mt={3}
                isLoading={uploading}
                onClick={() => inputRef.current.click()}
            >
                Select File
            </Button>
        </Box>
    );
};

export default FileUpload;
