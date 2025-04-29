'use client'
import { AgentSelection } from "@/components/AgentSelection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [showAgentSelection, setShowAgentSelection] = useState(false);

  const handleAgentSelection = () => {
    setShowAgentSelection(true);
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAgentSelection) {
        setShowAgentSelection(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showAgentSelection]);
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#638596] relative absolute inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]">
      <div className="z-10 flex flex-col items-center text-center gap-8">
        <Image
          src="/mellow-jesse.gif"
          alt="JesseXBT Avatar"
          width={180}
          height={180}
          className="rounded-none mx-auto"
          priority
        />
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">
          Talk to JesseXBT
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
          Get feedback on your ideas from Base creator Jesse Pollak&apos;s AI avatar. Choose between
          optimistic hype mode or brutally honest critique to level up your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="https://www.basebatches.xyz/"
            target="_blank"
            className="px-8 py-4 border border-white/40 rounded-lg text-lg font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
          >
            Apply to Base Batches: 001
          </Link>
          <button
            onClick={handleAgentSelection}
            className="px-8 py-4 rounded-lg text-lg font-semibold text-[#6B8A96] bg-white hover:bg-gray-100 transition-all shadow-md"
          >
            Start talking to Jesse
          </button>
        </div>
      </div>
      
      {
        showAgentSelection && (
          <div className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-80 w-screen h-screen backdrop-blur-lg z-20" onClick={() => setShowAgentSelection(false)}>
            <AgentSelection  />
          </div>
        )
      }
    </main>
  );
}
