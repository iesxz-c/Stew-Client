import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Text, Flex, ScaleFade } from '@chakra-ui/react';
import { FaReact } from 'react-icons/fa';
import { motion } from 'framer-motion';


const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const generateCards = () => {
  const symbols = [
    '❤️', '💎', '🌟', '🍀', '🌸', '☀️', '🍕', '🌈', '🐱', '🐶', '🎵', '🍎', 
    '❤️', '💎', '🌟', '🍀', '🌸', '☀️', '🍕', '🌈', '🐱', '🐶', '🎵', '🍎'
  ];
  return shuffle(symbols);
};

const MotionBox = motion.create(Box);

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [gameOver, setGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleFlip = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setScore((prevScore) => prevScore + 10);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setGameOver(true);
      clearInterval(intervalId);
    }
  }, [matchedCards, cards.length, intervalId]);

  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
      clearInterval(intervalId);
    }
  }, [timer, intervalId]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, []);

  return (
    <Box textAlign="center" alignItems={"center"}  justifyContent={"center"} p={4} bgGradient="linear(to-r, blue.500, purple.500)" minH="100vh">
      <Text fontSize="4xl" fontWeight="bold" color="white" mb={4}>
        {gameOver ? 'Game Over!' : 'Game Time'}
      </Text>
      <Flex justify="space-between" mx="auto" maxW="400px" color="white" fontWeight="bold" mb={4}>
        <Text>Time: <ScaleFade in={!gameOver}><Text as="span">{timer}s</Text></ScaleFade></Text>
        <Text>Score: <ScaleFade in={!gameOver}><Text as="span">{score}</Text></ScaleFade></Text>
      </Flex>

      <Grid templateColumns="repeat(6, 1fr)" gap={4} ml={118} >
        {cards.map((card, index) => (
          <MotionBox
            key={index}
            onClick={() => handleFlip(index)}
            w="80px"
            h="80px"
            bg={flippedCards.includes(index) || matchedCards.includes(index) ? 'white' : 'gray.700'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            transform={flippedCards.includes(index) || matchedCards.includes(index) ? 'rotateY(180deg)' : ''}
            transition="transform 0.5s"
            whileHover={{ scale: 1.1 }}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? (
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">{card}</Text>
            ) : (
              <FaReact color="gray.400" size="24px" />
            )}
          </MotionBox>
        ))}
      </Grid>

      {gameOver && (
        <Flex direction="column" align="center" mt={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              color: 'yellow',
              fontSize: '2rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 5px rgba(0,0,0,0.6)',
            }}
          >
            🎉 Final Score: {score} 🎉
          </motion.div>
          <Button
            mt={4}
            colorScheme="yellow"
            size="lg"
            onClick={() => {
              setCards(generateCards());
              setFlippedCards([]);
              setMatchedCards([]);
              setScore(0);
              setTimer(60);
              setGameOver(false);
              setIntervalId(null);
            }}
          >
            Play Again
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default MemoryGame;
