import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  head: () => ({ meta: [{ title: "My bookings — Hotel Vigneshwara Lodge" }] }),
  component: MyBookings,
});

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200",
  confirmed: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  checked_in: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
  checked_out: "bg-muted text-muted-foreground",
  cancelled: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
};

function MyBookings() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, rooms(room_number, room_type)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-bookings"] }); toast.success("Booking cancelled"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Your stays</div>
        <h1 className="font-display text-5xl">My bookings</h1>

        {isLoading && <p className="mt-10 text-muted-foreground">Loading…</p>}

        {bookings && bookings.length === 0 && (
          <div className="mt-12 border border-dashed border-border rounded-md p-10 text-center">
            <p className="text-muted-foreground">You don't have any bookings yet.</p>
            <Link to="/rooms"><Button className="mt-5">Browse rooms</Button></Link>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {bookings?.map((b) => (
            <div key={b.id} className="border border-border rounded-md bg-card p-6 flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl">{b.rooms?.room_type}</h3>
                  <Badge className={statusColor[b.status]}>{b.status.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Room {b.rooms?.room_number} · {b.num_guests} guest(s)</p>
                <p className="text-sm mt-2">
                  <span className="text-muted-foreground">Check‑in</span> {format(new Date(b.check_in), "EEE, d MMM yyyy")}
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-muted-foreground">Check‑out</span> {format(new Date(b.check_out), "EEE, d MMM yyyy")}
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-gold">₹{Number(b.total_amount).toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground">Total · pay at hotel</div>
                {(b.status === "pending" || b.status === "confirmed") && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => cancel.mutate(b.id)} disabled={cancel.isPending}>
                    Cancel booking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
