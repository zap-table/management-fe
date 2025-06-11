"use client";

import { mutateCreateMeal, mutateUpdateMeal } from "@/actions/meals.actions";
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
  BaseMeal,
  BaseMealSchema,
  CreateMeal,
  Meal,
  UpdateMeal,
} from "@/types/meals.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MealsEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMeal: Meal | null;
  onSuccess?: () => void;
}

export function MealsEditor({
  open,
  onOpenChange,
  editingMeal,
  onSuccess,
}: MealsEditorProps) {
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const form = useForm<BaseMeal>({
    resolver: zodResolver(BaseMealSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultPrice: "10.00",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateMeal | UpdateMeal) => {
      if (editingMeal?.id) {
        return await mutateUpdateMeal({
          mealId: editingMeal.id,
          businessId: Number(currentBusiness?.id),
          updateMeal: data,
        });
      } else {
        return await mutateCreateMeal({
          businessId: Number(currentBusiness?.id),
          createMeal: data as CreateMeal, // TODO hate this, but going to revisit this later
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-meals`],
      });
      toast.success(
        editingMeal
          ? "Refeição atualizada com sucesso!"
          : "Refeição criado com sucesso!"
      );
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateMeal | UpdateMeal) => {
    mutation.mutate({
      ...data,
    });
  };

  useEffect(() => {
    if (open && editingMeal) {
      form.reset({
        name: editingMeal.name,
        description: editingMeal.description,
        defaultPrice: editingMeal.defaultPrice,
      });
    } else if (open) {
      form.reset({
        name: "",
        description: "",
        defaultPrice: "10.00",
      });
    }
  }, [open, editingMeal, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const formatPriceInput = (value: string): string => {
    // Remove any non-digit and non-decimal characters
    const cleaned = value.replace(/[^\d.,]/g, "");

    // Replace comma with dot for decimal separator
    const normalized = cleaned.replace(",", ".");

    // Ensure only one decimal point
    const parts = normalized.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].substring(0, 2);
    }

    return normalized;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingMeal ? "Editar refeição" : "Nova refeição"}
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
                    <Input placeholder="Nome da refeição" {...field} />
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
                    <Textarea placeholder="Descrição da refeição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Preço da refeição"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatPriceInput(e.target.value);
                        field.onChange(formattedValue);
                      }}
                      onBlur={(e) => {
                        // Format to 2 decimal places on blur if it's a valid number
                        const value = e.target.value;
                        if (value && /^\d+(\.\d{1,2})?$/.test(value)) {
                          const num = parseFloat(value);
                          if (!isNaN(num)) {
                            field.onChange(num.toFixed(2));
                          }
                        }
                        field.onBlur();
                      }}
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
