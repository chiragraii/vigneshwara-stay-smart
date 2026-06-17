import { Link } from '@tanstack/react-router';
import { Bed, Heart, Maximize2, Star, Users, GitCompareArrows } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice, isOnSale } from '@/utils/formatters';
import { CATEGORY_COLORS, CATEGORY_LABELS, type Room, RoomCategory } from '@/types/room';
import { getAmenityIcon } from './amenityIcons';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface RoomCardListProps {
  room: Room;
  onBook: (room: Room) => void;
  compareSelected?: boolean;
  onCompareToggle?: (room: Room) => void;
}

export function RoomCardList({ room, onBook, compareSelected, onCompareToggle }: RoomCardListProps) {
  const { toggle, isWishlisted } = useWishlist();
  const image = room.images?.find((i) => i.isPrimary)?.url ?? room.images?.[0]?.url ?? '/images/rooms/room-1.jpg';
  const wishlisted = isWishlisted(room.id);
  const onSale = isOnSale(room.pricePerNight, room.originalPrice);
  const amenities = room.amenities ?? [];

  return (
    <article className="flex flex-col sm:flex-row gap-4 bg-card rounded-md border border-border shadow-card overflow-hidden p-4">
      <div className="relative w-full sm:w-[280px] shrink-0 aspect-[16/10] sm:aspect-auto sm:h-[200px] overflow-hidden rounded-md">
        <img src={image} alt={room.name} loading="lazy" className="h-full w-full object-cover" />
        <Badge className={cn('absolute top-2 left-2 text-[10px]', CATEGORY_COLORS[room.category as RoomCategory])}>
          {CATEGORY_LABELS[room.category as RoomCategory]}
        </Badge>
      </div>

      <div className="flex-1 grid md:grid-cols-[1fr_auto] gap-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-2xl">{room.name}</h3>
            <button type="button" onClick={() => { toggle(room.id); toast.success('Updated wishlist'); }} aria-label="Wishlist">
              <Heart className={cn('h-5 w-5', wishlisted && 'fill-red-500 text-red-500')} />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{room.shortDesc}</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span>{room.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({room.reviewCount})</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{room.bedType}</span>
            <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{room.roomSize} sq ft</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{room.maxGuests}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.slice(0, 8).map((a) => {
              const Icon = getAmenityIcon(a.icon);
              return (
                <span key={a.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" /> {a.name}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-3 min-w-[160px]">
          <div className="text-right">
            {onSale && <Badge className="mb-1 bg-destructive text-[10px]">Sale</Badge>}
            <div className="font-display text-2xl text-gold">{formatPrice(room.pricePerNight)}</div>
            <div className="text-xs text-muted-foreground">per night</div>
          </div>
          {onCompareToggle && (
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={compareSelected} onChange={() => onCompareToggle(room)} />
              <GitCompareArrows className="h-3 w-3" /> Compare
            </label>
          )}
          <div className="flex gap-2">
            <Link to="/rooms/$slug" params={{ slug: room.slug }}>
              <Button variant="outline" size="sm">Details</Button>
            </Link>
            <Button size="sm" onClick={() => onBook(room)}>Book</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
