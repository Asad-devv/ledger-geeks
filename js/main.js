gsap.registerPlugin(ScrollTrigger);

/* ---------- nav ---------- */
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 40);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ---------- ambient background: traveling node connections (whole page) ---------- */
(function bgFlow() {
  const canvas = document.getElementById('bgFlowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [], edges = [];

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(303);

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    // canvas is position:fixed at 100vw/100vh — its drawing buffer must match that
    // exactly, or the browser scales the whole thing and nodes render squashed/tiny
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(24, Math.min(50, Math.floor((w * h) / 90000)));
    nodes = Array.from({ length: count }, () => ({ x: rand() * w, y: rand() * h }));
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
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    edges.forEach(e => {
      ctx.strokeStyle = 'rgba(140,220,195,0.06)';
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });
  }
  window.addEventListener('resize', () => { build(); draw(); }, { passive: true });
  build();
  draw();
})();

/* ---------- custom cursor ---------- */
(function customCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  let mx = 0, my = 0, rx = 0, ry = 0, shown = false;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    if (!shown) { shown = true; dot.classList.add('shown'); ring.classList.add('shown'); }
  });
  window.addEventListener('mouseleave', () => { dot.classList.remove('shown'); ring.classList.remove('shown'); shown = false; });

  function raf() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const HOVER_SEL = 'a, button, .btn, .work-card, .consult-day, .consult-slot, input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SEL)) { ring.classList.add('big'); dot.classList.add('big'); }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SEL)) { ring.classList.remove('big'); dot.classList.remove('big'); }
  });
})();

/* ---------- work card tilt (follows cursor) ---------- */
(function tiltCards() {
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ---------- reveal on scroll ---------- */
/* Elements are visible by default (see CSS). Only once we're sure this script is
   actually running do we opt them into the hidden-until-scrolled-to animation —
   and even then, a timeout force-reveals anything left unrevealed, so text can
   never get stuck invisible. */
(function reveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;
  revealEls.forEach(el => el.classList.add('pre'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2500);
})();

/* ---------- animated stat counters ---------- */
(function countUp() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur = 1600;
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => obs.observe(el));
})();

/* ---------- hero: real 3D blockchain node network (WebGL) ---------- */
(function heroNetwork() {
  const canvas = document.getElementById('heroWebgl');
  const heroSection = document.getElementById('hero');
  if (!canvas || !window.THREE) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050c09, 0.028);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
  camera.position.set(0, 0, 36);

  const group = new THREE.Group();
  scene.add(group);

  function fibonacciSphere(n, r) {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r));
    }
    return pts;
  }

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

  // edges only — connect each node to its 2 nearest neighbors, no node dots
  const edgePositions = [];
  pts.forEach((p, i) => {
    const targets = pts
      .map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    targets.forEach(t => {
      edgePositions.push(p.x, p.y, p.z, pts[t.j].x, pts[t.j].y, pts[t.j].z);
    });
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x4dffc4, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // a sparse outer wireframe halo for depth (also lines only)
  const HALO_N = 40;
  const haloPts = fibonacciSphere(HALO_N, 24);
  const haloEdgePositions = [];
  haloPts.forEach((p, i) => {
    const targets = haloPts
      .map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    targets.forEach(t => {
      haloEdgePositions.push(p.x, p.y, p.z, haloPts[t.j].x, haloPts[t.j].y, haloPts[t.j].z);
    });
  });
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(haloEdgePositions, 3));
  const haloMat = new THREE.LineBasicMaterial({
    color: 0x0bdfc4, transparent: true, opacity: 0.25,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const halo = new THREE.LineSegments(haloGeo, haloMat);
  group.add(halo);

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
  heroSection.addEventListener('mousemove', (e) => {
    const r = heroSection.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / r.width - 0.5;
    mouseY = (e.clientY - r.top) / r.height - 0.5;
  });

  let running = true;
  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold: 0.02 }).observe(heroSection);

  function tick() {
    if (!running) return;
    if (!reduced) {
      group.rotation.y += 0.0016;
      halo.rotation.y -= 0.0009;
      camera.position.x += (mouseX * 7 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  renderer.render(scene, camera);
  if (!reduced) requestAnimationFrame(tick);
})();

/* ---------- CTA bookend: smaller reprise of the hero's 3D network ---------- */
(function ctaNetwork() {
  const canvas = document.getElementById('ctaWebgl');
  const section = document.querySelector('.cta-band');
  if (!canvas || !section || !window.THREE) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x081712, 0.03);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
  camera.position.set(0, 0, 32);

  const group = new THREE.Group();
  scene.add(group);

  function fibonacciSphere(n, r) {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r));
    }
    return pts;
  }

  const N = 34;
  const pts = fibonacciSphere(N, 13);
  const rand = mulberry32(19);
  pts.forEach(p => { p.x += (rand() - 0.5) * 1.2; p.y += (rand() - 0.5) * 1.2; p.z += (rand() - 0.5) * 1.2; });

  const edgePositions = [];
  pts.forEach((p, i) => {
    const targets = pts.map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    targets.forEach(t => edgePositions.push(p.x, p.y, p.z, pts[t.j].x, pts[t.j].y, pts[t.j].z));
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0bdfc4, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  function resize() {
    const w = section.clientWidth, h = section.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let running = true;
  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold: 0.05 }).observe(section);

  function tick() {
    if (!running) return;
    if (!reduced) group.rotation.y -= 0.0011;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  renderer.render(scene, camera);
  if (!reduced) requestAnimationFrame(tick);
})();

/* ---------- about panel: rotating 3D wireframe (nested icosahedra) ---------- */
(function originGeometry() {
  const canvas = document.getElementById('originWebgl');
  const panel = document.querySelector('.mono-panel');
  if (!canvas || !panel || !window.THREE) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const outer = new THREE.Group();
  const outerGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.7, 1));
  outer.add(new THREE.LineSegments(outerGeo, new THREE.LineBasicMaterial({ color: 0x17c98a, transparent: true, opacity: 0.45 })));
  scene.add(outer);

  const inner = new THREE.Group();
  const innerGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.55, 0));
  inner.add(new THREE.LineSegments(innerGeo, new THREE.LineBasicMaterial({ color: 0x0bdfc4, transparent: true, opacity: 0.65 })));
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

  let running = true;
  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold: 0.05 }).observe(panel);

  function tick() {
    if (!running) return;
    if (!reduced) {
      outer.rotation.y += 0.0032;
      outer.rotation.x += 0.0011;
      inner.rotation.y -= 0.0048;
      inner.rotation.x -= 0.0018;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  renderer.render(scene, camera);
  if (!reduced) requestAnimationFrame(tick);
})();
