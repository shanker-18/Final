import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@chakra-ui/react';

// Create a wrapper component that handles the icon
const IconWrapper = forwardRef(({ as: IconComponent, ...props }, ref) => (
  <span ref={ref}>
    <Icon as={IconComponent} {...props} />
  </span>
));

IconWrapper.displayName = 'IconWrapper';

// Use motion.create() instead of createDomMotionComponent
const MotionFaIcon = motion.create(IconWrapper);

export default MotionFaIcon;