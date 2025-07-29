"use client";

import { TableStatus } from "@/types/tables.types";
import { Filter, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DEBOUNCE_DELAY = 300; // 300ms debounce delay

export function TablesFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const statusFilter =
    (searchParams.get("status") as TableStatus | "all") || "all";

  // Debounced search handler following Next.js best practices
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, DEBOUNCE_DELAY);

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Procurar mesas..."
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-40">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Total</SelectItem>
          <SelectItem value="available">Disponíveis</SelectItem>
          <SelectItem value="occupied">Ocupadas</SelectItem>
          <SelectItem value="reserved">Reservadas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
