"use client";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";
import { useBusiness } from "@/providers/business-provider";
import { SlashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const { currentBusiness, currentRestaurant } = useBusiness();

  const breadcrumbItems = generateBreadcrumbs({
    pathname,
    business: currentBusiness,
    restaurant: currentRestaurant,
  });

  if (breadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb className="px-4 pt-2">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href && index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
