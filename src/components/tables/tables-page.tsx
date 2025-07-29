import { queryTablesByBusinessAndRestaurantId } from "@/lib/http/tables";
import { Table, TableStatus } from "@/types/tables.types";
import { Suspense } from "react";
import DashboardSection from "../layout/dashboard-section";
import { Heading } from "../ui/heading";
import { CreateTableDialog } from "./create-table-dialog";
import { TablesGrid } from "./tables-grid";

interface TablesPageProps {
  restaurantId: string;
  businessId: string;
  searchParams: {
    search?: string;
    status?: string;
  };
}

export default async function TablesPage({
  restaurantId,
  businessId,
  searchParams,
}: TablesPageProps) {
  const searchQuery = searchParams.search || "";
  const statusFilter = (searchParams.status as TableStatus | "all") || "all";

  let tables: Table[] = [];
  let error: string | null = null;

  try {
    tables = await queryTablesByBusinessAndRestaurantId(
      businessId,
      restaurantId
    );
  } catch (e) {
    error = (e as Error).message;
  }

  if (error) {
    return <div>Erro ao carregar mesas: {error}</div>;
  }

  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.tableNumber
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardSection>
      <Suspense fallback={<TablesGridFallback />}>
        <div className="flex items-center justify-between">
          <Heading title="Mesas" />
          <CreateTableDialog restaurantId={parseInt(restaurantId)} />
        </div>

        <TablesGrid
          filteredTables={filteredTables}
          businessId={businessId}
          restaurantId={restaurantId}
        />
      </Suspense>
    </DashboardSection>
  );
}

function TablesGridFallback() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
