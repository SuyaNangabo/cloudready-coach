import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/practice", label: "Practice" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/cheatsheet", label: "Cheat sheet" },
] as const;

export function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 bg-navy text-navy-foreground shadow-soft">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-5 w-5 text-highlight" />
          <span className="text-sm sm:text-base">
            AZ-900 Prep Coach <span className="font-normal opacity-70">(Unofficial)</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {!loading && user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-xs opacity-80 sm:inline">
                {user.email}
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-3 py-1 text-sm opacity-80 transition hover:opacity-100"
            activeProps={{ className: "bg-primary text-primary-foreground opacity-100" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
