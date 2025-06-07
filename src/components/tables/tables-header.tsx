import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

interface TablesHeaderProps {
  businessId: string;
}

export function TablesHeader({ businessId }: TablesHeaderProps) {
  return (
    <div className="space-y-4">
      <Heading
        title="Mesas"
        description="Gerencie as mesas do seu restaurante"
      />
      <Separator />
    </div>
  );
} 