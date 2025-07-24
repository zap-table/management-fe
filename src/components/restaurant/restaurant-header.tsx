"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { queryRestaurantById } from "@/lib/http/restaurants";
import { Restaurant } from "@/types/restaurants.types";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone } from "lucide-react";

interface RestaurantHeaderProps {
  restaurantId: string;
}

export function RestaurantHeader({ restaurantId }: RestaurantHeaderProps) {
  const { data: restaurant, isLoading } = useQuery<Restaurant>({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      return await queryRestaurantById(restaurantId);
    },
  });

  if (isLoading) {
    // TODO implement a skeleton loader
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title={restaurant?.name || "Restaurante"}
          description="Gestão do estabelecimento"
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {restaurant?.address || "Endereço não disponível"}{" "}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {restaurant?.phoneNumber || "Número de telefone não disponível"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
