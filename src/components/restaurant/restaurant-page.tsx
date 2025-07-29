import { RestaurantHeader } from "@/components/restaurant/restaurant-header";
import { TableGrid } from "@/components/restaurant/table-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DashboardSection from "../layout/dashboard-section";
import { Separator } from "../ui/separator";

interface RestaurantPageProps {
  params: {
    restaurantId: string;
    businessId: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  return (
    <DashboardSection>
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <RestaurantHeader restaurantId={params.restaurantId} />
      </Suspense>

      <Separator className="my-6" />

      <div className="grid gap-6">
        <h3 className="text-lg font-semibold">Mesas</h3>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <TableGrid
            businessId={params.businessId}
            restaurantId={params.restaurantId}
          />
        </Suspense>
      </div>
    </DashboardSection>
  );
}
