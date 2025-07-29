"use client";

import {
  mutateDeleteIngredient,
  queryAllIngredientsOfBusiness,
} from "@/actions/ingredients.actions";
import DashboardSection from "@/components/layout/dashboard-section";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useBusiness } from "@/providers/business-provider";
import { DetailedIngredient } from "@/types/ingredients.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { IngredientEditor } from "./ingredients-editor";

export default function Ingredients() {
  const [open, setOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState<DetailedIngredient | null>(null);
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: [`${currentBusiness?.id}-ingredients`],
    queryFn: async () =>
      await queryAllIngredientsOfBusiness(Number(currentBusiness?.id)),
    enabled: !!currentBusiness,
  });

  const deleteMutation = useMutation({
    mutationFn: mutateDeleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-ingredients`],
      });
      toast.success("Ingrediente excluído com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir ingrediente:", error);
      toast.error("Erro ao excluir ingrediente");
    },
  });

  const handleEdit = (ingredient: DetailedIngredient) => {
    setEditingIngredient(ingredient);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este ingrediente?")) return;
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingIngredient(null);
    setOpen(true);
  };

  const handleDialogSuccess = () => {
    setEditingIngredient(null);
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
      id: "actions",
      cell: ({ row }: { row: { original: DetailedIngredient } }) => {
        const ingredient = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(ingredient)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(ingredient.id)}
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
        <Heading title="Ingredientes" />
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Ingrediente
        </Button>
      </div>

      <DataTable columns={columns} data={ingredients} searchKey="name" />

      <IngredientEditor
        open={open}
        onOpenChange={setOpen}
        editingIngredient={editingIngredient}
        onSuccess={handleDialogSuccess}
      />
    </DashboardSection>
  );
}
