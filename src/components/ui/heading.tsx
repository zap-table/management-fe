interface HeadingProps {
  title: string;
}

export function Heading({ title }: HeadingProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
