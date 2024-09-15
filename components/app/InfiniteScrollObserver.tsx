import React, { useEffect, useRef } from 'react';

interface InfiniteScrollObserverProps {
  runOnObserve: () => void;
}

const InfiniteScrollObserver: React.FC<InfiniteScrollObserverProps> = ({ runOnObserve }) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const currentObserverTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          runOnObserve();
        }
      },
      { threshold: 1 },
    );

    if (currentObserverTarget) observer.observe(currentObserverTarget);

    return () => {
      if (currentObserverTarget) observer.unobserve(currentObserverTarget);
    };
  }, [observerTarget, runOnObserve]);

  return (
    <div className="border-t-2 border-zinc-300" ref={observerTarget}>
      &nbsp;
    </div>
  );
};

export default InfiniteScrollObserver;
