"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mutateCreateTable } from "@/lib/http/tables";
import { translateTableStatus } from "@/lib/i18n";
import { useBusiness } from "@/providers/business-provider";
import {
  CreateTableRequest,
  CreateTableRequestSchema,
  TableStatus,
} from "@/types/tables.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

interface CreateTableDialogProps {
  restaurantId: number;
}

const availableStatuses: TableStatus[] = ["available", "occupied", "reserved"];

export function CreateTableDialog({ restaurantId }: CreateTableDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const form = useForm<CreateTableRequest>({
    resolver: zodResolver(CreateTableRequestSchema),
    defaultValues: {
      tableNumber: 1,
      active: true,
      restaurantId,
      status: "available",
    },
  });

  const mutation = useMutation({
    mutationFn: mutateCreateTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-${restaurantId}-tables`],
      });
      toast.success("Mesa criada com sucesso!");
      resetForm();
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error("Erro ao criar mesa:", error);

      if (
        error.message.includes("409") ||
        error.message.includes("already exists")
      ) {
        toast.error("Já existe uma mesa com este número");
      } else {
        toast.error("Erro ao criar mesa. Tente novamente.");
      }
    },
  });

  const resetForm = () => {
    form.reset();
  };

  function onSubmit(createTable: CreateTableRequest) {
    mutation.mutate({
      restaurantId,
      createTable,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Mesa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Mesa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {translateTableStatus(field.value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue="available">
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {translateTableStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormLabel>Ativo</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 ">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
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
