import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/Reveal';
import CheckIcon from '@/components/CheckIcon';
import BookingCard from '@/components/BookingCard';
import { getBookingDays } from '@/lib/booking';

const title = 'Book a Consultation — Ledger Geeks';
const description = 'Book a free 30-minute consultation with Ledger Geeks to scope your blockchain or AI project.';

// re-render hourly so the offered days always start from tomorrow
export const revalidate = 3600;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

const steps = [
  { title: 'Tell us about your project', body: 'A short intake so the call starts with context, not a cold pitch.' },
  { title: 'We review technical fit', body: "A senior engineer looks at what you've sent before the call — not a salesperson." },
  { title: '30-minute call, real answers', body: 'Scope, rough timeline, and whether Ledger Geeks is the right fit — even if the answer is no.' },
];

const assurances = [
  'No commitment, no upfront payment',
  'A senior engineer on every call, not sales',
  "We'll tell you if we're not the right fit",
];


export default function ConsultationPage() {
  return (
    <>
      <SiteHeader onHome={false} initiallySolid cta={{ label: 'Back to site', href: '/' }} />

      <main id="top">
        <section className="consult-hero">
          <p className="eyebrow">Get Started</p>
          <h1 style={{ fontSize: 'clamp(34px,5.4vw,58px)', maxWidth: '16ch' }}>Book a free consultation.</h1>
          <p className="body-lg" style={{ marginTop: 20, maxWidth: '60ch' }}>30 minutes, no slides. Tell us what
            you&apos;re building — blockchain, AI, or both — and you&apos;ll leave with an honest read on scope,
            timeline, and whether we&apos;re the right team for it.</p>
        </section>

        <section className="consult-grid">
          <Reveal>
            <p className="eyebrow">What to expect</p>
            <div className="consult-steps">
              {steps.map((s, i) => (
                <div className="consult-step" key={s.title}>
                  <span className="consult-step-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <div><h4>{s.title}</h4><p>{s.body}</p></div>
                </div>
              ))}
            </div>

            <div className="consult-assurances">
              {assurances.map(a => <div key={a}><CheckIcon size={15} /> {a}</div>)}
            </div>
          </Reveal>

          <Reveal>
            <BookingCard days={getBookingDays()} />
          </Reveal>
        </section>
      </main>

      <SiteFooter onHome={false} />
    </>
  );
}
