import Link from 'next/link';
import type { ComponentProps } from 'react';

/* Same-page hash and mailto links stay native anchors (native smooth scroll, like the
   original site); anything that changes route goes through next/link. */
export default function SmartLink({ href, ...rest }: ComponentProps<'a'> & { href: string }) {
  if (href.startsWith('#') || href.startsWith('mailto:')) return <a href={href} {...rest} />;
  return <Link href={href} {...rest} />;
}
