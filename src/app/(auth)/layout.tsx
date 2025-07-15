import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/business`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
      <Card className="w-full max-w-md">{children}</Card>
    </div>
  );
}
