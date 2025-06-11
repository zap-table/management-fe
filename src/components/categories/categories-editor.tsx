"use client";

import {
  mutateCreateCategory,
  mutateUpdateCategory,
} from "@/actions/categories.actions";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useBusiness } from "@/providers/business-provider";
import {
  CreateCategory,
  CreateCategorySchema,
  DetailedCategory,
  UpdateCategory,
} from "@/types/categories.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CategoryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: DetailedCategory | null;
  onSuccess?: () => void;
}

export function CategoryEditor({
  open,
  onOpenChange,
  editingCategory,
  onSuccess,
}: CategoryEditorProps) {
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const form = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateCategory | UpdateCategory) => {
      if (editingCategory?.id) {
        await mutateUpdateCategory({
          businessId: Number(currentBusiness?.id),
          categoryId: editingCategory.id,
          updateCategory: data,
        });
      } else {
        await mutateCreateCategory({
          businessId: Number(currentBusiness?.id),
          createCategory: data as CreateCategory,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-categories`],
      });
      toast.success(
        editingCategory
          ? "Categoria atualizada com sucesso!"
          : "Categoria criada com sucesso!"
      );
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateCategory) => {
    mutation.mutate({
      ...data,
    });
  };

  useEffect(() => {
    if (open && editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description,
        color: editingCategory.color,
      });
    } else if (open) {
      form.reset({
        name: "",
        description: "",
        color: "",
      });
    }
  }, [open, editingCategory, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
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
                    <Input
                      placeholder="Digite o nome da categoria"
                      {...field}
                    />
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
                      placeholder="Digite a descrição da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Input
                      type="color"
                      placeholder="Cor da categoria"
                      {...field}
                    />
                  </FormControl>
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
