import { managementBackendUrl } from "@/configs";
import ky from "ky";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useKyAuthClient() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useMemo(() => {
    return ky.create({
      prefixUrl: managementBackendUrl,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  }, [accessToken]);
}
