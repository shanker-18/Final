import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@chakra-ui/react';

// Create a ref-forwarding Icon component
const IconWithRef = forwardRef((props, ref) => <Icon {...props} ref={ref} />);

// Use motion.create() for proper ref forwarding
const MotionIcon = motion.create(IconWithRef);

export default MotionIcon;