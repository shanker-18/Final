import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon, Box } from '@chakra-ui/react';

// Create a wrapper component that handles the icon with forwardRef
const IconWrapper = forwardRef(({ as: IconComponent, ...props }, ref) => (
  <Box ref={ref}>
    <Icon as={IconComponent} {...props} />
  </Box>
));

IconWrapper.displayName = 'IconWrapper';

// Use motion.create() for the motion component
const MotionIconWrapper = motion.create(IconWrapper);

const AnimatedFontAwesomeIcon = React.memo(({ as, boxSize, color, ...motionProps }) => (
  <MotionIconWrapper
    as={as}
    boxSize={boxSize}
    color={color}
    {...motionProps}
  />
));

AnimatedFontAwesomeIcon.displayName = 'AnimatedFontAwesomeIcon';

export default AnimatedFontAwesomeIcon;