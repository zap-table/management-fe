import { managementBackendUrl } from "@/configs";
import ky from "ky";
import { getSession } from "next-auth/react";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const kyClient = ky.create({
  credentials: "include",
  prefixUrl: managementBackendUrl,
  headers: DEFAULT_HEADERS,
});

export const createAuthenticatedClient = async () => {
  const session = await getSession();

  return ky.create({
    credentials: "include",
    prefixUrl: managementBackendUrl,
    headers: {
      ...DEFAULT_HEADERS,
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    },
  });
};
