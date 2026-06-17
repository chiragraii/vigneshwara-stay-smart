import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { RoomImage } from '@/types/room';

export function RoomGallery({ images, name }: { images: RoomImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const primary = sorted[0];
  const rest = sorted.slice(1, 5);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!primary) return null;

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2 h-[280px] md:h-[420px]">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="md:col-span-2 md:row-span-2 overflow-hidden rounded-md"
        >
          <img src={primary.url} alt={primary.altText ?? name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
        </button>
        {rest.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(i + 1)}
            className="overflow-hidden rounded-md hidden md:block"
          >
            <img src={img.url} alt={img.altText ?? name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </button>
        ))}
      </div>

      <Dialog open={lightbox !== null} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {lightbox !== null && (
            <img
              src={sorted[lightbox]?.url}
              alt={sorted[lightbox]?.altText ?? name}
              className="w-full max-h-[85vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
