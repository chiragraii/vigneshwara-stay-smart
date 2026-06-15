import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/book/$roomId")({
  head: () => ({ meta: [{ title: "Book a room — Hotel Vigneshwara Lodge" }] }),
  component: BookPage,
});

const bookingSchema = z.object({
  guest_name: z.string().trim().min(2).max(120),
  guest_phone: z.string().trim().min(7).max(20),
  guest_email: z.string().email().max(255).optional().or(z.literal("")),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  num_guests: z.coerce.number().min(1).max(10),
  notes: z.string().max(500).optional(),
});

function BookPage() {
  const { roomId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single();
      if (error) throw error;
      return data;
    },
  });

  const [dates, setDates] = useState({ in: "", out: "" });
  const nights = dates.in && dates.out ? Math.max(0, Math.ceil((new Date(dates.out).getTime() - new Date(dates.in).getTime()) / 86400000)) : 0;
  const total = room ? Number(room.price_per_night) * nights : 0;

  const createBooking = useMutation({
    mutationFn: async (formData: FormData) => {
      const parsed = bookingSchema.parse({
        guest_name: formData.get("guest_name"),
        guest_phone: formData.get("guest_phone"),
        guest_email: formData.get("guest_email") || "",
        check_in: formData.get("check_in"),
        check_out: formData.get("check_out"),
        num_guests: formData.get("num_guests"),
        notes: formData.get("notes") || "",
      });
      if (!user || !room) throw new Error("Not ready");
      const n = Math.max(1, Math.ceil((new Date(parsed.check_out).getTime() - new Date(parsed.check_in).getTime()) / 86400000));
      const amount = Number(room.price_per_night) * n;

      const { data, error } = await supabase.from("bookings").insert({
        user_id: user.id,
        room_id: room.id,
        guest_name: parsed.guest_name,
        guest_phone: parsed.guest_phone,
        guest_email: parsed.guest_email || null,
        check_in: parsed.check_in,
        check_out: parsed.check_out,
        num_guests: parsed.num_guests,
        total_amount: amount,
        notes: parsed.notes || null,
        status: "pending",
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      setSuccess(b.id);
      toast.success("Booking received! We'll confirm shortly.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <div className="p-10">Loading room…</div>;
  if (!room) return <div className="p-10">Room not found.</div>;

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container-narrow py-20 max-w-xl">
          <CheckCircle2 className="h-12 w-12 text-gold" />
          <h1 className="mt-6 font-display text-4xl">Booking received</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for booking with us. Our front desk will confirm your reservation shortly. You'll find it in your bookings page.
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={() => navigate({ to: "/my-bookings" })}>View my bookings</Button>
            <Link to="/"><Button variant="outline">Home</Button></Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-12 grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <Link to="/rooms" className="text-xs text-muted-foreground hover:text-foreground">← Back to rooms</Link>
          <h1 className="mt-4 font-display text-4xl">Book {room.room_type}</h1>
          <p className="text-muted-foreground mt-1">Room {room.room_number} · up to {room.capacity} guests</p>

          <form onSubmit={(e) => { e.preventDefault(); createBooking.mutate(new FormData(e.currentTarget)); }} className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label htmlFor="check_in">Check‑in</Label><Input id="check_in" name="check_in" type="date" required min={new Date().toISOString().slice(0,10)} onChange={(e)=>setDates(d=>({...d, in: e.target.value}))} /></div>
              <div><Label htmlFor="check_out">Check‑out</Label><Input id="check_out" name="check_out" type="date" required min={dates.in || new Date().toISOString().slice(0,10)} onChange={(e)=>setDates(d=>({...d, out: e.target.value}))} /></div>
            </div>
            <div><Label htmlFor="num_guests">Number of guests</Label><Input id="num_guests" name="num_guests" type="number" min={1} max={room.capacity} defaultValue={1} required /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label htmlFor="guest_name">Full name</Label><Input id="guest_name" name="guest_name" required maxLength={120} /></div>
              <div><Label htmlFor="guest_phone">Phone</Label><Input id="guest_phone" name="guest_phone" type="tel" required maxLength={20} /></div>
            </div>
            <div><Label htmlFor="guest_email">Email (optional)</Label><Input id="guest_email" name="guest_email" type="email" maxLength={255} defaultValue={user?.email ?? ""} /></div>
            <div><Label htmlFor="notes">Special requests</Label><Textarea id="notes" name="notes" rows={3} maxLength={500} placeholder="Early check‑in, extra pillows…" /></div>
            <Button type="submit" size="lg" disabled={createBooking.isPending || nights < 1} className="w-full md:w-auto">
              {createBooking.isPending ? "Submitting…" : "Confirm booking"}
            </Button>
          </form>
        </div>

        <aside className="bg-secondary/50 rounded-md p-6 h-fit sticky top-20">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Summary</div>
          <h2 className="font-display text-2xl mt-1">{room.room_type}</h2>
          <Badge variant="outline" className="mt-2">Room {room.room_number}</Badge>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span>₹{Number(room.price_per_night).toLocaleString("en-IN")} / night</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span>{nights || "—"}</span></div>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl text-gold">₹{total.toLocaleString("en-IN")}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">You pay at the hotel. We'll confirm by phone.</p>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
