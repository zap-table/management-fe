'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Check, ChevronsUpDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product, Category, Ingredient } from '@/types';

interface ProductWithRelations extends Product {
  categories: Category[];
  ingredients: Ingredient[];
}

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [ingredientSearchOpen, setIngredientSearchOpen] = useState(false);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);

  // Fetch Products with Categories
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<ProductWithRelations[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Fetch Ingredients
  const { data: ingredients = [], isLoading: isLoadingIngredients } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const response = await fetch('/api/ingredients');
      if (!response.ok) throw new Error('Failed to fetch ingredients');
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
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/products/${data.id}` : '/api/products';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || 'Erro ao salvar produto';
        } catch {
          errorMessage = 'Erro ao salvar produto';
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.text();
      try {
        return JSON.parse(responseData);
      } catch {
        throw new Error('Resposta inválida do servidor');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        editingProduct 
          ? 'Produto atualizado com sucesso!' 
          : 'Produto criado com sucesso!'
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
    setSelectedCategories(product.categories.map(c => c.id));
    setSelectedIngredients(product.ingredients.map(i => i.id));
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setSelectedCategories([]);
    setSelectedIngredients([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0) {
      toast.error('Selecione pelo menos uma categoria');
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
      setName(editingProduct?.name || '');
      setDescription(editingProduct?.description || '');
      setPrice(editingProduct?.default_price?.toString() || '');
      setSelectedCategories(editingProduct?.categories.map(c => c.id) || []);
      setSelectedIngredients(editingProduct?.ingredients.map(i => i.id) || []);
    } else {
      resetForm();
      setEditingProduct(null);
    }
  }, [open, editingProduct]);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'default_price',
      header: 'Preço',
      cell: ({ row }: { row: { original: ProductWithRelations } }) => {
        return new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR'
        }).format(row.original.default_price);
      }
    },
    {
      accessorKey: 'categories',
      header: 'Categorias',
      cell: ({ row }: { row: { original: ProductWithRelations } }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.categories.map(category => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      id: 'actions',
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <Heading title="Produtos" description="Gerencie os produtos do seu cardápio" />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
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
              <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
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
              <Popover open={ingredientSearchOpen} onOpenChange={setIngredientSearchOpen}>
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
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'A gravar...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 