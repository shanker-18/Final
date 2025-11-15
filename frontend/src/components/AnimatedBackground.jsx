import React, { useEffect, useRef, useMemo } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { FaUserAstronaut } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedFontAwesomeIcon from './AnimatedFontAwesomeIcon';

// Create motion box using motion.create()
const MotionBox = motion.create(Box);

const AnimatedBackground = React.memo(({ children }) => {
  const containerRef = useRef(null);

  // Generate stable bubble data
  const bubbleData = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      size: Math.random() * 40 + 20,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 10,
    }));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();
      const x = (clientX / width) * 100;
      const y = (clientY / height) * 100;
      
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Box
      ref={containerRef}
      position="relative"
      minH="100vh"
      overflow="hidden"
      bg="gray.900"
      sx={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '&::before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, #ff3366, #ba265d, #7928ca, #ff0080)",
          backgroundSize: "400% 400%",
          opacity: 0.1,
          zIndex: 0,
          transform: 'translate(calc(var(--mouse-x) * 0.02), calc(var(--mouse-y) * 0.02))',
          transition: 'transform 0.2s ease-out',
          animation: 'gradient 15s ease infinite',
        },
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes float': {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: 1,
            borderRadius: 0,
          },
          '100%': {
            transform: 'translateY(-1000px) rotate(720deg)',
            opacity: 0,
            borderRadius: '50%',
          },
        },
      }}
    >
      <MotionBox 
        position="absolute" 
        zIndex={1}
        initial={{ y: 0, x: 0 }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box>
          <Icon
            as={FaUserAstronaut}
            boxSize="40px"
            color="whiteAlpha.500"
          />
        </Box>
      </MotionBox>

      {/* Animated bubbles */}
      {bubbleData.map((bubble) => (
        <MotionBox
          key={`bubble-${bubble.id}-${bubble.size.toFixed(0)}-${bubble.left.toFixed(0)}`}
          position="absolute"
          bottom="-150px"
          display="block"
          width={`${bubble.size}px`}
          height={`${bubble.size}px`}
          background="rgba(255, 255, 255, 0.05)"
          left={`${bubble.left}%`}
          zIndex={1}
          backdropFilter="blur(2px)"
          sx={{
            animation: `float ${bubble.duration}s linear infinite`,
            '&::before': {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(2px)",
              borderRadius: "inherit",
            },
          }}
        />
      ))}

      {/* Content */}
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;