/* ============================================================
   D1 Business Solutions — Interactive Review Globe (D3 / SVG)
   ============================================================ */

/* ---------- Tag → palette class ---------- */
const TAG_CLASS = {
  'Website':    'tag-purple',
  'AI Agent':   'tag-cyan',
  'SEO':        'tag-green',
  'E-commerce': 'tag-blue',
  'Automation': 'tag-orange'
};
const AVATAR_BG = ['#c792ea', '#82aaff', '#c3e88d', '#89ddff', '#f78c6c'];

/* ---------- Demo data ---------- */
const DEFAULT_LOCATIONS = [
  {
    id: 'seattle', city: 'Seattle', country: 'WA, United States', lat: 47.6062, lng: -122.3321,
    reviews: [
      { name: 'Mike T.', biz: 'Pacific Drain & Plumbing', rating: 5, date: 'Mar 2026', tags: ['Website', 'AI Agent'],
        quote: "I used to miss calls all the time while I was under a sink. Now the AI handles them and I just call back the hot leads. Best investment I've made." },
      { name: 'James K.', biz: 'Cascade Comfort Heating & Cooling', rating: 5, date: 'Feb 2026', tags: ['SEO', 'Website'],
        quote: "We went from page 4 to page 1 in about 8 weeks. The phone started ringing without us paying for ads. That was a game-changer for us." }
    ]
  },
  {
    id: 'brooklyn', city: 'Brooklyn', country: 'NY, United States', lat: 40.6782, lng: -73.9442,
    reviews: [
      { name: 'Camille R.', biz: 'Maison Lune', rating: 5, date: 'Apr 2026', tags: ['E-commerce', 'Website'],
        quote: "I was spending 3 hours a day managing orders on Instagram. Now the store runs itself and I actually have time to source new products." },
      { name: 'Sara M.', biz: 'Apex Fitness Studio', rating: 5, date: 'Jan 2026', tags: ['AI Agent', 'Automation'],
        quote: "The AI books more trial classes than our front desk did. It never takes a day off and handles all the pricing questions without us lifting a finger." },
      { name: 'David B.', biz: 'Brennan & Associates', rating: 4, date: 'Dec 2025', tags: ['Website', 'AI Agent'],
        quote: "We were losing potential clients because nobody answered the website form fast enough. The AI now qualifies them and books the call before they look elsewhere." }
    ]
  },
  {
    id: 'miri', city: 'Miri', country: 'Sarawak, Malaysia', lat: 4.3995, lng: 113.9914,
    reviews: [
      { name: 'Aisha L.', biz: 'Borneo Bean Coffee Co.', rating: 5, date: 'May 2026', tags: ['Website', 'E-commerce'],
        quote: "D1 built us an online store that finally ships our beans across Malaysia. Orders came in the first week — we'd never reached customers outside Miri before." },
      { name: 'Daniel C.', biz: 'Sarawak Adventure Tours', rating: 5, date: 'Apr 2026', tags: ['Website', 'AI Agent'],
        quote: "The booking agent answers travellers in different time zones overnight. We wake up to confirmed tours. Genuinely felt like hiring a full-time team member." }
    ]
  }
];

/* ---------- State + persistence ---------- */
const STORAGE_KEY = 'd1_reviews_v1';
let LOCATIONS = loadLocations();

function loadLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_LOCATIONS));
}
function saveLocations() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(LOCATIONS)); } catch (e) { /* ignore */ }
}

/* ---------- Helpers ---------- */
function avg(loc) {
  if (!loc.reviews.length) return 0;
  return loc.reviews.reduce((s, r) => s + r.rating, 0) / loc.reviews.length;
}
function starString(n) {
  const full = Math.round(n);
  let out = '';
  for (let i = 1; i <= 5; i++) out += (i <= full) ? '★' : '☆';
  return out;
}
function starHTML(n) {
  const full = Math.round(n);
  let out = '';
  for (let i = 1; i <= 5; i++) out += (i <= full) ? '<span>★</span>' : '<span class="empty">★</span>';
  return out;
}
function initials(name) {
  const p = name.trim().split(/\s+/);
  return (p[0]?.[0] || '') + (p[1]?.[0] || '');
}

/* ============================================================
   GLOBE  (D3 orthographic, SVG)
   ============================================================ */
const globeEl = document.getElementById('globeViz');
let selectedId = null;

let svg, gGlow, gSphere, gGraticule, gLand, gBorders, pinLayer;
let projection, geoPath, graticule;
let worldFeatures = null, worldBorders = null;
let rotation = [-8, -18, 0];      // [λ, φ, γ]  → initial view (Africa/Europe, like reference)
let autoRotate = true, dragging = false;
let lastT = 0, idleTimer = null;
let tween = null;                  // active rotateTo tween

function buildGlobe() {
  // glow behind the globe
  svg = d3.select(globeEl).append('svg')
    .attr('class', 'globe-svg')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'block')
    .style('cursor', 'grab');

  const defs = svg.append('defs');
  const ocean = defs.append('radialGradient').attr('id', 'oceanGrad').attr('cx', '42%').attr('cy', '38%').attr('r', '72%');
  ocean.append('stop').attr('offset', '0%').attr('stop-color', '#141a26');
  ocean.append('stop').attr('offset', '70%').attr('stop-color', '#0c1019');
  ocean.append('stop').attr('offset', '100%').attr('stop-color', '#080a0f');
  const glow = defs.append('radialGradient').attr('id', 'glowGrad').attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
  glow.append('stop').attr('offset', '60%').attr('stop-color', 'rgba(199,146,234,0)');
  glow.append('stop').attr('offset', '85%').attr('stop-color', 'rgba(199,146,234,0.10)');
  glow.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(130,170,255,0)');

  gGlow      = svg.append('circle').attr('class', 'g-glow').attr('fill', 'url(#glowGrad)');
  gSphere    = svg.append('path').attr('class', 'g-sphere');
  gGraticule = svg.append('path').attr('class', 'g-graticule');
  gLand      = svg.append('path').attr('class', 'g-land');
  gBorders   = svg.append('path').attr('class', 'g-borders');

  // pin overlay
  pinLayer = document.createElement('div');
  pinLayer.className = 'pin-layer';
  globeEl.parentElement.appendChild(pinLayer);

  projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  geoPath = d3.geoPath(projection);
  graticule = d3.geoGraticule10();

  sizeGlobe();
  loadCountries();
  refreshPins();
  attachDrag();

  // animation loop — use setInterval (rAF is paused/throttled in some embedded views)
  lastT = performance.now();
  setInterval(tick, 1000 / 30);

  window.addEventListener('resize', sizeGlobe);
}

function sizeGlobe() {
  const w = globeEl.clientWidth, h = globeEl.clientHeight;
  svg.attr('viewBox', `0 0 ${w} ${h}`);
  const r = Math.min(w, h) / 2 * 0.92;
  projection.scale(r).translate([w / 2, h / 2]).rotate(rotation);
  gGlow.attr('cx', w / 2).attr('cy', h / 2).attr('r', r * 1.18);
  render();
}

function loadCountries() {
  fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
    .then(r => r.json())
    .then(topo => {
      worldFeatures = topojson.feature(topo, topo.objects.countries);
      worldBorders  = topojson.mesh(topo, topo.objects.countries);
      render();
    })
    .catch(() => { /* graticule-only fallback */ });
}

function render() {
  projection.rotate(rotation);
  gSphere.attr('d', geoPath({ type: 'Sphere' }));
  gGraticule.attr('d', geoPath(graticule));
  if (worldFeatures) gLand.attr('d', geoPath(worldFeatures));
  if (worldBorders)  gBorders.attr('d', geoPath(worldBorders));
  renderPins();
}

/* ---------- pins ---------- */
function refreshPins() {
  pinLayer.innerHTML = '';
  LOCATIONS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'pin';
    el.innerHTML = `<div class="pin-pulse"></div><div class="pin-dot"></div>` +
                   (d.reviews.length > 1 ? `<div class="pin-count">${d.reviews.length}</div>` : '');
    el.style.opacity = 0;
    el.addEventListener('click', (e) => { e.stopPropagation(); selectLocation(d.id, true); });
    if (d.id === selectedId) el.classList.add('selected');
    d.__el = el;
    pinLayer.appendChild(el);
  });
  renderPins();
}

function renderPins() {
  const center = [-rotation[0], -rotation[1]];
  for (const d of LOCATIONS) {
    if (!d.__el) continue;
    const dist = d3.geoDistance([d.lng, d.lat], center);   // 0 (front) .. PI (back)
    const facing = Math.cos(dist);                          // 1 front, 0 limb, <0 back
    if (facing <= 0.02) {
      d.__el.style.opacity = 0;
      d.__el.style.pointerEvents = 'none';
      continue;
    }
    const p = projection([d.lng, d.lat]);
    if (!p) { d.__el.style.opacity = 0; continue; }
    const o = Math.max(0, Math.min(1, facing / 0.28));
    d.__el.style.left = p[0] + 'px';
    d.__el.style.top = p[1] + 'px';
    d.__el.style.opacity = o.toFixed(3);
    d.__el.style.pointerEvents = o > 0.4 ? 'auto' : 'none';
    d.__el.style.zIndex = Math.round(facing * 100);
  }
}

/* ---------- animation tick ---------- */
function tick(now) {
  const t = performance.now();
  const dt = Math.min(80, t - lastT);
  lastT = t;

  if (tween) {
    tween.t += dt / tween.dur;
    const k = tween.t >= 1 ? 1 : d3.easeCubicInOut(tween.t);
    rotation = [
      tween.from[0] + tween.delta[0] * k,
      tween.from[1] + tween.delta[1] * k,
      0
    ];
    render();
    if (tween.t >= 1) tween = null;
  } else if (autoRotate && !dragging) {
    rotation = [rotation[0] + dt * 0.0055 * 60 / 22, rotation[1], 0];
    if (rotation[0] > 180) rotation[0] -= 360;
    render();
  }
}

/* ---------- drag to rotate ---------- */
function attachDrag() {
  let startX, startY, startRot;
  const sens = () => 70 / projection.scale();   // deg per px-ish

  svg.on('pointerdown', (e) => {
    dragging = true; tween = null; autoRotate = false;
    clearTimeout(idleTimer);
    hideHint();
    startX = e.clientX; startY = e.clientY; startRot = rotation.slice();
    svg.style('cursor', 'grabbing');
    e.target.setPointerCapture?.(e.pointerId);
  });
  svg.on('pointermove', (e) => {
    if (!dragging) return;
    const k = sens() * 0.9;
    let lam = startRot[0] + (e.clientX - startX) * k;
    let phi = startRot[1] - (e.clientY - startY) * k;
    phi = Math.max(-89, Math.min(89, phi));
    rotation = [lam, phi, 0];
    render();
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    svg.style('cursor', 'grab');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!dragging && !tween) autoRotate = true; }, 4000);
  };
  svg.on('pointerup', end);
  svg.on('pointerleave', end);
}

function rotateTo(lng, lat) {
  autoRotate = false;
  clearTimeout(idleTimer);
  const target = [-lng, -lat];
  let dLam = ((target[0] - rotation[0] + 540) % 360) - 180;   // shortest path
  tween = {
    from: rotation.slice(),
    delta: [dLam, target[1] - rotation[1]],
    t: 0, dur: 900
  };
  idleTimer = setTimeout(() => { if (!dragging && !tween) autoRotate = true; }, 6000);
}

function hideHint() {
  const h = document.getElementById('globeHint');
  if (h) h.style.opacity = '0';
}

/* ============================================================
   PANEL
   ============================================================ */
const panelDefault = document.getElementById('panelDefault');
const panelDetail  = document.getElementById('panelDetail');

function renderRatingSummary() {
  const all = LOCATIONS.flatMap(l => l.reviews);
  const a = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  document.getElementById('ratingSummary').innerHTML = `
    <div class="rs-block"><div class="rs-num"><span class="a">${a.toFixed(1)}</span></div><div class="rs-stars">${starString(a)}</div></div>
    <div class="rs-divider"></div>
    <div class="rs-block"><div class="rs-num">${all.length}</div><div class="rs-label">Reviews</div></div>
    <div class="rs-divider"></div>
    <div class="rs-block"><div class="rs-num">${LOCATIONS.length}</div><div class="rs-label">Cities</div></div>`;
}

function renderLocList() {
  const list = document.getElementById('locList');
  list.innerHTML = '';
  LOCATIONS.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'loc-chip';
    btn.innerHTML = `
      <span class="loc-chip-pin"></span>
      <span class="loc-chip-info">
        <span class="loc-chip-city">${loc.city}</span><br>
        <span class="loc-chip-country">${loc.country}</span>
      </span>
      <span class="loc-chip-meta">
        <span class="loc-chip-rating">★ ${avg(loc).toFixed(1)}</span><br>
        <span class="loc-chip-count">${loc.reviews.length} review${loc.reviews.length !== 1 ? 's' : ''}</span>
      </span>`;
    btn.addEventListener('click', () => selectLocation(loc.id, true));
    list.appendChild(btn);
  });
}

function selectLocation(id, fly) {
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  selectedId = id;

  LOCATIONS.forEach(l => { if (l.__el) l.__el.classList.toggle('selected', l.id === id); });

  if (fly) rotateTo(loc.lng, loc.lat);

  document.getElementById('detailCity').textContent = loc.city;
  document.getElementById('detailCountry').textContent = loc.country;
  document.getElementById('detailRating').textContent = avg(loc).toFixed(1);
  document.getElementById('detailCount').textContent = loc.reviews.length;

  const wrap = document.getElementById('detailReviews');
  wrap.innerHTML = '';
  loc.reviews.forEach((r, i) => {
    const tags = (r.tags || []).map(t =>
      `<span class="cs-tag ${TAG_CLASS[t] || 'tag-purple'}">${t}</span>`).join('');
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="rc-head">
        <div class="rc-stars">${starHTML(r.rating)}</div>
        <div class="rc-date">${r.date || ''}</div>
      </div>
      <div class="rc-quote">"${r.quote}"</div>
      ${tags ? `<div class="rc-tags">${tags}</div>` : ''}
      <div class="rc-author">
        <div class="rc-avatar" style="background:${AVATAR_BG[i % AVATAR_BG.length]}">${initials(r.name)}</div>
        <div><div class="rc-author-name">${r.name}</div><div class="rc-author-biz">${r.biz}</div></div>
      </div>`;
    wrap.appendChild(card);
  });

  panelDefault.classList.add('hidden');
  panelDetail.classList.add('active');
}

function showDefaultPanel() {
  selectedId = null;
  LOCATIONS.forEach(l => { if (l.__el) l.__el.classList.remove('selected'); });
  panelDetail.classList.remove('active');
  panelDefault.classList.remove('hidden');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!dragging && !tween) autoRotate = true; }, 600);
}

document.getElementById('detailBack').addEventListener('click', showDefaultPanel);

/* ============================================================
   ADD REVIEW MODAL
   ============================================================ */
const overlay = document.getElementById('modalOverlay');
const locSelect = document.getElementById('fLoc');
const newLocFields = document.getElementById('newLocFields');
let formRating = 5;
let formTags = new Set();

function openModal() {
  locSelect.innerHTML = LOCATIONS.map(l => `<option value="${l.id}">${l.city} — ${l.country}</option>`).join('')
    + `<option value="__new__">➕ New location…</option>`;
  toggleNewLoc();
  overlay.classList.add('active');
}
function closeModal() { overlay.classList.remove('active'); }
function toggleNewLoc() {
  newLocFields.classList.toggle('active', locSelect.value === '__new__');
}

document.getElementById('addReviewBtn').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
locSelect.addEventListener('change', toggleNewLoc);

const starInput = document.getElementById('starInput');
function paintStars() {
  [...starInput.children].forEach(s => s.classList.toggle('on', +s.dataset.v <= formRating));
}
starInput.addEventListener('click', (e) => {
  if (e.target.dataset.v) { formRating = +e.target.dataset.v; paintStars(); }
});
paintStars();

document.getElementById('tagPicker').addEventListener('click', (e) => {
  const b = e.target.closest('.tag-opt');
  if (!b) return;
  const t = b.dataset.tag;
  if (formTags.has(t)) { formTags.delete(t); b.classList.remove('on'); }
  else { formTags.add(t); b.classList.add('on'); }
});

document.getElementById('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const biz = document.getElementById('fBiz').value.trim();
  const quote = document.getElementById('fQuote').value.trim();
  if (!name || !biz || !quote) return;

  const review = {
    name, biz, quote, rating: formRating,
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    tags: [...formTags]
  };

  let targetId;
  if (locSelect.value === '__new__') {
    const city = document.getElementById('fCity').value.trim();
    const country = document.getElementById('fCountry').value.trim();
    const lat = parseFloat(document.getElementById('fLat').value);
    const lng = parseFloat(document.getElementById('fLng').value);
    if (!city || isNaN(lat) || isNaN(lng)) { alert('Please fill in city, latitude and longitude for the new location.'); return; }
    targetId = 'loc_' + Date.now();
    LOCATIONS.push({ id: targetId, city, country: country || '—', lat, lng, reviews: [review] });
  } else {
    targetId = locSelect.value;
    LOCATIONS.find(l => l.id === targetId).reviews.push(review);
  }

  saveLocations();
  refreshPins();
  renderRatingSummary();
  renderLocList();
  closeModal();

  e.target.reset();
  formRating = 5; paintStars();
  formTags.clear();
  document.querySelectorAll('.tag-opt.on').forEach(b => b.classList.remove('on'));

  selectLocation(targetId, true);
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderRatingSummary();
  renderLocList();
  if (typeof d3 === 'undefined') {
    globeEl.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#555d78;font-size:0.85rem;padding:2rem;text-align:center;">Globe failed to load. Check your connection.</div>';
    return;
  }
  buildGlobe();
}
init();
