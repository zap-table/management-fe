import { Heading } from "../ui/heading";
import { TablesGrid } from "./tables-grid";
import { TablesFilters } from "./tables-filters";
import { TableStatus } from "@/types/tables.types";

interface TablesPageProps {
  restaurantId: string;
  businessId: string;
  searchParams: {
    search?: string;
    status?: string;
  };
}

export default function TablesPage({
  restaurantId,
  businessId,
  searchParams,
}: TablesPageProps) {
  const searchQuery = searchParams.search || "";
  const statusFilter = (searchParams.status as TableStatus | "all") || "all";

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <Heading
          title="Mesas"
          description="Faça a gestão das mesas do seu restaurante"
        />

        <TablesFilters businessId={businessId} restaurantId={restaurantId} />
      </div>

      <TablesGrid 
        businessId={businessId} 
        restaurantId={restaurantId}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />
    </div>
  );
}
