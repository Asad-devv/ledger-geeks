'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';

/* Reveal on scroll. Content is visible by default (see [data-reveal] in globals.css);
   only once this runs does the element opt into the hidden-until-scrolled-to animation,
   and a timeout force-reveals it so text can never get stuck invisible. */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('pre');

    const reveal = () => el.classList.add('in');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    io.observe(el);
    const timer = setTimeout(reveal, 2500);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      el.classList.remove('pre', 'in');
    };
  }, [ref]);
}

type Props = {
  as?: 'div' | 'section' | 'blockquote';
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function Reveal({ as: Tag = 'div', children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
