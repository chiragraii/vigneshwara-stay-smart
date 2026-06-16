import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth, logout } from "@/lib/auth";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/rooms", label: "Rooms" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  function signOut() {
    logout();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-display text-lg">V</div>
          <div className="leading-tight">
            <div className="font-display text-base">Vigneshwara</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Lodge · Bengaluru</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/my-bookings"><Button variant="ghost" size="sm">My Bookings</Button></Link>
              {isStaff && <Link to="/admin"><Button variant="ghost" size="sm">Admin</Button></Link>}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="cursor-pointer">
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/rooms"><Button size="sm" className="bg-primary">Book now</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-narrow py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm py-1" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            {user ? (
              <>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Link to="/my-bookings" className="text-sm py-1" onClick={() => setOpen(false)}>My Bookings</Link>
                {isStaff && <Link to="/admin" className="text-sm py-1" onClick={() => setOpen(false)}>Admin</Link>}
                <Button size="sm" variant="outline" onClick={signOut} className="mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth"><Button size="sm" variant="outline" className="w-full">Sign in</Button></Link>
                <Link to="/rooms"><Button size="sm" className="w-full">Book now</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
