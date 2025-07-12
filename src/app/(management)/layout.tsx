import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticate = await isAuthenticated();
  if (!isAuthenticate) {
    redirect("sign-in");
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </header>
      <main className="flex min-h-svh">{children}</main>
    </SidebarInset>
  );
}
