export const managementBackendUrl =
  process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL ?? `http://localhost:8080`;

export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const AUTH_PATHS = ["/sign-in", "/sign-up"];
export const PUBLIC_PATHS = [...AUTH_PATHS, "/_next", "/favicon.ico"];
