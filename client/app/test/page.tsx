'use client';

import AudioVisualizer from '@/components/AudioVisualizer/AudioVisualizer';
import { AgentMoodEnum } from '@/types/agent';
import {
  BarVisualizer,
  RoomContext,
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
  useLocalParticipantPermissions,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import { useEffect, useMemo, useState } from 'react';

export default function TestPage() {
  const room = new Room();

  return (
    <RoomContext.Provider value={room}>
      <Component />
    </RoomContext.Provider>
  );
}

const Component = () => {
  const { microphoneTrack, localParticipant } = useLocalParticipant();

  const micTrackRef: TrackReferenceOrPlaceholder = useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  // if (!localPermissions) {
  //   visibleControls.microphone = false;
  // } else {
  //   visibleControls.microphone ??= localPermissions.canPublish;
  // }

  const mood = AgentMoodEnum.CRITICAL;

  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <main
      data-lk-theme="default"
      className="min-h-screen flex items-center justify-center bg-[#638596] relative inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]"
    >
      {/* Prefetch assets for the JesseFrame */}

      <div className="max-h-[20vh]">
        <div className="flex-1 flex flex-col items-center overflow-hidden z-10 mt-16 h-16 w-32">
          <AudioVisualizer state={isSpeaking ? 'speaking' : 'idle'} />
          {/* <BarVisualizer
            state={'speaking'}
            trackRef={micTrackRef}
            barCount={3}
            className="agent-visualizer"
            options={{ maxHeight: 40, minHeight: 20 }}
            style={{
              // @ts-expect-error variable update
              '--lk-fg': mood === AgentMoodEnum.EXCITED ? '#20282D' : 'white',
              // @ts-expect-error variable update
              '--lk-va-bg': mood === AgentMoodEnum.EXCITED ? '#20282D' : 'white',
            }}
          >
            <div className="bg-blue-3 h-16 w-32" />
          </BarVisualizer> */}
        </div>
      </div>
    </main>
  );
};
