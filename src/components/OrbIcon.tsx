import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OrbIconProps {
  onClick: () => void;
  isWindowVisible: boolean;
}

export const OrbIcon: React.FC<OrbIconProps> = ({ onClick, isWindowVisible }) => {
  return (
    <motion.div
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        cursor: 'pointer',
        zIndex: 9999,
      }}
      className="select-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-14 h-14">
        {/* Rotating border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-2xl border-2 border-black"
        />
        
        {/* White circle */}
        <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
          <motion.div
            animate={{
              scale: isWindowVisible ? [1, 0.8, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isWindowVisible ? Infinity : 0,
              repeatType: "reverse"
            }}
            className="w-6 h-6 bg-gradient-to-br from-sky-accent to-sky-purple rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};
