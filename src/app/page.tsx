import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`);
  } else {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/business`);
  }
}
