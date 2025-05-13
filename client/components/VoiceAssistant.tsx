import { CustomVoiceAssistantControlBar } from '@/components/CustomVoiceAssistantControlBar';
import { NoAgentNotification } from '@/components/NoAgentNotification';
import TranscriptionView from '@/components/TranscriptionView';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { AgentMoodEnum, AgentMoodI } from '@/types/agent';
import { BarVisualizer, RoomAudioRenderer, useChat, useVoiceAssistant } from '@livekit/components-react';
import Image from 'next/image';
import { useState } from 'react';
import AudioVisualizer from './AudioVisualizer/AudioVisualizer';
import { Loader } from './Loader';

export function VoiceAssistant({ mood, hideControls }: { mood: AgentMoodI; hideControls?: boolean }) {
  const { state: agentState, audioTrack: agentAudioTrack } = useVoiceAssistant();

  const { send } = useChat();

  const [loading, setLoading] = useState(false);

  const handleEndConversation = () => {
    send('Goodbye for now. Please end the conversation', {
      topic: 'user_end_conversation',
    });

    setLoading(true);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#638596] pt-8">
      <div
        className="absolute inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]"
        aria-hidden="true"
      ></div>

      <div className="flex flex-col items-center mb-6 relative">
        <div className="flex flex-row">
          <Image
            src={mood === AgentMoodEnum.CRITICAL ? '/critical-jesse.gif' : '/mellow-jesse.gif'}
            alt="JesseGPT Avatar"
            width={254}
            height={254}
            className="rounded-none"
            priority
          />
          <div
            className={`mt-[64px] w-[64px] h-[64px] rounded-full flex justify-center items-center relative overflow-hidden ${mood === AgentMoodEnum.EXCITED ? 'bg-[#FFF68D]' : 'bg-[#0157FA]'}`}
          >
            {/* <BarVisualizer
              state={agentState}
              trackRef={agentAudioTrack}
              barCount={5}
              className="agent-visualizer"
              options={{ minHeight: 8, maxHeight: 20 }}
              style={{
                // @ts-expect-error variable update
                '--lk-fg': mood === AgentMoodEnum.EXCITED ? '#20282D' : 'white',

                '--lk-va-bg': mood === AgentMoodEnum.EXCITED ? '#20282D' : 'white',
              }}
            /> */}

            <AudioVisualizer
              state={agentState === 'speaking' ? 'speaking' : 'idle'}
              variant={mood === AgentMoodEnum.EXCITED ? 'optimism' : 'critical'}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center overflow-hidden z-10 mt-16">
        <TranscriptionView mood={mood} />
      </div>

      <RoomAudioRenderer />
      <NoAgentNotification state={agentState} />

      {/* Centered controls at the bottom - Fixed */}
      {!hideControls && (
        <div className="w-full flex flex-col items-center fixed bottom-0 left-0 px-4 py-8 z-10 gap-4">
          <div className="flex justify-center gap-4">
            <div className="flex flex-row items-center gap-4 bg-white/90 rounded-xl shadow-lg py-3">
              <CustomVoiceAssistantControlBar controls={{ leave: false }} />
            </div>
            <div className="flex items-center gap-4 bg-white/90 rounded-xl shadow-lg px-3 py-3">
              <button
                className="h-[40px] flex items-center justify-center gap-2 px-6"
                onClick={handleEndConversation}
                disabled={loading}
                style={{
                  backgroundColor: '#F06444',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                }}
              >
                {loading ? <Loader color="white" /> : <CloseIcon />}
                End
              </button>
            </div>
          </div>

          <div className="text-base text-white font-inter">
            You can say ‘Bye’ or press the ‘End’ button to finish this conversation
          </div>
        </div>
      )}
    </div>
  );
}
