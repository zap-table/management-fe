'use client';

import { useState } from 'react';
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Menu, Category, Product } from '@/types';

interface MenuWithRelations extends Menu {
  categories: (Category & {
    products: Product[];
  })[];
}

interface ProductWithRelations extends Product {
  categories: Category[];
}

export default function MenusPage() {
  const [open, setOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuWithRelations | null>(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<number, number[]>>({});
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);

  // Fetch Menus
  const { data: menus = [], isLoading: isLoadingMenus } = useQuery<MenuWithRelations[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const response = await fetch('/api/menus');
      if (!response.ok) throw new Error('Failed to fetch menus');
      return response.json();
    },
  });

  // Fetch Categories with Products
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<ProductWithRelations[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      id?: number;
      name: string;
      description: string;
      business_id: number;
      categories: {
        category_id: number;
        products: number[];
      }[];
    }) => {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/menus/${data.id}` : '/api/menus';
      
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
          errorMessage = errorJson.message || 'Erro ao salvar menu';
        } catch {
          errorMessage = 'Erro ao salvar menu';
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
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      toast.success(editingMenu ? 'Menu atualizado com sucesso!' : 'Menu criado com sucesso!');
      setOpen(false);
      setEditingMenu(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedCategories([]);
    setCategoryProducts({});
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

    // Limpar produtos selecionados se a categoria for removida
    if (categoryProducts[categoryId]) {
      const newCategoryProducts = { ...categoryProducts };
      delete newCategoryProducts[categoryId];
      setCategoryProducts(newCategoryProducts);
    }
  };

  const toggleProduct = (categoryId: number, productId: number) => {
    setCategoryProducts((prev) => {
      const currentProducts = prev[categoryId] || [];
      const newProducts = currentProducts.includes(productId)
        ? currentProducts.filter((id) => id !== productId)
        : [...currentProducts, productId];
      
      return {
        ...prev,
        [categoryId]: newProducts,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0) {
      toast.error('Selecione pelo menos uma categoria');
      return;
    }

    const categoriesWithProducts = selectedCategories.map(categoryId => ({
      category_id: categoryId,
      products: categoryProducts[categoryId] || [],
    }));

    mutation.mutate({
      id: editingMenu?.id,
      name,
      description,
      business_id: 1, // Ajustar conforme necessário
      categories: categoriesWithProducts,
    });
  };

  const handleEdit = (menu: MenuWithRelations) => {
    setEditingMenu(menu);
    setName(menu.name);
    setDescription(menu.description);
    setSelectedCategories(menu.categories.map(c => c.id));
    setCategoryProducts(
      menu.categories.reduce((acc, category) => ({
        ...acc,
        [category.id]: category.products.map(p => p.id)
      }), {})
    );
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este menu?')) return;

    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete menu');

      queryClient.invalidateQueries({ queryKey: ['menus'] });
      toast.success('Menu excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir menu:', error);
      toast.error('Erro ao excluir menu');
    }
  };

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
      accessorKey: 'categories',
      header: 'Categorias',
      cell: ({ row }: { row: { original: MenuWithRelations } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.categories.map(category => (
            <Badge key={category.id} variant="secondary">
              {category.name} ({category.products.length})
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: MenuWithRelations } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoadingMenus || isLoadingCategories || isLoadingProducts) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <Heading title="Menus" description="Gerencie os menus do seu cardápio" />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Menu
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={menus}
        searchKey="name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMenu ? 'Editar Menu' : 'Novo Menu'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do menu"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do menu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categorias e Produtos</Label>
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

              {/* Lista de categorias selecionadas e seus produtos */}
              <div className="mt-4 space-y-4">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId);
                  if (!category) return null;

                  return (
                    <div key={categoryId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(categoryId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {products
                          .filter(product => product.categories.some(c => c.id === categoryId))
                          .map(product => (
                            <button
                              key={product.id}
                              type="button"
                              className={cn(
                                "flex items-center gap-2 p-2 rounded border cursor-pointer w-full text-left",
                                categoryProducts[categoryId]?.includes(product.id)
                                  ? "bg-primary/10 border-primary"
                                  : "hover:bg-muted"
                              )}
                              onClick={() => toggleProduct(categoryId, product.id)}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  categoryProducts[categoryId]?.includes(product.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span>{product.name}</span>
                            </button>
                          ))}
                      </div>
                    </div>
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