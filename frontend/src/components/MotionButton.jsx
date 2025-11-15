import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button, chakra } from '@chakra-ui/react';

// Create a base button wrapper
const ButtonBase = forwardRef((props, ref) => (
  <Button ref={ref} {...props} />
));

ButtonBase.displayName = 'ButtonBase';

// Create the chakra wrapper
const ChakraButtonWrapper = chakra(ButtonBase, {
  shouldForwardProp: (prop) => !['whileHover', 'whileTap', 'animate'].includes(prop),
});

// Create the motion component using motion.create()
const MotionButton = motion.create(ChakraButtonWrapper);

export default MotionButton;