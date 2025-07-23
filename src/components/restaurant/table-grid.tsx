"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryTablesByBusinessAndRestaurantId } from "@/lib/http/tables";
import { Table } from "@/types/tables.types";
import { useQuery } from "@tanstack/react-query";

interface TableGridProps {
  businessId: string;
  restaurantId: string;
}

export function TableGrid({ businessId, restaurantId }: TableGridProps) {
  const { data: tables, isLoading } = useQuery<Table[]>({
    queryKey: ["restaurant-tables", restaurantId],
    queryFn: async () => {
      return await queryTablesByBusinessAndRestaurantId(
        businessId,
        restaurantId
      );
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
              Mesa {table.tableNumber}
              <Badge
                variant={
                  table.status === "available" ? "default" : "destructive"
                }
              >
                {table.status === "available" ? "Livre" : "Ocupada"}
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
