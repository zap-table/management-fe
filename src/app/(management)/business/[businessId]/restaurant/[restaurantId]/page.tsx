import RestaurantPage from "@/components/restaurant/restaurant-page";

interface RestaurantDashboardProps {
  params: {
    restaurantId: string;
  };
}

export default function RestaurantDashboardPage({
  params,
}: RestaurantDashboardProps) {
  return <RestaurantPage params={params} />;
}
