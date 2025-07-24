import RestaurantPage from "@/components/restaurant/restaurant-page";

interface RestaurantDashboardProps {
  params: Promise<{
    restaurantId: string;
    businessId: string;
  }>;
}

export default async function RestaurantDashboardPage(
  props: RestaurantDashboardProps
) {
  const params = await props.params;

  return <RestaurantPage params={params} />;
}
