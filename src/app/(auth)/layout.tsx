"use client";

import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
      <Card className="w-full max-w-md">{children}</Card>
    </div>
  );
}
