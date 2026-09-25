'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { useReveal } from './Reveal';
import CheckIcon from './CheckIcon';

type Props = {
  index: string;
  tags: string[];
  art: ReactNode;
  title: string;
  description: string;
  metric: string;
};

/* case-study card that tilts toward the cursor */
export default function WorkCard({ index, tags, art, title, description, metric }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <div ref={ref} className="work-card" data-reveal="" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="work-top">
        <span className="work-index">{index}</span>
        <div className="work-tags">{tags.map(t => <span key={t}>{t}</span>)}</div>
      </div>
      {art}
      <h4>{title}</h4>
      <p>{description}</p>
      <div className="work-metric">
        <CheckIcon size={14} />
        <span>{metric}</span>
      </div>
      <a href="#" className="work-link">Read Case Study →</a>
    </div>
  );
}
