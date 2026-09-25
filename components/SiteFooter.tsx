import BrandMark from './BrandMark';
import SmartLink from './SmartLink';

/* onHome: section links are same-page anchors and placeholder socials point at #top;
   elsewhere they point back to the homepage, exactly as the original pages did */
export default function SiteFooter({ onHome }: { onHome: boolean }) {
  const base = onHome ? '' : '/';
  const home = onHome ? '#top' : '/';

  const columns = [
    { title: 'Company', links: [['About', `${base}#about`], ['Work', `${base}#work`], ['Contact', `${base}#contact`]] },
    { title: 'Services', links: [['Blockchain & Web3', `${base}#services`], ['AI & Automation', `${base}#services`], ['Software Engineering', `${base}#services`]] },
    { title: 'Resources', links: [['Case Studies', `${base}#work`], ['Capabilities', `${base}#capabilities`], ['Process', `${base}#process`]] },
    { title: 'Connect', links: [['Email', 'mailto:hello@ledgergeeks.dev'], ['Twitter / X', home], ['GitHub', home], ['LinkedIn', home]] },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <BrandMark href={home} />
        <p className="footer-tag">Blockchain &amp; AI engineering for products that have to work.</p>
      </div>

      <div className="footer-cols">
        {columns.map(col => (
          <div className="footer-col" key={col.title}>
            <h5>{col.title}</h5>
            {col.links.map(([label, href]) => <SmartLink key={label} href={href}>{label}</SmartLink>)}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 Ledger Geeks. All rights reserved.</span>
        <span>Designed &amp; engineered in-house.</span>
      </div>
    </footer>
  );
}
