import { OrderList } from "@/components/restaurant/order-list";
import { RestaurantHeader } from "@/components/restaurant/restaurant-header";
import { TableGrid } from "@/components/restaurant/table-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface RestaurantPageProps {
  params: {
    restaurantId: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <RestaurantHeader restaurantId={params.restaurantId} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <TableGrid restaurantId={params.restaurantId} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <OrderList restaurantId={params.restaurantId} />
        </Suspense>
      </div>
    </div>
  );
}
