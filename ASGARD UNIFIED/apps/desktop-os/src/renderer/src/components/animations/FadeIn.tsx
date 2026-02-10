import React from 'react';
import { motion } from 'motion/react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    style?: React.CSSProperties;
}

const directionOffset = {
    up: { y: 8 },
    down: { y: -8 },
    left: { x: 8 },
    right: { x: -8 },
    none: {},
};

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    duration = 0.3,
    direction = 'up',
    className,
    style,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
