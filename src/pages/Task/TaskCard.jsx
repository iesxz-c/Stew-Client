import { Box, Button, Text, Stack, Badge } from '@chakra-ui/react';

const TaskCard = ({ task, onComplete, onDelete }) => (
    <Box
        borderWidth="1px"
        borderRadius="lg"
        p={5}
        bg={task.completed ? "green.50" : "white"}
        boxShadow="md"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{
            transform: 'scale(1.05)',
            boxShadow: 'xl',
        }}
        my={2}
    >
        <Text fontWeight="bold" fontSize="lg" color="blue.600" mb={1}>
            {task.title}
        </Text>
        <Text color="gray.600" mb={2}>
            {task.description || "No description provided"}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
            Score: {task.score}
        </Text>
        {task.completed ? (
            <Badge colorScheme="green" mb={2} px={2} py={1} borderRadius="full">
                Completed
            </Badge>
        ) : (
            <Badge colorScheme="orange" mb={2} px={2} py={1} borderRadius="full">
                Pending
            </Badge>
        )}
        <Stack direction="row" spacing={3} mt={2}>
            <Button
                colorScheme="teal"
                variant={task.completed ? "outline" : "solid"}
                onClick={() => onComplete(task.id)}
                isDisabled={task.completed}
                size="sm"
                _hover={{
                    bg: task.completed ? 'gray.100' : 'teal.500',
                }}
            >
                {task.completed ? "Completed" : "Mark as Complete"}
            </Button>
            <Button
                colorScheme="red"
                variant="outline"
                onClick={() => onDelete(task.id)}
                size="sm"
                _hover={{ bg: 'red.100' }}
            >
                Delete
            </Button>
        </Stack>
    </Box>
);

export default TaskCard;
