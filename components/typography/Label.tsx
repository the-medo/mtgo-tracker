interface Props {
  label: string;
}

export default function Label({ label }: Props) {
  return <span className="pl-1 text-tiny text-foreground-500">{label}</span>;
}
