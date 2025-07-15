import { kyClient } from "@/lib/api-client";
import { SignUpOwnerUser } from "@/types/auth.types";
import z from "zod";

export async function mutateSignUpOwnerUser(
  signUpOwnerUser: SignUpOwnerUser
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirmation, ...requestBody } = signUpOwnerUser;
    await kyClient.post("auth/sign-up", {
      body: JSON.stringify(requestBody),
    });
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
