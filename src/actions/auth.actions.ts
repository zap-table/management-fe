import { kyClient } from "@/lib/api-client";
import {
  AuthStatus,
  LoginResponse,
  SignInUser,
  SignUpOwnerUser,
  User,
} from "@/types/auth.types";
import { z } from "zod";

export async function queryGetUserInfo(): Promise<User> {
  try {
    return await kyClient.get<User>("auth/me").json();
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function queryAuthStatus(): Promise<AuthStatus> {
  try {
    return await kyClient.get<AuthStatus>("auth/status").json();
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

    await kyClient.post("/auth/sign-up", {
      body: JSON.stringify(requestBody),
    });
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateSignInUser(
  signInUser: SignInUser
): Promise<LoginResponse> {
  try {
    return await kyClient
      .post<SignInUser>("auth/login", {
        body: JSON.stringify(signInUser),
      })
      .json();
  } catch (error: unknown) {
    checkError(error);
    throw error;
  }
}

export async function mutateLogout(): Promise<void> {
  try {
    return await kyClient.post<SignInUser>("auth/logout").json();
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
