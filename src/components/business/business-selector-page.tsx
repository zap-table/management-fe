"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBusiness } from "@/providers/business-provider";
import { Building2, Edit, Search, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BusinessSelectorPage() {
  const { businesses, isLoadingBusinesses } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoadingBusinesses) {
    return <>Loading businesses</>;
  }

  if (!businesses || businesses.length <= 0) {
    return <>No businesses, please consider register one</>;
  }

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Seus Négocios</CardTitle>
                <CardDescription>Faça a gestão do seu négocio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Procure pelo seu négocio"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Négocio</TableHead>
                  <TableHead>Restaurantes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.map((business) => (
                  <TableRow key={business.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3 ">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <Link href={`/business/${business.id}`}>
                          <div className="font-medium group-hover:underline">
                            {business.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {business.description}
                          </div>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">
                          {business.restaurants.length} restaurantes
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
