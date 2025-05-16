'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';

interface AudioVisualizerProps {
  state: 'speaking' | 'idle';
  variant?: 'critical' | 'optimism';
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state: activeState = 'speaking', variant = 'critical' }) => {
  const getVariant = (duration: number) => {
    const delay = undefined;

    return {
      speaking: {
        height: [8, 16, 8],
        transition: {
          duration: duration * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      },
      idle: {
        height: [16, 8],
        transition: {
          duration,
          ease: 'easeInOut',
          delay,
        },
      },
    };
  };

  const barClasses = clsx('w-1 rounded-sm', variant === 'critical' ? 'bg-white' : 'bg-black');

  return (
    <div className="flex items-center justify-center md:w-16 md:h-16 w-10 h-10">
      {/* Speaking State */}
      <div
        id={activeState === 'speaking' ? 'state1' : 'state2'}
        className={clsx(
          `relative flex items-center justify-center gap-1 md:w-16 md:h-16 w-10 h-10 rounded-full ${activeState === 'speaking' ? 'speaking' : 'not-speaking'}`,
          variant === 'critical' ? 'bg-critical' : 'bg-optimism'
        )}
      >
        <motion.div className={barClasses} animate={activeState} variants={getVariant(0.8)} />
        <motion.div className={barClasses} animate={activeState} variants={getVariant(0.9)} />
        <motion.div className={barClasses} animate={activeState} variants={getVariant(0.7)} />
        <motion.div className={barClasses} animate={activeState} variants={getVariant(0.85)} />
        <motion.div className={barClasses} animate={activeState} variants={getVariant(0.75)} />
      </div>
    </div>
  );
};

export default AudioVisualizer;
