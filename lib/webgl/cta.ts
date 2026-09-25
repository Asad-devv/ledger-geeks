import * as THREE from 'three';
import {
  createRenderer, disposeScene, fibonacciSphere, glowTexture, mulberry32,
  nearestNeighbourEdges, pointsGeometry, prefersReducedMotion, runLoop, type Cleanup,
} from './shared';

/* CTA bookend: smaller reprise of the hero's 3D network */
export default function initCtaNetwork(canvas: HTMLCanvasElement, section: HTMLElement): Cleanup {
  const reduced = prefersReducedMotion();
  const renderer = createRenderer(canvas);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x081712, 0.03);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
  camera.position.set(0, 0, 32);

  const group = new THREE.Group();
  scene.add(group);

  const N = 34;
  const pts = fibonacciSphere(N, 13);
  const rand = mulberry32(19);
  pts.forEach(p => { p.x += (rand() - 0.5) * 1.2; p.y += (rand() - 0.5) * 1.2; p.z += (rand() - 0.5) * 1.2; });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(nearestNeighbourEdges(pts), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5ff3e6, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  const vertexMat = new THREE.PointsMaterial({
    size: 0.8, map: glowTexture(), color: 0x4eeab3, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  group.add(new THREE.Points(pointsGeometry(pts), vertexMat));

  function resize() {
    const w = section.clientWidth, h = section.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const stopLoop = runLoop(section, 0.05, reduced, () => {
    group.rotation.y -= 0.0011;
  }, () => renderer.render(scene, camera));

  return () => {
    stopLoop();
    window.removeEventListener('resize', resize);
    disposeScene(scene, renderer);
  };
}
