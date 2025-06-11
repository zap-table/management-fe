export const managementBackendUrl = () => {
  return (
    process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL ?? `http://localhost:8080`
  );
};

export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
