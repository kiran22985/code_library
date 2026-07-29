"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initProgress, setProgressUser } from "@/lib/progressStore";

export interface User {
  id: number;
  username: string;
  createdAt: string;
}

interface AuthValue {
  user: User | null;
  /** False until the first `/api/auth/me` response, so the UI can avoid flicker. */
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Session state for the whole app.
 *
 * The session is fetched from the client rather than read in a server layout,
 * which keeps every lesson page statically generated and cacheable — only this
 * one small request is per-user.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Show locally stored progress immediately, before the session resolves.
    initProgress();

    (async () => {
      try {
        const response = await fetch("/api/auth/me/");
        const data: { user?: User | null } = await response.json();
        if (!active) return;
        setUser(data.user ?? null);
        await setProgressUser(Boolean(data.user));
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /** Shared by login and signup: both return the user and set the cookie. */
  const authenticate = useCallback(
    async (endpoint: "login" | "signup", username: string, password: string) => {
      const response = await fetch(`/api/auth/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: { user?: User; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setUser(data.user);
      await setProgressUser(true);
    },
    [],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      login: (username, password) => authenticate("login", username, password),
      signup: (username, password) => authenticate("signup", username, password),
      logout: async () => {
        await fetch("/api/auth/logout/", { method: "POST" }).catch(() => {});
        setUser(null);
        await setProgressUser(false);
      },
    }),
    [user, loading, authenticate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
