"use client";

import { fetchAllMenus, mutateDeleteMenu } from "@/actions/menus.actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { useBusiness } from "@/providers/business-provider";
import { MenuItem } from "@/types/menus-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardSection from "../layout/dashboard-section";
import { MenusEditor } from "./menus-editor";

export default function MenusPage() {
  const [open, setOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const queryClient = useQueryClient();
  const { currentBusiness } = useBusiness();

  const { data: menus = [], isLoading: isLoadingMenus } = useQuery<MenuItem[]>({
    queryKey: [`${currentBusiness?.id}-menus`],
    queryFn: fetchAllMenus,
  });

  const deleteMutation = useMutation({
    mutationFn: mutateDeleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentBusiness?.id}-menus`],
      });
      toast.success("Menu excluído com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir menu:", error);
      toast.error("Erro ao excluir menu");
    },
  });

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este menu?")) return;
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingMenu(null);
    setOpen(true);
  };

  const handleEditorSuccess = () => {
    setEditingMenu(null);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: MenuItem } }) => (
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
            disabled={deleteMutation.isPending}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoadingMenus) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardSection>
      <div className="flex items-center justify-between mb-8">
        <Heading
          title="Menus"
          description="Gerencie os menus do seu cardápio"
        />
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Menu
        </Button>
      </div>

      <DataTable columns={columns} data={menus} searchKey="name" />

      <MenusEditor
        open={open}
        onOpenChange={setOpen}
        editingMenu={editingMenu}
        onSuccess={handleEditorSuccess}
      />
    </DashboardSection>
  );
}
