import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingWidget } from './BookingWidget';
import type { Room } from '@/types/room';

interface BookingModalProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ room, open, onOpenChange }: BookingModalProps) {
  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book {room.name}</DialogTitle>
        </DialogHeader>
        <BookingWidget room={room} compact onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
