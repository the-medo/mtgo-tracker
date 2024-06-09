interface Props {
  date?: Date | string | null;
}

export default function DateDisplay({ date }: Props) {
  const dateText = date
    ? (typeof date === 'string' ? new Date(date) : date).toISOString().slice(0, 10)
    : ' - ';

  return <span className="text-xs text-foreground-700">{dateText}</span>;
}
