'use client';

import { useEffect, useRef } from 'react';

const scenes = {
  hero: () => import('@/lib/webgl/hero'),
  cta: () => import('@/lib/webgl/cta'),
  origin: () => import('@/lib/webgl/origin'),
};

type Props = {
  scene: keyof typeof scenes;
  id?: string;
  className?: string;
};

/* WebGL canvas; three.js is loaded lazily so it never blocks first paint.
   The scene sizes itself against the canvas's parent (hero / CTA section, about panel). */
export default function SceneCanvas({ scene, id, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    scenes[scene]()
      .then(({ default: init }) => {
        if (!cancelled) cleanup = init(canvas, container);
      })
      .catch(err => console.warn(`[${scene}] WebGL scene unavailable`, err));

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [scene]);

  return <canvas ref={ref} id={id} className={className} />;
}
