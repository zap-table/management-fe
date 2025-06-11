"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardSection from "../layout/dashboard-section";
import { CategoryDialog } from "./categories-dialog";

interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria excluída com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria");
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setOpen(true);
  };

  const handleDialogSuccess = () => {
    setEditingCategory(null);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "order",
      header: "Ordem",
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Category } }) => {
        const category = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(category)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(category.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <div>Carregando...</div>;

  return (
    <DashboardSection>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title="Categorias"
          description="Gerencie as categorias do seu cardápio"
        />
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Pesquise pelo nome"
      />

      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        editingCategory={editingCategory}
        onSuccess={handleDialogSuccess}
      />
    </DashboardSection>
  );
}
