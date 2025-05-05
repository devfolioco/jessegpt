import { BASE_BATCH_APPLY_URL } from '@/constants';
import { getFarcasterCopy, getTweetCopy, getTwitterIntentURL, getWarpcastIntentURL } from '@/helpers/copy';
import { useCoinOnZora } from '@/hooks/useCoinOnZora';
import { AgentMoodEnum, AgentMoodI, AgentShareData } from '@/types/agent';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { Button } from './Button';
import { CloseIcon } from './CloseIcon';
import JesseFrame from './JesseFrame';
import { Loader } from './Loader';
import { MicIcon } from './MicIcon';
import { DevfolioIcon } from './icons/DevfolioIcon';
import { FarcasterIcon } from './icons/FarcasterIcon';
import { XIcon } from './icons/XIcon';
import { ZoraIcon } from './icons/ZoraIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgentShareData;
  mood: AgentMoodI;
}

enum ShareModalError {
  FRAME_RENDER_ERROR = 'frame-render-error',
}

const MainContent = ({ data, onClose, mood }: ShareModalProps) => {
  const handleDefaultClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.preventDefault();
    e.stopPropagation();
  };

  const [error, setError] = useState<ShareModalError | null>(null);
  // todo: show error to user

  const ideaImageRef = useRef<string | null>(null);

  const {
    onClick: handleCoinOnZoraClick,
    isLoading,
    result: zoraResult,
  } = useCoinOnZora({
    title: data.oneLiner,
    description: data.summary,
    base64Image: ideaImageRef.current,
  });

  const onImageReady = (base64Image: string) => {
    ideaImageRef.current = base64Image;
  };

  const handleFrameError = (error: Error) => {
    console.error('Error rendering frame', error);
    setError(ShareModalError.FRAME_RENDER_ERROR);
  };

  const handleTweet = () => {
    const tweetCopy = getTweetCopy({
      title: data.oneLiner,
      summary: data.summary,
      zoraUrl: zoraResult?.zoraLink ?? '',
    });

    const twitterShareURL = getTwitterIntentURL({ text: tweetCopy });

    window.open(twitterShareURL, '_blank');
  };

  const handleFarcaster = () => {
    const farcasterCopy = getFarcasterCopy({
      title: data.oneLiner,
      summary: data.summary,
      zoraUrl: zoraResult?.zoraLink ?? '',
    });

    const warpcastShareURL = getWarpcastIntentURL({ text: farcasterCopy });

    window.open(warpcastShareURL, '_blank');
  };

  return (
    <div
      className="flex flex-col items-center gap-4 max-w-[682px] bg-secondary rounded-2xl p-4 relative"
      onClick={handleDefaultClick}
    >
      <button className="absolute top-10 right-10 hover:opacity-80 transition-opacity cursor-pointer" onClick={onClose}>
        <CloseIcon color="#2D2D2D" className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-start rounded-xl overflow-hidden">
        <JesseFrame idea={data.oneLiner} mood={mood} onImageReady={onImageReady} onError={handleFrameError} />

        <div className="flex justify-center items-center gap-2 self-stretch p-3 px-4 bg-[#1D1D1D] text-white text-[18px] leading-[28px] font-extralight font-inter">
          {data.summary}
        </div>
      </div>

      {zoraResult ? (
        // Zora Success UI
        <div className="flex gap-4 items-center w-full mt-2 font-inter">
          <Button appearance="colored" className="bg-farcaster  text-white" onClick={handleFarcaster}>
            <FarcasterIcon />
            Cast
          </Button>

          <Button appearance="colored" className="bg-x  text-white" onClick={handleTweet}>
            <XIcon />
            Cast
          </Button>

          <Button appearance="colored" className="bg-white text-black" href={zoraResult.zoraLink} target="_blank">
            <ZoraIcon />
            View
          </Button>
        </div>
      ) : (
        // Zora Flow
        <div className="flex gap-4 items-center w-full mt-2">
          <Button
            appearance="colored"
            className={clsx(mood === AgentMoodEnum.EXCITED ? 'text-black bg-optimism' : 'text-white bg-critical')}
            onClick={onClose}
          >
            <MicIcon color={mood === AgentMoodEnum.EXCITED ? 'black' : 'white'} />
            Chat again
          </Button>

          <Button
            appearance="colored"
            className={clsx('bg-white ', isLoading ? 'text-grey-7' : 'text-black')}
            onClick={handleCoinOnZoraClick}
          >
            {isLoading ? <Loader /> : <ZoraIcon />}
            Coin on Zora
          </Button>
        </div>
      )}

      <Button appearance="colored" className="bg-devfolio text-white" href={BASE_BATCH_APPLY_URL} target="_blank">
        <DevfolioIcon />
        Build your idea at Base Batches: 001
      </Button>
    </div>
  );
};

const ShareModal = (props: ShareModalProps) => {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-80 w-screen h-screen backdrop-blur-lg z-20"
          onClick={props.onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.2 }}
        >
          <MainContent {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
