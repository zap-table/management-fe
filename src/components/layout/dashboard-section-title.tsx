"use client";

import { getPageConfig } from "@/lib/breadcrumbs";
import { usePathname } from "next/navigation";

export function DashboardSectionTitle() {
  const pathname = usePathname();

  const { title, description } = getPageConfig(pathname);

  return (
    <div className="flex flex-1 justify-between flex-col">
      <div className="flex items-center gap-2">
        <h2 className=" font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
