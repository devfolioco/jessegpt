import { getFarcasterCopy, getTweetCopy, getTwitterIntentURL, getWarpcastIntentURL } from '@/helpers/copy';
import { useCoinOnZora } from '@/hooks/useCoinOnZora';
import { AgentMoodEnum, AgentMoodI, AgentShareData, ZoraCoinFlowStep } from '@/types/agent';
import confetti from 'canvas-confetti';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import EditIdea from './EditIdea';
import JesseFrame from './JesseFrame';
import { Loader } from './Loader';
import Snackbar from './Snackbar';
import { CloseIcon } from './icons/CloseIcon';
import { FarcasterIcon } from './icons/FarcasterIcon';
import { MicIcon } from './icons/MicIcon';
import { XIcon } from './icons/XIcon';
import { ZoraIcon } from './icons/ZoraIcon';

interface ShareModalProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
  data: AgentShareData;
  mood: AgentMoodI;
}

enum ShareModalError {
  FRAME_RENDER_ERROR = 'frame-render-error',
  ZORA_COIN_CREATION_ERROR = 'zora-coin-creation-error',
  INSUFFICIENT_WALLET_BALANCE = 'insufficient-wallet-balance',
}

const getZoraStateCopy = (status: ZoraCoinFlowStep) => {
  switch (status) {
    case ZoraCoinFlowStep.CONNECTING_WALLET:
      return 'Connecting wallet...';
    case ZoraCoinFlowStep.UPLOADING_IMAGE:
      return 'Generating post...';
    case ZoraCoinFlowStep.CREATING_COIN:
      return 'Coining on zora...';
    case ZoraCoinFlowStep.SUCCESS:
      return 'View on Zora';
    default:
      return 'Coin on Zora';
  }
};

const getZoraStateCopyError = (error: ShareModalError) => {
  switch (error) {
    case ShareModalError.INSUFFICIENT_WALLET_BALANCE:
      return 'Insufficient wallet balance. Add some ETH and try again.';
    case ShareModalError.FRAME_RENDER_ERROR:
      return 'Unable to render the idea frame. Try using a different browser.';
    case ShareModalError.ZORA_COIN_CREATION_ERROR:
      return 'Unable to create the Zora coin. Please try again.';
    default:
      return 'Unable to create the Zora coin. Please try again.';
  }
};

const ShareModal = ({ data: initialData, onClose, mood, isOpen, roomId }: ShareModalProps) => {
  const handleDefaultClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const [data, setData] = useState<AgentShareData>(initialData);
  const [error, setError] = useState<ShareModalError | null>(null);
  console.log(error);

  const ideaImageRef = useRef<string | null>(null);

  const {
    onClick: onZoraClick,
    isLoading,
    result: zoraResult,
    status: zoraStatus,
  } = useCoinOnZora({
    roomId: roomId,
    title: data.oneLiner,
    description: data.summary,
    base64Image: ideaImageRef.current,
    onSuccess: () => {
      setTimeout(() => {
        triggerConfetti();
        setZoraToastVisible(true);
      }, 1000);
    },
    onFailure: error => {
      console.error('Error creating Zora coin', error);

      if (error.message === 'Insufficient balance') {
        setError(ShareModalError.INSUFFICIENT_WALLET_BALANCE);
      } else {
        setError(ShareModalError.FRAME_RENDER_ERROR);
      }
    },
  });

  const handleCoinOnZoraClick = () => {
    setError(null);
    onZoraClick();
  };

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
  const router = useRouter();

  const handleChatAgain = () => {
    router.push('/');
  };

  const [zoraSuccessToastVisible, setZoraToastVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (editMode) {
          setEditMode(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, editMode]);

  const handleOneLinerChange = (value: string) => {
    console.log('value', value);
    setData({ ...data, oneLiner: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-80 w-screen h-screen backdrop-blur-lg z-20"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="flex flex-col items-center gap-4 max-w-[682px] bg-secondary rounded-2xl p-4 relative"
            onClick={handleDefaultClick}
          >
            {!editMode && (
              <button
                className="absolute top-10 right-10 hover:opacity-80 transition-opacity cursor-pointer z-10"
                onClick={onClose}
              >
                <CloseIcon color="#2D2D2D" className="w-6 h-6" />
              </button>
            )}

            <div className="flex flex-col items-start rounded-xl overflow-hidden">
              <div className="relative">
                <JesseFrame idea={data.oneLiner} mood={mood} onImageReady={onImageReady} onError={handleFrameError} />

                {!editMode && (
                  <button
                    className="absolute right-5 bottom-4 px-4 py-1 rounded-full bg-secondary !font-inter text-white !font-medium"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
                {editMode && (
                  <EditIdea value={data.oneLiner} onChange={handleOneLinerChange} onClose={() => setEditMode(false)} />
                )}
              </div>
              <div className="flex justify-center items-center gap-2 self-stretch p-3 px-4 bg-[#1D1D1D] text-white text-[18px] leading-[28px] font-extralight font-inter">
                {data.summary}
              </div>
            </div>

            <div className="flex gap-4 items-center w-full mt-2">
              <Button
                appearance="colored"
                className={clsx(mood === AgentMoodEnum.CRITICAL ? 'bg-critical text-white' : 'bg-optimism text-black')}
                onClick={handleChatAgain}
                stretch
              >
                <MicIcon color={mood === AgentMoodEnum.CRITICAL ? 'white' : 'black'} />
                Chat again
              </Button>

              {zoraResult ? (
                <Button
                  appearance="colored"
                  className="bg-white text-black"
                  href={zoraResult.zoraLink}
                  target="_blank"
                  stretch
                >
                  <ZoraIcon />
                  View on Zora
                </Button>
              ) : (
                <Button
                  appearance="colored"
                  className={clsx('bg-white ', isLoading ? 'text-grey-7' : 'text-black')}
                  onClick={handleCoinOnZoraClick}
                  stretch
                >
                  {isLoading ? <Loader /> : <ZoraIcon />}
                  {getZoraStateCopy(zoraStatus)}
                </Button>
              )}
            </div>

            <div className="flex gap-4 items-center w-full">
              <Button appearance="colored" className="bg-farcaster  text-white" onClick={handleFarcaster} stretch>
                <FarcasterIcon />
                Cast
              </Button>

              <Button appearance="colored" className="bg-x  text-white" onClick={handleTweet} stretch>
                <XIcon />
                Post
              </Button>
            </div>

            <div className="flex justify-center text-base text-white/90 font-inter">
              Zora takes around $0.05 - $0.25 gas fee
            </div>

            {/* <Button
              appearance="colored"
              className="bg-devfolio text-white"
              href={BASE_BATCH_APPLY_URL}
              target="_blank"
              stretch
            >
              <DevfolioIcon />
              Build your idea at Base Batches: 001
            </Button> */}

            <AnimatePresence initial={false}>
              {zoraSuccessToastVisible && (
                <Snackbar>
                  Your idea has been successfully coined on Zora.{' '}
                  <a href={zoraResult?.zoraLink ?? ''} target="_blank" className="underline">
                    Check it out here.
                  </a>
                </Snackbar>
              )}

              {error && <Snackbar error>{getZoraStateCopyError(error)}</Snackbar>}

              {/* 
              {error && (
                <motion.div
                  className="flex gap-4 p-4 justify-center items-center self-stretch rounded-2xl bg-secondary absolute w-full top-full mt-4 left-0 font-inter text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <p>
                    {error === ShareModalError.ZORA_COIN_CREATION_ERROR ? (
                      <p>Something went wrong while creating your Zora coin. Please try again.</p>
                    ) : (
                      <p>Error: Something went wrong while generating your idea frame. Please try again.</p>
                    )}
                  </p>
                </motion.div>
              )} */}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const triggerConfetti = () => {
  const canvas = document.createElement('canvas');

  /**
   * Set the dimensions of the canvas to 0 initially. This is so that
   * no extra space is taken up by the canvas when it is idle.
   *
   * And since we've set the resize flag on confetti to true, it will
   * auto-resize when required.
   */
  canvas.width = 0;
  canvas.height = 0;

  document.body.appendChild(canvas);

  confetti.create(canvas, {
    resize: true,
  });

  confetti({
    angle: 80,
    spread: 200,
    particleCount: 500,
    startVelocity: 100,
    origin: { y: 0.8, x: 0.9 },
  });

  confetti({
    angle: 80,
    spread: 200,
    particleCount: 500,
    startVelocity: 100,
    origin: { y: 0.8, x: 0.01 },
  });

  confetti({
    spread: 200,
    particleCount: 500,
    startVelocity: 100,
    origin: { y: 0.8 },
  });
};

export default ShareModal;
