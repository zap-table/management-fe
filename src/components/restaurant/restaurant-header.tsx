'use client';

import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/types';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  MapPin, 
  Users 
} from 'lucide-react';

interface RestaurantHeaderProps {
  restaurantId: string;
}

export function RestaurantHeader({ restaurantId }: RestaurantHeaderProps) {
  const { data: restaurant, isLoading } = useQuery<Restaurant>({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title={restaurant?.name || 'Restaurante'}
          description="Gestão do estabelecimento"
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">{restaurant?.address}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">{restaurant?.phone_number}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm">Staff: {restaurant?.staff?.length || 0}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 