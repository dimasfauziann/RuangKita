import { addMinutes, format, parse, isBefore } from 'date-fns';

interface Booking {
  waktuMulai: string; 
  waktuSelesai: string; 
}

interface Slot {
  time: string;       
  isBooked: boolean;
}

export const generateSlots = (
  startTime: string,
  endTime: string,
  bookings: Booking[]
): Slot[] => {
  const slots: Slot[] = [];
  let current = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());

  while (isBefore(current, end)) {
    const next = addMinutes(current, 30);
    const timeLabel = `${format(current, 'HH:mm')} - ${format(next, 'HH:mm')}`;

    const isBooked = bookings.some(book => {
      const mulai = parse(book.waktuMulai, 'HH:mm', new Date());
      const selesai = parse(book.waktuSelesai, 'HH:mm', new Date());
      return (
        current >= mulai && current < selesai 
      );
    });

    slots.push({ time: timeLabel, isBooked });
    current = next;
  }

  return slots;
};