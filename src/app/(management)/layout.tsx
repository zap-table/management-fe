import { DashboardBreadcrumbs } from "@/components/layout/dashboard-breadcrumbs";
import { DashboardSectionTitle } from "@/components/layout/dashboard-section-title";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`);
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <DashboardSectionTitle />
      </header>
      <main className="flex-1 flex flex-col">
        <DashboardBreadcrumbs />

        {children}
      </main>
    </SidebarInset>
  );
}
