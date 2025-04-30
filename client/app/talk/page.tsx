'use client';

import LoadingPage from '@/components/LoadingPage';
import ShareModal from '@/components/ShareModal';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { AgentMoodEnum, AgentMoodI, AgentShareData } from '@/types/agent';
import { RoomContext } from '@livekit/components-react';
import { Room, RoomEvent } from 'livekit-client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { ConnectionDetails } from '../api/connection-details/route';

const parseMoodQueryParam = (query: string | string[] | null): AgentMoodI | null => {
  if (typeof query === 'string') {
    return query as AgentMoodI;
  }
  return null;
};

const TalkComponent = () => {
  const searchParams = useSearchParams();
  const mood = parseMoodQueryParam(searchParams.get('mood'));
  const router = useRouter();

  const [room] = useState(new Room());
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [isOneLinerReceived, setIsOneLinerReceived] = useState(false);

  const finalMintData = useRef<AgentShareData>({
    oneLiner: '',
    summary: '',
  });

  // Holds object URL of image received via byte stream

  useEffect(() => {
    // redirect to home page if no mood is selected
    if (!mood) {
      router.push('/');
    }
  }, [mood, router]);

  // Connect to LiveKit when mood is selected
  useEffect(() => {
    if (!mood) return;
    let cancelled = false;
    async function connect() {
      setConnecting(true);
      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
        window.location.origin
      );
      const response = await fetch(`${url.toString()}?mood=${mood}`);
      const connectionDetailsData: ConnectionDetails = await response.json();

      if (cancelled) return;

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);

      // Register handler for the one liner text stream
      room.registerTextStreamHandler('end_conversation_one_liner', async (reader, participantInfo) => {
        const info = reader.info;
        console.log(
          `Received text stream from ${participantInfo.identity}\n` +
            `  Topic: ${info.topic}\n` +
            `  Timestamp: ${info.timestamp}\n` +
            `  ID: ${info.id}\n` +
            `  Size: ${info.size}`
        );
        for await (const chunk of reader) {
          console.log(`One Liner: ${chunk}`);
          finalMintData.current.oneLiner += chunk;
        }

        // conversation is over, disconnect from room

        console.log('room disconnected');
        room.disconnect();
        setIsOneLinerReceived(true);
      });

      // Register handler for the one liner text stream
      room.registerTextStreamHandler('end_conversation_summary', async (reader, participantInfo) => {
        const info = reader.info;
        console.log(
          `Received text stream from ${participantInfo.identity}\n` +
            `  Topic: ${info.topic}\n` +
            `  Timestamp: ${info.timestamp}\n` +
            `  ID: ${info.id}\n` +
            `  Size: ${info.size}`
        );

        for await (const chunk of reader) {
          finalMintData.current.summary += chunk;
          console.log(`Summary: ${chunk}`);
        }
      });

      if (!cancelled) setConnected(true);
      setConnecting(false);
    }
    connect();
    console.log('connecting to room...');
    return () => {
      cancelled = true;
    };
  }, [room, mood]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    const handleDisconnected = () => {
      console.log('Disconnected from room');
    };

    room.on(RoomEvent.Disconnected, handleDisconnected);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
      room.off(RoomEvent.Disconnected, handleDisconnected);
    };
  }, [room]);

  // Persona selection UI
  if (!mood) {
    return <></>;
  }

  // Show loading state while connecting
  if (connecting && !connected) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0C1110]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-white text-2xl font-bold mb-4">
            Connecting to {mood === AgentMoodEnum.EXCITED ? 'JesseXBT (Optimistic)' : 'SupaBald JesseXBT (Critical)'}...
          </div>
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  // Voice assistant UI
  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-h-[90vh]">
          <VoiceAssistant mood={mood} />
        </div>
      </RoomContext.Provider>

      {
        <ShareModal
          isOpen={isOneLinerReceived}
          data={finalMintData.current}
          onClose={() => {
            // on close
            // retry
          }}
        />
      }
    </main>
  );
};

export default function TalkPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TalkComponent />
    </Suspense>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab'
  );
}
