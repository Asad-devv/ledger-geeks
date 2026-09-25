import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import WorkCard from '@/components/WorkCard';
import SceneCanvas from '@/components/SceneCanvas';

const title = 'Ledger Geeks — Blockchain & AI Engineering';
const description = 'Ledger Geeks designs, builds, and scales blockchain and AI-driven products for startups and businesses worldwide.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

const trustItems = ['Ethereum', 'Solana', 'Polygon', 'Base', 'Arbitrum', 'AWS', 'Google Cloud'];
const marqueeItems = ['Blockchain & Web3', 'AI & Automation', 'Smart Contract Audits', 'Software Engineering', 'Cloud & Infrastructure'];

const services = [
  {
    num: '001', title: 'Blockchain & Web3',
    body: 'Smart contracts and on-chain infrastructure engineered with the same rigor as traditional finance systems — audited, tested, and production-grade from day one.',
    tags: ['Smart Contracts', 'Protocol Design', 'Chain Infrastructure', 'Security Audits'],
  },
  {
    num: '002', title: 'AI & Automation',
    body: "LLM-integrated products and automation pipelines that replace the repetitive work your team shouldn't be doing — built on real infrastructure, not demo-ware.",
    tags: ['LLM Integration', 'Workflow Automation', 'AI Data Pipelines', 'Intelligent Agents'],
  },
  {
    num: '003', title: 'Software Engineering',
    body: 'Full-stack products built to scale — backend architecture, APIs, cloud infrastructure, and frontend experiences engineered for growth, not just launch day.',
    tags: ['Backend & APIs', 'Cloud & DevOps', 'Web & Mobile', 'Systems Integration'],
  },
];

const processSteps = [
  { title: 'Discover', body: 'We map the problem, the users, and the technical constraints before writing a line of code.' },
  { title: 'Design', body: 'Architecture and product design happen together, so the system is buildable from day one.' },
  { title: 'Build', body: 'Senior engineers ship in short, reviewable increments — you see progress every week.' },
  { title: 'Launch', body: 'Audits, load-testing, and rollout planning — launch day is a formality, not a gamble.' },
  { title: 'Scale', body: 'We stay on as the system grows, tuning performance, security, and cost as you scale.' },
];

const stats = [
  { target: 60, decimals: 0, suffix: '+', label: 'Products shipped' },
  { target: 12, decimals: 0, suffix: '', label: 'Chains supported' },
  { target: 99.98, decimals: 2, suffix: '%', label: 'Uptime across client systems' },
  { target: 8, decimals: 0, suffix: ' yrs', label: 'Average engineer experience' },
];

const capabilities = [
  ['Blockchain', 'Solidity · EVM Chains · Solana / Rust · Layer 2s · Cross-Chain'],
  ['AI & ML', 'Python · OpenAI / Gemini / Claude APIs · LangChain · Vector DBs · n8n'],
  ['Backend & Infra', 'Node.js · Go · Rust · PostgreSQL · Kubernetes · AWS / GCP'],
  ['Frontend', 'React · Next.js · TypeScript · React Native'],
  ['Security', 'Contract Audits · Penetration Testing · Zero-Trust Architecture'],
];

const work = [
  {
    tags: ['Web3', 'DeFi'],
    art: <svg viewBox="0 0 200 140" className="work-art"><rect x="20" y="90" width="18" height="30" fill="#4eeab3" /><rect x="48" y="70" width="18" height="50" fill="#1c3a30" /><rect x="76" y="50" width="18" height="70" fill="#4eeab3" opacity=".55" /><rect x="104" y="30" width="18" height="90" fill="#1c3a30" /><rect x="132" y="60" width="18" height="60" fill="#4eeab3" opacity=".3" /></svg>,
    title: 'Lending Protocol Infrastructure',
    description: 'Smart-contract architecture and risk engine for an on-chain lending platform.',
    metric: 'Live risk engine processing collateral positions in real time',
  },
  {
    tags: ['SaaS', 'Cloud'],
    art: <svg viewBox="0 0 200 140" className="work-art"><circle cx="60" cy="70" r="34" fill="none" stroke="#4eeab3" strokeWidth="2" /><circle cx="130" cy="70" r="50" fill="none" stroke="#1c3a30" strokeWidth="2" /><circle cx="95" cy="70" r="4" fill="#4eeab3" /></svg>,
    title: 'Enterprise SaaS Rebuild',
    description: 'Full-stack re-architecture of a legacy platform onto modern cloud infrastructure.',
    metric: 'Migrated with zero downtime, latency cut by 60%',
  },
  {
    tags: ['Web3', 'Security'],
    art: <svg viewBox="0 0 200 140" className="work-art"><rect x="30" y="30" width="140" height="18" rx="4" fill="#1c3a30" /><rect x="30" y="61" width="140" height="18" rx="4" fill="#4eeab3" opacity=".5" /><rect x="30" y="92" width="90" height="18" rx="4" fill="#1c3a30" /></svg>,
    title: 'Cross-Chain Bridge',
    description: 'Secure asset-transfer infrastructure spanning four EVM-compatible networks.',
    metric: 'Independently audited, zero critical findings at launch',
  },
  {
    tags: ['Fintech', 'Mobile'],
    art: <svg viewBox="0 0 200 140" className="work-art"><path d="M20 110 C60 40, 140 40, 180 110" fill="none" stroke="#4eeab3" strokeWidth="2" /><circle cx="20" cy="110" r="5" fill="#4eeab3" /><circle cx="180" cy="110" r="5" fill="#1c3a30" /></svg>,
    title: 'Fintech Mobile Platform',
    description: 'Consumer banking app with real-time ledgering and regulatory-grade audit trails.',
    metric: 'Live in market, passed regulatory audit on first submission',
  },
];

const quotes = [
  { text: '"Ledger Geeks didn\'t just build what we asked for — they told us what we actually needed."', cite: 'Founder, fintech startup' },
  { text: '"They wired our support pipeline into an LLM without breaking anything that mattered. The most technically rigorous team we\'ve worked with."', cite: 'CTO, AI-native SaaS platform' },
  { text: '"They shipped our protocol audit-ready on the first pass."', cite: 'Head of Engineering, DeFi protocol' },
];

const FLOW_D = 'M50,0 C85,50 85,75 50,125 C15,175 15,200 50,250 C85,300 85,325 50,375 C15,425 15,450 50,500 C85,550 85,575 50,625 C15,675 15,700 50,750 C85,800 85,825 50,875 C15,925 15,950 50,1000';

export default function HomePage() {
  return (
    <>
      <SiteHeader onHome cta={{ label: 'Start a project', href: '/consultation' }} />

      <main id="top">

        {/* HERO */}
        <section className="hero" id="hero">
          <SceneCanvas scene="hero" id="heroWebgl" className="hero-canvas" />
          <div className="hero-vignette"></div>
          <div className="hero-copy">
            <div className="hero-avail"><span className="hero-dot"></span> Available for new engagements</div>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Ledger Geeks · Blockchain &amp; AI Engineering</p>
            <h1 className="hero-title">Blockchain &amp; AI.<br />Built to Ship.</h1>
            <p className="hero-sub">We design, build, and scale blockchain and AI-driven systems — from
              production smart contracts to intelligent automation platforms — backed by full-stack
              engineering that ships.</p>
            <div className="hero-actions">
              <Link href="/consultation" className="btn btn-primary">Start a project</Link>
              <a href="#work" className="btn btn-ghost">See our work</a>
            </div>
          </div>
          <div className="scroll-cue"><span></span>Scroll</div>
        </section>

        <div className="flow-wrap">
          <svg className="flow-path" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                {['0%', '14%', '28%', '42%', '56%', '70%', '84%', '100%'].map((offset, i) => (
                  <stop key={offset} offset={offset} stopColor={i % 2 ? '#5ff3e6' : '#4eeab3'} />
                ))}
              </linearGradient>
              <filter id="flowBlurOuter" x="-100%" y="-5%" width="300%" height="110%">
                <feGaussianBlur stdDeviation="34" />
              </filter>
              <filter id="flowBlurInner" x="-100%" y="-5%" width="300%" height="110%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            {/* deliberately soft — this is ambient depth, not a drawn line. no crisp core. */}
            <path d={FLOW_D} fill="none" stroke="url(#flowGrad)" strokeWidth="58" strokeLinecap="round"
              opacity="0.055" filter="url(#flowBlurOuter)" />
            <path d={FLOW_D} fill="none" stroke="url(#flowGrad)" strokeWidth="24" strokeLinecap="round"
              opacity="0.07" filter="url(#flowBlurInner)" />
          </svg>

          <Reveal className="trust-bar">
            <p className="trust-label">Built on</p>
            {/* list is doubled so the marquee loops seamlessly */}
            <div className="trust-row" id="trustRow">
              {[...trustItems, ...trustItems].map((t, i) => <span key={i}>{t}</span>)}
            </div>
          </Reveal>

          <div className="marquee-outer">
            <div className="marquee-strip">
              <div className="marquee-track" id="marqueeTrack">
                {[...marqueeItems, ...marqueeItems].map((t, i) => <span key={i}>{t}</span>)}
              </div>
            </div>
          </div>

          {/* MANIFESTO */}
          <Reveal as="section" className="section manifesto">
            <p className="manifesto-text">Good software is a promise.<br />We keep it <span className="accent">in code.</span></p>
          </Reveal>

          {/* ABOUT */}
          <section className="section origin" id="about">
            <div className="split">
              <Reveal className="split-text">
                <p className="eyebrow">About</p>
                <h2>Built by engineers,<br />not account managers.</h2>
                <p className="body-lg">Ledger Geeks started with a simple frustration: most agencies ship
                  prototypes and call it a product. We work the other way — architecture first, then
                  design, then code that&apos;s built to survive real users, real scale, and real adversaries.</p>
                <p className="body-lg">Every engagement is led by senior engineers who&apos;ve shipped production
                  systems before, across fintech, consumer platforms, and on-chain infrastructure. No
                  hand-offs to juniors you never meet.</p>
              </Reveal>
              <Reveal className="split-visual">
                <div className="mono-panel">
                  {Array.from({ length: 6 }, (_, i) => <div className="mono-panel-row" key={i}></div>)}
                  <SceneCanvas scene="origin" id="originWebgl" className="origin-webgl" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* SERVICES */}
          <section className="section services" id="services">
            <Reveal className="section-head">
              <p className="eyebrow">Services</p>
              <h2>Three disciplines. One team.</h2>
            </Reveal>

            {services.map(s => (
              <Reveal className="service-row" key={s.num}>
                <div className="service-num mono">{s.num}</div>
                <div className="service-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <ul className="tag-list">
                    {s.tags.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </section>

          {/* PROCESS */}
          <section className="section process" id="process">
            <Reveal className="section-head">
              <p className="eyebrow">Process</p>
              <h2>How an engagement runs.</h2>
            </Reveal>
            <div className="process-grid">
              {processSteps.map((s, i) => (
                <Reveal className="process-step" key={s.title}>
                  <span className="mono step-index">{String(i + 1).padStart(2, '0')}</span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* NUMBERS */}
          <Reveal as="section" className="section numbers">
            <div className="numbers-grid">
              {stats.map(s => (
                <div className="stat" key={s.label}>
                  <span className="stat-num"><CountUp target={s.target} decimals={s.decimals} />{s.suffix}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CAPABILITIES */}
          <section className="section capabilities" id="capabilities">
            <Reveal className="section-head">
              <p className="eyebrow">Capabilities</p>
              <h2>The stack we build with.</h2>
            </Reveal>
            <Reveal className="cap-table">
              {capabilities.map(([key, val]) => (
                <div className="cap-row" key={key}>
                  <div className="cap-key">{key}</div>
                  <div className="cap-val">{val}</div>
                </div>
              ))}
            </Reveal>
          </section>

          {/* WORK */}
          <section className="section work" id="work">
            <Reveal className="section-head">
              <p className="eyebrow">Selected Work</p>
              <h2>Representative engagements.</h2>
            </Reveal>
            <div className="work-grid">
              {work.map((w, i) => (
                <WorkCard key={w.title} index={String(i + 1).padStart(2, '0')} {...w} />
              ))}
            </div>
          </section>

          {/* VOICES */}
          <section className="section voices">
            <Reveal className="section-head">
              <p className="eyebrow">Voices</p>
              <h2>What partners say.</h2>
            </Reveal>
            <div className="quote-grid">
              {quotes.map(q => (
                <Reveal as="blockquote" key={q.cite}>
                  <p>{q.text}</p>
                  <cite>{q.cite}</cite>
                </Reveal>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="section cta-band" id="contact">
            <SceneCanvas scene="cta" id="ctaWebgl" className="cta-webgl" />
            <Reveal>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>Get Started</p>
              <h2>Have a system worth<br />building right?</h2>
              <p className="body-lg">Tell us what you&apos;re building. We&apos;ll tell you honestly whether we&apos;re the
                right team for it.</p>
              <Link href="/consultation" className="btn btn-primary btn-lg">Start a project</Link>
            </Reveal>
          </section>

        </div>

      </main>

      <SiteFooter onHome />
    </>
  );
}
