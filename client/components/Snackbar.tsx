import { motion } from 'motion/react';
import { CheckIcon } from './icons/CheckIcon';
import { ErrorIcon } from './icons/ErrorIcon';

const Snackbar = ({ children, error }: { children: React.ReactNode; error?: boolean }) => {
  return (
    <motion.div
      className="flex gap-3 p-4 items-center self-stretch rounded-2xl bg-secondary absolute w-full top-full mt-4 left-0 font-inter text-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {error ? <ErrorIcon /> : <CheckIcon />}
      <p>{children}</p>
    </motion.div>
  );
};

export default Snackbar;
