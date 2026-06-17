import { Star } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import type { Review } from '@/types/room';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border border-border rounded-md p-5 bg-card">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium text-sm">{review.guestName}</div>
        {review.isVerified && (
          <span className="text-[10px] uppercase tracking-wider text-gold">Verified stay</span>
        )}
      </div>
      <div className="flex items-center gap-0.5 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      <time className="mt-3 block text-xs text-muted-foreground">{formatDate(review.stayDate)}</time>
    </article>
  );
}
