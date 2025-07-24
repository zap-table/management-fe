"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TableStatus } from "@/types/tables.types";

interface TablesFiltersProps {
  businessId: string;
  restaurantId: string;
}

export function TablesFilters({ businessId, restaurantId }: TablesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const statusFilter = (searchParams.get("status") as TableStatus | "all") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Debounce search input
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const queryString = createQueryString("search", searchInput);
      router.push(`/business/${businessId}/restaurant/${restaurantId}/tables?${queryString}`);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchInput, createQueryString, router, businessId, restaurantId]);

  const handleStatusChange = (value: string) => {
    const queryString = createQueryString("status", value === "all" ? "" : value);
    router.push(`/business/${businessId}/restaurant/${restaurantId}/tables?${queryString}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tables..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 w-full sm:w-64"
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-40">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tables</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="occupied">Occupied</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
