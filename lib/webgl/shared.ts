import * as THREE from 'three';

export { mulberry32 } from '@/lib/random';

// The original site ran three.js r128, which had no colour management. Turning it off
// (and writing linear output) keeps hex colours and additive blending identical.
THREE.ColorManagement.enabled = false;

export type Cleanup = () => void;

export function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r));
  }
  return pts;
}

export function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

// connect each point to its 2 nearest neighbours; returns flat xyz pairs for LineSegments
export function nearestNeighbourEdges(pts: THREE.Vector3[]) {
  const positions: number[] = [];
  pts.forEach((p, i) => {
    const targets = pts
      .map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    targets.forEach(t => {
      positions.push(p.x, p.y, p.z, pts[t.j].x, pts[t.j].y, pts[t.j].z);
    });
  });
  return positions;
}

export function pointsGeometry(pts: THREE.Vector3[]) {
  const arr = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  return geo;
}

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  return renderer;
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// frees GPU resources for everything in a scene
export function disposeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  scene.traverse(obj => {
    const o = obj as THREE.Mesh;
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach(m => {
      (m as THREE.PointsMaterial).map?.dispose();
      m.dispose();
    });
  });
  renderer.dispose();
}

/*
 * Render loop shared by all three scenes, ported as-is from the original main.js:
 * an initial loop is started immediately, and an IntersectionObserver pauses it while
 * the section is off-screen and restarts it when it comes back.
 */
export function runLoop(
  target: Element,
  threshold: number,
  reduced: boolean,
  step: () => void,
  render: () => void,
): Cleanup {
  let running = true;
  let disposed = false;

  function tick() {
    if (!running || disposed) return;
    if (!reduced) step();
    render();
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold });
  io.observe(target);

  render();
  if (!reduced) requestAnimationFrame(tick);

  return () => { disposed = true; io.disconnect(); };
}
