import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ session: null, loading: true });

export function AuthProvider({ children, onChange }: { children: ReactNode; onChange?: (event: string) => void }) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, loading: false });
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") onChange?.(event);
    });
    void supabase.auth.getSession().then(({ data: d }) => setState({ session: d.session, loading: false }));
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const { session, loading } = useContext(AuthContext);
  return { session, user: session?.user ?? null, loading };
}
