import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/types/tables.types";
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
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Nenhuma mesa encontrada</div>
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
      label: "Total",
      value: totalTables,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      label: "Disponíveis",
      value: availableTables,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Ocupadas",
      value: occupiedTables,
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      label: "Reservadas",
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
