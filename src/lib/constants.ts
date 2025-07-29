export const AUTH_PAGES = ["/sign-in", "/sign-up"] as const;
export const AUTH_ENDPOINTS = [
  "auth/sign-up",
  "auth/login",
  "auth/status",
] as const;

export const USER_ROLES = {
  ADMIN: "admin",
  OWNER: "owner",
  STAFF: "staff",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const BUSINESS_PATHS = {
  BUSINESS_PREFIX: "/business",
  RESTAURANT_PREFIX: "/restaurant",
} as const;

export const COOKIE_NAMES = {
  BUSINESS: "business",
  RESTAURANT: "restaurant",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const QUERY_KEYS = {
  USER: ["user"],
  BUSINESSES: ["businesses"],
  AUTH_STATUS: ["auth-status"],
} as const;

export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: "Autenticação necessária",
  ACCESS_DENIED: "Acesso negado",
  SESSION_EXPIRED: "Sessão expirada",
  INVALID_PATH_FORMAT: "Formato de caminho inválido",
} as const;

export const PATHS = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  BUSINESS: "/business",
  UNAUTHORIZED: "/unauthorized",
  DASHBOARD: "/",
} as const;

export const INITIAL_LOGGED_PATH = PATHS.BUSINESS;
export const UNAUTHENTICATED_PATH = PATHS.SIGN_IN;
