"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { BusinessProvider } from "./business-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (client errors)
              if (error && typeof error === "object" && "status" in error) {
                const status = error.status as number;
                if (status >= 400 && status < 500) return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BusinessProvider>
          <SidebarProvider>
            {children}
            <Toaster richColors position="top-right" />
          </SidebarProvider>
        </BusinessProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
