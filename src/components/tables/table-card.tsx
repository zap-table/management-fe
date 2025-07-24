"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, QrCode } from "lucide-react";

import { formatLastUpdated } from "@/lib/date";
import { Table, TableStatus } from "@/types/tables.types";

interface TableCardProps {
  table: Table;
  onTableClick?: (table: Table) => void;
  onStatusChange?: (tableId: number, status: TableStatus) => void;
}

const statusConfig = {
  available: {
    color: "bg-green-500",
    badgeVariant: "default" as const,
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  occupied: {
    color: "bg-red-500",
    badgeVariant: "destructive" as const,
    badgeClass: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  reserved: {
    color: "bg-yellow-500",
    badgeVariant: "secondary" as const,
    badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
};

export function TableCard({
  table,
  onTableClick,
  onStatusChange,
}: TableCardProps) {
  const config = statusConfig[table.status];

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.color}`} />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {table.tableNumber}
              </h3>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onStatusChange?.(table.id, "available")}
              >
                Set Available
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange?.(table.id, "occupied")}
              >
                Set Occupied
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange?.(table.id, "reserved")}
              >
                Set Reserved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <Badge className={config.badgeClass} variant={config.badgeVariant}>
            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </Badge>

          <p className="text-xs text-gray-500">
            Atualizado {formatLastUpdated(new Date(table.updatedAt))}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTableClick?.(table)}
            className="flex-1 h-10"
          >
            <Eye className="h-4 w-4 mr-2" />
            Detalhes
          </Button>

          {table.qrCodeUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              disabled={!table.qrCodeUrl}
              aria-label="Ver QR Code"
              asChild
            >
              <a
                href={table.qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <QrCode className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
