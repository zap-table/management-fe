"use client";

import {
  mutateDeleteMeal,
  queryMealsByBusiness,
} from "@/actions/meals.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useBusiness } from "@/providers/business-provider";
import { Meal } from "@/types/meals.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardSection from "../layout/dashboard-section";
import { Heading } from "../ui/heading";
import { MealsEditor } from "./meals-editor";

export default function MealsPage() {
  const [open, setOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const queryClient = useQueryClient();

  const { currentBusiness } = useBusiness();

  const { data: meals = [], isLoading: isLoadingMeals } = useQuery<Meal[]>({
    queryKey: [`${currentBusiness?.id}-meals`],
    enabled: !!currentBusiness,
    queryFn: async () =>
      await queryMealsByBusiness(Number(currentBusiness?.id)),
  });

  const deleteMutation = useMutation({
    mutationFn: mutateDeleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-meals`],
      });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto");
    },
  });

  function handleAddNew(): void {
    setEditingMeal(null);
    setOpen(true);
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    deleteMutation.mutate(id);
  };

  const handleEditorSuccess = () => {
    setEditingMeal(null);
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
      accessorKey: "default_price",
      header: "Preço",
      cell: ({ row }: { row: { original: Meal } }) => {
        return new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(Number(row.original.defaultPrice));
      },
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      // TODO implement categories here
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: ({ row }: { row: { original: Meal } }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {/*row.original.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))*/}

            <Badge variant="secondary">TODO</Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Meal } }) => {
        const Meal = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(Meal)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(Meal.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoadingMeals) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardSection>
      <div className="flex items-center justify-between">
        <Heading title="Refeições" />
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Refeição
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={meals}
        searchKey="name"
        searchPlaceholder="Pesquise pelo nome"
      />

      <MealsEditor
        open={open}
        onOpenChange={setOpen}
        editingMeal={editingMeal}
        onSuccess={handleEditorSuccess}
      />
    </DashboardSection>
  );
}
