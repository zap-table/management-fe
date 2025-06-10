"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Category, Ingredient, Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProductWithRelations extends Product {
  categories: Category[];
  ingredients: Ingredient[];
}

interface MealsEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: ProductWithRelations | null;
  onSuccess?: () => void;
}

const mealSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  default_price: z.number().min(0.01, "Preço deve ser maior que 0"),
  categories: z.array(z.number()).min(1, "Selecione pelo menos uma categoria"),
  ingredients: z.array(z.number()),
});

type MealFormValues = z.infer<typeof mealSchema>;

export function MealsEditor({
  open,
  onOpenChange,
  editingProduct,
  onSuccess,
}: MealsEditorProps) {
  const queryClient = useQueryClient();
  const [ingredientSearchOpen, setIngredientSearchOpen] = useState(false);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      description: "",
      default_price: 0,
      categories: [],
      ingredients: [],
    },
  });

  // Fetch Categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Fetch Ingredients
  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const response = await fetch("/api/ingredients");
      if (!response.ok) throw new Error("Failed to fetch ingredients");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MealFormValues & { id?: number }) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/api/products/${data.id}` : "/api/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          business_id: 1, // Ajustar conforme necessário
        }),
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
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: MealFormValues) => {
    mutation.mutate({
      ...data,
      id: editingProduct?.id,
    });
  };

  const toggleCategory = (categoryId: number) => {
    const currentCategories = form.getValues("categories");
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    form.setValue("categories", newCategories);
  };

  const toggleIngredient = (ingredientId: number) => {
    const currentIngredients = form.getValues("ingredients");
    const newIngredients = currentIngredients.includes(ingredientId)
      ? currentIngredients.filter((id) => id !== ingredientId)
      : [...currentIngredients, ingredientId];

    form.setValue("ingredients", newIngredients);
  };

  const removeCategory = (categoryId: number) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((id) => id !== categoryId)
    );
  };

  const removeIngredient = (ingredientId: number) => {
    const currentIngredients = form.getValues("ingredients");
    form.setValue(
      "ingredients",
      currentIngredients.filter((id) => id !== ingredientId)
    );
  };

  // Reset form when dialog opens/closes or editing product changes
  useEffect(() => {
    if (open && editingProduct) {
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description,
        default_price: editingProduct.default_price,
        categories: editingProduct.categories.map((c) => c.id),
        ingredients: editingProduct.ingredients.map((i) => i.id),
      });
    } else if (open) {
      form.reset({
        name: "",
        description: "",
        default_price: 0,
        categories: [],
        ingredients: [],
      });
    }
  }, [open, editingProduct, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setIngredientSearchOpen(false);
      setCategorySearchOpen(false);
    }
    onOpenChange(newOpen);
  };

  const selectedCategories = form.watch("categories");
  const selectedIngredients = form.watch("ingredients");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição do produto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Digite o preço do produto"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categorias</FormLabel>
                  <FormControl>
                    <Popover
                      open={categorySearchOpen}
                      onOpenChange={setCategorySearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          Selecionar categorias
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Procurar categoria..." />
                          <CommandEmpty>
                            Nenhuma categoria encontrada.
                          </CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                onSelect={() => toggleCategory(category.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCategories.includes(category.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((id) => {
                      const category = categories.find((c) => c.id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeCategory(id)}
                        >
                          {category?.name}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              render={() => (
                <FormItem>
                  <FormLabel>Ingredientes</FormLabel>
                  <FormControl>
                    <Popover
                      open={ingredientSearchOpen}
                      onOpenChange={setIngredientSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          Selecionar ingredientes
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Procurar ingrediente..." />
                          <CommandEmpty>
                            Nenhum ingrediente encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {ingredients.map((ingredient) => (
                              <CommandItem
                                key={ingredient.id}
                                onSelect={() => toggleIngredient(ingredient.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedIngredients.includes(ingredient.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {ingredient.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIngredients.map((id) => {
                      const ingredient = ingredients.find((i) => i.id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeIngredient(id)}
                        >
                          {ingredient?.name}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "A gravar..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
