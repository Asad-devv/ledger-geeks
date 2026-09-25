'use client';

import { useEffect, useState } from 'react';
import BrandMark from './BrandMark';
import SmartLink from './SmartLink';

type Props = {
  /** true on the homepage: section links are same-page anchors */
  onHome: boolean;
  /** render the solid (scrolled) style before the first scroll event */
  initiallySolid?: boolean;
  cta: { label: string; href: string };
};

const SECTIONS = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export default function SiteHeader({ onHome, initiallySolid = false, cta }: Props) {
  const [solid, setSolid] = useState(initiallySolid);
  const [menuOpen, setMenuOpen] = useState(false);
  const base = onHome ? '' : '/';

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={solid ? 'nav solid' : 'nav'} id="siteNav">
        <BrandMark href={onHome ? '#top' : '/'} label="Ledger Geeks home" />

        <nav className="nav-links">
          {SECTIONS.map(s => <SmartLink key={s.id} href={`${base}#${s.id}`}>{s.label}</SmartLink>)}
        </nav>

        <SmartLink href={cta.href} className="btn btn-nav btn-ghost">{cta.label}</SmartLink>

        <button className="nav-toggle" id="navToggle" aria-label="Toggle menu" onClick={() => setMenuOpen(o => !o)}>
          <span></span><span></span><span></span>
        </button>
      </header>

      <div className={menuOpen ? 'mobile-menu open' : 'mobile-menu'} id="mobileMenu">
        {SECTIONS.map(s => (
          <SmartLink key={s.id} href={`${base}#${s.id}`} onClick={closeMenu}>{s.label}</SmartLink>
        ))}
        <SmartLink href={cta.href} className="btn btn-primary" onClick={closeMenu}>{cta.label}</SmartLink>
      </div>
    </>
  );
}
