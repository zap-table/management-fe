"use client";

import {
  mutateChangeTableStatus,
  mutateDeleteTable,
  mutateUpdateTableInformation,
} from "@/lib/http/tables";
import { Table, TableStatus, UpdateTableRequest } from "@/types/tables.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { TableCard } from "./table-card";
import { TableDetailsModal } from "./table-details-dialog";

interface TablesGridClientProps {
  tables: Table[];
  businessId: string;
  restaurantId: string;
}

export function TablesGridClient({
  tables,
  businessId,
  restaurantId,
}: TablesGridClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTableId = searchParams.get("tableId");
  const selectedTable = selectedTableId
    ? tables.find((table) => table.id === Number(selectedTableId)) || null
    : null;

  const handleTableClick = useCallback(
    (table: Table) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tableId", table.id.toString());
      router.push(
        `/business/${businessId}/restaurant/${restaurantId}/tables?${params.toString()}`
      );
    },
    [searchParams, router, businessId, restaurantId]
  );

  const handleCloseDialog = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tableId");
    const queryString = params.toString();
    router.push(
      `/business/${businessId}/restaurant/${restaurantId}/tables${
        queryString ? `?${queryString}` : ""
      }`
    );
  }, [searchParams, router, businessId, restaurantId]);

  const updateTableStatusMutation = useMutation({
    mutationFn: async (data: { tableId: number; status: TableStatus }) => {
      await mutateChangeTableStatus(data.tableId, { newStatus: data.status });
    },
    onSuccess: () => {
      toast.success("Status da mesa atualizada com sucesso");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Erro ao atualizar status da mesa");
    },
  });

  const handleStatusChange = useCallback(
    async (tableId: number, status: TableStatus) => {
      await updateTableStatusMutation.mutateAsync({ tableId, status });
    },
    [updateTableStatusMutation]
  );

  const deleteTableMutation = useMutation({
    mutationFn: async (tableId: number) => {
      await mutateDeleteTable(tableId);
    },
    onSuccess: () => {
      toast.success("Mesa apagada com sucesso");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Erro ao apagar mesa");
    },
  });

  const handleDeleteTable = useCallback(
    async (tableId: number) => {
      await deleteTableMutation.mutateAsync(tableId);
    },
    [deleteTableMutation]
  );

  const updateTableMutation = useMutation({
    mutationFn: async (data: {
      tableId: number;
      updatedTable: UpdateTableRequest;
    }) => {
      await mutateUpdateTableInformation(data.tableId, data.updatedTable);
    },
    onSuccess: () => {
      toast.success("Informações da mesa atualizadas com sucesso");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Erro ao atualizar informações da mesa");
    },
  });

  const handleUpdateTable = useCallback(
    async (tableId: number, updates: UpdateTableRequest) => {
      await updateTableMutation.mutateAsync({ tableId, updatedTable: updates });
    },
    [updateTableMutation]
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onTableClick={handleTableClick}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      <TableDetailsModal
        table={selectedTable}
        isOpen={!!selectedTableId}
        onClose={handleCloseDialog}
        onStatusChange={handleStatusChange}
        onDeleteTable={handleDeleteTable}
        onUpdateTable={handleUpdateTable}
      />
    </>
  );
}
