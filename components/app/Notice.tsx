import { PropsWithChildren } from 'react';
import cn from 'classnames';

interface NoticeProps extends PropsWithChildren {
  variant: 'warning' | 'info' | 'success' | 'danger';
}

export default function Notice({ children, variant }: NoticeProps) {
  return (
    <div
      className={cn('border-1 flex flex-col w-full p-2 gap-2 text-sm rounded-md', {
        'bg-warning-100 border-warning-400': variant === 'warning',
        'bg-danger-100 border-danger-400': variant === 'danger',
        'bg-success-100 border-success-400': variant === 'success',
        'bg-blue-200 border-blue-500': variant === 'info',
      })}
    >
      {children}
    </div>
  );
}
