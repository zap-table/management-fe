"use client";

import {
  mutateDeleteCategory,
  queryAllCategoryOfBusiness,
} from "@/actions/categories.actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useBusiness } from "@/providers/business-provider";
import { DetailedCategory } from "@/types/categories.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { CSSProperties, useState } from "react";
import { toast } from "sonner";
import DashboardSection from "../layout/dashboard-section";
import { Badge } from "../ui/badge";
import { CategoryEditor } from "./categories-editor";

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<DetailedCategory | null>(null);
  const queryClient = useQueryClient();

  const { currentBusiness } = useBusiness();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: [`${currentBusiness?.id}-categories`],
    queryFn: async () =>
      await queryAllCategoryOfBusiness(Number(currentBusiness?.id)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await mutateDeleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-categories`],
      });
      toast.success("Categoria excluída com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria");
    },
  });

  const handleEdit = (category: DetailedCategory) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
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
      id: "name",
      header: "Nome",
      cell: ({ row }: { row: { original: DetailedCategory } }) => {
        const style: CSSProperties = {
          ...(row.original?.color && { backgroundColor: row.original.color }),
        };

        return <Badge style={style}>{row.original.name}</Badge>;
      },
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: { row: { original: DetailedCategory } }) => {
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

      <CategoryEditor
        open={open}
        onOpenChange={setOpen}
        editingCategory={editingCategory}
        onSuccess={handleDialogSuccess}
      />
    </DashboardSection>
  );
}
