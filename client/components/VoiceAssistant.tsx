import { CloseIcon } from '@/components/CloseIcon';
import { CustomVoiceAssistantControlBar } from '@/components/CustomVoiceAssistantControlBar';
import { NoAgentNotification } from '@/components/NoAgentNotification';
import TranscriptionView from '@/components/TranscriptionView';
import { BarVisualizer, DisconnectButton, RoomAudioRenderer, useVoiceAssistant } from '@livekit/components-react';
import Image from 'next/image';

export function VoiceAssistant({ mood }: { mood: 'excited' | 'critical' }) {
  const { state: agentState, audioTrack: agentAudioTrack } = useVoiceAssistant();
  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#638596] pt-8">
      <div
        className="absolute inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]"
        aria-hidden="true"
      ></div>

      <div className="flex flex-col items-center mb-6 relative">
        <div className="flex flex-row">
          <Image
            src={mood === 'critical' ? '/critical-jesse.gif' : '/mellow-jesse.gif'}
            alt="JesseXBT Avatar"
            width={254}
            height={254}
            className="rounded-none"
            priority
          />
          <div
            className={`mt-[64px] w-[64px] h-[64px] rounded-full flex justify-center items-center relative overflow-hidden ${mood === 'excited' ? 'bg-[#FFF68D]' : 'bg-[#0157FA]'}`}
          >
            <BarVisualizer
              state={agentState}
              trackRef={agentAudioTrack}
              barCount={5}
              className="agent-visualizer"
              options={{ maxHeight: 40 }}
              style={{
                // @ts-expect-error variable update
                '--lk-fg': mood === 'excited' ? '#20282D' : 'white',
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center overflow-hidden z-10 mt-16">
        <div className="max-w-2xl h-[560px] overflow-y-auto">
          <TranscriptionView mood={mood} />
        </div>
      </div>

      <RoomAudioRenderer />
      <NoAgentNotification state={agentState} />

      {/* Centered controls at the bottom - Fixed */}
      <div className="w-full flex justify-center fixed bottom-0 left-0 px-4 py-6 z-10 gap-4">
        <div className="flex flex-row items-center gap-4 bg-white/90 rounded-xl shadow-lg py-3">
          <CustomVoiceAssistantControlBar controls={{ leave: false }} />
        </div>
        <div className="flex flex-row items-center gap-4 bg-white/90 rounded-xl shadow-lg px-3 py-3">
          <DisconnectButton
            className="w-[40px] h-[40px] "
            style={{
              backgroundColor: '#F06444',
              borderRadius: '8px',
              border: 'none',
              color: 'white',
            }}
          >
            <CloseIcon />
          </DisconnectButton>
        </div>
      </div>
    </div>
  );
}
