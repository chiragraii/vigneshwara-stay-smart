import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarCheck, LogIn, LogOut as LogOutIcon, Bed, Users, IndianRupee } from "lucide-react";
import { claimFirstAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Hotel Vigneshwara Lodge" }] }),
  component: AdminPage,
});

const statusOptions = ["pending", "confirmed", "checked_in", "checked_out", "cancelled"] as const;

function AdminPage() {
  const { isStaff, loading } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*, rooms(room_number, room_type)").order("check_in", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ["admin-rooms"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*").order("room_number");
      if (error) throw error;
      return data;
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("bookings").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-bookings"] }); toast.success("Updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("rooms").update({ status: status as "available" | "occupied" | "maintenance" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-rooms"] }); toast.success("Room updated"); },
  });

  if (loading) return <div className="p-10">Loading…</div>;
  if (!isStaff) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container-narrow py-20 max-w-lg">
          <h1 className="font-display text-4xl">Staff access only</h1>
          <p className="text-muted-foreground mt-3">
            Your account doesn't have admin or staff permission yet.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            If you're setting this up for the first time and no admin exists yet, you can claim the first admin role for your account.
          </p>
          <Button className="mt-4" onClick={async () => {
            try { await claimFirstAdmin(); toast.success("You're now an admin. Refreshing…"); setTimeout(()=>location.reload(), 600); }
            catch (e) { toast.error((e as Error).message); }
          }}>Claim first admin</Button>
          <Link to="/" className="text-sm text-gold mt-6 inline-block">← Back home</Link>
        </main>
      </div>
    );
  }

  const filtered = bookings?.filter((b) => filter === "all" || b.status === filter) ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    arriving: bookings?.filter((b) => b.check_in === today && b.status !== "cancelled").length ?? 0,
    inhouse: bookings?.filter((b) => b.status === "checked_in").length ?? 0,
    departing: bookings?.filter((b) => b.check_out === today && b.status === "checked_in").length ?? 0,
    revenue: bookings?.filter((b) => ["confirmed", "checked_in", "checked_out"].includes(b.status)).reduce((s, b) => s + Number(b.total_amount), 0) ?? 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-12">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Front desk</div>
        <h1 className="font-display text-5xl">Operations</h1>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatCard icon={LogIn} label="Arriving today" value={stats.arriving} />
          <StatCard icon={Bed} label="In‑house guests" value={stats.inhouse} />
          <StatCard icon={LogOutIcon} label="Departing today" value={stats.departing} />
          <StatCard icon={IndianRupee} label="Revenue (active)" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
        </div>

        <Tabs defaultValue="bookings" className="mt-12">
          <TabsList><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="rooms">Rooms</TabsTrigger></TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-sm text-muted-foreground">{filtered.length} booking(s)</div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="border border-border rounded-md overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Guest</th>
                    <th className="text-left p-3">Room</th>
                    <th className="text-left p-3">Dates</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Total</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-t border-border align-top">
                      <td className="p-3">
                        <div className="font-medium">{b.guest_name}</div>
                        <div className="text-xs text-muted-foreground">{b.guest_phone}</div>
                        {b.guest_email && <div className="text-xs text-muted-foreground">{b.guest_email}</div>}
                      </td>
                      <td className="p-3">
                        <div>{b.rooms?.room_type}</div>
                        <div className="text-xs text-muted-foreground">#{b.rooms?.room_number} · <Users className="inline h-3 w-3"/> {b.num_guests}</div>
                      </td>
                      <td className="p-3 text-xs">
                        <div>{format(new Date(b.check_in), "d MMM")}</div>
                        <div className="text-muted-foreground">→ {format(new Date(b.check_out), "d MMM")}</div>
                      </td>
                      <td className="p-3">
                        <Select value={b.status} onValueChange={(s) => {
                          const patch: Record<string, unknown> = { status: s };
                          if (s === "checked_in") patch.checked_in_at = new Date().toISOString();
                          if (s === "checked_out") patch.checked_out_at = new Date().toISOString();
                          updateBooking.mutate({ id: b.id, patch });
                        }}>
                          <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-right font-medium">₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          {b.status === "confirmed" && (
                            <Button size="sm" variant="outline" onClick={() => updateBooking.mutate({ id: b.id, patch: { status: "checked_in", checked_in_at: new Date().toISOString() } })}>
                              <LogIn className="h-3 w-3 mr-1" />Check in
                            </Button>
                          )}
                          {b.status === "checked_in" && (
                            <Button size="sm" variant="outline" onClick={() => updateBooking.mutate({ id: b.id, patch: { status: "checked_out", checked_out_at: new Date().toISOString() } })}>
                              <LogOutIcon className="h-3 w-3 mr-1" />Check out
                            </Button>
                          )}
                          {b.status === "pending" && (
                            <Button size="sm" onClick={() => updateBooking.mutate({ id: b.id, patch: { status: "confirmed" } })}>
                              <CalendarCheck className="h-3 w-3 mr-1" />Confirm
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No bookings.</td></tr>}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="mt-6">
            <div className="grid gap-3 md:grid-cols-2">
              {rooms?.map((r) => (
                <div key={r.id} className="border border-border rounded-md p-4 bg-card flex items-center justify-between gap-4">
                  <div>
                    <div className="font-display text-xl">{r.room_type}</div>
                    <div className="text-xs text-muted-foreground">Room {r.room_number} · ₹{Number(r.price_per_night).toLocaleString("en-IN")} / night</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.status === "available" ? "default" : "outline"} className="capitalize">{r.status}</Badge>
                    <Select value={r.status} onValueChange={(s) => updateRoom.mutate({ id: r.id, status: s })}>
                      <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md p-5 bg-card">
      <Icon className="h-4 w-4 text-gold" />
      <div className="mt-3 font-display text-3xl">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
