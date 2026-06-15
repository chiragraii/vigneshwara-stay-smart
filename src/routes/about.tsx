import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hotel Vigneshwara Lodge" },
      { name: "description", content: "About Hotel Vigneshwara Lodge in Attibele, Bengaluru — a family‑run lodge known for friendly service and clean rooms." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">About</div>
        <h1 className="font-display text-5xl max-w-2xl">A small lodge, run with care.</h1>
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hotel Vigneshwara Lodge has been welcoming guests on Sarjapur Road for years. We're a family‑run property
            originally from Mangalore — and that's the kind of warmth we try to bring to every guest who walks in.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our rooms are simple, modern, and spotless. We keep things straightforward: a clean bed, good Wi‑Fi, hot
            water, and a calm space to rest after a long day. Whether you're visiting Attibele for business or just
            passing through, we'll take good care of you.
          </p>
        </div>
        <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10">
          {[
            ["4.0★", "Google rating"],
            ["242", "Guest reviews"],
            ["24/7", "Reception"],
            ["6+", "Room types"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-4xl text-gold">{n}</dt>
              <dd className="text-sm text-muted-foreground mt-1">{l}</dd>
            </div>
          ))}
        </dl>
      </main>
      <SiteFooter />
    </div>
  ),
});
