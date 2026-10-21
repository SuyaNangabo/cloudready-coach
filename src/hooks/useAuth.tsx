import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  session: Session | null;
  loading: boolean;
}

// One shared store, so every page sees the same sign-in status.
let state: AuthState = { session: null, loading: true };
const serverState: AuthState = { session: null, loading: true };
const listeners = new Set<() => void>();
let started = false;

function setState(next: AuthState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function startListening() {
  if (started || typeof window === "undefined") return;
  started = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    setState({ session, loading: false });
  });
  void supabase.auth.getSession().then(({ data }) => {
    setState({ session: data.session, loading: false });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Kept so older imports still work. It no longer needs to be used anywhere. */
export function AuthProvider({
  children,
}: {
  children: ReactNode;
  onChange?: (event: string) => void;
}) {
  return <>{children}</>;
}

export function useAuth() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );

  useEffect(() => {
    startListening();
  }, []);

  return {
    session: snapshot.session,
    user: snapshot.session?.user ?? null,
    loading: snapshot.loading,
  };
}
