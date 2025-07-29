import { Table } from "@/types/tables.types";
import { TablesFilters } from "./tables-filters";
import { TablesGridClient } from "./tables-grid-client";

interface TablesGridProps {
  filteredTables: Table[];
  businessId: string;
  restaurantId: string;
}

export async function TablesGrid({
  filteredTables,
  businessId,
  restaurantId,
}: TablesGridProps) {
  if (!filteredTables || filteredTables.length === 0) {
    return (
      <div className="w-full mx-auto space-y-4">
        <TablesFilters />

        <div className="text-gray-500 text-lg text-center">
          Nenhuma mesa encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-4">
      <TablesFilters />

      <TablesGridClient
        tables={filteredTables}
        businessId={businessId}
        restaurantId={restaurantId}
      />
    </div>
  );
}
