"use client";

import { getPageConfig } from "@/lib/breadcrumbs";
import { usePathname } from "next/navigation";

export function DashboardSectionTitle() {
  const pathname = usePathname();

  const { title, description } = getPageConfig(pathname);

  return (
    <div>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {description && <p className="text-sm text-slate-600">{description}</p>}
    </div>
  );
}
