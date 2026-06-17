import { createFileRoute, Link } from '@tanstack/react-router';
import { Bed, Maximize2, Users, Star, MapPin, ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomGallery } from '@/components/rooms/RoomGallery';
import { ReviewCard } from '@/components/rooms/ReviewCard';
import { BookingWidget } from '@/components/rooms/BookingWidget';
import { RoomCard } from '@/components/rooms/RoomCard';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import { useState } from 'react';
import { BookingModal } from '@/components/rooms/BookingModal';
import { CATEGORY_COLORS, CATEGORY_LABELS, type Room, RoomCategory, type RoomDetail } from '@/types/room';
import { getAmenityIcon } from '@/components/rooms/amenityIcons';
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { roomsApi } from '@/api/roomsApi';

export const Route = createFileRoute('/rooms/$slug')({
  head: ({ loaderData }) => {
    const d = loaderData as RoomDetail | null | undefined;
    return {
      meta: [
        { title: d ? `${d.name} — Hotel Vigneshwara Lodge` : 'Room Details' },
        { name: 'description', content: d?.shortDesc ?? 'Room details at Hotel Vigneshwara Lodge' },
        { property: 'og:title', content: d?.name ?? 'Room' },
        { property: 'og:description', content: d?.shortDesc ?? '' },
        { property: 'og:image', content: d?.images?.[0]?.url ?? '/images/rooms/room-1.jpg' },
      ],
    };
  },
  loader: async ({ params, context }) => {
    try {
      return await context.queryClient.fetchQuery({
        queryKey: ['room', params.slug],
        queryFn: () => roomsApi.getBySlug(params.slug),
      });
    } catch {
      return null;
    }
  },
  component: RoomDetailPage,
});

function RoomDetailPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { data: room, isLoading, isError } = useRoomDetail(slug);
  const detail = room ?? loaderData;
  const [bookRoom, setBookRoom] = useState<Room | null>(null);

  if (isLoading && !detail) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container-narrow py-20">Loading room…</main>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container-narrow py-20 text-center">
          <h1 className="font-display text-3xl">Room not found</h1>
          <Link to="/rooms"><Button className="mt-6">Browse all rooms</Button></Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const amenities = detail.amenities ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-narrow py-8 md:py-12">
        <Link to="/rooms" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to rooms
        </Link>

        <RoomGallery images={detail.images ?? []} name={detail.name} />

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={cn('text-[10px] uppercase', CATEGORY_COLORS[detail.category as RoomCategory])}>
                {CATEGORY_LABELS[detail.category as RoomCategory]}
              </Badge>
              {detail.isFeatured && <Badge className="bg-gold text-gold-foreground text-[10px]">Featured</Badge>}
              {!detail.availability && <Badge variant="destructive">Unavailable</Badge>}
            </div>

            <h1 className="font-display text-4xl md:text-5xl">{detail.name}</h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span>{detail.avgRating?.toFixed(1) ?? detail.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({detail.reviewCount} reviews)</span>
              <span className="font-display text-gold text-xl">{formatPrice(detail.pricePerNight)}<span className="text-sm text-muted-foreground font-sans"> / night</span></span>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">{detail.description}</p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Maximize2, label: 'Size', value: `${detail.roomSize} sq ft` },
                { icon: Bed, label: 'Bed', value: `${detail.bedType} × ${detail.bedCount}` },
                { icon: Users, label: 'Guests', value: `Up to ${detail.maxGuests}` },
                { icon: MapPin, label: 'View', value: detail.viewType ?? '—' },
              ].map((h) => (
                <div key={h.label} className="bg-secondary/40 rounded-md p-4 border border-border">
                  <h.icon className="h-4 w-4 text-gold" />
                  <div className="text-xs text-muted-foreground mt-2">{h.label}</div>
                  <div className="text-sm font-medium mt-0.5">{h.value}</div>
                </div>
              ))}
            </div>

            {amenities.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-2xl mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((a) => {
                    const Icon = getAmenityIcon(a.icon);
                    return (
                      <div key={a.id} className="flex items-center gap-2 text-sm p-3 rounded-md border border-border bg-card">
                        <Icon className="h-4 w-4 text-gold shrink-0" />
                        {a.name}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {detail.reviews.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-2xl mb-4">Guest Reviews</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {detail.reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </section>
            )}

            {detail.relatedRooms.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-2xl mb-4">Similar Rooms</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {detail.relatedRooms.map((r) => (
                    <div key={r.id} className="min-w-[300px] max-w-[320px] snap-start shrink-0">
                      <RoomCard room={r} onBook={setBookRoom} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="hidden lg:block">
            <BookingWidget room={detail} />
          </aside>
        </div>

        <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-background/95 border-t border-border backdrop-blur z-40">
          <Button className="w-full" size="lg" onClick={() => setBookRoom(detail)}>
            Book from {formatPrice(detail.pricePerNight)}/night
          </Button>
        </div>
      </main>

      <BookingModal room={bookRoom} open={!!bookRoom} onOpenChange={(o) => !o && setBookRoom(null)} />
      <SiteFooter />
    </div>
  );
}
