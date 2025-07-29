"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableStatus } from "@/types/tables.types";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TableDetailsModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (tableId: number, status: TableStatus) => void;
  onDeleteTable: (tableId: number) => void;
  onUpdateTable: (tableId: number, updates: Partial<Table>) => void;
}

const statusConfig = {
  available: {
    color: "bg-green-500",
    badgeClass: "bg-green-100 text-green-800",
  },
  occupied: {
    color: "bg-red-500",
    badgeClass: "bg-red-100 text-red-800",
  },
  reserved: {
    color: "bg-yellow-500",
    badgeClass: "bg-yellow-100 text-yellow-800",
  },
};

export function TableDetailsModal({
  table,
  isOpen,
  onClose,
  onStatusChange,
  onDeleteTable,
  onUpdateTable,
}: TableDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ number: table?.tableNumber || 0 });

  if (!table) return null;

  const config = statusConfig[table.status];

  const handleEdit = () => {
    setEditForm({ number: table.tableNumber });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateTable(table.id, {
      tableNumber: editForm.number,
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.color}`} />
            Table {table.tableNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2 w-full">
                <div>
                  <Label className="text-sm font-medium">Estado Atual</Label>
                  <div className="mt-1 ">
                    <Select
                      value={table.status}
                      onValueChange={(value) =>
                        onStatusChange(table.id, value as TableStatus)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Número da mesa</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.number}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          number: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {table.tableNumber}
                    </p>
                  )}
                </div>
              </div>

              <QrCodePreview table={table} />
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 min-w-[120px]"
                  >
                    Guardar alterações
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Mesa
                </Button>
              )}

              <ConfirmDeleteDialog
                table={table}
                onDeleteTable={onDeleteTable}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QrCodePreview({ table }: { table: Table }) {
  return (
    <div className="space-y-3">
      <header>
        <Label className="text-sm font-medium">QR Code</Label>
      </header>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-3">
          {table.qrCodeUrl ? (
            <Image
              src={table.qrCodeUrl}
              width={96}
              height={96}
              alt={`QR Code for table ${table.tableNumber}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">QR Code indisponível</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({
  table,
  onDeleteTable,
}: {
  table: Table;
  onDeleteTable: (tableId: number) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Apagar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar Mesa</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Tem a certeza que quer apagar a mesa {table.tableNumber}?</p>
            <b> Esta ação não pode ser desfeita.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDeleteTable(table.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Apagar Mesa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
