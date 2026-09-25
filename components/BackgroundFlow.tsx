'use client';

import { useEffect, useRef } from 'react';
import { mulberry32 } from '@/lib/random';

type Point = { x: number; y: number };

/* ambient background: a faint static line lattice behind the whole page */
export default function BackgroundFlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0, h = 0;
    let edges: { key: string; a: Point; b: Point }[] = [];
    const rand = mulberry32(303);

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // canvas is position:fixed at 100vw/100vh — its drawing buffer must match that
      // exactly, or the browser scales the whole thing and nodes render squashed/tiny
      w = window.innerWidth; h = window.innerHeight;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(50, Math.floor((w * h) / 90000)));
      const nodes: Point[] = Array.from({ length: count }, () => ({ x: rand() * w, y: rand() * h }));
      edges = [];
      nodes.forEach((n, i) => {
        const targets = nodes
          .map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
          .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
        targets.forEach(t => {
          const key = [i, t.j].sort().join('-');
          if (!edges.find(e => e.key === key)) edges.push({ key, a: n, b: nodes[t.j] });
        });
      });
    }

    // static — just a faint line lattice, no travelling dots
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineWidth = 1;
      edges.forEach(e => {
        ctx!.strokeStyle = 'rgba(140,220,195,0.06)';
        ctx!.beginPath(); ctx!.moveTo(e.a.x, e.a.y); ctx!.lineTo(e.b.x, e.b.y); ctx!.stroke();
      });
    }

    function onResize() { build(); draw(); }
    window.addEventListener('resize', onResize, { passive: true });
    build();
    draw();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <canvas ref={ref} id="bgFlowCanvas" />;
}
