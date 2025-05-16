'use client';

import { Button } from '@/components/Button';
import { PrefetchJesseFrameAssets } from '@/components/JesseFrame';
import LoadingPage from '@/components/LoadingPage';
import ShareModal from '@/components/ShareModal';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { MicIcon } from '@/components/icons/MicIcon';
import { ShareIcon } from '@/components/icons/ShareIcon';
import { AgentMoodEnum, AgentMoodI, AgentShareData } from '@/types/agent';
import { RoomContext } from '@livekit/components-react';
import { track } from '@vercel/analytics';
import clsx from 'clsx';
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

const projectIdeas = [
  'Tax Weighted Voting',
  'Talent Protocol',
  'MailSprint',
  'ZK-Insurance',
  'Fanbase | Coldplay tickets',
  'SwarmSense: Agentic Grant',
  'Airdrop Sentinel',
];

const testData = {
  oneLiner: projectIdeas[2],
  summary: `
In a world drowning in lengthy emails, MailSprint revolutionizes the way you consume information. This Chrome extension streamlines communication by extracting the essence of any open email and delivering it in a concise easy-to-read summary. 
Save time, stay focused, and conquer your inbox with MailSprint.
    `,
};

const initialData = {
  oneLiner: '',
  summary: '',
};

const TalkComponent = () => {
  const searchParams = useSearchParams();
  const mood = parseMoodQueryParam(searchParams.get('mood'));
  const router = useRouter();

  const [room] = useState(new Room());
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const isInitialRender = useRef(false);

  const [isSummaryReceived, setIsSummaryReceived] = useState(false);

  const [isConversationEnded, setIsConversationEnded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const finalMintData = useRef<AgentShareData>(initialData);

  const [roomId, setRoomId] = useState<string | null>(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleShareModal = () => {
    setIsModalOpen(true);
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error requesting microphone permission', error);
    }
  };

  async function connect() {
    try {
      setConnecting(true);
      requestMicrophonePermission();

      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
        window.location.origin
      );
      const response = await fetch(`${url.toString()}?mood=${mood}`);
      const connectionDetailsData: ConnectionDetails = await response.json();

      if (connectionDetailsData.roomName) {
        setRoomId(connectionDetailsData.roomName.split('_')[2]); // format is: <mood>_room_<roomId>
      }

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);

      room.registerTextStreamHandler('has_enough_information', async (reader, participantInfo) => {
        const info = reader.info;
        console.log(
          `Received text stream from ${participantInfo.identity}\n` +
            `  Topic: ${info.topic}\n` +
            `  Timestamp: ${info.timestamp}\n` +
            `  ID: ${info.id}\n` +
            `  Size: ${info.size}`
        );
        for await (const chunk of reader) {
          console.log(`Has enough information: ${chunk}`);
          setIsConversationEnded(true);
          room.disconnect();
          console.log('room disconnected');

          if (chunk === 'false') {
            handleNotEnoughInformation();
          } else {
            // has enough information
            setIsSummaryReceived(true);
            setIsModalOpen(true);
            track('conversation_ended', {
              title: finalMintData.current.oneLiner,
              roomId: roomId,
              mood,
            });
          }
        }
      });

      room.registerTextStreamHandler('is_inappropriate', async (reader, participantInfo) => {
        const info = reader.info;
        console.log(
          `Received text stream from ${participantInfo.identity}\n` +
            `  Topic: ${info.topic}\n` +
            `  Timestamp: ${info.timestamp}\n` +
            `  ID: ${info.id}\n` +
            `  Size: ${info.size}`
        );
        for await (const chunk of reader) {
          console.log(`Is inappropriate: ${chunk}`);
          if (chunk === 'true') {
            handleIsInappropriate();
          }
        }
      });

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

      room.registerTextStreamHandler('agent_version', async (reader, participantInfo) => {
        for await (const chunk of reader) {
          // Logs agent version
          console.log(`CurrentVersion: ${chunk}`);
        }
      });

      setConnected(true);
      setConnecting(false);
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (error) {
      console.error('Error connecting to room', error);
    }
  }

  const handleRetry = () => {
    // setIsSummaryReceived(false);
    // setIsConversationEnded(false);
    // setIsModalOpen(false);
    // finalMintData.current = initialData;
    // setConnected(false);
    // setConnecting(false);

    router.push('/');
  };

  const handleNotEnoughInformation = () => {
    console.log('Not enough information');
    room.disconnect();
  };

  const handleIsInappropriate = () => {
    console.log('Is inappropriate');
    room.disconnect();
  };

  useEffect(() => {
    // redirect to home page if no mood is selected
    if (!mood) {
      router.push('/');
    }
  }, [mood, router]);

  // Connect to LiveKit when mood is selected
  useEffect(() => {
    if (!mood) return;
    if (isInitialRender.current) return;

    connect();
    isInitialRender.current = true;
    console.log('connecting to room...');
    return () => {
      console.log('clean up ran');
    };
  }, [room, mood]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    const handleDisconnected = () => {
      room.removeAllListeners();
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
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-white text-lg md:text-2xl font-bold mb-4 px-8 md:px-0 text-center">
            Connecting to {mood === AgentMoodEnum.EXCITED ? 'JesseGPT (Optimistic)' : 'SupaBald JesseGPT (Critical)'}...
          </div>
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  // Voice assistant UI
  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      {/* Prefetch assets for the JesseFrame */}
      <PrefetchJesseFrameAssets />

      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-h-[90vh]">
          <VoiceAssistant mood={mood} hideControls={isConversationEnded} />
        </div>
      </RoomContext.Provider>

      {isConversationEnded && (
        <div className="w-full flex items-center justify-center fixed bottom-0 left-0 px-4 py-8 z-10 gap-6">
          <Button
            appearance="colored"
            className={clsx(
              mood === AgentMoodEnum.EXCITED ? 'text-black bg-optimism' : 'text-white bg-critical shadow-lg'
            )}
            onClick={handleRetry}
          >
            <MicIcon color={mood === AgentMoodEnum.EXCITED ? 'black' : 'white'} />
            Chat again
          </Button>

          {/* <Button appearance="colored" className="bg-white text-black" href={BASE_BATCH_APPLY_URL} target="_blank">
            <DevfolioIcon color="black" />
            <span className="-translate-y-[1.5px]">Apply to Base Batches</span>
          </Button> */}

          {isSummaryReceived && (
            <Button appearance="colored" className="bg-white text-black shadow-lg" onClick={handleShareModal}>
              <ShareIcon color="black" />
              Share on socials
            </Button>
          )}
        </div>
      )}

      <ShareModal
        isOpen={isModalOpen}
        data={finalMintData.current}
        mood={mood}
        onClose={handleModalClose}
        roomId={roomId ?? ''}
      />
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
