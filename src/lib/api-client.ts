import { managementBackendUrl } from "@/configs";
import { AuthStatus } from "@/types/auth.types";
import ky from "ky";
import { isOnAuthPage } from "./utils";

const endpointsToNotValidate = ["auth/sign-up", "auth/login", "auth/status"];

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const kyClient = ky.create({
  credentials: "include",
  prefixUrl: managementBackendUrl,
  headers: DEFAULT_HEADERS,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (
          isOnAuthPage() ||
          endpointsToNotValidate.find((endpoint) =>
            request.url.includes(endpoint)
          )
        ) {
          return;
        }
        const statusRes = await ky
          .get<AuthStatus>(`${managementBackendUrl}/auth/status`, {
            credentials: "include",
          })
          .json();

        if (!statusRes.isAuthenticated && statusRes.hasRefreshToken) {
          const refreshRes = await ky.post(
            `${managementBackendUrl}/auth/refresh-token`,
            {
              credentials: "include",
            }
          );
          if (!refreshRes.ok) {
            window.location.href = "/sign-in";
            throw new Error("Session expired");
          }
        } else if (!statusRes.isAuthenticated && !statusRes.hasRefreshToken) {
          window.location.href = "/sign-in";
          throw new Error("Not authenticated");
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (
          isOnAuthPage() ||
          endpointsToNotValidate.find((endpoint) =>
            request.url.includes(endpoint)
          )
        ) {
          return response;
        }
        // If we get a 401, try to refresh and retry (up to 3 times)
        if (response.status === 401) {
          for (let i = 0; i < 3; i++) {
            const statusRes = await ky
              .get<AuthStatus>(`${managementBackendUrl}/auth/status`, {
                credentials: "include",
              })
              .json();

            if (!statusRes.isAuthenticated && statusRes.hasRefreshToken) {
              const refreshRes = await ky.post(
                `${managementBackendUrl}/auth/refresh-token`,
                {
                  credentials: "include",
                }
              );
              if (refreshRes.ok) {
                // Retry the original request
                return ky(request.url, { ...options, credentials: "include" });
              }
            }
          }
          window.location.href = "/sign-in";
          throw new Error("Not authenticated");
        }
        return response;
      },
    ],
  },
});
