import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/practice", label: "Practice" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-navy text-navy-foreground shadow-soft">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-5 w-5 text-highlight" />
          <span className="text-sm sm:text-base">AZ-900 Prep Coach <span className="font-normal opacity-70">(Unofficial)</span></span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button size="sm" className="rounded-full">Sign in</Button>
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
