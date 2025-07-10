import { z } from "zod";

const RoleSchema = z.enum(["admin", "owner", "staff"]);

const SignUpOwnerUserSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Introduze um email válido"),
    password: z
      .string()
      .min(1, "Password é obrigatório")
      .min(8, "A password deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        "A password deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um carácter especial"
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As duas passwords inseridas não são iguais",
    path: ["passwordConfirmation"],
  });

const SignInUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Introduze um email válido"),
  password: z
    .string()
    .min(1, "Password é obrigatório")
    .min(8, "A password deve ter pelo menos 8 caracteres"),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(RoleSchema),
});

export const AuthTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: UserSchema,
});

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(RoleSchema),
  iat: z.number(),
  exp: z.number(),
});

type User = z.infer<typeof UserSchema>;
type SignUpOwnerUser = z.infer<typeof SignUpOwnerUserSchema>;
type SignInUser = z.infer<typeof SignInUserSchema>;
type Role = z.infer<typeof RoleSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export { RoleSchema, SignInUserSchema, SignUpOwnerUserSchema, UserSchema };

  export type { Role, SignInUser, SignUpOwnerUser, User };

