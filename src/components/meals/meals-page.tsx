"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Category, Ingredient, Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MealsEditor } from "./meals-editor";

interface MealWithRelations extends Product {
  categories: Category[];
  ingredients: Ingredient[];
}

export default function MealsPage() {
  const [open, setOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealWithRelations | null>(
    null
  );
  const queryClient = useQueryClient();

  // Fetch Meals with Categories
  const { data: Meals = [], isLoading: isLoadingMeals } = useQuery<
    MealWithRelations[]
  >({
    queryKey: ["Meals"],
    queryFn: async () => {
      // TODO fetch to BE
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch Meals");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete Meal");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Meals"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto");
    },
  });

  const handleEdit = (Meal: MealWithRelations) => {
    setEditingMeal(Meal);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingMeal(null);
    setOpen(true);
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
      cell: ({ row }: { row: { original: MealWithRelations } }) => {
        return new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(row.original.default_price);
      },
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }: { row: { original: MealWithRelations } }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: MealWithRelations } }) => {
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
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <Heading
          title="Refeições"
          description="Faça a gestão das refeições do seu cardápio"
        />
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Criar
        </Button>
      </div>

      <DataTable columns={columns} data={Meals} searchKey="name" />

      <MealsEditor
        open={open}
        onOpenChange={setOpen}
        editingProduct={editingMeal}
        onSuccess={handleEditorSuccess}
      />
    </div>
  );
}
