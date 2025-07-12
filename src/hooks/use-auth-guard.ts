import { useAuth } from "@/providers/auth-provider";
import { Role, User } from "@/types/auth.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseAuthGuardOptions {
  requiredRoles?: Role | Role[];
  redirectTo?: string;
  requireAuth?: boolean;
}

interface UseAuthGuardReturn {
  isAuthenticated: boolean;
  hasRequiredRole: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuthGuard(
  options: UseAuthGuardOptions = {}
): UseAuthGuardReturn {
  const { user, isAuthenticated, hasRole, isLoading } = useAuth();
  const router = useRouter();

  const {
    requiredRoles,
    redirectTo = "/sign-in",
    requireAuth = true,
  } = options;

  const hasRequiredRole = requiredRoles ? hasRole(requiredRoles) : true;

  useEffect(() => {
    if (!isLoading) {
      // Check authentication if required
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (requiredRoles && !hasRequiredRole) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [
    isAuthenticated,
    hasRequiredRole,
    isLoading,
    requireAuth,
    requiredRoles,
    redirectTo,
    router,
  ]);

  return {
    isAuthenticated,
    hasRequiredRole,
    isLoading,
    user,
  };
}
