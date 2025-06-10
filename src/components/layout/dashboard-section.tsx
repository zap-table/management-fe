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
  return <section className={cn("p-6 w-full", className)}>{children}</section>;
}
