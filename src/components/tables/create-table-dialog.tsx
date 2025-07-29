"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateTableDialog() {
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTableNumber("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: parseInt(tableNumber),
          restaurant_id: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          toast.error("Já existe uma mesa com este número");
          return;
        }
        throw new Error(error.message);
      }

      const table = await response.json();
      toast.success("Mesa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar mesa:", error);
      toast.error("Erro ao criar mesa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <form onSubmit={onSubmit} className="grid gap-6 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="tableNumber">Número da Mesa</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Digite o número da mesa"
              disabled={isLoading}
              className="w-full"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !tableNumber}>
              {isLoading ? "Criando..." : "Criar Mesa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
