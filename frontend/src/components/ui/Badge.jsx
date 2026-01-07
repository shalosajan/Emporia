import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, className, variant = 'neutral' }) => {
    const variants = {
        success: "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]",
        error: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]",
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(96,165,250,0.2)]",
        neutral: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(129,140,248,0.2)]"
    };

    return (
        <span
            className={twMerge(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
