"use client";

import {
  mutateLogout,
  mutateSignInUser,
  queryGetUserInfo,
} from "@/actions/auth.actions";
import { isOnAuthPage } from "@/lib/utils";
import { Role, User } from "@/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: Role | Role[]) => boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      return await queryGetUserInfo();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !isOnAuthPage(pathName),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      await mutateSignInUser(credentials);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["user"] }),
        queryClient.refetchQueries({ queryKey: ["businesses"] }),
      ]);
      router.push("/business");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await mutateLogout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      router.push("/sign-in");
    },
  });

  const hasRole = (requiredRoles: Role | Role[]): boolean => {
    if (!user?.roles) return false;
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    return roles.some((role) => user.roles.includes(role));
  };

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    login: async (credentials) => loginMutation.mutateAsync(credentials),
    logout: async () => logoutMutation.mutateAsync(),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
