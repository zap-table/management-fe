import { cn } from "@/lib/utils";
import React from "react";

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardSection({
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("p-4 pt-2 w-full flex-1", className)}>
      {children}
    </section>
  );
}
