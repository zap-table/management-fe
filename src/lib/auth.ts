// src/lib/auth.ts
import { User as BEUser, LoginResponse, Role } from "@/types/auth.types";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { kyClient } from "./api-client";

export const hasRole = (
  user: BEUser,
  requiredRoles: Role | Role[]
): boolean => {
  if (!user?.roles) return false;
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.some((role) => user.roles.includes(role));
};

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    roles?: Role[] | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      roles: Role[];
    };
    accessToken?: string | null;
    refreshToken?: string | null;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    roles: Role[];
    accessToken?: string | null;
    refreshToken?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await kyClient
            .post<LoginResponse>(`auth/login`, {
              json: {
                email: credentials.email,
                password: credentials.password,
              },
            })
            .json();

          const { user, access_token, refresh_token } = response;

          // Return user object with tokens
          const token: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            accessToken: access_token,
            refreshToken: refresh_token,
          };

          return token;
        } catch (err: unknown) {
          console.error("error while signing in", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in (user object is available)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      }

      // Check if we need to refresh the access token
      if (
        token.refreshToken &&
        token.accessTokenExpires &&
        Date.now() >= token.accessTokenExpires - 5 * 60 * 1000 // Refresh 5 minutes before expiry
      ) {
        try {
          const refreshResponse = await kyClient
            .post<LoginResponse>(`auth/refresh`, {
              json: {
                refreshToken: token.refreshToken,
              },
            })
            .json();

          if (refreshResponse.access_token && refreshResponse.refresh_token) {
            token.accessToken = refreshResponse.access_token;
            token.refreshToken = refreshResponse.refresh_token;
            token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // Update expiry
            console.log("Token refreshed successfully");
          } else {
            console.error("No new tokens from refresh endpoint");
            // Clear tokens if refresh failed
            token.accessToken = null;
            token.refreshToken = null;
            token.accessTokenExpires = null;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          // Clear tokens if refresh failed
          token.accessToken = null;
          token.refreshToken = null;
          token.accessTokenExpires = null;
        }
      }

      // Update for client-side session updates (e.g., role changes)
      if (trigger === "update" && session?.user) {
        token.roles = session.user.roles;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          roles: token.roles as Role[],
        };

        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      if (token.accessToken) {
        try {
          await kyClient.post(`auth/logout`, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
        } catch (e: unknown) {
          console.error("error while logging out ", e);
        }
      }
    },
  },

  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
