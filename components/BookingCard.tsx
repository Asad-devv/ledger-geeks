'use client';

import { useState } from 'react';
import { BOOKING_EMAIL, BOOKING_SLOTS, BOOKING_TZ_LABEL, bookingMailto, type BookingDay } from '@/lib/booking';

/* Day + time picker. Confirming opens the visitor's email client with the chosen slot
   filled in. Swap for a scheduling embed (Cal.com / Calendly) once an account exists. */
export default function BookingCard({ days }: { days: BookingDay[] }) {
  const [dayKey, setDayKey] = useState(days[1]?.key ?? days[0].key);
  const [slot, setSlot] = useState('2:30 PM');
  const day = days.find(d => d.key === dayKey) ?? days[0];

  return (
    <div className="consult-card">
      <div className="consult-card-head">
        <h4>Pick a time</h4>
        <span>{BOOKING_TZ_LABEL}</span>
      </div>
      <div className="consult-days" role="group" aria-label="Day">
        {days.map(d => (
          <button
            type="button"
            key={d.key}
            className={d.key === day.key ? 'consult-day active' : 'consult-day'}
            aria-pressed={d.key === day.key}
            aria-label={d.long}
            onClick={() => setDayKey(d.key)}
          >
            <span className="d">{d.weekday}</span><span className="n">{d.day}</span>
          </button>
        ))}
      </div>
      <div className="consult-slots" role="group" aria-label="Time">
        {BOOKING_SLOTS.map(s => (
          <button
            type="button"
            key={s}
            className={s === slot ? 'consult-slot selected' : 'consult-slot'}
            aria-pressed={s === slot}
            onClick={() => setSlot(s)}
          >
            <span>{s}</span>
          </button>
        ))}
      </div>
      <div className="consult-card-foot">
        <a href={bookingMailto(day, slot)} className="btn btn-primary" style={{ width: '100%' }}>
          Confirm {slot} {day.weekday}
        </a>
        <p>Confirming opens an email to {BOOKING_EMAIL} with your chosen time — add a few lines about your project and send.</p>
      </div>
    </div>
  );
}
