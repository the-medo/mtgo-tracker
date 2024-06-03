import { CircularProgress } from '@nextui-org/progress';

export default function FieldCircularProgress() {
  return (
    <CircularProgress
      classNames={{
        svg: 'h-4 w-4',
      }}
      color="default"
      aria-label="Loading..."
    />
  );
}
