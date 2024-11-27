import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { SketchPicker } from 'react-color'; // Color picker library
import { Box, IconButton, useDisclosure } from '@chakra-ui/react'; // Chakra UI components
import { MdColorLens } from 'react-icons/md'; // Color icon
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Whiteboard = () => {
  const [lines, setLines] = useState([]); // Stores all lines
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black
  const isDrawing = useRef(false);
  const { isOpen, onToggle } = useDisclosure(); // Chakra UI hook to toggle visibility

  useEffect(() => {
    // Listen for drawing data from other users
    socket.on('draw', (newLine) => {
      setLines((prevLines) => [...prevLines, newLine]);
    });

    return () => {
      socket.off('draw');
    };
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color: selectedColor }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    socket.emit('draw', lines[lines.length - 1]); // Emit the drawn line to the server
  };

  return (
    <Box position="relative" width="100%" height="100vh" bg="gray.50">
      {/* Color Picker Toggle Button */}
      <IconButton
        icon={<MdColorLens />}
        onClick={onToggle}
        position="absolute"
        top="16px"
        right="16px"
        zIndex="10"
        bg="white"
        borderRadius="full"
        boxShadow="md"
        _hover={{ bg: 'gray.100' }}
        _active={{ bg: 'gray.200' }}
      />

      {/* Color Picker with Animation */}
      <Box
        position="absolute"
        top="60px"
        right="16px"
        zIndex="10"
        transition="all 0.3s ease-in-out"
        opacity={isOpen ? 1 : 0}
        transform={isOpen ? 'scale(1)' : 'scale(0.9)'}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <SketchPicker
          color={selectedColor}
          onChangeComplete={(color) => setSelectedColor(color.hex)}
        />
      </Box>

      {/* Konva Stage */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default Whiteboard;
