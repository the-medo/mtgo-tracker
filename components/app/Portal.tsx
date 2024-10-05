'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface PortalProps {
  children: React.ReactNode;
  targetId: string;
}

const Portal: React.FC<PortalProps> = ({ children, targetId }) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.getElementById(targetId);
    setTargetElement(element);

    // Re-check for the element whenever the breakpoint changes
    const checkForElement = () => {
      const newElement = document.getElementById(targetId);
      setTargetElement(newElement);
    };

    checkForElement();

    window.addEventListener('resize', checkForElement);

    return () => {
      window.removeEventListener('resize', checkForElement);
    };
  }, [targetId]);

  // If there's no target element, render children normally
  if (!targetElement) {
    return <>{children}</>;
  }

  // If there is a target element, render children in the portal
  return createPortal(children, targetElement);
};

export default Portal;
