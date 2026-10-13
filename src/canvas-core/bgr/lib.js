// THE NaN & BEER KIT, ported from motdang-comics/lib.js (the comics' and reels' canvas library, drawn from
// the FB profile avatars). makeLib(ctx) hands back the same functions bound to one context; the film is
// 1080 x 1920 logical pixels. Mali stands in for Bangers in the sound effects (Mali carries Thai).
// @ts-nocheck
export function makeLib(x) {
const W = 1080, H = 1920;
const K = {ink:'#1E1B2E', paper:'#FFF4DE', dot:'#F2C9A0', sky:'#8FD3F7', pink:'#FF5FA2', pinkL:'#FFC2DC',
  yellow:'#FFD23F', orange:'#FF8A2A', mint:'#6FD6BE', teal:'#2BB3A3', grass:'#8BD17C', road:'#5C5F6E',
  concrete:'#EFE6D4', skin:'#F6D1AE', red:'#E8384F', white:'#FFFFFF', sign:'#1E7D4A', grey:'#8A8FA3'};
const SFX = 'Mali, Thonburi, sans-serif', HAND = 'Mali, Thonburi, sans-serif';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
// line offsets for a block: a Thai line under a Latin one gets .18 of its size more, so tone marks clear the line above
const isTh = (s) => /[\u0E00-\u0E7F]/.test(s);
const lineYs = (L, size, pitch) => { let y = 0; return L.map((l, i) => (i ? (y += size * pitch + (isTh(l) && !isTh(L[i - 1]) ? .18 * size : 0)) : 0)); };
const ease = (v) => { v = clamp(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
const back = (v) => { v = clamp(v); const c = 2.2; return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2); };
const inn = (t, a, d = .35) => ease((t - a) / d);
const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const P = {x: 46, y: 130, w: 988, h: 1470};   // the panel; reels UI covers the bottom 300 px

// ---------- lettering ----------
function txt(s, px, py, o = {}) {
  const size = o.size || 60, lh = o.lh || 1.18;
  x.save(); x.font = `${o.weight || 700} ${size}px ${o.face || HAND}`; x.textAlign = o.align || 'center'; x.textBaseline = 'middle';
  x.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  const L = String(s).split('\n');
  L.forEach((l, i) => {
    const yy = py + (i - (L.length - 1) / 2) * size * lh;
    if (o.stroke) { x.lineJoin = 'round'; x.lineWidth = o.stroke; x.strokeStyle = o.strokeColor || K.ink; x.strokeText(l, px, yy); }
    x.fillStyle = o.color || K.ink; x.fillText(l, px, yy);
  });
  x.restore();
}
function sfx(s, px, py, size, a, o = {}) {           // pops in with an overshoot
  if (a <= 0) return;
  x.save(); x.translate(px, py); x.rotate(o.rot || 0); const k = back(a); x.scale(k, k);
  txt(s, 3, 8, {size, face: o.face || SFX, weight: o.weight || 700, color: K.ink, stroke: size * .2, alpha: clamp(a * 3)});
  txt(s, 0, 0, {size, face: o.face || SFX, weight: o.weight || 700, color: o.color || K.yellow, stroke: size * .14, alpha: clamp(a * 3)});
  x.restore();
}
function caption(lines, px, py, a, o = {}) {        // yellow narration box
  if (a <= 0) return;
  x.save(); x.globalAlpha = clamp(a * 2); x.translate(0, (1 - ease(a)) * -30);
  x.font = `700 ${o.size || 44}px ${HAND}`;
  const L = lines.split('\n'), size = o.size || 44, w = Math.max(...L.map((l) => x.measureText(l).width)) + 56, pitch = L.length > 1 ? 1.4 : 1.25, ys = lineYs(L, size, pitch), h = ys[ys.length - 1] + size * pitch + 34;
  const bx = o.right ? px - w : o.center ? px - w / 2 : px;
  x.fillStyle = K.ink; x.fillRect(bx + 8, py + 8, w, h);
  x.fillStyle = o.fill || K.yellow; x.fillRect(bx, py, w, h); x.lineWidth = 5; x.strokeStyle = K.ink; x.strokeRect(bx, py, w, h);
  L.forEach((l, i) => txt(l, bx + w / 2, py + 17 + size * .62 + ys[i], {size, color: o.color || K.ink}));
  x.restore();
}
function bubble(lines, cx, cy, tx, ty, a, o = {}) {  // speech bubble centred on cx,cy with a tail to tx,ty
  if (a <= 0) return;
  const size = o.size || 50; x.font = `700 ${size}px ${HAND}`;
  const L = lines.split('\n'), w = Math.max(...L.map((l) => x.measureText(l).width)) + 70, pitch = L.length > 1 ? 1.4 : 1.22, ys = lineYs(L, size, pitch), h = ys[ys.length - 1] + size * pitch + 46 + (L.length > 1 ? 18 : 0);
  const k = .6 + .4 * back(a);
  x.save(); x.globalAlpha = clamp(a * 3); x.translate(cx, cy); x.scale(k, k); x.translate(-cx, -cy);
  const shape = () => {
    x.beginPath();
    if (o.thought) { x.ellipse(cx, cy, w / 2 + 20, h / 2 + 14, 0, 0, 6.29); }
    else x.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 46));
    if (!o.thought) { const bx = cx + clamp(tx - cx, -w / 3, w / 3); const by = ty > cy ? cy + h / 2 - 4 : cy - h / 2 + 4;
      const dx = tx - bx, dy = ty - by, dl = Math.hypot(dx, dy) || 1, k2 = Math.min(dl, 110) / dl;
      x.moveTo(bx - 26, by); x.lineTo(bx + dx * k2, by + dy * k2); x.lineTo(bx + 26, by); }
  };
  x.lineJoin = 'round'; shape(); x.lineWidth = 14; x.strokeStyle = K.ink; x.stroke();
  shape(); x.fillStyle = o.fill || K.white; x.fill();
  if (o.thought) for (let i = 1; i <= 2; i++) { const f = i / 3, px = cx + (tx - cx) * (.55 + f * .45), py = cy + (ty - cy) * (.55 + f * .45);
    x.beginPath(); x.arc(px, py, 18 - i * 5, 0, 6.29); x.fillStyle = K.white; x.fill(); x.lineWidth = 6; x.stroke(); }
  L.forEach((l, i) => txt(l, cx, cy - ys[ys.length - 1] / 2 + ys[i], {size, color: o.color || K.ink}));
  x.restore();
}

// ---------- page and panel ----------
function page() {
  x.fillStyle = K.paper; x.fillRect(0, 0, W, H);
  x.fillStyle = K.dot;
  for (let yy = 12; yy < H; yy += 26) for (let xx = (yy / 26 % 2) * 13; xx < W; xx += 26) { x.beginPath(); x.arc(xx, yy, 3.2, 0, 6.29); x.fill(); }
  txt('มดแดง · motdang.net', W / 2, 70, {size: 34, color: '#8A6A4A'});
}
function panel(t, fill, draw, o = {}) {              // pops in, clips its drawing, then draws the ink frame
  const a = back(t / .38), tilt = (o.tilt || 0) * Math.PI / 180;
  x.save(); x.translate(P.x + P.w / 2, P.y + P.h / 2); x.rotate(tilt); x.scale(.9 + .1 * a, .9 + .1 * a); x.translate(-(P.x + P.w / 2), -(P.y + P.h / 2));
  x.fillStyle = K.ink; x.fillRect(P.x + 14, P.y + 14, P.w, P.h);
  x.save(); x.beginPath(); x.rect(P.x, P.y, P.w, P.h); x.clip();
  x.fillStyle = fill; x.fillRect(P.x, P.y, P.w, P.h);
  draw();
  x.restore();
  x.lineWidth = 10; x.strokeStyle = K.ink; x.strokeRect(P.x, P.y, P.w, P.h);
  x.restore();
}
function shake(t, at, amt = 18) { const d = t - at; if (d < 0 || d > .35) return; const k = (1 - d / .35) * amt; x.translate(Math.sin(d * 90) * k, Math.cos(d * 70) * k); }
function rays(cx, cy, c, spin, n = 20) {
  x.save(); x.translate(cx, cy); x.rotate(spin); x.fillStyle = c;
  for (let i = 0; i < n; i++) { x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 2400, i * 6.283 / n, i * 6.283 / n + 6.283 / n / 2); x.fill(); }
  x.restore();
}
function focusLines(cx, cy, t, r0 = 360) {           // manga speed-focus lines
  x.fillStyle = K.ink;
  for (let i = 0; i < 70; i++) {
    const a = i / 70 * 6.283 + rnd(i) * .05, w = .006 + rnd(i + 9) * .012, r = r0 + rnd(i + Math.floor(t * 12)) * 160;
    x.beginPath(); x.moveTo(cx + Math.cos(a - w) * 1800, cy + Math.sin(a - w) * 1800);
    x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); x.lineTo(cx + Math.cos(a + w) * 1800, cy + Math.sin(a + w) * 1800); x.fill();
  }
}
function sparkle(px, py, s, a) {
  if (a <= 0) return; x.save(); x.translate(px, py); x.scale(s * a, s * a); x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 4 / s;
  x.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 7 : 22, an = i * Math.PI / 4; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); }
  x.closePath(); x.fill(); x.stroke(); x.restore();
}

// ---------- the two of us ----------
// The two of us, drawn from the FB profile avatars (Nan — FB profile + cover / Beer — FB profile + cover).
// Tuesday is pink: tops go pink, the brand trims stay; bottoms and helmets keep the brand crimson and navy.
const NAN = {name: 'NAN', look: 'nan', skin: '#E6AE86', skin2: '#CF9068', top: '#B7243A', pants: '#6E1020', bottom: 'sin',
  helmet: '#F6EBD6', helmetStripe: '#9E1B2C', bike: 'adv', bikeScale: 1.3};
const BEER = {name: 'BEER', look: 'beer', skin: '#E8B48C', skin2: '#D29870', top: '#283A6E', pants: '#3B4466', bottom: 'pants',
  helmet: '#283A6E', helmetStripe: '#D6A42C', bike: 'retro', bikeScale: .85};
// the plumber: a tom from the moobaan's own trade, in a work shirt; rides a saleng (sidecar) carrying blue PVC pipe
const PLUMBER = {name: 'PLUMBER', look: 'pl', skin: '#C98E64', skin2: '#B07750', top: '#2F6FA8', pants: '#3E3A36', bottom: 'pants',
  helmet: '#E8E2D6', helmetStripe: '#2F6FA8', bike: 'retro', bikeScale: .95, cap: '#1F4E7A', stripe: '#C9CED8', bikeColor: '#C8D9E6'};
const GOLD = '#D6A42C';
function diamonds(px, py, w, h, base, d1, d2) {    // tin chok band: diamonds on a strip
  x.fillStyle = base; x.fillRect(px, py, w, h);
  for (let i = 0; i * h < w; i++) { const cx = px + h / 2 + i * h, cy = py + h / 2;
    x.fillStyle = d1; x.beginPath(); x.moveTo(cx, py + 1); x.lineTo(cx + h / 2 - 1, cy); x.lineTo(cx, py + h - 1); x.lineTo(cx - h / 2 + 1, cy); x.fill();
    x.fillStyle = d2; x.beginPath(); x.arc(cx, cy, h * .14, 0, 6.29); x.fill(); }
}
function trimLine(ax, ay, bx, by, w, base, dot) {  // a diamond-studded trim along a line
  x.strokeStyle = base; x.lineWidth = w; x.lineCap = 'butt'; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
  const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / (w * 1.3)));
  x.fillStyle = dot; for (let i = 0; i < n; i++) { const f = (i + .5) / n, cx = ax + (bx - ax) * f, cy = ay + (by - ay) * f, r = w * .32;
    x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r, cy); x.lineTo(cx, cy + r); x.lineTo(cx - r, cy); x.fill(); }
}
function goldFlower(px, py, r) {
  x.fillStyle = GOLD; for (let i = 0; i < 5; i++) { const a = i * 1.2566 - 1.57; x.beginPath(); x.arc(px + Math.cos(a) * r * .62, py + Math.sin(a) * r * .62, r * .5, 0, 6.29); x.fill(); }
  x.strokeStyle = '#A97A12'; x.lineWidth = 1.5; x.stroke(); x.fillStyle = '#B23A2E'; x.beginPath(); x.arc(px, py, r * .28, 0, 6.29); x.fill();
}
function feather(px, py, rot, s = 1) {
  x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s);
  x.fillStyle = '#E7507A'; x.beginPath(); x.moveTo(0, -70); x.bezierCurveTo(28, -40, 28, 20, 0, 55); x.bezierCurveTo(-28, 20, -28, -40, 0, -70); x.fill();
  x.strokeStyle = '#F7A1B8'; x.lineWidth = 2.5; x.lineCap = 'round';
  for (let i = 0; i < 5; i++) for (const d of [-1, 1]) { x.beginPath(); x.moveTo(0, -40 + i * 18); x.lineTo(d * 15, -50 + i * 18); x.stroke(); }
  x.strokeStyle = '#F7E7C8'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(0, -62); x.lineTo(0, 78); x.stroke();
  x.restore();
}
// the plumber's hand: palm, four fingers, thumb. grip 'open' | 'fist'; a = the angle the fingers (or the held handle) run along
function plHand(who, tx, ty, a, grip) {
  x.save(); x.translate(tx, ty); x.rotate(a); x.fillStyle = who.skin; x.strokeStyle = who.skin; x.lineCap = 'round'; x.lineJoin = 'round';
  const up = Math.cos(a) >= 0 ? -1 : 1;             // thumb on the upper side on screen
  if (grip === 'fist') {
    x.beginPath(); x.roundRect(-17, -13, 34, 26, 10); x.fill();
    x.fillStyle = who.skin2; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-12 + i * 8, -up * 10, 4.4, 0, 6.29); x.fill(); }
    x.strokeStyle = who.skin2; x.lineWidth = 2.4; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(-16 + i * 8, up * -12); x.lineTo(-16 + i * 8, up * 9); x.stroke(); }
    x.strokeStyle = who.skin; x.lineWidth = 8; x.beginPath(); x.moveTo(-14, up * 12); x.lineTo(12, up * 14); x.stroke();     // thumb over the fingers
  } else {
    x.beginPath(); x.roundRect(-4, -12, 25, 24, 9); x.fill();
    const len = [20, 23, 21, 15]; x.lineWidth = 6.6;
    for (let i = 0; i < 4; i++) { const yy = -9 + i * 6, an = (i - 1.5) * .17; x.beginPath(); x.moveTo(15, yy); x.lineTo(15 + Math.cos(an) * len[i], yy + Math.sin(an) * len[i]); x.stroke(); }
    x.lineWidth = 7.6; x.beginPath(); x.moveTo(3, up * 8); x.lineTo(14, up * 20); x.stroke();
  }
  x.restore();
}
// the plumber's arm: sleeve to a rolled cuff at the elbow, bare forearm, a hand. Two-bone reach, so a long reach bends at the elbow.
function plArm(who, s, tx, ty, g) {
  const sx = s * 46, sy = -100, L1 = 110, L2 = 106;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy) || 1;
  const fit = Math.min(1.06, Math.max(1, d / (L1 + L2))), l1 = L1 * fit, l2 = L2 * fit, dm = l1 + l2 - .5;
  if (d > dm) { tx = sx + dx / d * dm; ty = sy + dy / d * dm; dx = tx - sx; dy = ty - sy; d = dm; }
  const dd = Math.max(d, Math.abs(l1 - l2) + 4), a0 = Math.atan2(dy, dx), A = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1));
  let ex = 0, ey = 0, best = -1e9;
  for (const sg of [-1, 1]) { const a = a0 + sg * A, qx = sx + Math.cos(a) * l1, qy = sy + Math.sin(a) * l1, v = qy + s * qx * .7; if (v > best) { best = v; ex = qx; ey = qy; } }
  const fx = tx - ex, fy = ty - ey, fl = Math.hypot(fx, fy) || 1, nx = -fy / fl, ny = fx / fl, k = Math.max(0, fl - 8) / fl, wx = ex + fx * k, wy = ey + fy * k;
  x.fillStyle = who.skin; x.beginPath(); x.moveTo(ex + nx * 11.5, ey + ny * 11.5); x.lineTo(wx + nx * 8.5, wy + ny * 8.5); x.lineTo(wx - nx * 8.5, wy - ny * 8.5); x.lineTo(ex - nx * 11.5, ey - ny * 11.5); x.closePath(); x.fill();
  x.fillStyle = who.skin2; x.globalAlpha = .35; x.beginPath(); x.moveTo(ex + nx * 11.5, ey + ny * 11.5); x.lineTo(wx + nx * 8.5, wy + ny * 8.5); x.lineTo(wx + nx * 3, wy + ny * 3); x.lineTo(ex + nx * 4, ey + ny * 4); x.closePath(); x.fill(); x.globalAlpha = 1;
  x.lineCap = 'round'; x.strokeStyle = who.top; x.lineWidth = 30; x.beginPath(); x.moveTo(sx, sy); x.lineTo(ex, ey); x.stroke();
  const ux = (ex - sx) / l1, uy = (ey - sy) / l1;
  x.strokeStyle = '#245A8A'; x.lineWidth = 34; x.lineCap = 'butt'; x.beginPath(); x.moveTo(ex - ux * 20, ey - uy * 20); x.lineTo(ex - ux * 6, ey - uy * 6); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = 3; x.beginPath(); x.moveTo(sx + ux * 18 - uy * 7, sy + uy * 18 + ux * 7); x.lineTo(ex - ux * 24 - uy * 7, ey - uy * 24 + ux * 7); x.stroke();
  const grip = typeof g === 'string' ? g : g && g.k || 'open', ang = g && g.a != null ? g.a : Math.atan2(ty - ey, tx - ex);
  plHand(who, tx, ty, ang, grip);
}
// origin = hips. o.face: happy | joy | shock | grin ; o.hands: [[lx,ly],[rx,ry]] ; o.legs: 'none' to hide ; o.helmet: riding
// o.grip: [left, right], each undefined | 'fist' | {k: 'fist' | 'open', a: radians}   (the plumber's hands)
function avatar(who, o = {}) {
  const hands = o.hands || [[-78, -20], [78, -20]], nan = who.look === 'nan', pl = who.look === 'pl', kick = (o.kick || 0) * 10, hy = -214;
  const sway = Math.sin((o.t || 0) * 5) * 3;
  // back hair
  if (pl) {                                       // the plumber: short back and sides under a cap
    x.fillStyle = '#211A1C'; x.beginPath(); x.arc(0, hy - 4, 98, Math.PI, 0); x.lineTo(92, hy + 40); x.lineTo(-92, hy + 40); x.closePath(); x.fill();
  } else if (nan) {
    x.fillStyle = '#65463A'; x.beginPath(); x.arc(0, hy, 106, Math.PI, 0);
    for (let yy = hy; yy <= -6; yy += 4) x.lineTo(124 + Math.sin(yy / 17) * 9 + sway, yy);
    for (let xx = 124; xx >= -124; xx -= 4) x.lineTo(xx, -6 + Math.sin(xx / 13) * 7);
    for (let yy = -6; yy >= hy; yy -= 4) x.lineTo(-124 + Math.sin(yy / 17 + 1) * 9 + sway, yy);
    x.fill();
    x.fillStyle = '#46302A'; x.beginPath(); x.ellipse(0, -110, 92, 70, 0, 0, 6.29); x.fill();
  } else {
    x.fillStyle = '#1D1A1F'; x.beginPath(); x.arc(0, hy, 104, Math.PI, 0); x.lineTo(112, -50); x.lineTo(-112, -50); x.closePath(); x.fill();
  }
  if (o.legs !== 'none') {
    for (const s of [-1, 1]) {
      x.strokeStyle = who.skin; x.lineWidth = 20; x.lineCap = 'round'; x.beginPath(); x.moveTo(s * 26, 50); x.lineTo(s * (28 + kick), 80); x.stroke();
      x.fillStyle = '#2A1C18'; x.beginPath(); x.ellipse(s * (32 + kick), 92, 28, 14, 0, 0, 6.29); x.fill();
    }
    if (who.bottom === 'sin') {
      x.fillStyle = who.pants; x.beginPath(); x.moveTo(-54, -14); x.lineTo(54, -14); x.lineTo(62 + kick, 70); x.lineTo(-62 - kick, 70); x.closePath(); x.fill();
      x.save(); x.beginPath(); x.moveTo(-54, -14); x.lineTo(54, -14); x.lineTo(62 + kick, 70); x.lineTo(-62 - kick, 70); x.clip();
      diamonds(-70 - kick, 46, 140 + kick * 2, 22, GOLD, '#1B1618', '#F6EBD6'); x.restore();
    } else for (const sd of [-1, 1]) {
      x.fillStyle = who.pants; x.beginPath(); x.moveTo(sd * 2, -14); x.lineTo(sd * 56, -14); x.lineTo(sd * (62 + kick), 66); x.lineTo(sd * (6 + kick * .3), 66); x.closePath(); x.fill();
      x.fillStyle = who.stripe || GOLD; x.beginPath(); x.moveTo(sd * (8 + kick * .3), 54); x.lineTo(sd * (60 + kick), 54); x.lineTo(sd * (61 + kick), 60); x.lineTo(sd * (7 + kick * .3), 60); x.fill();
    }
  }
  // torso
  x.fillStyle = who.top; x.beginPath(); x.roundRect(-60, -124, 120, 132, [46, 46, 20, 20]); x.fill();
  x.fillStyle = who.skin2; x.fillRect(-20, -142, 40, 22);
  if (pl) {                                       // work shirt: pocket, name patch, rolled sleeves, tool belt
    x.fillStyle = '#2F6FA8'; x.beginPath(); x.moveTo(-26, -124); x.lineTo(0, -96); x.lineTo(26, -124); x.lineTo(14, -124); x.lineTo(0, -108); x.lineTo(-14, -124); x.fill();
    x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(-3, -96, 6, 104);
    x.fillStyle = '#FFF4DE'; x.beginPath(); x.roundRect(14, -92, 40, 22, 5); x.fill(); txt('ช่าง', 34, -81, {size: 15, color: '#1F4E7A'});
    x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 3; x.strokeRect(-50, -86, 30, 32);
    x.fillStyle = '#5A3A22'; x.fillRect(-60, -10, 120, 16); x.fillStyle = '#C9A24A'; x.fillRect(-10, -10, 20, 16);
    x.fillStyle = '#F2C230'; x.beginPath(); x.roundRect(30, -4, 26, 26, 6); x.fill(); x.fillStyle = '#2A2A2A'; x.beginPath(); x.arc(43, 9, 6, 0, 6.29); x.fill();
  } else if (nan) {
    x.fillStyle = '#1B1618'; x.beginPath(); x.moveTo(-40, -124); x.lineTo(40, -124); x.lineTo(0, -34); x.closePath(); x.fill();
    x.fillStyle = who.skin; x.beginPath(); x.moveTo(-26, -124); x.lineTo(26, -124); x.lineTo(0, -98); x.closePath(); x.fill();
    trimLine(-44, -126, -2, -32, 12, GOLD, '#1B1618'); trimLine(44, -126, 2, -32, 12, GOLD, '#1B1618');
    x.fillStyle = '#F6EBD6'; for (let i = 0; i < 5; i++) { const a = i * 1.2566; x.beginPath(); x.arc(-2 + Math.cos(a) * 5, -64 + Math.sin(a) * 5, 4.5, 0, 6.29); x.fill(); }
    x.fillStyle = '#E2582A'; for (const [dy, n] of [[18, 9], [30, 11]]) for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; x.beginPath(); x.arc(-Math.cos(a) * 24, -126 + Math.sin(a) * dy, 4, 0, 6.29); x.fill(); }
  } else {
    x.fillStyle = '#F5EEE2'; x.beginPath(); x.moveTo(-32, -124); x.lineTo(32, -124); x.lineTo(20, 8); x.lineTo(-20, 8); x.closePath(); x.fill();
    x.fillStyle = who.skin; x.beginPath(); x.moveTo(-24, -124); x.quadraticCurveTo(0, -100, 24, -124); x.fill();
    trimLine(-34, -126, -22, 8, 11, GOLD, '#B23A2E'); trimLine(34, -126, 22, 8, 11, GOLD, '#B23A2E');
    diamonds(24, -58, 34, 10, GOLD, '#B23A2E', GOLD);
    x.strokeStyle = GOLD; x.lineWidth = 2.5; x.beginPath(); x.moveTo(-18, -126); x.quadraticCurveTo(0, -84, 18, -126); x.stroke();
    x.fillStyle = GOLD; x.beginPath(); x.moveTo(0, -104); x.lineTo(6, -96); x.lineTo(0, -88); x.lineTo(-6, -96); x.fill();
  }
  if (!pl) { x.save(); x.beginPath(); x.roundRect(-60, -124, 120, 132, [46, 46, 20, 20]); x.clip(); diamonds(-66, -12, 132, 20, GOLD, nan ? '#1B1618' : '#283A6E', nan ? '#E0457B' : '#B23A2E'); x.restore(); }
  for (let i = 0; i < 2; i++) {
    const s = i ? 1 : -1, [hx, hy2] = hands[i];
    if (pl) { plArm(who, s, hx, hy2, (o.grip || [])[i]); continue; }
    x.lineCap = 'round'; x.strokeStyle = who.top; x.lineWidth = 28; x.beginPath(); x.moveTo(s * 46, -100); x.lineTo(hx, hy2); x.stroke();
    x.fillStyle = who.skin; x.beginPath(); x.arc(hx, hy2, 16, 0, 6.29); x.fill();
  }
  // face
  x.fillStyle = who.skin; x.beginPath(); x.ellipse(0, hy + 6, nan ? 78 : 80, nan ? 90 : 86, 0, 0, 6.29); x.fill();
  if (nan) for (const s of [-1, 1]) {               // gold drop earrings
    x.strokeStyle = GOLD; x.lineWidth = 3; x.beginPath(); x.moveTo(s * 80, hy + 10); x.lineTo(s * 80, hy + 34); x.stroke();
    x.fillStyle = GOLD; x.beginPath(); x.moveTo(s * 80, hy + 30); x.lineTo(s * 86, hy + 40); x.lineTo(s * 80, hy + 50); x.lineTo(s * 74, hy + 40); x.fill();
    x.fillStyle = '#B7243A'; x.beginPath(); x.arc(s * 80, hy + 60, 8, 0, 6.29); x.fill();
  }
  const f = o.face || 'happy', ey = hy - 4;
  x.fillStyle = nan ? 'rgba(224,115,110,.4)' : 'rgba(240,138,138,.42)'; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(s * 48, ey + 38, 20, 11, 0, 0, 6.29); x.fill(); }
  const dark = '#2A1C18'; x.lineCap = 'round';
  for (const s of [-1, 1]) {
    const ex = s * 34;
    if (f === 'joy') { x.strokeStyle = dark; x.lineWidth = 6; x.beginPath(); x.arc(ex, ey + 6, 12, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
    else if (f === 'shock') { x.fillStyle = K.white; x.beginPath(); x.arc(ex, ey, 16, 0, 6.29); x.fill(); x.fillStyle = dark; x.beginPath(); x.arc(ex, ey + 2, 6, 0, 6.29); x.fill(); }
    else if (f === 'roll') { x.fillStyle = K.white; x.beginPath(); x.ellipse(ex, ey, 13, 15, 0, 0, 6.29); x.fill(); x.fillStyle = dark; x.beginPath(); x.arc(ex + 3, ey - 8, 6.5, 0, 6.29); x.fill(); }   // a fond eye-roll
    else { x.fillStyle = dark; x.beginPath(); x.ellipse(ex, ey, 10, 13, 0, 0, 6.29); x.fill();
      x.fillStyle = K.white; x.beginPath(); x.arc(ex + 3, ey - 5, 4.5, 0, 6.29); x.fill(); x.beginPath(); x.arc(ex - 4, ey + 5, 2, 0, 6.29); x.fill();
      if (f === 'grin') { x.fillStyle = who.skin; x.fillRect(ex - 14, ey - 16, 28, 11); } }
    if (nan && f !== 'joy') { x.strokeStyle = dark; x.lineWidth = 3; for (const [dx, dy] of [[10, -8], [14, -2], [12, 5]]) { x.beginPath(); x.moveTo(ex + s * 8, ey - 6 + dy * .4); x.lineTo(ex + s * (8 + dx), ey - 6 + dy); x.stroke(); } }
    if (pl) { x.strokeStyle = '#211A1C'; x.lineWidth = 9; x.beginPath(); x.moveTo(ex - 17, ey - 27); x.lineTo(ex + 17, ey - 29 + s * 2); x.stroke(); }
    if (nan) { x.strokeStyle = '#5A3C2C'; x.lineWidth = 5; x.beginPath();
      if (f === 'grin') { x.moveTo(ex - s * 14, ey - 18); x.lineTo(ex + s * 14, ey - 28); } else { x.moveTo(ex - 16, ey - 26); x.quadraticCurveTo(ex, ey - 34, ex + 16, ey - 26); } x.stroke(); }
  }
  x.strokeStyle = who.skin2; x.lineWidth = 3; x.beginPath(); x.arc(0, ey + 30, 5, .3, Math.PI - .3); x.stroke();
  const my = ey + 50;
  if (f === 'shock') { x.fillStyle = '#7A2230'; x.beginPath(); x.ellipse(0, my + 6, 12, 16, 0, 0, 6.29); x.fill(); }
  else {                                           // the big open grin, with teeth (Nan's has the gold one)
    const w = nan ? 40 : 30, d = nan ? 42 : 34;
    const mouth = () => { x.beginPath(); x.moveTo(-w, my - 4); x.quadraticCurveTo(0, my + 4, w, my - 4); x.quadraticCurveTo(w * .9, my + d, 0, my + d); x.quadraticCurveTo(-w * .9, my + d, -w, my - 4); x.closePath(); };
    mouth(); x.fillStyle = nan ? '#7A2230' : '#8E3A3A'; x.fill();
    x.save(); mouth(); x.clip();
    x.fillStyle = '#E07A86'; x.beginPath(); x.ellipse(0, my + d - 4, w * .5, 10, 0, 0, 6.29); x.fill();
    if (nan) for (let i = 0; i < 8; i++) { x.fillStyle = i === 5 ? '#E8B32E' : '#FBF8F2'; x.fillRect(-w + 4 + i * (2 * w - 8) / 8 + 1, my - 6, (2 * w - 8) / 8 - 2, 13); }
    else { x.fillStyle = '#FFFFFF'; x.fillRect(-w, my - 6, 2 * w, 11); }
    x.restore();
    mouth(); x.strokeStyle = nan ? '#A81E34' : '#C7645C'; x.lineWidth = 4; x.stroke();
  }
  // front hair
  if (pl) {                                        // short side-swept fringe, a cap worn backwards
    x.fillStyle = '#211A1C'; x.beginPath(); x.moveTo(-84, hy - 30); x.quadraticCurveTo(-70, hy - 96, 0, hy - 100); x.quadraticCurveTo(70, hy - 98, 86, hy - 34);
    x.quadraticCurveTo(40, hy - 74, -10, hy - 56); x.quadraticCurveTo(-50, hy - 62, -84, hy - 30); x.fill();
    if (!o.helmet) {
      x.fillStyle = who.cap || '#1F4E7A'; x.beginPath(); x.arc(0, hy - 34, 92, Math.PI * 1.08, Math.PI * 1.92); x.quadraticCurveTo(0, hy - 96, -86, hy - 58); x.fill();
      x.beginPath(); x.ellipse(-84, hy - 62, 46, 13, .35, 0, 6.29); x.fill();
      x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(0, hy - 128, 7, 0, 6.29); x.fill();
      x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 4; x.beginPath(); x.arc(0, hy - 34, 80, Math.PI * 1.25, Math.PI * 1.75); x.stroke();
    }
  } else if (nan) {
    x.fillStyle = '#65463A';
    for (const s of [-1, 1]) { x.beginPath(); x.moveTo(s * 2, hy - 98); x.bezierCurveTo(s * 70, hy - 98, s * 92, hy - 50, s * 86, hy + 30);
      x.lineTo(s * 76, hy + 30); x.bezierCurveTo(s * 76, hy - 30, s * 50, hy - 62, s * 2, hy - 64); x.closePath(); x.fill(); }
    x.strokeStyle = '#46302A'; x.lineWidth = 4; x.beginPath(); x.moveTo(0, hy - 104); x.lineTo(0, hy - 66); x.stroke();
    x.strokeStyle = '#DDD4C2'; x.lineWidth = 5;
    for (const s of [-1, 1]) for (const k of [0, 1]) { x.beginPath(); x.moveTo(s * (14 + k * 22), hy - 90 + k * 6);
      x.bezierCurveTo(s * (70 + k * 14), hy - 86, s * (100 + k * 12), hy - 30, s * (104 + k * 10) + sway, hy + 40);
      for (let yy = hy + 40; yy < -20; yy += 4) x.lineTo(s * (104 + k * 10 + Math.sin(yy / 14 + k) * 7) + sway, yy); x.stroke(); }
    if (!o.helmet) feather(66, hy - 64, .55, .9);
  } else {
    x.fillStyle = '#1D1A1F';
    x.beginPath(); x.arc(0, hy, 106, Math.PI * 1.05, Math.PI * 1.95);
    x.bezierCurveTo(96, hy - 20, 80, hy + 10, 84, hy + 70); x.lineTo(70, hy + 70); x.bezierCurveTo(66, hy - 10, 40, hy - 58, 6, hy - 70);
    x.lineTo(-6, hy - 70); x.bezierCurveTo(-40, hy - 58, -66, hy - 10, -70, hy + 70); x.lineTo(-84, hy + 70); x.bezierCurveTo(-80, hy + 10, -96, hy - 20, -100, hy - 36);
    x.fill();
    x.strokeStyle = '#3A3438'; x.lineWidth = 4; x.beginPath(); x.arc(0, hy, 90, Math.PI * 1.3, Math.PI * 1.6); x.stroke();
    x.strokeStyle = '#B08A3E'; x.lineWidth = 4.5;             // round gold glasses
    for (const s of [-1, 1]) { x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.arc(s * 36, ey + 2, 31, 0, 6.29); x.fill(); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); x.arc(s * 36, ey + 2, 22, Math.PI * 1.15, Math.PI * 1.45); x.stroke(); x.strokeStyle = '#B08A3E'; x.lineWidth = 4.5; }
    x.beginPath(); x.moveTo(-6, ey); x.quadraticCurveTo(0, ey - 6, 6, ey); x.moveTo(-67, ey); x.lineTo(-80, ey - 4); x.moveTo(67, ey); x.lineTo(80, ey - 4); x.stroke();
    if (!o.helmet) goldFlower(72, hy - 70, 20);
  }
  if (o.helmet) {                                  // open-face helmet in the brand colour, hair out underneath
    x.fillStyle = who.helmet; x.beginPath(); x.arc(0, hy - 6, 112, Math.PI * 1.02, Math.PI * 1.98); x.quadraticCurveTo(0, hy - 60, -112, hy - 10); x.fill();
    x.strokeStyle = '#1E1B2E'; x.lineWidth = 4; x.stroke();
    x.strokeStyle = who.helmetStripe; x.lineWidth = 14; x.beginPath(); x.arc(0, hy - 6, 96, Math.PI * 1.3, Math.PI * 1.7); x.stroke();
    x.strokeStyle = '#1E1B2E'; x.lineWidth = 4; for (const s of [-1, 1]) { x.beginPath(); x.moveTo(s * 86, hy - 4); x.lineTo(s * 60, hy + 80); x.stroke(); }
    if (nan) feather(96, hy - 40, .5, .75); else if (!pl) goldFlower(96, hy - 30, 17);
  }
  if (o.sweat) { x.fillStyle = '#9AD8FF'; x.strokeStyle = '#1E1B2E'; x.lineWidth = 3; x.beginPath(); x.moveTo(-96, hy - 20); x.quadraticCurveTo(-80, hy + 10, -96, hy + 16); x.quadraticCurveTo(-112, hy + 10, -96, hy - 20); x.fill(); x.stroke(); }
}
function standing(who, px, gy, s, o = {}) { x.save(); x.translate(px, gy - 100 * s); x.scale(s, s); avatar(who, o); x.restore(); }

// scooters face right; origin on the ground under the middle
function wheel(px, py, r, spin) {                  // fat tyre, cast mag wheel, brake disc
  x.fillStyle = K.ink; x.beginPath(); x.arc(px, py, r, 0, 6.29); x.fill();
  x.fillStyle = '#C9CED8'; x.beginPath(); x.arc(px, py, r * .6, 0, 6.29); x.fill();
  x.strokeStyle = '#7C8290'; x.lineWidth = 4; x.beginPath(); x.arc(px, py, r * .42, 0, 6.29); x.stroke();
  x.fillStyle = '#3A3F4E'; for (let i = 0; i < 5; i++) { const a = spin + i * 1.2566; x.beginPath(); x.ellipse(px + Math.cos(a) * r * .38, py + Math.sin(a) * r * .38, r * .12, r * .07, a, 0, 6.29); x.fill(); }
  x.fillStyle = K.ink; x.beginPath(); x.arc(px, py, r * .14, 0, 6.29); x.fill();
}
// Nan rides a Zontes 368G, far too big for her; Beer rides a little beige retro scooter.
function plate(px, py, num) {
  x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 4; x.beginPath(); x.roundRect(px - 30, py - 20, 60, 40, 5); x.fill(); x.stroke();
  txt(num, px, py - 7, {size: 15}); txt('เชียงใหม่', px, py + 10, {size: 11, weight: 500});
}
function puffs(t, px, py) {
  for (let k = 0; k < 4; k++) { const f = (t * 2.2 + k / 4) % 1; x.fillStyle = `rgba(190,196,210,${.75 * (1 - f)})`; x.strokeStyle = `rgba(30,27,46,${.5 * (1 - f)})`; x.lineWidth = 4;
    x.beginPath(); x.arc(px - f * 170, py - f * 40 + Math.sin(k * 3) * 10, 14 + f * 34, 0, 6.29); x.fill(); x.stroke(); }
}
const BIKES = {
  adv: {seat: [-80, -266], bar: [150, -324], floor: [70, -152],
    base(t, spin, bob, riding) {
      if (riding) puffs(t, -262, -120);
      wheel(-150, -66, 66, spin); wheel(165, -66, 66, spin);
      x.strokeStyle = K.ink; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(165, -66); x.lineTo(132, -250); x.stroke();
      x.strokeStyle = '#B9BECB'; x.lineWidth = 7; x.stroke();
      x.translate(0, bob); x.lineJoin = 'round';
      x.fillStyle = '#4A4F5E'; x.strokeStyle = K.ink; x.lineWidth = 6; x.beginPath(); x.roundRect(-110, -118, 130, 70, 12); x.fill(); x.stroke();
      x.fillStyle = '#D5DAE3'; x.beginPath(); x.moveTo(-40, -60); x.lineTo(-170, -100); x.lineTo(-250, -104); x.lineTo(-250, -136); x.lineTo(-160, -128); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#3A4055'; x.lineWidth = 8;
      x.beginPath(); x.moveTo(-235, -150); x.lineTo(-222, -215); x.quadraticCurveTo(-200, -248, -150, -250); x.lineTo(22, -242); x.lineTo(42, -152); x.lineTo(100, -152);
      x.lineTo(128, -302); x.quadraticCurveTo(172, -318, 192, -272); x.lineTo(218, -236); x.lineTo(186, -204); x.lineTo(192, -152);
      x.quadraticCurveTo(170, -126, 130, -122); x.lineTo(100, -100); x.lineTo(-80, -100); x.quadraticCurveTo(-140, -100, -172, -140); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = K.orange; x.lineWidth = 5; x.beginPath(); x.moveTo(150, -150); x.quadraticCurveTo(200, -168, 238, -128); x.lineTo(222, -116); x.quadraticCurveTo(196, -140, 158, -134); x.closePath(); x.fill(); x.stroke();
      x.strokeStyle = K.orange; x.lineWidth = 10; x.beginPath(); x.moveTo(-210, -180); x.lineTo(-10, -180); x.moveTo(140, -260); x.lineTo(178, -236); x.stroke();
      x.fillStyle = '#FFF3A8'; x.strokeStyle = K.ink; x.lineWidth = 4; x.beginPath(); x.ellipse(196, -254, 14, 7, .5, 0, 6.29); x.fill(); x.stroke();
      x.fillStyle = K.red; x.fillRect(-240, -196, 14, 24);
      plate(-262, -168, 'กข 29');
      x.fillStyle = K.ink; x.beginPath(); x.roundRect(-190, -276, 215, 32, 15); x.fill();
    },
    top(t, streamer) {
      x.strokeStyle = K.ink; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(128, -322); x.lineTo(168, -326); x.stroke();
      x.fillStyle = K.orange; x.lineWidth = 4; x.beginPath(); x.ellipse(170, -318, 16, 10, .4, 0, 6.29); x.fill(); x.stroke();
      x.lineWidth = 5; x.beginPath(); x.moveTo(136, -322); x.lineTo(120, -382); x.stroke();
      x.fillStyle = '#CFE9FF'; x.beginPath(); x.ellipse(116, -390, 18, 11, -.3, 0, 6.29); x.fill(); x.stroke();
      if (streamer) { x.strokeStyle = K.pink; x.lineWidth = 9; x.beginPath(); x.moveTo(116, -394); for (let i = 1; i <= 6; i++) x.lineTo(116 - i * 22, -394 + Math.sin(t * 16 - i) * 10 + i * 3); x.stroke(); }
      x.fillStyle = 'rgba(170,215,255,.6)'; x.strokeStyle = K.ink; x.lineWidth = 6;
      x.beginPath(); x.moveTo(134, -306); x.lineTo(152, -440); x.lineTo(194, -430); x.lineTo(186, -296); x.closePath(); x.fill(); x.stroke();
    }},
  retro: {seat: [-80, -214], bar: [122, -262], floor: [45, -104],
    base(t, spin, bob, riding) {
      if (riding) puffs(t, -205, -70);
      wheel(-120, -44, 44, spin); wheel(130, -44, 44, spin);
      x.translate(0, bob); x.lineJoin = 'round';
      x.fillStyle = '#D5DAE3'; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.roundRect(-190, -84, 80, 20, 10); x.fill(); x.stroke();
      x.fillStyle = this.col || '#E8D5B0'; x.lineWidth = 8;
      x.beginPath(); x.moveTo(-195, -84); x.quadraticCurveTo(-232, -196, -140, -204); x.lineTo(-20, -200); x.quadraticCurveTo(-4, -118, 22, -104);
      x.lineTo(72, -104); x.quadraticCurveTo(96, -160, 108, -246); x.lineTo(130, -246); x.quadraticCurveTo(150, -160, 150, -112);
      x.lineTo(130, -82); x.lineTo(-60, -74); x.quadraticCurveTo(-150, -64, -195, -84); x.closePath(); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(84, -62); x.quadraticCurveTo(130, -122, 180, -62); x.lineTo(168, -56); x.quadraticCurveTo(130, -104, 96, -56); x.closePath(); x.fill(); x.stroke();
      x.strokeStyle = '#FFF8EA'; x.lineWidth = 8; x.beginPath(); x.moveTo(-200, -120); x.quadraticCurveTo(-120, -110, -40, -120); x.stroke();
      x.strokeStyle = '#B9BECB'; x.lineWidth = 6; x.beginPath(); x.moveTo(-190, -206); x.lineTo(-230, -206); x.lineTo(-230, -188); x.stroke();
      x.fillStyle = K.red; x.fillRect(-212, -150, 12, 20);
      plate(-222, -112, 'ชม 9');
      x.fillStyle = '#7A4E2D'; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.roundRect(-165, -226, 150, 28, 13); x.fill(); x.stroke();
    },
    top(t, streamer) {
      x.strokeStyle = K.ink; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(100, -262); x.lineTo(144, -262); x.stroke();
      x.fillStyle = '#FFF3A8'; x.lineWidth = 5; x.beginPath(); x.arc(122, -270, 20, 0, 6.29); x.fill(); x.stroke();
      x.fillStyle = '#D5DAE3'; x.beginPath(); x.arc(122, -270, 10, 0, 6.29); x.fill();
      x.beginPath(); x.moveTo(104, -262); x.lineTo(92, -316); x.stroke();
      x.fillStyle = '#E3E8EF'; x.beginPath(); x.arc(90, -322, 13, 0, 6.29); x.fill(); x.stroke();
      if (streamer) { x.strokeStyle = K.pink; x.lineWidth = 9; x.beginPath(); x.moveTo(90, -326); for (let i = 1; i <= 6; i++) x.lineTo(90 - i * 20, -326 + Math.sin(t * 16 - i) * 10 + i * 3); x.stroke(); }
    }},
};
function scooter(who, px, gy, s, t, o = {}) {
  BIKES.retro.col = who.bikeColor; const B = BIKES[who.bike], bs = who.bikeScale, bob = o.riding ? Math.sin(t * 22 + px) * 3 : 0, spin = o.spin != null ? o.spin : o.riding ? t * 14 : 0;
  x.save(); x.translate(px, gy); x.scale(s, s);
  x.save(); x.scale(bs, bs); B.base(t, spin, bob, o.riding); x.restore();
  if (who.look === 'pl' && o.side) { x.save(); o.side(spin, bob); x.restore(); }   // the saleng's sidecar: over the bike body, under the rider's legs
  if (o.rider) {                                   // rider at her own size: hips on the seat, reaching for the bars
    const r = o.rider, hx = B.seat[0] * bs, hy = B.seat[1] * bs + bob, bx = B.bar[0] * bs, by = B.bar[1] * bs + bob;
    const kx = hx + 70, ky = hy - 4, fx0 = B.floor[0] * bs, fy0 = B.floor[1] * bs, d = Math.hypot(fx0 - kx, fy0 - ky), reach = 95;
    const fx = kx + (fx0 - kx) * Math.min(1, reach / d), fy = ky + (fy0 - ky) * Math.min(1, reach / d) + (d > reach ? Math.sin(t * 9) * 6 : 0);
    for (const [c, w] of [[r.pants, 30]]) { x.strokeStyle = c; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(hx + 10, hy - 12); x.lineTo(kx, ky); x.lineTo(fx, fy); x.stroke(); }
    x.fillStyle = K.ink; x.beginPath(); x.ellipse(fx + 12, fy + 6, 26, 12, d > reach ? .5 : 0, 0, 6.29); x.fill();
    x.save(); x.translate(hx, hy); if (o.cargo) o.cargo();
    avatar(r, {legs: 'none', helmet: o.helmet !== false, t, face: o.face || 'happy', sweat: d > reach && o.sweat, grip: o.grip, hands: o.hands || [[bx - hx - 22, by - hy + 6], [bx - hx + 20, by - hy + 2]]}); x.restore();
  }
  x.save(); x.scale(bs, bs); x.translate(0, bob); B.top(t, o.streamer); x.restore();
  x.restore();
}
function tag(s, px, py, a) {                        // little label with a pointer down
  if (a <= 0) return; x.save(); x.globalAlpha = clamp(a * 3); x.font = `700 36px ${HAND}`;
  const w = x.measureText(s).width + 40; x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 5; x.lineJoin = 'round';
  x.beginPath(); x.roundRect(px - w / 2, py - 30, w, 60, 14); x.moveTo(px - 14, py + 30); x.lineTo(px, py + 56); x.lineTo(px + 14, py + 30); x.fill(); x.stroke();
  x.fillStyle = K.white; x.fillRect(px - 12, py + 24, 24, 8); txt(s, px, py + 1, {size: 36}); x.restore();
}

function scissors(px, py, len, rot, open, o = {}) {  // giant ceremonial scissors, pivot at px,py, blades point along +x
  x.save(); x.translate(px, py); x.rotate(rot); x.lineJoin = 'round';
  for (const s of [-1, 1]) {
    x.save(); x.rotate(s * open / 2);
    x.fillStyle = '#E3E8EF'; x.strokeStyle = K.ink; x.lineWidth = len * .025;
    x.beginPath(); x.moveTo(0, -s * len * .03); x.lineTo(len, 0); x.lineTo(len * .12, s * len * .13); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = K.ink; x.lineWidth = len * .07; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, 0); x.lineTo(-len * .2, s * len * .08); x.stroke();
    x.strokeStyle = o.handle || '#F5B400'; x.lineWidth = len * .045; x.stroke(); x.lineWidth = len * .025; x.strokeStyle = K.ink;
    x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.moveTo(len * .15, s * len * .01); x.lineTo(len * .85, s * len * .004); x.lineTo(len * .15, s * len * .035); x.fill();
    x.fillStyle = o.handle || '#F5B400'; x.beginPath(); x.ellipse(-len * .34, s * len * .12, len * .17, len * .11, 0, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = o.hole || '#FFF4DE'; x.beginPath(); x.ellipse(-len * .34, s * len * .12, len * .1, len * .055, 0, 0, 6.29); x.fill(); x.stroke();
    x.restore();
  }
  x.fillStyle = K.ink; x.beginPath(); x.arc(0, 0, len * .03, 0, 6.29); x.fill();
  x.restore();
}
function cone(px, gy, s) {
  x.save(); x.translate(px, gy); x.scale(s, s); x.lineJoin = 'round'; x.strokeStyle = K.ink; x.lineWidth = 6;
  x.fillStyle = K.orange; x.beginPath(); x.moveTo(-26, -150); x.lineTo(26, -150); x.lineTo(52, -10); x.lineTo(-52, -10); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = K.white; x.beginPath(); x.moveTo(-17, -100); x.lineTo(17, -100); x.lineTo(24, -62); x.lineTo(-24, -62); x.closePath(); x.fill();
  x.fillStyle = K.orange; x.beginPath(); x.roundRect(-70, -14, 140, 18, 6); x.fill(); x.stroke();
  x.restore();
}
function bow(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = K.pink; x.strokeStyle = K.ink; x.lineWidth = 5; x.lineJoin = 'round';
  for (const d of [-1, 1]) { x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(d * 60, -46, d * 62, 0); x.quadraticCurveTo(d * 60, 40, 0, 0); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(d * 4, 6); x.lineTo(d * 30, 70); x.lineTo(d * 16, 64); x.lineTo(d * 12, 76); x.lineTo(0, 10); x.fill(); x.stroke(); }
  x.beginPath(); x.arc(0, 0, 14, 0, 6.29); x.fill(); x.stroke(); x.restore();
}
function ribbon(ax, ay, bx, by, cut) {               // cut 0 = whole, 1 = both halves hanging
  x.lineCap = 'round';
  const seg = (sx, sy, ex, ey) => { x.strokeStyle = K.ink; x.lineWidth = 30; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo((sx + ex) / 2, Math.max(sy, ey) + 30, ex, ey); x.stroke();
    x.strokeStyle = K.pink; x.lineWidth = 20; x.stroke(); };
  if (cut <= 0) { seg(ax, ay, bx, by); return; }
  const half = (bx - ax) / 2, sw = ease(cut);
  const a = sw * 1.35 + Math.sin(cut * 9) * .12 * (1 - sw);
  seg(ax, ay, ax + Math.cos(a) * half * .9, ay + Math.sin(a) * half * .9);
  seg(bx, by, bx - Math.cos(a) * half * .9, by + Math.sin(a) * half * .9);
}
function confetti(cx, cy, dt, n = 150, seed = 1) {
  if (dt < 0) return; const cols = [K.pink, K.yellow, K.mint, K.orange, '#6FA8FF', K.white];
  for (let i = 0; i < n; i++) {
    const vx = (rnd(i + seed) - .5) * 1700, vy = -(rnd(i * 3 + seed) * 1400 + 500), g = 1500, drag = Math.exp(-dt * 1.2);
    const px = cx + vx * (1 - drag) / 1.2, py = cy + vy * (1 - drag) / 1.2 + .5 * g * dt * dt * .55;
    x.save(); x.translate(px, py); x.rotate(dt * (4 + rnd(i) * 8) + i); x.fillStyle = cols[i % cols.length]; x.strokeStyle = K.ink; x.lineWidth = 2;
    x.fillRect(-10, -5, 20, 10); x.strokeRect(-10, -5, 20, 10); x.restore();
  }
}
function groundConfetti(x0, x1, gy, n, gone) {       // bits lying on the footpath; `gone` sweeps them away left→right
  const cols = [K.pink, K.yellow, K.mint, K.orange, '#6FA8FF'];
  for (let i = 0; i < n; i++) {
    const px = x0 + rnd(i + 40) * (x1 - x0); if ((px - x0) / (x1 - x0) < gone) continue;
    x.save(); x.translate(px, gy + rnd(i + 90) * 60); x.rotate(rnd(i) * 6); x.fillStyle = cols[i % 5]; x.fillRect(-9, -4, 18, 8); x.restore();
  }
}
function dog(px, gy, s, wag, look) {
  x.save(); x.translate(px, gy); x.scale(s, s); x.lineJoin = 'round'; x.lineCap = 'round'; x.strokeStyle = K.ink; x.lineWidth = 6;
  x.strokeStyle = K.ink; x.lineWidth = 16; x.beginPath(); x.moveTo(90, -30); x.quadraticCurveTo(140, -40 - wag * 40, 150 + wag * 20, -70 - wag * 20); x.stroke();
  x.strokeStyle = '#D9A566'; x.lineWidth = 8; x.stroke();
  x.strokeStyle = K.ink; x.lineWidth = 6; x.fillStyle = '#D9A566';
  x.beginPath(); x.ellipse(20, -34, 100, 38, 0, 0, 6.29); x.fill(); x.stroke();
  x.beginPath(); x.ellipse(-50, -8, 34, 12, 0, 0, 6.29); x.fill(); x.stroke();
  x.beginPath(); x.arc(-80, -64, 46, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = '#B98242'; for (const d of [-1, 1]) { x.beginPath(); x.moveTo(-80 + d * 22, -100); x.lineTo(-80 + d * 44, -128); x.lineTo(-80 + d * 40, -86); x.fill(); x.stroke(); }
  x.fillStyle = '#F2D2A6'; x.beginPath(); x.ellipse(-110, -50, 26, 18, 0, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = K.ink; x.beginPath(); x.arc(-128, -56, 7, 0, 6.29); x.fill();
  x.lineWidth = 5; for (const d of [-1, 1]) { if (look) { x.beginPath(); x.moveTo(-80 + d * 16 - 8, -70); x.lineTo(-80 + d * 16 + 8, -70); x.stroke(); } else { x.beginPath(); x.arc(-80 + d * 16, -70, 6, 0, 6.29); x.fill(); } }
  x.restore();
}
function bridge(ox, gy, w, h, t, deckY) {           // the 1317 overpass over the 121, drawn side-on like the page card
  const y = (u) => deckY - h * Math.sin(Math.PI * u), X = (u) => ox + u * w;
  x.fillStyle = '#E3D9C6'; x.strokeStyle = K.ink; x.lineWidth = 6;
  for (const u of [.12, .27, .42, .58, .73, .88]) { const py = y(u) + 22; x.beginPath(); x.rect(X(u) - 22, py, 44, gy - py); x.fill(); x.stroke(); x.beginPath(); x.rect(X(u) - 36, py, 72, 18); x.fill(); x.stroke(); }
  x.lineCap = 'round';
  x.strokeStyle = K.ink; x.lineWidth = 42; x.beginPath(); for (let i = 0; i <= 60; i++) x.lineTo(X(i / 60), y(i / 60)); x.stroke();
  x.strokeStyle = K.concrete; x.lineWidth = 30; x.stroke();
  x.strokeStyle = '#8C8272'; x.lineWidth = 4; x.beginPath(); for (let i = 0; i <= 60; i++) x.lineTo(X(i / 60), y(i / 60) - 36); x.stroke();
  for (let i = 1; i < 30; i++) { x.beginPath(); x.moveTo(X(i / 30), y(i / 30) - 16); x.lineTo(X(i / 30), y(i / 30) - 36); x.stroke(); }
  return {X, y};
}
function car(px, py, rot, col, s = 1) {
  x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s); x.strokeStyle = K.ink; x.lineWidth = 4; x.fillStyle = col;
  x.beginPath(); x.roundRect(-34, -30, 68, 22, 8); x.fill(); x.stroke(); x.beginPath(); x.roundRect(-18, -44, 34, 18, 6); x.fill(); x.stroke();
  x.fillStyle = K.ink; x.beginPath(); x.arc(-20, -8, 8, 0, 6.29); x.arc(20, -8, 8, 0, 6.29); x.fill(); x.restore();
}
function shield(px, py, s, num) {
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 6;
  x.beginPath(); x.moveTo(-50, -40); x.lineTo(50, -40); x.lineTo(50, 10); x.quadraticCurveTo(0, 50, -50, 10); x.closePath(); x.fill(); x.stroke();
  txt(num, 0, -8, {size: 40, face: SFX, weight: 700}); x.restore();
}
function sign(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#9AA0AE'; x.fillRect(-6, 50, 12, 260); x.strokeStyle = K.ink; x.lineWidth = 4; x.strokeRect(-6, 50, 12, 260);
  x.fillStyle = K.sign; x.beginPath(); x.roundRect(-140, -60, 280, 120, 12); x.fill(); x.strokeStyle = K.white; x.lineWidth = 5; x.beginPath(); x.roundRect(-132, -52, 264, 104, 8); x.stroke();
  txt('สันกำแพง →', 0, -18, {size: 40, color: K.white}); txt('San Kamphaeng', 0, 26, {size: 28, color: K.white, weight: 500}); x.restore();
}
function hills(gy, off) {
  x.fillStyle = '#A7DBA0'; x.beginPath(); x.moveTo(P.x, gy);
  for (let xx = 0; xx <= W; xx += 20) x.lineTo(xx, gy - 170 - Math.sin((xx + off) / 170) * 50 - Math.sin((xx + off) / 71) * 18); x.lineTo(W, gy); x.fill();
}


return {PLUMBER, K, SFX, HAND, clamp, ease, back, inn, rnd, P, txt, sfx, caption, bubble, page, panel, shake, rays, focusLines, sparkle, NAN, BEER, GOLD, diamonds, trimLine, goldFlower, feather, avatar, standing, wheel, plate, puffs, BIKES, scooter, tag, scissors, cone, bow, ribbon, confetti, groundConfetti, dog, car, shield, hills, W, H};
}
