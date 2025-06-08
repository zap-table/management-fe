"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { ProductWithRelations } from "@/app/(management)/meals/page";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Category, Ingredient } from "@/types";
import { UseMutationResult } from "@tanstack/react-query";

interface MealPopUpProps {
  categories: Category[];
  categorySearchOpen: boolean;
  description: string;
  editingProduct: ProductWithRelations | null;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  ingredients: Ingredient[];
  ingredientSearchOpen: boolean;
  mutation: UseMutationResult<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    {
      id?: number | undefined;
      name: string;
      description: string;
      default_price: number;
      business_id: number;
      categories: number[];
      ingredients: number[];
    },
    unknown
  >;
  name: string;
  open: boolean;
  price: string;
  selectedCategories: number[];
  selectedIngredients: number[];
  setCategorySearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setIngredientSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
  toggleIngredient: (ingredientId: number) => void;
}

export function MealPopUp({
  categories,
  categorySearchOpen,
  description,
  editingProduct,
  handleSubmit,
  ingredients,
  ingredientSearchOpen,
  mutation,
  name,
  open,
  price,
  selectedCategories,
  selectedIngredients,
  setCategorySearchOpen,
  setDescription,
  setIngredientSearchOpen,
  setName,
  setOpen,
  setPrice,
  setSelectedCategories,
  toggleIngredient,
}: MealPopUpProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Digite o preço do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categorias</Label>
            <Popover
              open={categorySearchOpen}
              onOpenChange={setCategorySearchOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Selecionar categorias
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Procurar categoria..." />
                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(category.id)
                              ? prev.filter((id) => id !== category.id)
                              : [...prev, category.id]
                          );
                        }}
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
          </div>

          <div className="space-y-2">
            <Label>Ingredientes</Label>
            <Popover
              open={ingredientSearchOpen}
              onOpenChange={setIngredientSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-expanded={ingredientSearchOpen}
                  className="w-full justify-between"
                >
                  Selecionar ingredientes
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Procurar ingrediente..." />
                  <CommandEmpty>Nenhum ingrediente encontrado.</CommandEmpty>
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

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((id) => {
                const category = categories.find((c) => c.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.filter((prevId) => prevId !== id)
                      );
                    }}
                  >
                    {category?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "A gravar..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
