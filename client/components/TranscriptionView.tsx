import useCombinedTranscriptions from '@/hooks/useCombinedTranscriptions';
import { AgentMoodEnum, AgentMoodI } from '@/types/agent';
import { useVoiceAssistant } from '@livekit/components-react';
import clsx from 'clsx';
import * as React from 'react';

// const testTranscriptions = [
//   {
//     id: 'SG_c3b777e0b1b3',
//     text: 'Alright, let’s cut to the chase. What are you building? Lay it out quickly. Why should I care?',
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746618974989,
//     lastReceivedTime: 1746618980614,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618971339,
//     role: 'user',
//   },
//   {
//     id: 'SG_cd6a36b225c8',
//     text: "If you've got",
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746618998349,
//     lastReceivedTime: 1746618998376,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618971339,
//     role: 'assistant',
//   },
//   {
//     id: 'SG_831bdbc25fca',
//     text: "I'm building a platform for",
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746618998683,
//     lastReceivedTime: 1746619000231,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618967890,
//     role: 'user',
//   },
//   {
//     id: 'SG_5ee784f4cdfc',
//     text: 'talent protocol.',
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746619002159,
//     lastReceivedTime: 1746619003197,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618967890,
//     role: 'user',
//   },
//   {
//     id: 'SG_b03531e29a38',
//     text: 'I need more from you on this. How are you addressing privacy concerns? What safeguards do you have in place to protect user data while still providing value through identity connections? Security is paramount—explain your strategy.',
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746619328407,
//     lastReceivedTime: 1746619343277,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618971339,
//     role: 'assistant',
//   },
//   {
//     id: 'SG_323bc56e28d2',
//     text: "Aha! This was fun, but I'm afraid that's all that we have for today. I can't wait to see your idea come to life during Onchain Summer! Stay based, and never stop building!!",
//     startTime: 0,
//     endTime: 0,
//     final: true,
//     language: '',
//     firstReceivedTime: 1746619346668,
//     lastReceivedTime: 1746619360719,
//     receivedAtMediaTimestamp: 0,
//     receivedAt: 1746618971339,
//     role: 'assistant',
//   },
// ];

// const streamSpeed = 50;

// const useTestTranscriptions = () => {
//   const [transcriptions, setTranscriptions] = React.useState<typeof testTranscriptions>([
//     { ...testTranscriptions[0], text: '' },
//   ]);

//   React.useEffect(() => {
//     // initial case
//     if (transcriptions[0].text !== testTranscriptions[0].text) {
//       console.log('stream');
//       const updatedText = testTranscriptions[0].text.slice(0, transcriptions[0].text.length + 1);

//       setTimeout(() => {
//         setTranscriptions(prev => [{ ...testTranscriptions[0], text: updatedText }]);
//       }, streamSpeed);
//       // streamText();
//     } else {
//       // reset
//       setTimeout(() => {
//         setTranscriptions(prev => [{ ...testTranscriptions[0], text: '' }]);
//       }, streamSpeed);
//     }
//   }, [transcriptions]);

//   return transcriptions;
// };

const sanitizeText = (text: string) => {
  return text.replaceAll(/[*"'`~#>]/g, '');
};

export default function TranscriptionView({ mood }: { mood: AgentMoodI }) {
  const combinedTranscriptions = useCombinedTranscriptions();

  const { state } = useVoiceAssistant();

  const isThinking = state === 'thinking' || state === 'connecting';

  const lastScrolledID = React.useRef<string | null>(null);

  // for testing only
  // const combinedTranscriptions = useTestTranscriptions();

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    const transcription = combinedTranscriptions[combinedTranscriptions.length - 1];
    if (transcription && transcription.id !== lastScrolledID.current) {
      const transcriptionElement = document.getElementById(transcription.id);
      if (transcriptionElement) {
        transcriptionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (isThinking) {
      const transcriptionElement = document.getElementById('agent-thinking');
      if (transcriptionElement) {
        transcriptionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [combinedTranscriptions, isThinking]);

  const onlyAssistantTranscriptions = combinedTranscriptions.filter(segment => segment.role === 'assistant');
  const lastAssistantTranscription = onlyAssistantTranscriptions[onlyAssistantTranscriptions.length - 1];

  const onlyUserTranscriptions = combinedTranscriptions.filter(segment => segment.role === 'user');
  const lastUserTranscription = onlyUserTranscriptions[onlyUserTranscriptions.length - 1];

  const preventAutoScrollOnHumanScroll = () => {
    const transcription = combinedTranscriptions[combinedTranscriptions.length - 1];
    if (transcription) lastScrolledID.current = transcription.id;
  };

  return (
    <div
      className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden py-8 md:w-[700px] w-full pb-44 md:pb-40 px-4"
      onWheel={preventAutoScrollOnHumanScroll}
      onTouchStart={preventAutoScrollOnHumanScroll}
    >
      {combinedTranscriptions.map(segment => (
        <ChatBubble
          key={segment.id}
          id={segment.id}
          text={sanitizeText(segment.text)}
          role={segment.role}
          mood={mood}
          isLast={
            (!isThinking && segment.id === lastAssistantTranscription?.id) || segment.id === lastUserTranscription?.id
          }
        />
      ))}

      {isThinking && <ChatBubble id={'agent-thinking'} role={'assistant'} mood={mood} thinking isLast />}
    </div>
  );
}

const ChatBubble = ({
  id,
  text,
  role,
  mood,
  thinking,
  isLast,
}: {
  id: string;
  text?: string;
  role: 'assistant' | 'user';
  mood: AgentMoodI;
  thinking?: boolean;
  isLast?: boolean;
}) => {
  return (
    <div
      id={id}
      className={clsx(
        role === 'assistant'
          ? `assistant-bubble rounded-2xl px-6 py-4 self-start md:max-w-[70%] max-w-[90%] shadow-md text-lg ${mood === AgentMoodEnum.EXCITED ? 'bg-[#FFF68E] text-gray-900' : 'bg-[#0157FA] text-white'} ${isLast ? 'rounded-tl-none' : ''}`
          : `user-bubble bg-[#22302B] text-white rounded-2xl px-6 py-4 self-end md:max-w-[70%] max-w-[90%] shadow-md text-lg ${isLast ? 'rounded-br-none' : ''}`
      )}
      style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
    >
      {text?.toLocaleLowerCase()}

      {thinking && <div className={'rounded-full animate-pulse opacity-80'}>Thinking...</div>}
    </div>
  );
};
