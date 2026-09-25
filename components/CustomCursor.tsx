'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const HOVER_SEL = 'a, button, .btn, .work-card, .consult-day, .consult-slot, input, textarea, select';
const FINE_POINTER = '(pointer:fine)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/* custom cursor: accent dot + trailing ring that grows over interactive elements */
export default function CustomCursor() {
  const finePointer = useSyncExternalStore(subscribe, () => window.matchMedia(FINE_POINTER).matches, () => false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current, ring = ringRef.current;
    if (!finePointer || !dot || !ring) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    // how much of the remaining gap the ring closes each frame (higher = snappier)
    const RING_FOLLOW = 0.35;
    let mx = 0, my = 0, rx = 0, ry = 0, shown = false, frame = 0;

    // positioned with transforms (GPU-composited, no layout work) rather than left/top
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    function onMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY;
      place(dot!, mx, my);
      if (!shown) {
        shown = true;
        // start the ring on the pointer instead of flying in from the corner
        rx = mx; ry = my;
        dot!.classList.add('shown'); ring!.classList.add('shown');
      }
    }
    function onLeave() { dot!.classList.remove('shown'); ring!.classList.remove('shown'); shown = false; }
    function onOver(e: MouseEvent) {
      if ((e.target as Element).closest?.(HOVER_SEL)) { ring!.classList.add('big'); dot!.classList.add('big'); }
    }
    function onOut(e: MouseEvent) {
      if ((e.target as Element).closest?.(HOVER_SEL)) { ring!.classList.remove('big'); dot!.classList.remove('big'); }
    }
    function raf() {
      rx += (mx - rx) * RING_FOLLOW; ry += (my - ry) * RING_FOLLOW;
      place(ring!, rx, ry);
      frame = requestAnimationFrame(raf);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      root.classList.remove('has-custom-cursor');
    };
  }, [finePointer]);

  if (!finePointer) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
