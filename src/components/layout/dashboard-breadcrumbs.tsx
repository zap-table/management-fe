"use client";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";
import { useBusiness } from "@/providers/business-provider";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
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

  // TODO Continue from here !

  return (
    <Breadcrumb className="px-4 pt-2 gap-1">
      <BreadcrumbList className="gap-1">
        {breadcrumbItems.map((item, index) => (
          <Fragment key={index}>
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
                <ChevronRight className="w-4 h-4  text-slate-400" />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
