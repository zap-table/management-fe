'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderListProps {
  restaurantId: string;
}

export function OrderList({ restaurantId }: OrderListProps) {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}/orders`);
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {orders?.map((order) => (
            <div
              key={order.id}
              className="mb-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Mesa {order.table_id}</span>
                <Badge>
                  {order.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-muted-foreground">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                  R$ {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 