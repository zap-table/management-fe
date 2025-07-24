import { Card, CardContent } from "@/components/ui/card";
import { queryTablesByBusinessAndRestaurantId } from "@/lib/http/tables";
import { Table, TableStatus } from "@/types/tables.types";
import { TablesGridClient } from "./tables-grid-client";

interface TablesGridProps {
  businessId: string;
  restaurantId: string;
  searchQuery: string;
  statusFilter: TableStatus | "all";
}

export async function TablesGrid({
  businessId,
  restaurantId,
  searchQuery,
  statusFilter,
}: TablesGridProps) {
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

  if (!filteredTables || filteredTables.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Nenhuma mesa encontrada</div>
        <p className="text-gray-400 mt-2">
          {searchQuery || statusFilter !== "all"
            ? "Tente ajustar sua pesquisa ou critérios de filtro"
            : "Por favor, adicione algumas mesas."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <TableStatsOverview tables={filteredTables} />

      <div className="mt-8">
        <TablesGridClient
          tables={filteredTables}
          businessId={businessId}
          restaurantId={restaurantId}
        />
      </div>
    </div>
  );
}

function TableStatsOverview({ tables }: { tables: Table[] }) {
  const totalTables = tables.length;
  const availableTables = tables.filter((t) => t.status === "available").length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const reservedTables = tables.filter((t) => t.status === "reserved").length;

  const stats = [
    {
      label: "Total Tables",
      value: totalTables,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      label: "Available",
      value: availableTables,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Occupied",
      value: occupiedTables,
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      label: "Reserved",
      value: reservedTables,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`${stat.bgColor} ${stat.borderColor} border shadow-sm`}
        >
          <CardContent className="">
            <div className="text-center">
              <p className={`text-2xl font-bold ${stat.color} leading-none`}>
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-600 mt-1">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
