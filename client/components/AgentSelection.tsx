'use client';

import { nyghtMedium } from '@/app/fonts/fonts';
import { MicIcon } from '@/components/icons/MicIcon';
import useIsPhone from '@/hooks/useIsPhone';
import { AgentMoodEnum, AgentMoodI } from '@/types/agent';
import { track } from '@vercel/analytics';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from './Button';

interface AgentSelectionProps extends React.HTMLAttributes<HTMLDivElement> {
  // add new props here
}

export const AgentSelection = ({ ...props }: AgentSelectionProps) => {
  const router = useRouter();
  const isPhone = useIsPhone();
  const [selectedMood, setSelectedMood] = useState<AgentMoodI | null>(null);

  const updateMood = (mood: AgentMoodI) => {
    track('conversation_started', {
      mood,
    });
    router.push(`/talk?mood=${mood}`);
  };

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleMoodSelection = (mood: AgentMoodI) => {
    setSelectedMood(mood);
  };

  if (isPhone && selectedMood === null) {
    return (
      <div className="flex flex-col justify-center items-center gap-16" onClick={clickHandler}>
        <div onClick={() => handleMoodSelection(AgentMoodEnum.EXCITED)}>
          <Image
            src="/mellow-jesse.gif"
            alt="JesseGPT Avatar"
            width={200}
            height={200}
            className="rounded-none mb-6 w-32 h-32 sm:w-48 sm:h-48 m-auto"
            priority
          />
          <h2
            className={clsx(
              'text-2xl sm:text-4xl text-white mb-2 text-center sm:leading-[52px]',
              nyghtMedium.className
            )}
          >
            JesseGPT
          </h2>
        </div>

        <div onClick={() => handleMoodSelection(AgentMoodEnum.CRITICAL)}>
          <div>
            <Image
              src="/critical-jesse.gif"
              alt="SupaBald JesseGPT Avatar"
              width={200}
              height={200}
              className="rounded-none mb-6 w-32 h-32 sm:w-48 sm:h-48 m-auto"
              priority
            />
          </div>
          <h2
            className={clsx(
              'text-2xl sm:text-4xl text-white mb-2 text-center sm:leading-[52px]',
              nyghtMedium.className
            )}
          >
            SupaBald <br />
            JesseGPT
          </h2>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center" {...props}>
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 py-16">
        {/* JesseGPT (Optimistic) */}
        {((isPhone && selectedMood === AgentMoodEnum.EXCITED) || !isPhone) && (
          <JesseCard
            mood={AgentMoodEnum.EXCITED}
            onMoodSelection={updateMood}
            onClick={clickHandler}
            isPhone={isPhone}
            onBack={() => setSelectedMood(null)}
          />
        )}

        {/* SupaBald JesseGPT (Critical) */}
        {((isPhone && selectedMood === AgentMoodEnum.CRITICAL) || !isPhone) && (
          <JesseCard
            mood={AgentMoodEnum.CRITICAL}
            onMoodSelection={updateMood}
            onClick={clickHandler}
            isPhone={isPhone}
            onBack={() => setSelectedMood(null)}
          />
        )}
      </div>
    </main>
  );
};

const JesseCard = ({
  mood,
  onMoodSelection,
  onBack,
  isPhone,
  ...props
}: {
  mood: AgentMoodI;
  onMoodSelection: (mood: AgentMoodI) => void;
  onBack: () => void;
  isPhone: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex-1 flex flex-col items-center text-center bg-transparent w-full px-8 md:px-0 " {...props}>
      <Image
        src={mood === AgentMoodEnum.CRITICAL ? '/critical-jesse.gif' : '/mellow-jesse.gif'}
        alt={mood === AgentMoodEnum.CRITICAL ? 'SupaBald JesseGPT Avatar' : 'JesseGPT Avatar'}
        width={200}
        height={200}
        className="rounded-none mb-6 w-32 h-32 sm:w-48 sm:h-48 m-auto mt-16 sm:mt-0"
        priority
      />
      <h2 className={clsx('text-4xl text-white mb-2', nyghtMedium.className)}>
        {mood === AgentMoodEnum.CRITICAL ? 'SupaBald JesseGPT' : 'JesseGPT'}
      </h2>
      <p className="text-lg md:text-[22px] text-white/80 mb-2 font-inter font-light max-w-[300px] md:max-w-[427px]">
        {mood === AgentMoodEnum.CRITICAL
          ? 'The brutally honest Jesse Pollak.'
          : 'The relentlessly optimistic Jesse Pollak.'}
      </p>
      <p className="text-lg md:text-[22px] text-white/80 mb-8 max-w-[300px] md:max-w-[427px] font-inter font-light">
        {mood === AgentMoodEnum.CRITICAL
          ? 'Cuts through the hype, challenges every premise, & believes great ideas must survive intense scrutiny to succeed.'
          : 'Sees massive potential everywhere, bursting with Onchain Summer energy, & ready to hype your vision to the moon.'}
      </p>

      <Button
        appearance="colored"
        onClick={() => onMoodSelection(mood)}
        stretch={isPhone}
        className={clsx(
          mood === AgentMoodEnum.CRITICAL ? 'bg-critical text-white' : 'bg-optimism text-black',
          'mt-8 md:mt-0'
        )}
      >
        <span role="img" aria-label="microphone">
          <MicIcon color={mood === AgentMoodEnum.CRITICAL ? undefined : 'black'} />
        </span>{' '}
        Start talking
      </Button>

      {isPhone && (
        <Button appearance="outlined" onClick={onBack} stretch className="mt-4">
          Back
        </Button>
      )}
    </div>
  );
};
