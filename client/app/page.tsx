'use client';

import { AgentSelection } from '@/components/AgentSelection';
import { Button } from '@/components/Button';
import { BASE_BATCH_APPLY_URL } from '@/constants';
import useButtonPointerAnimation from '@/hooks/useButtonPointerAnimation';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { nyghtMedium } from './fonts/fonts';

export default function HomePage() {
  const [showAgentSelection, setShowAgentSelection] = useState(false);

  const handleAgentSelection = () => {
    setShowAgentSelection(true);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAgentSelection) {
        setShowAgentSelection(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showAgentSelection]);

  const { canvasRef, targetRef, initializeAnimation } = useButtonPointerAnimation();

  useEffect(() => {
    initializeAnimation();
  }, []);

  return (
    <main
      className={
        'min-h-screen flex flex-col justify-between items-center bg-[#638596] relative inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]'
      }
    >
      <div className="z-10 flex flex-col items-center text-center justify-center h-full">
        <Image
          src="/original.gif"
          alt="JesseGPT Avatar"
          width={328}
          height={328}
          className="rounded-none mx-auto -z-10"
          priority
        />

        <h1 className={clsx('text-5xl md:text-6xl text-white mt-6', nyghtMedium.className)}>Talk to JesseGPT</h1>

        <p className={clsx('text-lg md:text-xl text-white/90 max-w-[515px] mx-auto font-light mt-2 font-inter')}>
          Talk to Jesse’s AI avatar about your project idea and coin it on Zora.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-14">
          <Button href={BASE_BATCH_APPLY_URL} target="_blank" appearance="secondary">
            Learn more
          </Button>
          <Button ref={targetRef} onClick={handleAgentSelection}>
            Start talking to Jesse
          </Button>
        </div>
      </div>

      <div
        className="w-full flex justify-between text-white text-[22px] font-inter font-light"
        style={{ padding: '40px 211px 48px 211px' }}
      >
        <div>
          Made with {'<3'} at{' '}
          <a href="https://devfolio.co" className="underline">
            Devfolio
          </a>
        </div>

        <div className="flex gap-8">
          <a className="underline" href="https://twitter.com/devfolio">
            Twitter / X
          </a>
          <a className="underline" href="https://warpcast.com/devfolio">
            Farcaster
          </a>
        </div>
      </div>

      <AnimatePresence>
        {showAgentSelection && (
          <motion.div
            className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-80 w-screen min-h-screen backdrop-blur-lg z-20"
            onClick={() => setShowAgentSelection(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.2 }}
          >
            <AgentSelection />
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none w-screen h-screen z-10 hidden"></canvas>

      {/* Prefetch Jesse avatar images for faster loading */}
      <link rel="prefetch" href="/mellow-jesse.gif" as="image" type="image/gif" />
      <link rel="prefetch" href="/critical-jesse.gif" as="image" type="image/gif" />
      <link rel="prefetch" href="/original.gif" as="image" type="image/gif" />
    </main>
  );
}
