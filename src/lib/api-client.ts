import { managementBackendUrl } from "@/configs";
import { ApiResponse } from "@/types/api-client.types";
import {
    LoginResponse,
    LoginResponseSchema,
    SignInUser,
    SignUpOwnerUser,
} from "@/types/auth.types";
import { redirect } from "next/navigation";
import { z } from "zod";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async parseResponse<T>(
    response: Response,
    schema: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      const text = await response.text();
      let data: unknown;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (!response.ok) {
        return {
          status: response.status,
          error: text || `HTTP ${response.status}`,
        };
      }

      try {
        const validatedData = schema.parse(data);
        return {
          data: validatedData,
          status: response.status,
        };
      } catch (zodError) {
        console.error("Schema validation error:", zodError);
        return {
          status: response.status,
          error: "Invalid response format",
        };
      }
    } catch (error) {
      return {
        status: response.status,
        error: error instanceof Error ? error.message : "Parse error",
      };
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: "include", // Ensure cookies are sent
      });

      // Handle 401 as fallback
      if (
        response.status === 401 &&
        endpoint !== "/auth/login" &&
        endpoint !== "/auth/sign-up"
      ) {
        redirect("/sign-in");
      }
      if (!schema) {
        return response;
      }

      return this.parseResponse(response, schema);
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Auth methods
  async login(credentials: SignInUser): Promise<LoginResponse> {
    const response = await this.request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      LoginResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Login failed");
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request(
        "/auth/logout",
        {
          method: "POST",
        },
        z.object({ message: z.string() })
      );
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }

  async signup(userData: SignUpOwnerUser): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirmation, ...requestBody } = userData;

    const response = await this.request(
      "/auth/sign-up",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
      z.object({ message: z.string() })
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Signup failed");
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(managementBackendUrl());
