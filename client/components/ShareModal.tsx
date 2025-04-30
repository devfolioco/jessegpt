import { AgentShareData } from '@/types/agent';
import { AnimatePresence, motion } from 'motion/react';
import JesseFrame from './JesseFrame';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgentShareData;
}

const MainContent = ({ data, isOpen }: ShareModalProps) => {
  return (
    <div>
      <JesseFrame idea={data.oneLiner} />
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
