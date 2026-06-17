import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatPrice } from '@/utils/formatters';
import { CATEGORY_LABELS, type Room } from '@/types/room';
import { getAmenityIcon } from './amenityIcons';

interface CompareDrawerProps {
  rooms: Room[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (id: string) => void;
}

export function CompareTray({
  rooms,
  onCompare,
  onRemove,
}: {
  rooms: Room[];
  onCompare: () => void;
  onRemove: (id: string) => void;
}) {
  if (rooms.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur p-4 shadow-elegant">
      <div className="container-narrow flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          {rooms.map((r) => (
            <div key={r.id} className="relative shrink-0">
              <img
                src={r.images?.[0]?.url ?? '/images/rooms/room-1.jpg'}
                alt={r.name}
                className="h-14 w-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => onRemove(r.id)}
                className="absolute -top-1 -right-1 bg-background border rounded-full p-0.5"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <span className="text-sm text-muted-foreground">{rooms.length}/3 selected</span>
        </div>
        <Button onClick={onCompare} disabled={rooms.length < 2}>
          Compare Now
        </Button>
      </div>
    </div>
  );
}

export function CompareDrawer({ rooms, open, onOpenChange, onRemove }: CompareDrawerProps) {
  const allAmenityNames = [...new Set(rooms.flatMap((r) => (r.amenities ?? []).map((a) => a.name)))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <h2 className="font-display text-2xl mb-4">Compare Rooms</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-border w-32" />
                {rooms.map((r) => (
                  <th key={r.id} className="p-2 border-b border-border min-w-[180px]">
                    <button type="button" onClick={() => onRemove(r.id)} className="float-right"><X className="h-4 w-4" /></button>
                    <img src={r.images?.[0]?.url} alt="" className="h-24 w-full object-cover rounded-md mb-2" />
                    <div className="font-display text-lg">{r.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Category</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b">{CATEGORY_LABELS[r.category]}</td>)}
              </tr>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Price/night</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b text-gold font-medium">{formatPrice(r.pricePerNight)}</td>)}
              </tr>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Size</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b">{r.roomSize} sq ft</td>)}
              </tr>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Bed</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b">{r.bedType} × {r.bedCount}</td>)}
              </tr>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Max guests</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b">{r.maxGuests}</td>)}
              </tr>
              <tr>
                <td className="p-2 border-b text-muted-foreground">Rating</td>
                {rooms.map((r) => <td key={r.id} className="p-2 border-b">{r.rating} ({r.reviewCount})</td>)}
              </tr>
              {allAmenityNames.map((name) => (
                <tr key={name}>
                  <td className="p-2 border-b text-muted-foreground text-xs">{name}</td>
                  {rooms.map((r) => {
                    const has = r.amenities?.some((a) => a.name === name);
                    const icon = r.amenities?.find((a) => a.name === name)?.icon;
                    const Icon = icon ? getAmenityIcon(icon) : null;
                    return (
                      <td key={r.id} className="p-2 border-b text-center">
                        {has ? (Icon ? <Icon className="h-4 w-4 inline text-gold" /> : '✓') : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
