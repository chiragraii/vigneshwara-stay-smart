import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useBookedDates } from '@/hooks/useRoomDetail';
import { cn } from '@/lib/utils';

export function MiniAvailabilityCalendar({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const { data } = useBookedDates(roomId, open);

  const disabled = data?.dates.map((d) => new Date(d + 'T00:00:00')) ?? [];

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs text-gold hover:underline"
      >
        {open ? 'Hide dates' : 'Check dates'}
      </button>
      {open && (
        <div className="mt-2 border border-border rounded-md p-2 bg-secondary/30">
          <Calendar
            mode="single"
            disabled={disabled}
            className={cn('mx-auto text-xs')}
            modifiers={{ booked: disabled }}
            modifiersClassNames={{ booked: 'bg-destructive/20 text-destructive line-through' }}
          />
          <p className="text-[10px] text-muted-foreground text-center mt-1">Red = booked</p>
        </div>
      )}
    </div>
  );
}
