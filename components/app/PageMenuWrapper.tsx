'use client';

import useStore from '@/store/store';

interface PageMenuWrapperProps {
  children: React.ReactNode;
}

const PageMenuWrapper: React.FC<PageMenuWrapperProps> = ({ children }) => {
  const breakpoint = useStore(state => state.breakpoint);

  // If there's no target element, render children normally
  if (breakpoint === 'xs') {
    return (
      <div className="p-4 w-full w-max-[250px] flex flex-col gap-4 overflow-y-auto">{children}</div>
    );
  }

  // If there is a target element, render children in the portal
  return (
    <div className="p-4 min-w-[250px] w-[250px] border-r-1 flex flex-col gap-4 overflow-y-auto">
      {children}
    </div>
  );
};

export default PageMenuWrapper;
