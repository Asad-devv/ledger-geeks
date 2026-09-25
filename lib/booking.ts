/* Consultation booking: which days and slots are offered, in Pakistan time (PKT, UTC+5). */

export const BOOKING_TIMEZONE = 'Asia/Karachi';
export const BOOKING_TZ_LABEL = 'PKT · UTC+5';
export const BOOKING_EMAIL = 'hello@ledgergeeks.dev';
export const BOOKING_SLOTS = ['10:00 AM', '2:30 PM', '4:00 PM', '6:30 PM'];

export type BookingDay = {
  key: string;     // 2026-09-29
  weekday: string; // Tue
  day: string;     // 29
  long: string;    // Tuesday, 29 September 2026
};

/* The next `count` weekdays, starting tomorrow in PKT. */
export function getBookingDays(now = new Date(), count = 5): BookingDay[] {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(now);
  const get = (t: string) => Number(parts.find(p => p.type === t)!.value);
  const [y, m, d] = [get('year'), get('month') - 1, get('day')];

  const days: BookingDay[] = [];
  for (let i = 1; days.length < count; i++) {
    // midnight UTC of the PKT calendar date, formatted back in UTC so the date never shifts
    const date = new Date(Date.UTC(y, m, d + i));
    const dow = date.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    days.push({
      key: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      day: String(date.getUTCDate()),
      long: date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
    });
  }
  return days;
}

export function bookingMailto(day: BookingDay, slot: string) {
  const subject = `Consultation request — ${day.weekday} ${day.day}, ${slot} PKT`;
  const body = [
    'Hi Ledger Geeks,',
    '',
    "I'd like to book a free 30-minute consultation.",
    '',
    `Preferred time: ${day.long} at ${slot} PKT (UTC+5)`,
    '',
    'About my project:',
    '',
    '',
  ].join('\n');
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
