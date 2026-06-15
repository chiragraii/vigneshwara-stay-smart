import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-narrow py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Hotel Vigneshwara Lodge</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            A modern, friendly lodge on Sarjapur Road, Attibele. Comfort, clean rooms, and warm hospitality — at a fair price.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gold">★ ★ ★ ★</span>
            <span className="text-muted-foreground">4.0 · 242 Google Reviews</span>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Visit</div>
          <p className="text-sm flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />Attibele, near Apollo Pharmacy, Sarjapur Road, Bengaluru, Karnataka 562107</p>
          <p className="text-sm flex gap-2 mt-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-gold" />099722 89533</p>
          <p className="text-sm flex gap-2 mt-2"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-gold" />Reception open 24/7</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-foreground text-muted-foreground">Rooms & rates</Link></li>
            <li><Link to="/about" className="hover:text-foreground text-muted-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-foreground text-muted-foreground">Guest sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-narrow py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Hotel Vigneshwara Lodge. All rights reserved.</span>
          <span>Crafted with care.</span>
        </div>
      </div>
    </footer>
  );
}
