import SmartLink from './SmartLink';

/* logo lockup used in the header and footer */
export default function BrandMark({ href, label }: { href: string; label?: string }) {
  return (
    <SmartLink href={href} className="nav-mark" aria-label={label}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#0a1a14" />
        <rect x="8" y="9" width="16" height="2.6" rx="1.3" fill="#4eeab3" />
        <rect x="8" y="15" width="16" height="2.6" rx="1.3" fill="#eef4f0" />
        <rect x="8" y="21" width="10" height="2.6" rx="1.3" fill="#4eeab3" />
      </svg>
      <span>Ledger&nbsp;Geeks</span>
    </SmartLink>
  );
}
