import * as THREE from 'three';
import { createRenderer, disposeScene, glowTexture, prefersReducedMotion, runLoop, type Cleanup } from './shared';

// Since three r152, Points whose geometry carries a `uv` attribute sample the map per
// vertex instead of across each point sprite, which renders the glow as flat squares.
// Dropping the uvs restores the round glow the original (r128) site had.
function withoutUv(geo: THREE.BufferGeometry) {
  const copy = geo.clone();
  copy.deleteAttribute('uv');
  return copy;
}

/* about panel: rotating 3D wireframe (nested icosahedra) */
export default function initOriginGeometry(canvas: HTMLCanvasElement, panel: HTMLElement): Cleanup {
  const reduced = prefersReducedMotion();
  const renderer = createRenderer(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const outer = new THREE.Group();
  const outerBase = new THREE.IcosahedronGeometry(2.7, 1);
  outer.add(new THREE.LineSegments(new THREE.WireframeGeometry(outerBase), new THREE.LineBasicMaterial({ color: 0x4eeab3, transparent: true, opacity: 0.45 })));
  outer.add(new THREE.Points(withoutUv(outerBase), new THREE.PointsMaterial({
    size: 0.22, map: glowTexture(), color: 0x4eeab3, transparent: true, opacity: 0.9,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  })));
  scene.add(outer);

  const inner = new THREE.Group();
  const innerBase = new THREE.IcosahedronGeometry(1.55, 0);
  inner.add(new THREE.LineSegments(new THREE.WireframeGeometry(innerBase), new THREE.LineBasicMaterial({ color: 0x5ff3e6, transparent: true, opacity: 0.65 })));
  inner.add(new THREE.Points(withoutUv(innerBase), new THREE.PointsMaterial({
    size: 0.28, map: glowTexture(), color: 0x5ff3e6, transparent: true, opacity: 1,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  })));
  scene.add(inner);

  function resize() {
    const s = Math.min(panel.clientWidth, panel.clientHeight);
    if (!s) return;
    renderer.setSize(s, s, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const stopLoop = runLoop(panel, 0.05, reduced, () => {
    outer.rotation.y += 0.0032;
    outer.rotation.x += 0.0011;
    inner.rotation.y -= 0.0048;
    inner.rotation.x -= 0.0018;
  }, () => renderer.render(scene, camera));

  return () => {
    stopLoop();
    window.removeEventListener('resize', resize);
    disposeScene(scene, renderer);
  };
}
