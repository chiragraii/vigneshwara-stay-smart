import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, Wifi } from "lucide-react";
import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const roomsQuery = queryOptions({
  queryKey: ["rooms"],
  queryFn: async () => {
    const { data, error } = await supabase.from("rooms").select("*").order("price_per_night");
    if (error) throw error;
    return data;
  },
});

function imgFor(type: string) {
  const t = type.toLowerCase();
  if (t.includes("suite")) return roomSuite;
  if (t.includes("deluxe")) return roomDeluxe;
  return roomStandard;
}

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms & Rates — Hotel Vigneshwara Lodge" },
      { name: "description", content: "Browse rooms at Hotel Vigneshwara Lodge in Attibele, Bengaluru. Standard, deluxe and family suites from ₹899/night." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(roomsQuery),
  component: RoomsPage,
  errorComponent: ({ error }) => <div className="p-10">Failed to load rooms: {String(error.message)}</div>,
  notFoundComponent: () => <div className="p-10">No rooms found.</div>,
});

function RoomsPage() {
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Stays</div>
        <h1 className="font-display text-5xl">Our rooms</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Pick a room, choose your dates, and we'll have it ready. All rates include taxes and Wi‑Fi.</p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {rooms.map((r) => (
            <article key={r.id} className="bg-card rounded-md overflow-hidden shadow-card border border-border flex flex-col">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={imgFor(r.room_type)} alt={r.room_type} loading="lazy" width={1280} height={800} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Room {r.room_number}</div>
                    <h2 className="mt-1 font-display text-2xl">{r.room_type}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display text-gold">₹{Number(r.price_per_night).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-muted-foreground">per night</div>
                  </div>
                </div>
                {r.description && <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" />Up to {r.capacity}</Badge>
                  {(r.amenities ?? []).slice(0, 4).map((a: string) => (
                    <Badge key={a} variant="outline">{a}</Badge>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Wifi className="h-3 w-3" />Free Wi‑Fi included</div>
                  {r.status === "available" ? (
                    <Link to="/book/$roomId" params={{ roomId: r.id }}>
                      <Button>Book this room</Button>
                    </Link>
                  ) : (
                    <Badge variant="outline" className="capitalize">{r.status}</Badge>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
