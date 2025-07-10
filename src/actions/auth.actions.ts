import { apiClient } from "@/lib/api-client";
import {
  LoginResponse,
  LoginResponseSchema,
  SignInUser,
  SignUpOwnerUser,
  User,
  UserSchema,
} from "@/types/auth.types";
import { z } from "zod";

const SignUpResponseSchema = z.object({
  message: z.string(),
});

export async function queryGetUserInfo(): Promise<User> {
  try {
    const response = await apiClient.request(
      "/auth/me",
      {
        method: "GET",
      },
      UserSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Signup failed");
    }

    return response.data;
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateSignUpOwnerUser(
  signUpOwnerUser: SignUpOwnerUser
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirmation, ...requestBody } = signUpOwnerUser;

    const response = await apiClient.request(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
      // TODO Fix response type
      SignUpResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Signup failed");
    }
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateSignInUser(
  signInUser: SignInUser
): Promise<LoginResponse> {
  try {
    const response = await apiClient.request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(signInUser),
      },
      LoginResponseSchema
    );

    if (response.error || !response.data) {
      throw new Error(response.error || "Sign in failed");
    }

    return response.data;
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

function checkError(error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("Validation error:", error.errors);
  } else if (error instanceof Error) {
    console.error("Fetch error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
