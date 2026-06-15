import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Star, Wifi, ShieldCheck, Coffee, MapPin, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-lobby.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hotel Vigneshwara Lodge — Modern Stay in Attibele, Bengaluru" },
      { name: "description", content: "Book a clean, comfortable room at Hotel Vigneshwara Lodge on Sarjapur Road, Attibele. Friendly service, fair rates, 4.0★ (242 reviews)." },
      { property: "og:title", content: "Hotel Vigneshwara Lodge" },
      { property: "og:description", content: "Modern lodge in Attibele, Bengaluru. Book rooms online." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative">
          <div className="absolute inset-0">
            <img src={heroImg} alt="Hotel Vigneshwara Lodge lobby" width={1920} height={1280} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          </div>
          <div className="relative container-narrow pt-28 pb-36 md:pt-40 md:pb-48">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1 text-xs">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-muted-foreground">4.0 · 242 Google reviews</span>
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl">
              A quiet, modern stay
              <span className="block text-gold italic">on Sarjapur Road.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
              Hotel Vigneshwara Lodge in Attibele offers clean rooms, sincere service, and an easy check-in — whether you're here for business, travel, or a quick stop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/rooms"><Button size="lg" className="h-12 px-6">Book a room <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <a href="tel:09972289533"><Button size="lg" variant="outline" className="h-12 px-6">Call 099722 89533</Button></a>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="container-narrow py-20 grid gap-8 md:grid-cols-4">
          {[
            { icon: Wifi, title: "Fast Wi‑Fi", desc: "In every room, free for guests." },
            { icon: ShieldCheck, title: "Safe & clean", desc: "Daily housekeeping, secure entry." },
            { icon: Coffee, title: "Tea & coffee", desc: "Complimentary in‑room kit." },
            { icon: MapPin, title: "Easy to reach", desc: "On Sarjapur Road, Attibele." },
          ].map((f) => (
            <div key={f.title} className="border-l-2 border-gold pl-4">
              <f.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-3 font-display text-xl">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* ROOMS PREVIEW */}
        <section className="bg-secondary/40 border-y border-border">
          <div className="container-narrow py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Stays</div>
                <h2 className="font-display text-4xl md:text-5xl max-w-xl">Rooms designed for an easy night.</h2>
              </div>
              <Link to="/rooms" className="hidden md:inline-flex text-sm items-center gap-1 hover:text-gold">All rooms <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { img: roomStandard, title: "Standard Room", price: "₹899", desc: "Cozy, well‑lit, with all the essentials." },
                { img: roomDeluxe, title: "Deluxe Room", price: "₹1,799", desc: "Spacious with modern furnishings and a city view." },
                { img: roomSuite, title: "Family Suite", price: "₹2,799", desc: "Separate seating, perfect for families." },
              ].map((r) => (
                <div key={r.title} className="group bg-card rounded-md overflow-hidden shadow-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={r.img} alt={r.title} loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-2xl">{r.title}</h3>
                      <div className="text-sm"><span className="text-gold font-medium">{r.price}</span> <span className="text-muted-foreground">/ night</span></div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="container-narrow py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">What guests say</div>
          <h2 className="font-display text-4xl md:text-5xl max-w-2xl">Real reviews. <span className="text-muted-foreground">From real stays.</span></h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "Best facility with good staff service.",
              "Very nice rooms and quick facilities available — hotel managing is very cool.",
              "This place is owned by Mangalore people and they are really friendly.",
            ].map((q, i) => (
              <figure key={i} className="border border-border rounded-md p-6 bg-card">
                <div className="flex gap-0.5 text-gold mb-3">{Array.from({length:5}).map((_,j)=><Star key={j} className="h-3.5 w-3.5 fill-current"/>)}</div>
                <blockquote className="text-foreground/90 italic font-display text-lg leading-snug">"{q}"</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">Verified Google review</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-narrow pb-24">
          <div className="rounded-lg bg-primary text-primary-foreground p-10 md:p-16 flex flex-col md:flex-row md:items-end gap-8 justify-between shadow-elegant">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Ready when you are</div>
              <h2 className="font-display text-4xl md:text-5xl max-w-xl">Reserve your room in under a minute.</h2>
            </div>
            <Link to="/rooms"><Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-7">Browse rooms</Button></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
