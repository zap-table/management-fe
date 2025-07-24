import ky from "ky";
import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "./auth";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Cache for server-side session to avoid multiple calls per request
let serverSessionCache: { session: Session | null; timestamp: number } | null =
  null;
const SESSION_CACHE_TTL = 30000; // 30 seconds (increased from 5 seconds)

// Track if we're currently fetching a session to prevent concurrent calls
let isSessionFetching = false;
let sessionFetchPromise: Promise<Session | null> | null = null;

async function getOptimizedServerSession(): Promise<Session | null> {
  const now = Date.now();

  // Return cached session if it's still valid
  if (
    serverSessionCache &&
    now - serverSessionCache.timestamp < SESSION_CACHE_TTL
  ) {
    return serverSessionCache.session;
  }

  // If we're already fetching a session, return the existing promise
  if (isSessionFetching && sessionFetchPromise) {
    return sessionFetchPromise;
  }

  // Start fetching session
  isSessionFetching = true;
  sessionFetchPromise = getServerSession(authOptions)
    .then((session) => {
      serverSessionCache = { session, timestamp: now };
      return session;
    })
    .finally(() => {
      isSessionFetching = false;
      sessionFetchPromise = null;
    });

  return sessionFetchPromise;
}

export const kyClient = ky.create({
  credentials: "include",
  headers: DEFAULT_HEADERS,
  prefixUrl: process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL,
  timeout: 10000, // 10 second timeout
  hooks: {
    beforeRequest: [
      async (request) => {
        const url = request.url.toString();

        // Don't add auth headers to auth endpoints to prevent circular calls
        if (
          url.includes("/auth/login") ||
          url.includes("/auth/refresh-token") ||
          url.includes("/auth/logout")
        ) {
          return;
        }

        let accessToken: string | null | undefined = null;

        if (typeof window === "undefined") {
          try {
            const session = await getOptimizedServerSession();
            accessToken = session?.accessToken;
          } catch (error) {
            console.error("Error getting server session:", error);
            return; // Don't add auth header if session fetch fails
          }
        } else {
          try {
            const session = await getSession();
            accessToken = session?.accessToken;
          } catch (error) {
            console.error("Error getting client session:", error);
            return; // Don't add auth header if session fetch fails
          }
        }

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
