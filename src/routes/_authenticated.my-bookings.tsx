import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  head: () => ({ meta: [{ title: "My bookings — Hotel Vigneshwara Lodge" }] }),
  component: MyBookings,
});

function MyBookings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Your stays</div>
        <h1 className="font-display text-5xl">My bookings</h1>
        
        {user && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="text-lg font-medium">{user.full_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        )}

        <div className="mt-12 border border-dashed border-border rounded-md p-10 text-center">
          <p className="text-muted-foreground">You don't have any bookings yet.</p>
          <Link to="/rooms"><Button className="mt-5">Browse rooms</Button></Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
