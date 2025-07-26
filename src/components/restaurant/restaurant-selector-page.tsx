"use client";

import { useBusiness } from "@/providers/business-provider";
import { Restaurant } from "@/types/restaurants.types";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import DashboardSection from "../layout/dashboard-section";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Heading } from "../ui/heading";

export default function RestaurantSelectorPage() {
  const { currentBusiness } = useBusiness();

  if (!currentBusiness) {
    return <>No business selected !</>;
  }

  const { restaurants } = currentBusiness;

  const columns = [
    {
      id: "name",
      cell: ({ row }: { row: { original: Restaurant } }) => {
        const { original: restaurant } = row;
        return (
          <Link
            href={`/business/${currentBusiness.id}/restaurant/${restaurant.id}`}
          >
            <div className="font-medium group-hover:underline">
              {restaurant.name}
            </div>
          </Link>
        );
      },
    },
    {
      id: "actions",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: ({ row }: { row: { original: Restaurant } }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardSection>
      <div className="flex items-center justify-between mb-8">
        <Heading
          title="Restaurantes"
          description="Faça a gestão dos seus restaurantes"
        />
      </div>

      <DataTable
        columns={columns}
        data={restaurants}
        searchKey="name"
        searchPlaceholder="Pesquise pelo nome"
      />
    </DashboardSection>
  );
}
