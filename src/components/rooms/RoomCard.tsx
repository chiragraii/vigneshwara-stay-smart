import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Bed,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Star,
  Users,
  GitCompareArrows,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice, isOnSale } from '@/utils/formatters';
import { CATEGORY_COLORS, CATEGORY_LABELS, type Room, RoomCategory } from '@/types/room';
import { getAmenityIcon } from './amenityIcons';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { MiniAvailabilityCalendar } from './MiniAvailabilityCalendar';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  compareSelected?: boolean;
  onCompareToggle?: (room: Room) => void;
  cheapestInCategory?: boolean;
}

export function RoomCard({
  room,
  onBook,
  compareSelected,
  onCompareToggle,
  cheapestInCategory,
}: RoomCardProps) {
  const { toggle, isWishlisted } = useWishlist();
  const images = room.images?.length ? room.images : [{ id: '0', url: '/images/rooms/room-1.jpg', altText: room.name, isPrimary: true, order: 0 }];
  const [idx, setIdx] = useState(0);
  const wishlisted = isWishlisted(room.id);
  const onSale = isOnSale(room.pricePerNight, room.originalPrice);
  const amenities = room.amenities ?? [];

  function handleWishlist() {
    const added = toggle(room.id);
    toast.success(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
  }

  return (
    <article className="group bg-card rounded-md overflow-hidden shadow-card border border-border flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={images[idx]?.url}
          alt={images[idx]?.altText ?? room.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span key={i} className={cn('h-1.5 w-1.5 rounded-full', i === idx ? 'bg-gold' : 'bg-background/60')} />
              ))}
            </div>
          </>
        )}
        <Badge className={cn('absolute top-3 left-3 text-[10px] uppercase tracking-wider', CATEGORY_COLORS[room.category as RoomCategory])}>
          {CATEGORY_LABELS[room.category as RoomCategory]}
        </Badge>
        {room.isFeatured && (
          <Badge className="absolute top-3 right-12 bg-gold text-gold-foreground text-[10px]">Featured</Badge>
        )}
        {onSale && <Badge className="absolute top-10 left-3 bg-destructive text-destructive-foreground text-[10px]">Sale</Badge>}
        {cheapestInCategory && !onSale && (
          <Badge className="absolute top-10 left-3 bg-primary text-primary-foreground text-[10px]">Best Value</Badge>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="Wishlist"
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-red-500 text-red-500')} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-xl">{room.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{room.shortDesc}</p>

        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {amenities.slice(0, 5).map((a) => {
              const Icon = getAmenityIcon(a.icon);
              return (
                <span key={a.id} title={a.name} className="p-1.5 rounded-md bg-secondary/60">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              );
            })}
            {amenities.length > 5 && (
              <Badge variant="outline" className="text-[10px]">+{amenities.length - 5}</Badge>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span>{room.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">({room.reviewCount} reviews)</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{room.bedType}</span>
          <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{room.roomSize} sq ft</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{room.maxGuests} guests</span>
        </div>

        {room.viewType && (
          <Badge variant="secondary" className="mt-2 w-fit text-[10px]">{room.viewType} view</Badge>
        )}

        <MiniAvailabilityCalendar roomId={room.id} />

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl text-gold">{formatPrice(room.pricePerNight)}</div>
            <div className="text-xs text-muted-foreground">per night</div>
            {room.originalPrice && room.originalPrice > room.pricePerNight && (
              <div className="text-sm text-muted-foreground line-through">{formatPrice(room.originalPrice)}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {onCompareToggle && (
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={compareSelected} onChange={() => onCompareToggle(room)} className="rounded" />
                <GitCompareArrows className="h-3 w-3" /> Compare
              </label>
            )}
            <div className="flex gap-2">
              <Link to="/rooms/$slug" params={{ slug: room.slug }}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
              <Button size="sm" onClick={() => onBook(room)} disabled={!room.isAvailable}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
