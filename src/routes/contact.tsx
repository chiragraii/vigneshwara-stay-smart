import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Hotel Vigneshwara Lodge" },
      { name: "description", content: "Reach Hotel Vigneshwara Lodge — call 099722 89533 or visit us at Sarjapur Road, Attibele, Bengaluru 562107." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Contact</div>
        <h1 className="font-display text-5xl">We'd love to host you.</h1>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4"><MapPin className="h-5 w-5 text-gold shrink-0 mt-1" /><div><div className="font-medium">Address</div><p className="text-muted-foreground text-sm mt-1">Attibele, near Apollo Pharmacy, Sarjapur Road,<br/>Bengaluru, Karnataka 562107</p></div></div>
            <div className="flex gap-4"><Phone className="h-5 w-5 text-gold shrink-0 mt-1" /><div><div className="font-medium">Phone</div><a href="tel:09972289533" className="text-muted-foreground text-sm hover:text-foreground">099722 89533</a></div></div>
            <div className="flex gap-4"><Mail className="h-5 w-5 text-gold shrink-0 mt-1" /><div><div className="font-medium">Email</div><a href="mailto:stay@vigneshwaralodge.com" className="text-muted-foreground text-sm hover:text-foreground">stay@vigneshwaralodge.com</a></div></div>
            <div className="flex gap-4"><Clock className="h-5 w-5 text-gold shrink-0 mt-1" /><div><div className="font-medium">Reception</div><p className="text-muted-foreground text-sm mt-1">Open 24 hours, 7 days a week.</p></div></div>
          </div>
          <div className="aspect-[4/3] rounded-md overflow-hidden border border-border">
            <iframe
              title="Hotel Vigneshwara Lodge location"
              src="https://www.google.com/maps?q=Hotel+Vigneshwara+Lodge+Attibele+Sarjapur+Road+Bengaluru&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
});
