"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { MealPopUp } from "@/components/meal/meal-popup";
import { Badge } from "@/components/ui/badge";
import { Category, Ingredient, Product } from "@/types";

export interface ProductWithRelations extends Product {
  categories: Category[];
  ingredients: Ingredient[];
}

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithRelations | null>(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [ingredientSearchOpen, setIngredientSearchOpen] = useState(false);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);

  // Fetch Products with Categories
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<
    ProductWithRelations[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Fetch Ingredients
  const { data: ingredients = [], isLoading: isLoadingIngredients } = useQuery<
    Ingredient[]
  >({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const response = await fetch("/api/ingredients");
      if (!response.ok) throw new Error("Failed to fetch ingredients");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      id?: number;
      name: string;
      description: string;
      default_price: number;
      business_id: number;
      categories: number[];
      ingredients: number[];
    }) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/api/products/${data.id}` : "/api/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || "Erro ao salvar produto";
        } catch {
          errorMessage = "Erro ao salvar produto";
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.text();
      try {
        return JSON.parse(responseData);
      } catch {
        throw new Error("Resposta inválida do servidor");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        editingProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );
      setOpen(false);
      setEditingProduct(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (product: ProductWithRelations) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.default_price.toString());
    setSelectedCategories(product.categories.map((c) => c.id));
    setSelectedIngredients(product.ingredients.map((i) => i.id));
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSelectedCategories([]);
    setSelectedIngredients([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      toast.error("Selecione pelo menos uma categoria");
      return;
    }

    mutation.mutate({
      id: editingProduct?.id,
      name,
      description,
      default_price: Number(price),
      business_id: 1, // Ajustar conforme necessário
      categories: selectedCategories,
      ingredients: selectedIngredients,
    });
  };

  const toggleIngredient = (ingredientId: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  useEffect(() => {
    if (open) {
      setName(editingProduct?.name || "");
      setDescription(editingProduct?.description || "");
      setPrice(editingProduct?.default_price?.toString() || "");
      setSelectedCategories(editingProduct?.categories.map((c) => c.id) || []);
      setSelectedIngredients(
        editingProduct?.ingredients.map((i) => i.id) || []
      );
    } else {
      resetForm();
      setEditingProduct(null);
    }
  }, [open, editingProduct]);

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
      cell: ({ row }: { row: { original: ProductWithRelations } }) => {
        return new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(row.original.default_price);
      },
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }: { row: { original: ProductWithRelations } }) => {
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
      cell: ({ row }: { row: { original: ProductWithRelations } }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(product.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoadingProducts || isLoadingCategories || isLoadingIngredients) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <Heading
          title="Refeições"
          description="Faça a gestão das refeições do seu cardápio"
        />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Refeição
        </Button>
      </div>

      <DataTable columns={columns} data={products} searchKey="name" />

      <MealPopUp
        categories={categories}
        categorySearchOpen={categorySearchOpen}
        description={description}
        editingProduct={editingProduct}
        handleSubmit={handleSubmit}
        ingredients={ingredients}
        ingredientSearchOpen={ingredientSearchOpen}
        mutation={mutation}
        name={name}
        open={open}
        price={price}
        selectedCategories={selectedCategories}
        selectedIngredients={selectedIngredients}
        setCategorySearchOpen={setCategorySearchOpen}
        setDescription={setDescription}
        setIngredientSearchOpen={setIngredientSearchOpen}
        setName={setName}
        setOpen={setOpen}
        setPrice={setPrice}
        setSelectedCategories={setSelectedCategories}
        toggleIngredient={toggleIngredient}
      />
    </div>
  );
}
