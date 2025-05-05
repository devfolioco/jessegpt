'use client';

import { nyghtBold, nyghtMedium } from '@/app/fonts/fonts';
import { MicIcon } from '@/components/MicIcon';
import { AgentMoodEnum, AgentMoodI } from '@/types/agent';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface AgentSelectionProps extends React.HTMLAttributes<HTMLDivElement> {
  // add new props here
}

export const AgentSelection = ({ ...props }: AgentSelectionProps) => {
  const router = useRouter();

  const updateMood = (mood: AgentMoodI) => {
    router.push(`/talk?mood=${mood}`);
  };

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center" {...props}>
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 py-16">
        {/* JesseXBT (Optimistic) */}
        <div className="flex-1 flex flex-col items-center text-center bg-transparent" onClick={clickHandler}>
          <Image
            src="/mellow-jesse.gif"
            alt="JesseXBT Avatar"
            width={180}
            height={180}
            className="rounded-none mb-6"
            priority
          />
          <h2 className={clsx('text-4xl text-white mb-2', nyghtMedium.className)}>JesseXBT</h2>
          <p className="text-xl text-white/80 mb-2 font-inter font-light">The relentlessly optimistic Jesse Pollak.</p>
          <p className="text-xl text-white/80 mb-8 max-w-[427px] font-inter font-light">
            Sees massive potential everywhere, bursting with Onchain Summer energy, &amp; ready to hype your vision to
            the moon.
          </p>
          <Button
            appearance="colored"
            onClick={() => updateMood(AgentMoodEnum.EXCITED)}
            className="bg-optimism w-auto text-black"
          >
            <span role="img" aria-label="microphone">
              <MicIcon color="black" />
            </span>{' '}
            Start talking
          </Button>
        </div>
        {/* SupaBald JesseXBT (Critical) */}
        <div className="flex-1 flex flex-col items-center text-center bg-transparent" onClick={clickHandler}>
          <Image
            src="/critical-jesse.gif"
            alt="SupaBald JesseXBT Avatar"
            width={180}
            height={180}
            className="rounded-none mb-6"
            priority
          />
          <h2 className={clsx('text-4xl text-white mb-2', nyghtMedium.className)}>SupaBald JesseXBT</h2>
          <p className="text-xl text-white/80 mb-2 font-inter font-light">The brutally honest Jesse Pollak.</p>
          <p className="text-xl text-white/80 mb-8 max-w-[427px] font-inter font-light">
            Cuts through the hype, challenges every premise, &amp; believes great ideas must survive intense scrutiny to
            succeed.
          </p>
          <Button
            appearance="colored"
            className="bg-critical w-auto"
            onClick={() => updateMood(AgentMoodEnum.CRITICAL)}
          >
            <span role="img" aria-label="microphone">
              <MicIcon />
            </span>{' '}
            Start talking
          </Button>
        </div>
      </div>
    </main>
  );
};
