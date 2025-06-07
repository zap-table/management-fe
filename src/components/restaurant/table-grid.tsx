'use client';

import { Table } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TableGridProps {
  restaurantId: string;
}

export function TableGrid({ restaurantId }: TableGridProps) {
  const { data: tables, isLoading } = useQuery<Table[]>({
    queryKey: ['restaurant-tables', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}/tables`);
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tables?.map((table) => (
        <Card key={table.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Mesa {table.table_number}
              <Badge variant={table.status === 'open' ? 'success' : 'destructive'}>
                {table.status === 'open' ? 'Livre' : 'Ocupada'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Status: {table.status}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 