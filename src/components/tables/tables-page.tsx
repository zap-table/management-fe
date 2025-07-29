import { queryTablesByBusinessAndRestaurantId } from "@/lib/http/tables";
import { Table, TableStatus } from "@/types/tables.types";
import DashboardSection from "../layout/dashboard-section";
import { Heading } from "../ui/heading";
import { TablesFilters } from "./tables-filters";
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
      <div className="flex items-center justify-between mb-8">
        <Heading title="Mesas" />

        <TablesFilters />
      </div>

      <TablesGrid
        filteredTables={filteredTables}
        businessId={businessId}
        restaurantId={restaurantId}
      />
    </DashboardSection>
  );
}
