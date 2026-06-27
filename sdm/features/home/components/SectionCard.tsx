import { Card, CardHeader } from "@/components/ui";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} action={action} />
      {children}
    </Card>
  );
}
