import * as THREE from 'three';
import {
  createRenderer, disposeScene, fibonacciSphere, glowTexture, mulberry32,
  nearestNeighbourEdges, pointsGeometry, prefersReducedMotion, runLoop, type Cleanup,
} from './shared';

/* hero: real 3D blockchain node network */
export default function initHeroNetwork(canvas: HTMLCanvasElement, heroSection: HTMLElement): Cleanup {
  const reduced = prefersReducedMotion();
  const renderer = createRenderer(canvas);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050c09, 0.028);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
  camera.position.set(0, 0, 36);

  const group = new THREE.Group();
  scene.add(group);

  const N = 76;
  const RADIUS = 15;
  const pts = fibonacciSphere(N, RADIUS);
  const rand = mulberry32(41);
  // small jitter so the sphere reads as an organic network, not a perfect geodesic
  pts.forEach(p => {
    p.x += (rand() - 0.5) * 1.4;
    p.y += (rand() - 0.5) * 1.4;
    p.z += (rand() - 0.5) * 1.4;
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(nearestNeighbourEdges(pts), 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x8ff7dc, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // a soft glow marking each vertex — small, only where lines actually meet
  const vertexMat = new THREE.PointsMaterial({
    size: 0.85, map: glowTexture(), color: 0x4eeab3, transparent: true, opacity: 0.9,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  group.add(new THREE.Points(pointsGeometry(pts), vertexMat));

  // a sparse outer wireframe halo for depth (also lines only)
  const HALO_N = 40;
  const haloPts = fibonacciSphere(HALO_N, 24);
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(nearestNeighbourEdges(haloPts), 3));
  const haloMat = new THREE.LineBasicMaterial({
    color: 0x5ff3e6, transparent: true, opacity: 0.25,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const halo = new THREE.LineSegments(haloGeo, haloMat);
  group.add(halo);

  const haloVertexMat = new THREE.PointsMaterial({
    size: 0.6, map: glowTexture(), color: 0x5ff3e6, transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  group.add(new THREE.Points(pointsGeometry(haloPts), haloVertexMat));

  function resize() {
    const w = heroSection.clientWidth, h = heroSection.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let mouseX = 0, mouseY = 0;
  function onMouseMove(e: MouseEvent) {
    const r = heroSection.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / r.width - 0.5;
    mouseY = (e.clientY - r.top) / r.height - 0.5;
  }
  heroSection.addEventListener('mousemove', onMouseMove);

  const stopLoop = runLoop(heroSection, 0.02, reduced, () => {
    group.rotation.y += 0.0016;
    halo.rotation.y -= 0.0009;
    camera.position.x += (mouseX * 7 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
  }, () => renderer.render(scene, camera));

  return () => {
    stopLoop();
    window.removeEventListener('resize', resize);
    heroSection.removeEventListener('mousemove', onMouseMove);
    disposeScene(scene, renderer);
  };
}
