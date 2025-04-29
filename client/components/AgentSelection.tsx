'use client';

import { MicIcon } from '@/components/MicIcon';
import { AgentMoodEnum, AgentMoodI } from '@/types/agent';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
          <h2 className="text-4xl font-serif font-bold text-white mb-2">JesseXBT</h2>
          <p className="text-lg text-white/90 mb-2">The relentlessly optimistic Jesse Pollak.</p>
          <p className="text-base text-white/80 mb-8 max-w-xs">
            Sees massive potential everywhere, bursting with Onchain Summer energy, &amp; ready to hype your vision to
            the moon.
          </p>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold bg-yellow-300 text-black hover:bg-yellow-200 transition-all shadow-md"
            onClick={() => updateMood(AgentMoodEnum.EXCITED)}
          >
            <span role="img" aria-label="microphone">
              <MicIcon color="black" />
            </span>{' '}
            Start talking
          </button>
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
          <h2 className="text-4xl font-serif font-bold text-white mb-2">SupaBald JesseXBT</h2>
          <p className="text-lg text-white/90 mb-2">The brutally honest Jesse Pollak.</p>
          <p className="text-base text-white/80 mb-8 max-w-xs">
            Cuts through the hype, challenges every premise, &amp; believes great ideas must survive intense scrutiny to
            succeed.
          </p>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md"
            onClick={() => updateMood(AgentMoodEnum.CRITICAL)}
          >
            <span role="img" aria-label="microphone">
              <MicIcon />
            </span>{' '}
            Start talking
          </button>
        </div>
      </div>
    </main>
  );
};
