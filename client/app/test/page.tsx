'use client';

import TranscriptionView from '@/components/TranscriptionView';
import { AgentMoodEnum } from '@/types/agent';

export default function TestPage() {
  return (
    <main
      data-lk-theme="default"
      className="min-h-screen flex items-center justify-center bg-[#638596] relative inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]"
    >
      {/* Prefetch assets for the JesseFrame */}

      <div className="max-h-[90vh]">
        <div className="w-full flex-1 flex flex-col items-center overflow-hidden z-10 mt-16">
          <TranscriptionView mood={AgentMoodEnum.EXCITED} />
        </div>
      </div>
    </main>
  );
}
