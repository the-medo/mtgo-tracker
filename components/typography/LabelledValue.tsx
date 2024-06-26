import { ReactNode } from 'react';

interface LabelledValueProps {
  label: string | ReactNode;
  value: ReactNode;
  direction?: 'vertical' | 'horizontal';
  onClick?: () => void;
}

export default function LabelledValue({
  label,
  value,
  direction = 'horizontal',
  onClick,
}: LabelledValueProps) {
  const horizontalClasses = `flex flex-row items-center w-full gap-2 justify-between `;
  const verticalClasses = `flex flex-col w-full gap-2 `;

  return (
    <div
      className={direction === 'horizontal' ? horizontalClasses : verticalClasses}
      onClick={onClick}
    >
      {typeof label === 'string' ? (
        <span className="pl-1 text-tiny text-foreground-500">{label}</span>
      ) : (
        label
      )}
      {value}
    </div>
  );
}
