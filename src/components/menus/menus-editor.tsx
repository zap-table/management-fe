"use client";

import {
  mutateCreateRestaurantMenu,
  mutateUpdateRestaurantMenu,
} from "@/actions/menus-actions";
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
  BaseRestaurantMenu,
  BaseRestaurantMenuSchema,
  CreateRestaurantMenu,
  MenuItem,
  UpdateRestaurantMenu,
} from "@/types/menus-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

interface MenusEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMenu: MenuItem | null;
  onSuccess?: () => void;
}

export function MenusEditor({
  open,
  onOpenChange,
  editingMenu,
  onSuccess,
}: MenusEditorProps) {
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const form = useForm<BaseRestaurantMenu>({
    resolver: zodResolver(BaseRestaurantMenuSchema),
    defaultValues: {
      name: "",
      description: "",
      active: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateRestaurantMenu | UpdateRestaurantMenu) => {
      if ("id" in data) {
        return await mutateUpdateRestaurantMenu({
          // TODO pass business id to string with uuid7
          businessId: Number(currentBusiness?.id),
          updatedRestaurant: data,
        });
      } else {
        return await mutateCreateRestaurantMenu({
          // TODO pass business id to string with uuid7
          businessId: Number(currentBusiness?.id),
          createdRestaurantMenu: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-menus`],
      });
      toast.success(
        editingMenu
          ? "Menu atualizado com sucesso!"
          : "Menu criado com sucesso!"
      );
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: BaseRestaurantMenu) => {
    mutation.mutate({
      ...data,
      ...(editingMenu && { id: editingMenu.id }),
    });
  };

  // Reset form when dialog opens/closes or editing menu changes
  useEffect(() => {
    if (open && editingMenu) {
      form.reset({
        name: editingMenu.name,
        description: editingMenu.description,
        active: editingMenu.active,
      });
    } else if (open) {
      form.reset({
        name: "",
        description: "",
        active: false,
      });
    }
  }, [open, editingMenu, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl"
        aria-describedby={editingMenu ? "Editar Menu" : "Adicionar Menu"}
      >
        <DialogHeader>
          <DialogTitle>
            {editingMenu ? "Editar Menu" : "Adicionar Menu"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do menu" {...field} />
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
                    <Textarea placeholder="Descrição do menu" {...field} />
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
