gsap.registerPlugin(ScrollTrigger);

/* ---------- nav ---------- */
const nav = document.getElementById('siteNav');
const heroScene = document.getElementById('hero-scene');
ScrollTrigger.create({
  trigger: heroScene,
  start: 'top top',
  end: '20% top',
  onLeave: () => nav.classList.add('visible'),
  onEnterBack: () => nav.classList.remove('visible'),
});
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > window.innerHeight * 1.5);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ---------- reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ---------- seeded random ---------- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- global traveling color connections (behind entire page) ---------- */
(function bgFlow() {
  const canvas = document.getElementById('bgFlowCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [], edges = [], pulses = [];
  const rand = mulberry32(303);
  let running = !document.hidden;
  const t0 = performance.now();

  function spawnPulse() {
    const edge = edges[Math.floor(rand() * edges.length)];
    return { edge, t: rand(), speed: 0.0022 + rand() * 0.0028, seed: rand() * 100 };
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(16, Math.min(30, Math.floor((w * h) / 70000)));
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
    pulses = Array.from({ length: Math.min(14, edges.length) }, spawnPulse);
  }

  function tick(now) {
    if (!running) return;
    const time = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    edges.forEach(e => {
      ctx.strokeStyle = 'rgba(150,210,190,0.05)';
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });
    pulses.forEach((p, i) => {
      p.t += p.speed;
      if (p.t > 1) { pulses[i] = spawnPulse(); return; }
      const x = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
      const y = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
      const hue = 158 + Math.sin(time * 0.25 + p.seed) * 30 + Math.sin(time * 0.11 + p.seed * 1.7) * 15;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 11);
      grad.addColorStop(0, `hsla(${hue},90%,68%,0.95)`);
      grad.addColorStop(1, `hsla(${hue},90%,60%,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });
  window.addEventListener('resize', build, { passive: true });
  build();
  requestAnimationFrame(tick);
})();

/* ---------- hero canvas: drifting node field ---------- */
(function heroField() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [];
  const rand = mulberry32(7);
  let running = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(24, Math.min(60, Math.floor((w * h) / 26000)));
    particles = Array.from({ length: count }, () => ({
      x: rand() * w, y: rand() * h,
      vx: (rand() - 0.5) * 0.15, vy: (rand() - 0.5) * 0.15,
      r: rand() * 1.6 + 0.6,
    }));
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(23,201,138,${(1 - dist / 140) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.fillStyle = 'rgba(242,243,245,0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold: 0.05 }).observe(canvas);

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(tick);
})();

/* ---------- multi-piece cube clusters (2x2x2 = 8 pieces, more corners) ---------- */
const CUBE_FACES_HTML = `<div class="cube">
  <div class="face front"></div><div class="face back"></div>
  <div class="face right"></div><div class="face left"></div>
  <div class="face top"></div><div class="face bottom"></div>
</div>`;

function buildCubeCluster(container, pieceSize, offset, seed) {
  const rand = mulberry32(seed);
  const pieces = [];
  [-1, 1].forEach(x => [-1, 1].forEach(y => [-1, 1].forEach(z => {
    const wrap = document.createElement('div');
    wrap.className = 'cube-wrap cube-piece';
    wrap.style.setProperty('--size', pieceSize + 'px');
    wrap.style.filter = `brightness(${(0.88 + rand() * 0.24).toFixed(2)})`;
    wrap.innerHTML = CUBE_FACES_HTML;
    container.appendChild(wrap);
    const assembled = { x: x * offset, y: y * offset, z: z * offset };
    gsap.set(wrap, assembled);
    pieces.push({ wrap, corner: { x, y, z }, assembled });
  })));
  return pieces;
}

const heroPieces = buildCubeCluster(document.getElementById('heroCubeCluster'), 130, 68, 11);
const shellPieces = buildCubeCluster(document.getElementById('shellCubeCluster'), 168, 87, 23);

/* ---------- hero cube mouse parallax ---------- */
(function heroCubeTilt() {
  const cube = document.getElementById('heroCube');
  const scene = document.getElementById('hero-scene');
  scene.addEventListener('mousemove', (e) => {
    const r = scene.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cube.style.transform = `rotateY(${px * 22}deg) rotateX(${-py * 16}deg)`;
  });
  scene.addEventListener('mouseleave', () => { cube.style.transform = ''; });
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

/* ---------- hero title char reveal (entrance, not scroll-scrubbed) ---------- */
(function heroIntro() {
  const titleEl = document.getElementById('heroTitle');
  const text = titleEl.textContent.trim();
  titleEl.innerHTML = '';
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    titleEl.appendChild(span);
  });
  const tl = gsap.timeline({ delay: 0.2 });
  tl.to('.hero-title .char', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.028 })
    .to('.hero-sub', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('.hero-actions', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5');
})();

/* ---------- desktop pinned scroll scenes ---------- */
ScrollTrigger.matchMedia({
  '(min-width: 900px)': function () {

    // hero exit parallax
    gsap.timeline({
      scrollTrigger: { trigger: '#hero-scene', start: 'top top', end: 'bottom top', scrub: 0.6 },
    }).to('.hero-copy', { y: -80, opacity: 0.15, ease: 'none' })
      .to('#heroCanvas', { opacity: 0.15, ease: 'none' }, 0);

    // unpack scene: the 8-piece shell cluster flies apart along each piece's
    // own corner vector, revealing the detailed inner core, then re-seals
    const core = document.getElementById('cubeCore');
    const erand = mulberry32(55);
    gsap.set(core, { scale: 0.65, opacity: 0.12, transformOrigin: '50% 50%' });

    const unpackTl = gsap.timeline({
      scrollTrigger: { trigger: '#assembly-scene', start: 'top top', end: 'bottom bottom', scrub: 0.7 },
    });
    shellPieces.forEach(p => {
      const exploded = {
        x: p.corner.x * (170 + erand() * 90),
        y: p.corner.y * (120 + erand() * 70),
        z: p.corner.z * (170 + erand() * 90),
      };
      unpackTl
        .to(p.wrap, {
          x: exploded.x, y: exploded.y, z: exploded.z,
          rotationX: p.corner.x * 75, rotationY: p.corner.y * 75,
          duration: 1, ease: 'power2.inOut',
        }, 0)
        .to(p.wrap, {
          x: p.assembled.x, y: p.assembled.y, z: p.assembled.z,
          rotationX: 0, rotationY: 0,
          duration: 1, ease: 'power2.inOut',
        }, 1.1);
    });
    unpackTl
      .to(core, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0.15)
      .to('#cubeShell .cube-cluster', { rotationY: '+=140', duration: 2, ease: 'power1.inOut' }, 0)
      .to(core, { scale: 0.65, opacity: 0.12, duration: 1, ease: 'power2.in' }, 1.1);

    gsap.to('#assembly-scene .scene-copy', {
      scrollTrigger: { trigger: '#assembly-scene', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      opacity: 1, y: 0, ease: 'none',
    });

    // network scene — real 3D node network on a fibonacci sphere
    const net3d = document.getElementById('net3d');
    const NET_N = 26, NET_R = 190;
    function fibonacciSphere(n, r) {
      const pts = [], golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        pts.push({ x: Math.cos(theta) * rad * r, y: y * r, z: Math.sin(theta) * rad * r });
      }
      return pts;
    }
    const netPts = fibonacciSphere(NET_N, NET_R);
    const netEdgeData = [];
    netPts.forEach((p, i) => {
      const targets = netPts
        .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z) }))
        .filter(t => t.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      targets.forEach(t => {
        const key = [i, t.j].sort().join('-');
        if (!netEdgeData.find(e => e.key === key)) netEdgeData.push({ key, a: p, b: netPts[t.j] });
      });
    });
    const netNodeEls = netPts.map((p, i) => {
      const d = document.createElement('div');
      d.className = 'net3d-node' + (i % 2 ? ' alt' : '');
      d.style.setProperty('--tx', p.x + 'px');
      d.style.setProperty('--ty', p.y + 'px');
      d.style.setProperty('--tz', p.z + 'px');
      net3d.appendChild(d);
      return d;
    });
    const netEdgeEls = netEdgeData.map(e => {
      const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, dz = e.b.z - e.a.z;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const rotZ = Math.atan2(dy, dx);
      const rotY = length ? -Math.asin(dz / length) : 0;
      const el = document.createElement('div');
      el.className = 'net3d-edge';
      el.style.width = length + 'px';
      el.style.transform = `translate3d(${e.a.x}px, ${e.a.y}px, ${e.a.z}px) rotateZ(${rotZ}rad) rotateY(${rotY}rad)`;
      net3d.appendChild(el);
      return el;
    });
    const networkTl = gsap.timeline({
      scrollTrigger: { trigger: '#network-scene', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
    netEdgeEls.forEach((el, i) => {
      networkTl.to(el, { opacity: 1, duration: 0.4, onStart: () => el.classList.add('lit') }, i * 0.045);
    });
    netNodeEls.forEach((el, i) => {
      networkTl.to(el, { opacity: 1, duration: 0.4, onStart: () => el.classList.add('lit') }, i * 0.05);
    });
    networkTl.to(net3d, { rotationY: '+=220', ease: 'none' }, 0);
    gsap.to('#network-scene .scene-copy', {
      scrollTrigger: { trigger: '#network-scene', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      opacity: 1, y: 0, ease: 'none',
    });

    // network scene mouse parallax (outer wrap, independent of the spin/scroll rotation on #net3d)
    (function net3dTilt() {
      const wrap = document.querySelector('#network-scene .net3d-wrap');
      const scene = document.getElementById('network-scene');
      scene.addEventListener('mousemove', (e) => {
        const r = scene.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        wrap.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 12}deg)`;
      });
      scene.addEventListener('mouseleave', () => { wrap.style.transform = ''; });
    })();

    // layers scene
    const layers = gsap.utils.toArray('.layer');
    gsap.set(layers, { opacity: 0.4 });
    const layersTl = gsap.timeline({
      scrollTrigger: { trigger: '#layers-scene', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
    layers.forEach((el, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      layersTl.to(el, { x: dir * 40, opacity: 1, duration: 1, ease: 'power2.out' }, i * 0.15);
    });
    layersTl.to(layers, { x: 0, duration: 0.6 }, '+=0.1');

    // scale scene
    const path = document.getElementById('scalePath');
    const dot = document.getElementById('scaleDot');
    const pathLen = path.getTotalLength();
    path.style.strokeDasharray = pathLen;
    path.style.strokeDashoffset = pathLen;
    const scaleTl = gsap.timeline({
      scrollTrigger: { trigger: '#scale-scene', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
    const proxy = { p: 0 };
    scaleTl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
    scaleTl.to(proxy, {
      p: 1, duration: 1, ease: 'none',
      onUpdate: () => {
        const pt = path.getPointAtLength(proxy.p * pathLen);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      },
    }, 0);
    scaleTl.to('#scale-scene .scene-copy', { opacity: 1, y: 0, duration: 0.5 }, 0.4);

    return () => {
      netEdgeEls.forEach(el => el.remove());
      netNodeEls.forEach(el => el.remove());
    };
  },

  '(max-width: 899px)': function () {
    // lightweight mobile entrances, no pin/scrub
    ['#assembly-scene .scene-copy', '#network-scene .scene-copy', '#layers-scene .scene-copy', '#scale-scene .scene-copy']
      .forEach(sel => {
        gsap.fromTo(sel, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sel, start: 'top 80%' },
        });
      });
    gsap.set(['#cubeField', '.net3d-wrap', '#layersStack', '#scaleSvg'], { opacity: 0.5 });
  },
});
