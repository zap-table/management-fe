"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Ingredient {
  id: string;
  name: string;
  description: string;
  photo?: string;
}

interface IngredientEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIngredient: Ingredient | null;
  onSuccess?: () => void;
}

const ingredientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

export function IngredientEditor({
  open,
  onOpenChange,
  editingIngredient,
  onSuccess,
}: IngredientEditorProps) {
  const queryClient = useQueryClient();

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: IngredientFormValues & { id?: string }) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/api/ingredients/${data.id}` : "/api/ingredients";

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
          errorMessage = errorJson.message || "Erro ao salvar ingrediente";
        } catch {
          errorMessage = "Erro ao salvar ingrediente";
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
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
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

  const onSubmit = (data: IngredientFormValues) => {
    mutation.mutate({
      ...data,
      id: editingIngredient?.id,
    });
  };

  // Reset form when dialog opens/closes or editing ingredient changes
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
                    <Input
                      placeholder="Digite o nome do ingrediente"
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
                      placeholder="Digite a descrição do ingrediente"
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
