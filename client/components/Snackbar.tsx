import { motion } from 'motion/react';
import { Loader } from './Loader';
import { CheckIcon } from './icons/CheckIcon';
import { ErrorIcon } from './icons/ErrorIcon';

const Snackbar = ({
  children,
  appearance = 'success',
}: {
  children: React.ReactNode;
  appearance?: 'error' | 'success' | 'loading';
}) => {
  return (
    <motion.div
      className="flex gap-3 p-4 items-center self-stretch rounded-2xl bg-secondary absolute w-full top-full mt-4 left-0 font-inter text-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {appearance === 'error' ? <ErrorIcon /> : appearance === 'success' ? <CheckIcon /> : <Loader color="white" />}
      <p>{children}</p>
    </motion.div>
  );
};

export default Snackbar;
