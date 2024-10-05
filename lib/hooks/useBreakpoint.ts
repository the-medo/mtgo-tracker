import { useEffect } from 'react';
import useStore from '@/store/store';
import { getBreakpoint } from '@/lib/breakpoints';

const useBreakpoint = () => {
  const setBreakpoint = useStore(state => state.setBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setBreakpoint]); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return;
};

export default useBreakpoint;
