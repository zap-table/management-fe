import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarInset>
      <main className="flex min-h-svh">{children}</main>
    </SidebarInset>
  );
}
