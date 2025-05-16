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
      className={clsx(
        'min-h-screen flex flex-col justify-between items-center bg-[#638596] relative inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]',
        showAgentSelection && 'overflow-hidden'
      )}
    >
      <div className="z-10 flex flex-col items-center text-center justify-center h-full">
        <Image
          src="/original.gif"
          alt="JesseGPT Avatar"
          width={328}
          height={328}
          className="rounded-none mx-auto -z-10 w-[202px] h-[202px] md:w-[328px] md:h-[328px]"
          priority
        />

        <h1 className={clsx('text-5xl md:text-6xl text-white mt-6 leading-[60px]', nyghtMedium.className)}>
          Talk to
          <div className="md:hidden"></div> JesseGPT
        </h1>

        <p
          className={clsx(
            'text-lg md:text-xl text-white/90 md:max-w-[515px] max-w-[300px] mx-auto font-light mt-2 font-inter px-4 md:px-0'
          )}
        >
          Talk to Jesse’s AI avatar about your project idea and coin it on Zora.
        </p>

        <div className="flex flex-col-reverse md:flex-row gap-6 mt-14 px-8">
          <Button href={BASE_BATCH_APPLY_URL} target="_blank" appearance="secondary">
            Learn more
          </Button>
          <Button ref={targetRef} onClick={handleAgentSelection}>
            Start talking to Jesse
          </Button>
        </div>
      </div>

      <div className="hidden w-full px-8  pb-2">
        <div className="border-grey-3 border-b w-full"></div>
      </div>

      <div className="w-full flex md:flex-row flex-col justify-between text-white md:text-[22px] text-[16px] font-inter font-light pt-10 pb-12 md:px-[211px] px-8 gap-6 text-center md:text-left">
        <div className="">
          Made with {'<3'} at{' '}
          <a href="https://devfolio.co" className="underline">
            Devfolio
          </a>
        </div>

        <div className="flex flex-row gap-8 justify-center">
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
            className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-80 w-screen min-h-screen backdrop-blur-lg z-20 overflow-scroll"
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
