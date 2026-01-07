import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            className={twMerge(
                "bg-glass-surface backdrop-blur-md border border-glass-border rounded-2xl shadow-xl overflow-hidden text-gray-100",
                hoverEffect ? "transition-all duration-300 hover:shadow-cyan-glass/20 hover:border-cyan-glass/30" : "",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
