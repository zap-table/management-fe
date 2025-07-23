import ky from "ky";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "./auth";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const kyClient = ky.create({
  credentials: "include",
  headers: DEFAULT_HEADERS,
  prefixUrl: process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let accessToken: string | null | undefined = null;

        if (typeof window === "undefined") {
          const session = await getServerSession(authOptions);

          accessToken = session?.accessToken;
        } else {
          const session = await getSession();
          accessToken = session?.accessToken;
        }

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
