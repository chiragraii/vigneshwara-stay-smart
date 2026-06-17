import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Minus, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { roomsApi } from '@/api/roomsApi';
import { calcTotalWithGst, formatDate, formatPrice, nightsBetween } from '@/utils/formatters';
import { useBookedDates } from '@/hooks/useRoomDetail';
import { toast } from 'sonner';
import type { Room, BookingResponse } from '@/types/room';
import { cn } from '@/lib/utils';

interface BookingWidgetProps {
  room: Room;
  compact?: boolean;
  onSuccess?: (booking: BookingResponse) => void;
}

export function BookingWidget({ room, compact, onSuccess }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingResponse | null>(null);

  const { data: bookedData } = useBookedDates(room.id);
  const disabledDates = bookedData?.dates.map((d) => new Date(d + 'T00:00:00')) ?? [];

  const checkInStr = checkIn?.toISOString().slice(0, 10) ?? '';
  const checkOutStr = checkOut?.toISOString().slice(0, 10) ?? '';
  const nights = nightsBetween(checkInStr, checkOutStr);
  const total = calcTotalWithGst(room.pricePerNight, nights);

  const checkMutation = useMutation({
    mutationFn: () =>
      roomsApi.checkAvailability({
        roomId: room.id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
      }),
    onSuccess: (res) => {
      setAvailable(res.available);
      setShowForm(res.available);
      if (!res.available) toast.error('Room no longer available for selected dates');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bookMutation = useMutation({
    mutationFn: (form: { name: string; email: string; phone: string; notes: string }) =>
      roomsApi.createBooking({
        roomId: room.id,
        guestName: form.name,
        guestEmail: form.email,
        guestPhone: form.phone,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        specialRequests: form.notes,
        numGuests: guests,
      }),
    onSuccess: (b) => {
      setConfirmed(b);
      toast.success(`Booking confirmed! ID: #${b.confirmationId}`);
      onSuccess?.(b);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (confirmed) {
    return (
      <div className="bg-card border border-border rounded-md p-6 shadow-card text-center">
        <CheckCircle2 className="h-10 w-10 text-gold mx-auto" />
        <h3 className="font-display text-xl mt-3">Booking Confirmed</h3>
        <p className="text-sm text-muted-foreground mt-2">Confirmation ID: #{confirmed.confirmationId}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatDate(confirmed.checkIn)} → {formatDate(confirmed.checkOut)}</p>
        <p className="font-display text-gold text-xl mt-3">{formatPrice(confirmed.totalAmount)}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-card border border-border rounded-md p-6 shadow-card', compact ? '' : 'sticky top-24')}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Book this room</div>
      <div className="font-display text-2xl text-gold mt-1">{formatPrice(room.pricePerNight)}<span className="text-sm text-muted-foreground font-sans"> / night</span></div>

      <div className="mt-5 space-y-4">
        <div>
          <Label>Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start mt-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? formatDate(checkIn) : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={disabledDates} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start mt-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? formatDate(checkOut) : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={[...disabledDates, ...(checkIn ? [{ before: checkIn }] : [])]} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Guests</Label>
          <div className="flex items-center gap-3 mt-1">
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(Math.max(1, guests - 1))}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm">{guests}</span>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(Math.min(room.maxGuests, guests + 1))}>
              <Plus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground">Max {room.maxGuests}</span>
          </div>
        </div>

        {nights > 0 && (
          <div className="text-sm space-y-1 border-t border-border pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">{nights} nights</span><span>{formatPrice(room.pricePerNight * nights)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatPrice(total - room.pricePerNight * nights)}</span></div>
            <div className="flex justify-between font-medium pt-1"><span>Total</span><span className="text-gold font-display text-lg">{formatPrice(total)}</span></div>
          </div>
        )}

        {!showForm ? (
          <Button
            className="w-full"
            disabled={!checkIn || !checkOut || nights < 1 || checkMutation.isPending}
            onClick={() => checkMutation.mutate()}
          >
            {checkMutation.isPending ? 'Checking…' : 'Check Availability'}
          </Button>
        ) : available ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              bookMutation.mutate({
                name: String(fd.get('name')),
                email: String(fd.get('email')),
                phone: String(fd.get('phone')),
                notes: String(fd.get('notes') ?? ''),
              });
            }}
          >
            <div><Label htmlFor="bw-name">Full name</Label><Input id="bw-name" name="name" required /></div>
            <div><Label htmlFor="bw-email">Email</Label><Input id="bw-email" name="email" type="email" required /></div>
            <div><Label htmlFor="bw-phone">Phone</Label><Input id="bw-phone" name="phone" type="tel" required /></div>
            <div><Label htmlFor="bw-notes">Special requests</Label><Textarea id="bw-notes" name="notes" rows={2} /></div>
            <Button type="submit" className="w-full" disabled={bookMutation.isPending}>
              {bookMutation.isPending ? 'Booking…' : 'Confirm Booking'}
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
