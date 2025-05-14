import { nyghtMedium } from '@/app/fonts/fonts';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

const EditIdea = ({
  onClose,
  value,
  onChange,
}: {
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [localValue, setLocalValue] = useState(value);

  const save = () => {
    onChange(localValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      save();
    }
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={clsx(
          'absolute top-0 left-0 w-full h-full bg-black text-white flex flex-col items-center justify-center gap-4',
          nyghtMedium.className
        )}
      >
        <h1 className="text-5xl font-bold translate-y-[-9px] translate-x-[1px]">Base</h1>
        <h1 className="text-5xl font-bold translate-y-[-12px] translate-x-[1px]">is for</h1>

        <div className="max-w-[80%] flex flex-col gap-2 -translate-x-[2px]">
          <input
            type="text"
            className="w-full bg-transparent text-white !text-5xl border-b-2 border-white text-center focus:outline-none hover:outline-none -mt-1 mx-auto"
            placeholder="Your Idea name"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex gap-2 font-inter mt-4">
          <button className="bg-transparent text-white px-2 py-1 rounded-md min-w-24 !font-medium" onClick={onClose}>
            Discard
          </button>
          <button className="bg-white text-black px-2 py-1 rounded-md min-w-24 !font-medium" onClick={save}>
            Save
          </button>
        </div>

        {/* <button className="absolute top-4 right-4 hover:opacity-80 transition-opacity cursor-pointer" onClick={onClose}>
          <CloseIcon color="white" className="w-6 h-6 opacity-90" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default EditIdea;
