'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
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

interface Ingredient {
  id: string;
  name: string;
  description: string;
  photo?: string;
}

export default function IngredientsPage() {
  const [open, setOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const response = await fetch('/api/ingredients');
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { id?: string; name: string; description: string }) => {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/ingredients/${data.id}` : '/api/ingredients';
      
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
          errorMessage = errorJson.message || 'Erro ao salvar ingrediente';
        } catch {
          errorMessage = 'Erro ao salvar ingrediente';
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
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success(
        editingIngredient 
          ? 'Ingrediente atualizado com sucesso!' 
          : 'Ingrediente criado com sucesso!'
      );
      setOpen(false);
      setEditingIngredient(null);
      setName('');
      setDescription('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setName(ingredient.name);
    setDescription(ingredient.description);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ingrediente?')) return;

    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ingredient');

      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast.success('Ingrediente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir ingrediente:', error);
      toast.error('Erro ao excluir ingrediente');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    mutation.mutate({
      id: editingIngredient?.id,
      name,
      description,
    });
  };

  useEffect(() => {
    if (open) {
      setName(editingIngredient?.name || '');
      setDescription(editingIngredient?.description || '');
    } else {
      setName('');
      setDescription('');
      setEditingIngredient(null);
    }
  }, [open, editingIngredient]);

  if (isLoading) return <div>Carregando...</div>;

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
      id: 'actions',
      cell: ({ row }: { row: { original: Ingredient } }) => {
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
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <Heading title="Ingredientes" description="Gerencie os ingredientes do seu cardápio" />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Ingrediente
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={ingredients}
        searchKey="name"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIngredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do ingrediente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do ingrediente"
                required
              />
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