import { useEffect, useState } from 'react';

/**
 * A hook that detects if the current device is a phone based on screen width
 * @param breakpoint The maximum width in pixels to consider a device as a phone (default: 768)
 * @returns A boolean indicating whether the current device is a phone
 */
const useIsPhone = (breakpoint = 768): boolean => {
  const [isPhone, setIsPhone] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value
    const checkIfPhone = () => {
      setIsPhone(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIfPhone();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfPhone);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', checkIfPhone);
    };
  }, [breakpoint]);

  return isPhone;
};

export default useIsPhone;
