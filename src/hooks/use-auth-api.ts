import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api-client.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Generic hook for authenticated GET requests
export function useAuthenticatedQuery<T>(
  queryKey: readonly unknown[],
  endpoint: string,
  schema: z.ZodSchema<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await apiClient.request(endpoint, { credentials: "include" }, schema);
      if (response.error || !response.data) {
        throw new Error(response.error || "Request failed");
      }
      return response.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
  });
}

// Generic hook for authenticated POST requests
export function useAuthenticatedMutation<T, TData = unknown>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: readonly (readonly unknown[])[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TData): Promise<T> => {
      const response = await apiClient.request(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
        },
        schema
      );
      if (response.error || !response.data) {
        throw new Error(response.error || "Request failed");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

// Generic hook for authenticated PUT requests
export function useAuthenticatedPutMutation<T, TData = unknown>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: readonly (readonly unknown[])[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TData): Promise<T> => {
      const response = await apiClient.request(
        endpoint,
        {
          method: "PUT",
          body: JSON.stringify(data),
          credentials: "include",
        },
        schema
      );
      if (response.error || !response.data) {
        throw new Error(response.error || "Request failed");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

// Generic hook for authenticated DELETE requests
export function useAuthenticatedDeleteMutation<T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: readonly (readonly unknown[])[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<T> => {
      const response = await apiClient.request(
        endpoint,
        {
          method: "DELETE",
          credentials: "include",
        },
        schema
      );
      if (response.error || !response.data) {
        throw new Error(response.error || "Request failed");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}

// Helper function for making authenticated requests outside of React components
export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  schema: z.ZodSchema<T>
): Promise<ApiResponse<T>> {
  return apiClient.request(endpoint, { ...options, credentials: "include" }, schema);
} 