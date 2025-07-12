import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const isAuthenticate = await isAuthenticated();

  if (!isAuthenticate) {
    redirect("/sign-in");
  } else {
    redirect("/business");
  }
}
