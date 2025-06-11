"use client";

import {
  mutateCreateIngredient,
  mutateUpdateIngredient,
} from "@/actions/ingredients.actions";
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
  CreateIngredient,
  CreateIngredientSchema,
  DetailedIngredient,
  UpdateIngredient,
} from "@/types/ingredients.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IngredientEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIngredient: DetailedIngredient | null;
  onSuccess?: () => void;
}

export function IngredientEditor({
  open,
  onOpenChange,
  editingIngredient,
  onSuccess,
}: IngredientEditorProps) {
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const form = useForm<CreateIngredient>({
    resolver: zodResolver(CreateIngredientSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateIngredient | UpdateIngredient) => {
      if (editingIngredient?.id) {
        await mutateUpdateIngredient({
          businessId: Number(currentBusiness?.id),
          ingredientId: editingIngredient.id,
          updateIngredient: data,
        });
      } else {
        await mutateCreateIngredient({
          businessId: Number(currentBusiness?.id),
          createIngredient: data as CreateIngredient,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-ingredients`],
      });
      toast.success(
        editingIngredient
          ? "Ingrediente atualizado com sucesso!"
          : "Ingrediente criado com sucesso!"
      );
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateIngredient) => {
    mutation.mutate({
      ...data,
    });
  };

  useEffect(() => {
    if (open && editingIngredient) {
      form.reset({
        name: editingIngredient.name,
        description: editingIngredient.description,
      });
    } else if (open) {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [open, editingIngredient, form]);

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
            {editingIngredient ? "Editar Ingrediente" : "Novo Ingrediente"}
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
                    <Input placeholder="Nome do ingrediente" {...field} />
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
                      placeholder="Descrição do ingrediente"
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
