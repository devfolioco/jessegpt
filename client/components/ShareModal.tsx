import { inter } from '@/app/fonts/fonts';
import { BASE_BATCH_APPLY_URL } from '@/constants';
import { useCoinOnZora } from '@/hooks/useCoinOnZora';
import { AgentShareData } from '@/types/agent';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { Button } from './Button';
import { CloseIcon } from './CloseIcon';
import JesseFrame from './JesseFrame';
import { MicIcon } from './MicIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgentShareData;
}

enum ShareModalError {
  FRAME_RENDER_ERROR = 'frame-render-error',
}

const MainContent = ({ data, onClose }: ShareModalProps) => {
  const handleDefaultClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
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

  return (
    <div
      className="flex flex-col items-center gap-4 max-w-[682px] bg-secondary rounded-2xl p-4 relative"
      onClick={handleDefaultClick}
    >
      <button className="absolute top-10 right-10 hover:opacity-80 transition-opacity cursor-pointer" onClick={onClose}>
        <CloseIcon color="#2D2D2D" className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-start rounded-xl overflow-hidden">
        <JesseFrame idea={data.oneLiner} onImageReady={onImageReady} onError={handleFrameError} />

        <div className="flex justify-center items-center gap-2 self-stretch p-3 px-4 bg-[#1D1D1D] text-white font-['Nunito_Sans'] text-[18px] leading-[28px]">
          {data.summary}
        </div>
      </div>

      {zoraResult ? (
        // Zora Success UI
        <div className="flex gap-4 items-center w-full mt-2">
          <Button appearance="colored" className="bg-farcaster  text-white">
            <MicIcon color="black" />
            Cast
          </Button>

          <Button appearance="colored" className="bg-x  text-white">
            <MicIcon color="black" />
            Cast
          </Button>

          <Button appearance="colored" className="bg-white text-black" href={zoraResult.zoraLink}>
            {/* todo: add zora icon and loading state */}
            View
          </Button>
        </div>
      ) : (
        // Zora Flow
        <div className="flex gap-4 items-center w-full mt-2">
          <Button appearance="colored" className="bg-optimism  text-black" onClick={onClose}>
            <MicIcon color="black" />
            Chat again
          </Button>

          <Button appearance="colored" className="bg-white text-black" onClick={handleCoinOnZoraClick}>
            {/* todo: add zora icon and loading state */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLoading ? 'Creating...' : 'Coin on Zora'}
          </Button>
        </div>
      )}

      {/* todo: add devfolio icon */}
      <Button appearance="colored" className="bg-devfolio text-white" href={BASE_BATCH_APPLY_URL}>
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
