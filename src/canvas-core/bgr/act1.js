// ACT ONE (Monday): the plumbing goes wrong, the machines try, Beer books a plumber on motdang.
// Every scene is draw(S, t) with t the shot's own seconds; S carries the kit (L), the props (Q), the
// film's seconds (T), the context (x) and env.
// lib.js is not this file's to change, so what act 1 needs from it lives here as local helpers:
//   block / bub / say / cap / tag2   speech and label system (tails reach the speaker, Thai lines clear the English line above)
//   avatar2 / person                  the brand avatar from lib.js with idle breathing, blinks, talk, look and a smoke puff attached
// @ts-nocheck
const two = (en, th) => `${en}\n${th}`;
const isTh = (s) => /[฀-๿]/.test(s);
const win = (L, t, a, b, d = .25) => L.inn(t, a, d) * (1 - L.inn(t, b, d));    // fades in at a, out at b

// ---------- text, bubbles, captions, tags ----------
// lines: 'a\nb'. A Thai line after a Latin line drops .36 of its size, after a Thai line .20, so tone marks and upper vowels
// clear the line above; a block that opens on a Thai line gets .32 of its size above it. o.sub = how many trailing lines use o.subSize / o.subColor.
function block(S, lines, size, o = {}) {
  const { x, L } = S, lh = o.lh || 1.22, raw = String(lines).split('\n'), n = raw.length, ns = o.sub || 0;
  const ls = raw.map((s, i) => ({ s, size: i >= n - ns ? (o.subSize || size) : size, color: i >= n - ns ? o.subColor : o.color }));
  let y = isTh(ls[0].s) ? .32 * size : 0, w = 0;
  ls.forEach((l, i) => {
    if (i && isTh(l.s)) y += (isTh(ls[i - 1].s) ? .20 : .36) * l.size;
    l.y = y + l.size * lh / 2; y += l.size * lh;
    x.font = `700 ${l.size}px ${L.HAND}`; w = Math.max(w, x.measureText(l.s).width);
  });
  return { ls, w, h: y };
}
const paint = (S, b, cx, top) => b.ls.forEach((l) => S.L.txt(l.s, cx, top + l.y, { size: l.size, color: l.color }));

// speech bubble centred on cx,cy, tail to tx,ty (the tail may run 240 px); it breathes a little so a read-hold is alive
function bub(S, lines, cx, cy, tx, ty, a, o = {}) {
  if (a <= 0) return; const { x, L, T } = S, K = L.K, size = o.size || 50;
  const b = block(S, lines, size, o), w = b.w + 70, h = b.h + 46 + (isTh(String(lines).split('\n')[0]) ? .12 * size : 0);
  const k = (.6 + .4 * L.back(a)) * (1 + .012 * Math.sin(T * 5));
  x.save(); x.globalAlpha = L.clamp(a * 3); x.translate(cx, cy); x.scale(k, k); x.translate(-cx, -cy);
  const shape = () => {
    x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 46));
    const bx = cx + L.clamp(tx - cx, -w / 3, w / 3), by = ty > cy ? cy + h / 2 - 4 : cy - h / 2 + 4;
    const dx = tx - bx, dy = ty - by, dl = Math.hypot(dx, dy) || 1, k2 = Math.min(dl, 240) / dl;
    x.moveTo(bx - 26, by); x.lineTo(bx + dx * k2, by + dy * k2); x.lineTo(bx + 26, by);
  };
  x.lineJoin = 'round'; shape(); x.lineWidth = 14; x.strokeStyle = K.ink; x.stroke();
  shape(); x.fillStyle = o.fill || K.white; x.fill();
  paint(S, b, cx, cy - b.h / 2); x.restore();
}
// a bubble over a speaker standing at (px, gy) at scale s: sits above her head, its tail ends at the crown, never below y 1560
function say(S, px, gy, s, lines, a, o = {}) {
  if (a <= 0) return; const { L } = S, size = o.size || 44, b = block(S, lines, size, o), w = b.w + 70, h = b.h + 46, headTop = gy - 420 * s;
  const cy = Math.max(150 + h / 2, Math.min(headTop - 70 - h / 2 + (o.dy || 0), 1560 - h / 2));
  bub(S, lines, L.clamp(o.cx ?? px, 70 + w / 2, 1010 - w / 2), cy, o.tx ?? px, o.ty ?? headTop + 10, a, o);
}
// yellow narration box, kept above y 1580
function cap(S, lines, px, py, a, o = {}) {
  if (a <= 0) return; const { x, L } = S, K = L.K, size = o.size || 44;
  const b = block(S, lines, size, { lh: 1.25 }), w = b.w + 56, h = b.h + 34; py = Math.min(py, 1580 - h);
  const bx = L.clamp(o.right ? px - w : o.center ? px - w / 2 : px, 60, 1020 - w);
  x.save(); x.globalAlpha = L.clamp(a * 2); x.translate(0, (1 - L.ease(a)) * -30);
  x.fillStyle = K.ink; x.fillRect(bx + 8, py + 8, w, h); x.fillStyle = o.fill || K.yellow; x.fillRect(bx, py, w, h); x.lineWidth = 5; x.strokeStyle = K.ink; x.strokeRect(bx, py, w, h);
  paint(S, b, bx + w / 2, py + 17); x.restore();
}
// little label with a pointer; the pointer keeps its target when the body is pushed inside the frame. o.up turns it up.
function tag2(S, lines, px, py, a, o = {}) {
  if (a <= 0) return; const { x, L } = S, K = L.K, size = o.size || 36, dir = o.up ? -1 : 1;
  const b = block(S, lines, size, { lh: 1.15 }), w = b.w + 40, h = b.h + 22;
  const bx = L.clamp(px, 70 + w / 2, 1010 - w / 2), pb = L.clamp(px, bx - w / 2 + 28, bx + w / 2 - 28), edge = py + dir * h / 2;
  x.save(); x.globalAlpha = L.clamp(a * 3); x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 5; x.lineJoin = 'round';
  x.beginPath(); x.roundRect(bx - w / 2, py - h / 2, w, h, 14); x.moveTo(pb - 14, edge); x.lineTo(px, edge + dir * 26); x.lineTo(pb + 14, edge); x.fill(); x.stroke();
  x.fillStyle = K.white; x.fillRect(pb - 12, dir > 0 ? edge - 6 : edge - 2, 24, 8);
  paint(S, b, bx, py - b.h / 2); x.restore();
}
// a sound word that jumps a little on its beat (k 0..1)
function bump(S, str, px, py, size, a, k, o = {}) {
  const { x } = S; x.save(); x.translate(px, py); const g = 1 + .2 * k; x.scale(g, g); x.translate(-px, -py); S.L.sfx(str, px, py, size, a, o); x.restore();
}

// ---------- the brand avatar, with life ----------
// lib.js's avatar() plus: breathing (upper body only, feet stay), blinks, o.talk (mouth and a nod), o.look [dx,dy] (pupils),
// o.tilt (head), o.roll 0..1 (the eye-roll sweep), and the smoke puff attached to NaN's head (o.smoke false | true | 'heart').
// o.idle false switches the life off. The plumber's arms are lib.js's plArm.
function plHand2(S, who, tx, ty, a, grip) {
  const { x } = S; x.save(); x.translate(tx, ty); x.rotate(a); x.fillStyle = who.skin; x.strokeStyle = who.skin; x.lineCap = 'round'; x.lineJoin = 'round';
  const up = Math.cos(a) >= 0 ? -1 : 1;
  if (grip === 'fist') {
    x.beginPath(); x.roundRect(-17, -13, 34, 26, 10); x.fill();
    x.fillStyle = who.skin2; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-12 + i * 8, -up * 10, 4.4, 0, 6.29); x.fill(); }
    x.strokeStyle = who.skin2; x.lineWidth = 2.4; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(-16 + i * 8, up * -12); x.lineTo(-16 + i * 8, up * 9); x.stroke(); }
    x.strokeStyle = who.skin; x.lineWidth = 8; x.beginPath(); x.moveTo(-14, up * 12); x.lineTo(12, up * 14); x.stroke();
  } else {
    x.beginPath(); x.roundRect(-4, -12, 25, 24, 9); x.fill();
    const len = [20, 23, 21, 15]; x.lineWidth = 6.6;
    for (let i = 0; i < 4; i++) { const yy = -9 + i * 6, an = (i - 1.5) * .17; x.beginPath(); x.moveTo(15, yy); x.lineTo(15 + Math.cos(an) * len[i], yy + Math.sin(an) * len[i]); x.stroke(); }
    x.lineWidth = 7.6; x.beginPath(); x.moveTo(3, up * 8); x.lineTo(14, up * 20); x.stroke();
  }
  x.restore();
}
function plArm2(S, who, s, tx, ty, g) {
  const { x, L } = S, clamp = L.clamp, sx = s * 46, sy = -100, L1 = 110, L2 = 106;
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
  plHand2(S, who, tx, ty, ang, grip);
}
function avatar2(S, who, o = {}) {
  const { x, L, Q } = S, { K, txt, GOLD, diamonds, trimLine, goldFlower, feather } = L;
  const hands = o.hands || [[-78, -20], [78, -20]], nan = who.look === 'nan', pl = who.look === 'pl', kick = (o.kick || 0) * 10, hy = -214, t = o.t || 0;
  const idle = o.idle !== false, sway = Math.sin(t * 5) * 3, br = idle ? Math.sin(t * 3.1) * 3 : 0;
  const closed = idle && (t + (nan ? 0 : pl ? 2.0 : 1.1)) % 3.3 < .14 ? .12 : 1;                 // a blink every 3.3 s, four frames, offset per person
  const talk = o.talk, nod = idle && talk > 0 ? Math.sin(t * 6) * .025 * talk : 0, tilt = o.tilt || 0, lk = o.look || [0, 0];
  const head = (draw) => { x.save(); x.translate(0, br - 120); x.rotate(nod + tilt); x.translate(0, 120); draw(); x.restore(); };
  const upper = (draw) => { x.save(); x.translate(0, br); draw(); x.restore(); };
  if (nan && o.smoke !== false) Q.smoke(o.smokeX ?? 112, -296, 1, t, o.smoke === 'heart' ? 1 : 0);
  head(() => {                                      // back hair
    if (pl) { x.fillStyle = '#211A1C'; x.beginPath(); x.arc(0, hy - 4, 98, Math.PI, 0); x.lineTo(92, hy + 40); x.lineTo(-92, hy + 40); x.closePath(); x.fill(); }
    else if (nan) {
      x.fillStyle = '#65463A'; x.beginPath(); x.arc(0, hy, 106, Math.PI, 0);
      for (let yy = hy; yy <= -6; yy += 4) x.lineTo(124 + Math.sin(yy / 17) * 9 + sway, yy);
      for (let xx = 124; xx >= -124; xx -= 4) x.lineTo(xx, -6 + Math.sin(xx / 13) * 7);
      for (let yy = -6; yy >= hy; yy -= 4) x.lineTo(-124 + Math.sin(yy / 17 + 1) * 9 + sway, yy);
      x.fill(); x.fillStyle = '#46302A'; x.beginPath(); x.ellipse(0, -110, 92, 70, 0, 0, 6.29); x.fill();
    } else { x.fillStyle = '#1D1A1F'; x.beginPath(); x.arc(0, hy, 104, Math.PI, 0); x.lineTo(112, -50); x.lineTo(-112, -50); x.closePath(); x.fill(); }
  });
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
  upper(() => {                                     // torso, arms
    x.fillStyle = who.top; x.beginPath(); x.roundRect(-60, -124, 120, 132, [46, 46, 20, 20]); x.fill();
    x.fillStyle = who.skin2; x.fillRect(-20, -142, 40, 22);
    if (pl) {
      x.fillStyle = '#2F6FA8'; x.beginPath(); x.moveTo(-26, -124); x.lineTo(0, -96); x.lineTo(26, -124); x.lineTo(14, -124); x.lineTo(0, -108); x.lineTo(-14, -124); x.fill();
      x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(-3, -96, 6, 104);
      x.fillStyle = '#FFF4DE'; x.beginPath(); x.roundRect(14, -92, 40, 22, 5); x.fill(); txt('ช่าง', 34, -81, { size: 15, color: '#1F4E7A' });
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
      if (pl) { plArm2(S, who, s, hx, hy2, (o.grip || [])[i]); continue; }
      x.lineCap = 'round'; x.strokeStyle = who.top; x.lineWidth = 28; x.beginPath(); x.moveTo(s * 46, -100); x.lineTo(hx, hy2); x.stroke();
      x.fillStyle = who.skin; x.beginPath(); x.arc(hx, hy2, 16, 0, 6.29); x.fill();
    }
  });
  head(() => {                                      // face and front hair
    x.fillStyle = who.skin; x.beginPath(); x.ellipse(0, hy + 6, nan ? 78 : 80, nan ? 90 : 86, 0, 0, 6.29); x.fill();
    if (nan) for (const s of [-1, 1]) {
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
      else {
        x.save(); x.translate(ex, ey); x.scale(1, closed); x.translate(-ex, -ey);
        if (f === 'shock') { x.fillStyle = K.white; x.beginPath(); x.arc(ex, ey, 16, 0, 6.29); x.fill(); x.fillStyle = dark; x.beginPath(); x.arc(ex + lk[0] * 7, ey + 2 + lk[1] * 7, 6, 0, 6.29); x.fill(); }
        else if (f === 'roll') {                      // a fond eye-roll: the pupil sweeps left, up, then right
          const u = o.roll == null ? null : L.clamp(o.roll), a = u == null ? 0 : Math.PI + u * Math.PI * .8, px = u == null ? 3 : Math.cos(a) * 7, py = u == null ? -8 : Math.sin(a) * 8;
          x.fillStyle = K.white; x.beginPath(); x.ellipse(ex, ey, 13, 15, 0, 0, 6.29); x.fill(); x.fillStyle = dark; x.beginPath(); x.arc(ex + px, ey + py, 6.5, 0, 6.29); x.fill();
        } else {
          const lx = lk[0] * 9, ly = lk[1] * 8;
          x.fillStyle = dark; x.beginPath(); x.ellipse(ex + lx, ey + ly, 10, 13, 0, 0, 6.29); x.fill();
          x.fillStyle = K.white; x.beginPath(); x.arc(ex + lx + 3, ey + ly - 5, 4.5, 0, 6.29); x.fill(); x.beginPath(); x.arc(ex + lx - 4, ey + ly + 5, 2, 0, 6.29); x.fill();
          if (f === 'grin') { x.fillStyle = who.skin; x.fillRect(ex - 14, ey - 16, 28, 11); }
        }
        x.restore();
      }
      if (nan && f !== 'joy') { x.strokeStyle = dark; x.lineWidth = 3; for (const [dx, dy] of [[10, -8], [14, -2], [12, 5]]) { x.beginPath(); x.moveTo(ex + s * 8, ey - 6 + dy * .4); x.lineTo(ex + s * (8 + dx), ey - 6 + dy); x.stroke(); } }
      if (pl) { x.strokeStyle = '#211A1C'; x.lineWidth = 9; x.beginPath(); x.moveTo(ex - 17, ey - 27); x.lineTo(ex + 17, ey - 29 + s * 2); x.stroke(); }
      if (nan) { x.strokeStyle = '#5A3C2C'; x.lineWidth = 5; x.beginPath();
        if (f === 'grin') { x.moveTo(ex - s * 14, ey - 18); x.lineTo(ex + s * 14, ey - 28); } else { x.moveTo(ex - 16, ey - 26); x.quadraticCurveTo(ex, ey - 34, ex + 16, ey - 26); } x.stroke(); }
    }
    x.strokeStyle = who.skin2; x.lineWidth = 3; x.beginPath(); x.arc(0, ey + 30, 5, .3, Math.PI - .3); x.stroke();
    const my = ey + 50;
    if (f === 'shock') { x.fillStyle = '#7A2230'; x.beginPath(); x.ellipse(0, my + 6, 12, 16, 0, 0, 6.29); x.fill(); }
    else {                                           // the big open grin, with teeth (Nan's has the gold one); talking, it opens and shuts
      const w = nan ? 40 : 30, mm = talk > 0 ? 1 - talk * .5 * (1 - Math.abs(Math.sin(t * 13))) : talk === 0 ? .8 : 1, d = (nan ? 42 : 34) * mm;
      const mouth = () => { x.beginPath(); x.moveTo(-w, my - 4); x.quadraticCurveTo(0, my + 4, w, my - 4); x.quadraticCurveTo(w * .9, my + d, 0, my + d); x.quadraticCurveTo(-w * .9, my + d, -w, my - 4); x.closePath(); };
      mouth(); x.fillStyle = nan ? '#7A2230' : '#8E3A3A'; x.fill();
      x.save(); mouth(); x.clip();
      x.fillStyle = '#E07A86'; x.beginPath(); x.ellipse(0, my + d - 4, w * .5, 10, 0, 0, 6.29); x.fill();
      if (nan) for (let i = 0; i < 8; i++) { x.fillStyle = i === 5 ? '#E8B32E' : '#FBF8F2'; x.fillRect(-w + 4 + i * (2 * w - 8) / 8 + 1, my - 6, (2 * w - 8) / 8 - 2, 13); }
      else { x.fillStyle = '#FFFFFF'; x.fillRect(-w, my - 6, 2 * w, 11); }
      x.restore();
      mouth(); x.strokeStyle = nan ? '#A81E34' : '#C7645C'; x.lineWidth = 4; x.stroke();
    }
    if (pl) {
      x.fillStyle = '#211A1C'; x.beginPath(); x.moveTo(-84, hy - 30); x.quadraticCurveTo(-70, hy - 96, 0, hy - 100); x.quadraticCurveTo(70, hy - 98, 86, hy - 34);
      x.quadraticCurveTo(40, hy - 74, -10, hy - 56); x.quadraticCurveTo(-50, hy - 62, -84, hy - 30); x.fill();
      x.fillStyle = who.cap || '#1F4E7A'; x.beginPath(); x.arc(0, hy - 34, 92, Math.PI * 1.08, Math.PI * 1.92); x.quadraticCurveTo(0, hy - 96, -86, hy - 58); x.fill();
      x.beginPath(); x.ellipse(-84, hy - 62, 46, 13, .35, 0, 6.29); x.fill();
      x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(0, hy - 128, 7, 0, 6.29); x.fill();
      x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 4; x.beginPath(); x.arc(0, hy - 34, 80, Math.PI * 1.25, Math.PI * 1.75); x.stroke();
    } else if (nan) {
      x.fillStyle = '#65463A';
      for (const s of [-1, 1]) { x.beginPath(); x.moveTo(s * 2, hy - 98); x.bezierCurveTo(s * 70, hy - 98, s * 92, hy - 50, s * 86, hy + 30);
        x.lineTo(s * 76, hy + 30); x.bezierCurveTo(s * 76, hy - 30, s * 50, hy - 62, s * 2, hy - 64); x.closePath(); x.fill(); }
      x.strokeStyle = '#46302A'; x.lineWidth = 4; x.beginPath(); x.moveTo(0, hy - 104); x.lineTo(0, hy - 66); x.stroke();
      x.strokeStyle = '#DDD4C2'; x.lineWidth = 5;
      for (const s of [-1, 1]) for (const k of [0, 1]) { x.beginPath(); x.moveTo(s * (14 + k * 22), hy - 90 + k * 6);
        x.bezierCurveTo(s * (70 + k * 14), hy - 86, s * (100 + k * 12), hy - 30, s * (104 + k * 10) + sway, hy + 40);
        for (let yy = hy + 40; yy < -20; yy += 4) x.lineTo(s * (104 + k * 10 + Math.sin(yy / 14 + k) * 7) + sway, yy); x.stroke(); }
      feather(66, hy - 64, .55, .9);
    } else {
      x.fillStyle = '#1D1A1F';
      x.beginPath(); x.arc(0, hy, 106, Math.PI * 1.05, Math.PI * 1.95);
      x.bezierCurveTo(96, hy - 20, 80, hy + 10, 84, hy + 70); x.lineTo(70, hy + 70); x.bezierCurveTo(66, hy - 10, 40, hy - 58, 6, hy - 70);
      x.lineTo(-6, hy - 70); x.bezierCurveTo(-40, hy - 58, -66, hy - 10, -70, hy + 70); x.lineTo(-84, hy + 70); x.bezierCurveTo(-80, hy + 10, -96, hy - 20, -100, hy - 36);
      x.fill();
      x.strokeStyle = '#3A3438'; x.lineWidth = 4; x.beginPath(); x.arc(0, hy, 90, Math.PI * 1.3, Math.PI * 1.6); x.stroke();
      x.strokeStyle = '#B08A3E'; x.lineWidth = 4.5;
      for (const s of [-1, 1]) { x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.arc(s * 36, ey + 2, 31, 0, 6.29); x.fill(); x.stroke();
        x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); x.arc(s * 36, ey + 2, 22, Math.PI * 1.15, Math.PI * 1.45); x.stroke(); x.strokeStyle = '#B08A3E'; x.lineWidth = 4.5; }
      x.beginPath(); x.moveTo(-6, ey); x.quadraticCurveTo(0, ey - 6, 6, ey); x.moveTo(-67, ey); x.lineTo(-80, ey - 4); x.moveTo(67, ey); x.lineTo(80, ey - 4); x.stroke();
      goldFlower(72, hy - 70, 20);
    }
  });
}
// pose a brand avatar at (px, gy) at scale s. o.joy = hops; o.flail 0..1 = the hands wave about; the rest goes to avatar2.
function person(S, who, px, gy, s, o = {}) {
  const { x, T } = S, hop = o.joy ? -Math.abs(Math.sin(T * 7)) * 18 * s : 0;
  let hands = o.hands || [[-78, -20], [78, -20]];
  if (o.flail) hands = hands.map(([hx, hy], i) => [hx + Math.sin(T * 9 + i * 2.4) * 25 * o.flail, hy + Math.cos(T * 9 + i * 1.7) * 25 * o.flail]);
  x.save(); x.translate(px, gy - 100 * s + hop); x.scale(s, s); avatar2(S, who, { ...o, hands, t: T }); x.restore();
  return hands;
}
// where a hand drawn by person() lands on the page, and the hand drawn again on top of whatever it holds
function handAt(S, px, gy, s, h, o = {}) { const hop = o.joy ? -Math.abs(Math.sin(S.T * 7)) * 18 * s : 0; return [px + h[0] * s, gy - 100 * s + hop + (o.idle === false ? 0 : Math.sin(S.T * 3.1) * 3 * s) + h[1] * s]; }
function holdHand(S, who, wx, wy, s) { const { x } = S; x.fillStyle = who.skin; x.beginPath(); x.arc(wx, wy, 16 * s, 0, 6.29); x.fill(); }

// ---------- small things ----------
const INK = '#1E1B2E';
function ol(x, w = 5) { x.strokeStyle = INK; x.lineWidth = w; x.lineJoin = 'round'; x.lineCap = 'round'; }
// a phone drawn at its own size (a thin bezel, not Q.phone's fixed one): origin = its centre, w x h = the whole outside
function miniPhone(S, px, py, w, h, rot, draw) {
  const { x } = S, bz = Math.max(4, w * .08);
  x.save(); x.translate(px, py); x.rotate(rot || 0); x.fillStyle = INK; x.beginPath(); x.roundRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6, w * .2); x.fill();
  x.fillStyle = '#3A3D4A'; x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, w * .17); x.fill();
  x.save(); x.beginPath(); x.roundRect(-w / 2 + bz, -h / 2 + bz, w - 2 * bz, h - 2 * bz, w * .12); x.clip(); x.translate(-w / 2 + bz, -h / 2 + bz); draw(w - 2 * bz, h - 2 * bz); x.restore(); x.restore();
}
// expanding ring arcs from a phone (3, 24 px apart, fading), opening toward angle a
function ringing(S, px, py, a, T, k = 1, rgb = '30,27,46') {
  const { x } = S; x.save(); x.translate(px, py); x.rotate(a); x.lineCap = 'round'; x.lineWidth = 7;
  for (let i = 0; i < 3; i++) { const f = ((T * 1.6 + i / 3) % 1), r = 40 + f * 72; x.strokeStyle = `rgba(${rgb},${(1 - f) * .9 * k})`; x.beginPath(); x.arc(0, 0, r, -.62, .62); x.stroke(); }
  x.restore();
}
function pumpClick(T) { const ph = (T * 1.6) % 1, on = ph < .5; return { on, k: Math.exp(-((ph % .5) / 1.6) * 12) }; }

// Hitachi-style automatic pump: a SQUARE pressure tank (the real WT-P tanks are 384 mm square), the pump head and motor under it,
// a pressure switch with its gauge, and a drain plug under the tank (the pump-filter-drain fix for a pump that cycles)
function pumpSq(S, px, gy, s, T, cyc = 1) {
  const { x, L } = S, K = L.K, pc = pumpClick(T), on = cyc > 0 && pc.on;
  x.save(); x.translate(px, gy); x.scale(s, s); ol(x, 6);
  x.fillStyle = '#6B7180'; x.beginPath(); x.roundRect(-190, -20, 380, 30, 6); x.fill(); x.stroke();                                // base plate
  x.strokeStyle = INK; x.lineWidth = 34; x.lineCap = 'butt'; x.beginPath(); x.moveTo(-320, -90); x.lineTo(-170, -90); x.stroke();      // inlet pipe
  x.strokeStyle = '#3F8FD8'; x.lineWidth = 24; x.stroke(); ol(x, 6);
  x.fillStyle = '#2F78BF'; x.beginPath(); x.roundRect(-170, -150, 150, 130, 16); x.fill(); x.stroke();                                  // pump head
  x.fillStyle = '#E9EDF2'; x.beginPath(); x.roundRect(-30, -170, 200, 150, 30); x.fill(); x.stroke();                                    // motor
  x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 4; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(110 + i * 9, -150); x.lineTo(110 + i * 9, -40); x.stroke(); }
  ol(x, 6);
  const tg = x.createLinearGradient(0, -500, 0, -176); tg.addColorStop(0, '#E9EDF2'); tg.addColorStop(1, '#CFD8DD');
  const tank = () => { x.beginPath(); x.roundRect(-170, -506, 300, 330, 64); };
  tank(); x.fillStyle = tg; x.fill(); x.save(); tank(); x.clip(); x.fillStyle = '#2F78BF'; x.fillRect(-176, -286, 312, 120); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(-176, -286, 312, 14); x.restore();
  tank(); x.stroke(); x.beginPath(); x.moveTo(-170, -286); x.lineTo(130, -286); x.lineWidth = 4; x.stroke(); x.lineWidth = 6;
  x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.roundRect(-140, -470, 22, 160, 11); x.fill();
  x.fillStyle = '#C9A24A'; x.beginPath(); x.roundRect(-30, -178, 20, 12, 3); x.fill(); x.stroke(); x.fillStyle = '#E8CF7E'; x.beginPath(); x.arc(-20, -158, 9, 0, 6.29); x.fill(); x.stroke(); // the brass drain plug
  x.fillStyle = '#E9EDF2'; ol(x, 5); x.beginPath(); x.roundRect(90, -330, 90, 110, 12); x.fill(); x.stroke();                                // pressure switch
  x.fillStyle = '#FBFAF6'; x.beginPath(); x.arc(135, -288, 30, 0, 6.29); x.fill(); x.stroke();
  const needle = -2.4 + (on ? 1.2 : .4) + Math.sin(T * 12) * .1 * cyc; x.strokeStyle = '#E2463C'; x.lineWidth = 4; x.beginPath(); x.moveTo(135, -288); x.lineTo(135 + Math.cos(needle) * 24, -288 + Math.sin(needle) * 24); x.stroke();
  x.strokeStyle = INK; x.lineWidth = 34; x.lineCap = 'butt'; x.beginPath(); x.moveTo(170, -110); x.lineTo(330, -110); x.stroke(); x.strokeStyle = '#3F8FD8'; x.lineWidth = 24; x.stroke();
  if (on) { x.lineCap = 'round'; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { const ex = d > 0 ? 130 + 20 + i * 24 : -170 - 20 - i * 24; x.strokeStyle = INK; x.lineWidth = 7; x.globalAlpha = .65 - i * .2;
      x.beginPath(); x.moveTo(ex, -450); x.quadraticCurveTo(ex + d * 14, -370, ex, -290); x.stroke(); } x.globalAlpha = 1; }
  x.restore(); return pc;
}
// a round comic inset ("meanwhile, outside"); shake [dx,dy] jolts the whole circle
function inset(S, cx, cy, r, a, draw, shake) {
  const { x, L } = S; if (a <= 0) return; const k = L.back(a);
  x.save(); if (shake) x.translate(shake[0], shake[1]); x.translate(cx, cy); x.scale(k, k); x.translate(-cx, -cy);
  x.fillStyle = L.K.ink; x.beginPath(); x.arc(cx + 10, cy + 10, r, 0, 6.29); x.fill();
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 6.29); x.clip(); draw(); x.restore();
  x.strokeStyle = L.K.ink; x.lineWidth = 9; x.beginPath(); x.arc(cx, cy, r, 0, 6.29); x.stroke(); x.restore();
}
// room.svg: a pink plastic dipper (khan), rocking on the water
function dipper(S, px, py, s, rot) {
  const { x } = S; x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s); ol(x, 3); x.lineJoin = 'round';
  x.strokeStyle = INK; x.lineWidth = 11; x.beginPath(); x.moveTo(27, 2); x.lineTo(54, -6); x.stroke(); x.strokeStyle = '#E8407A'; x.lineWidth = 6; x.stroke();
  ol(x, 3); x.fillStyle = '#E8407A'; x.beginPath(); x.moveTo(-27, 0); x.quadraticCurveTo(-25, 22, 0, 24); x.quadraticCurveTo(25, 22, 27, 0); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#FF8FB3'; x.beginPath(); x.ellipse(0, 0, 27, 5, 0, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(-12, 12, 4, 7, -.4, 0, 6.29); x.fill();
  x.restore();
}
function slippers(S, px, py, s) {                                                     // a pair of pink rubber slippers, toes up: sole, Y strap, toe post
  const { x } = S; x.save(); x.translate(px, py); x.scale(s, s); x.lineJoin = 'round'; x.lineCap = 'round';
  for (const [dx, r] of [[-24, -.1], [26, .08]]) { x.save(); x.translate(dx, 0); x.rotate(r);
    x.fillStyle = '#E8407A'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -38); x.bezierCurveTo(21, -38, 22, -6, 16, 16); x.bezierCurveTo(12, 38, -12, 38, -16, 16); x.bezierCurveTo(-22, -6, -21, -38, 0, -38); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#FF8FB3'; x.beginPath(); x.ellipse(0, 12, 9, 17, 0, 0, 6.29); x.fill();
    x.strokeStyle = INK; x.lineWidth = 11; x.beginPath(); x.moveTo(-17, -4); x.lineTo(0, -24); x.lineTo(17, -4); x.stroke(); x.strokeStyle = '#fff'; x.lineWidth = 6; x.stroke();
    x.restore(); }
  x.restore();
}
function pedalBin(S, px, gy, s) {                                                      // a pedal bin by the toilet
  const { x } = S; x.save(); x.translate(px, gy); x.scale(s, s); ol(x, 5);
  x.fillStyle = '#7FB3C9'; x.beginPath(); x.moveTo(-46, -170); x.lineTo(46, -170); x.lineTo(38, -12); x.lineTo(-38, -12); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 4; x.beginPath(); x.moveTo(-43, -112); x.lineTo(43, -112); x.stroke(); ol(x, 5);
  x.fillStyle = '#9CC8DB'; x.beginPath(); x.roundRect(-54, -192, 108, 24, 11); x.fill(); x.stroke();
  x.fillStyle = '#3B6476'; x.beginPath(); x.roundRect(-20, -10, 40, 12, 5); x.fill(); x.stroke();
  x.restore();
}

// the bathroom wall and floor, shared by the Monday shots: small square tiles, the pink band, a louvre window, a floor drain
export function bathroom(S, o = {}) {
  const { x, L, Q, t, T } = S, P = L.P, gy = 1250;
  Q.tiles(P.x, P.y, P.w, gy - P.y, 58, '#F4ECD8', '#CFE8DE');
  x.fillStyle = '#E8407A'; x.fillRect(P.x, 790, P.w, 14); x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 3; x.setLineDash([10, 15]); x.beginPath(); x.moveTo(P.x, 797); x.lineTo(P.x + P.w, 797); x.stroke(); x.setLineDash([]);
  Q.floorTiles(P.x, gy, P.w, P.y + P.h - gy);
  x.fillStyle = 'rgba(125,139,145,.55)'; x.fillRect(P.x, gy - 4, P.w, 8);
  Q.windowSky(650, 290, 210, 130, () => { x.fillStyle = '#7CC08A'; x.fillRect(650, 388, 210, 40); x.fillStyle = '#FFF3A8'; x.beginPath(); x.arc(822, 332, 20, 0, 6.29); x.fill(); });
  Q.shower(170, 480, 1, T, false);
  Q.gecko(925, 322 + Math.sin(T * .7) * 8, .9, -.3, T, { look: Math.sin(T * 1.3) });
  Q.toilet(800, 1320, .6, {});
  Q.stopValve(940, 1040, .8, 1, true);
  pedalBin(S, 965, 1355, .9);
}

// 1. Monday, 0–7 s: the pump clicks, the shower drain floods, the paper runs out. One problem per beat.
export function s1Monday(S) {
  const { x, L, Q, t, T } = S, K = L.K, NX = 430, NY = 1470, NS = 1.05, HX = 595, HY = 1170;
  const pc = pumpClick(T), jolt = t > 1.3 && t < 3.6 ? [Math.sin(T * 90) * 4 * pc.k, Math.cos(T * 70) * 3 * pc.k] : [0, 0];
  const gasp = t >= 4.4 && t < 5.3, cheer = t >= 5.3, reach = L.ease((t - 4.35) / .3);
  const look = t < 1.1 ? [.2, 0] : t < 3.3 ? [.8, -.8] : t < 4.4 ? [-.7, .8] : gasp ? [.9, .1] : [0, 0];
  const hands = cheer ? [[-96, -200], [96, -200]] : gasp ? [[-60, -70], [84 + (157 - 84) * reach, -40 + (-162 + 40) * reach]] : [[-80, -30], [84, -40]];
  const rr = Math.min(1, L.clamp((t - 3.3) / 2.2));
  L.panel(t, '#F4ECD8', () => {
    bathroom(S);
    Q.paperHolder(HX, HY, .8, 0, gasp || cheer ? T * 9 : 0);
    Q.floorDrain(230, 1375, 1.1, L.ease((t - 3.3) / .7), T);
    if (t > 3.5) { const rx = 40 + 190 * L.ease((t - 3.5) / 2); Q.puddle(250, 1400, rx, rx * .3, T, 1); if (rx > 90) dipper(S, 220 + Math.sin(T * .9) * 26, 1398 + Math.sin(T * 1.7) * 4, 1.9, Math.sin(T * 2) * .15); }
    slippers(S, 130, 1525, 1.15);
    person(S, L.NAN, NX, NY, NS, { face: gasp ? 'shock' : 'happy', hands, look, tilt: gasp ? .07 : look[1] > .5 ? -.05 : 0, talk: cheer ? 1 : undefined, flail: cheer ? .6 : 0 });
    inset(S, 800, 590, 160, L.inn(t, 1.1, .4), () => {
      x.fillStyle = '#BFE3F2'; x.fillRect(640, 430, 320, 320); x.fillStyle = '#9CC98C'; x.fillRect(640, 640, 320, 120);
      pumpSq(S, 800, 706, .46, T, 1);
    }, jolt);
    if (t > 1.3) bump(S, 'TIK!', 650, 505, 70, L.inn(t, 1.3, .3), pc.on ? pc.k : 0, { rot: -.2 });
    if (t > 1.7) bump(S, 'TAK!', 912, 468, 70, L.inn(t, 1.7, .3), pc.on ? 0 : pc.k, { rot: .2 });
  });
  cap(S, two("Monday. NaN's bathroom.", 'วันจันทร์ ห้องน้ำบ้านแนน'), 80, 160, L.inn(t, .2, .4), { size: 40 });
  tag2(S, two('ท่อตัน', 'drain blocked'), 230, 1262, win(L, t, 3.4, 4.6), { size: 34 });
  say(S, NX, NY, NS, two('I need a BUM GUN!', 'อยากได้สายฉีดชำระ!'), L.inn(t, 5.4, .3), { size: 48 });
}

// 2. 7–12 s: NaN asks the robot vacuum; it drives into the puddle and breaks
function sparks(S, px, py, t) {
  const { x, L } = S; x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
  for (let k = 0; k < 3; k++) { if (Math.floor(t * 16 + k) % 3 === 0) continue; const a = -1.57 + (k - 1) * .85;
    x.beginPath(); x.moveTo(px, py); for (let i = 1; i <= 4; i++) x.lineTo(px + Math.cos(a + (i % 2 ? .35 : -.35)) * i * 24, py + Math.sin(a + (i % 2 ? .35 : -.35)) * i * 24);
    x.strokeStyle = INK; x.lineWidth = 11; x.stroke(); x.strokeStyle = L.K.yellow; x.lineWidth = 5; x.stroke(); }
  x.restore();
}
function wisp(S, px, py, T) {                                                         // a grey smoke wisp curling up off the robot
  const { x } = S; x.save(); x.lineCap = 'round';
  for (let k = 0; k < 3; k++) { const f = (T * .7 + k / 3) % 1, wx = px + Math.sin(f * 6 + k) * 18, wy = py - f * 120, r = 12 + f * 20;
    x.fillStyle = `rgba(150,154,168,${.8 * (1 - f)})`; x.strokeStyle = `rgba(30,27,46,${.45 * (1 - f)})`; x.lineWidth = 3; x.beginPath(); x.arc(wx, wy, r, 0, 6.29); x.fill(); x.stroke(); }
  x.restore();
}
export function s2Robot(S) {
  const { x, L, Q, t, T } = S, P = L.P, HZ = 760, NX = 250, NY = 1530, NS = 1.2;
  const go = L.ease((t - 2) / 1.8), vx = 570 + go * 260, broke = t >= 3.8, rolling = t > 2 && !broke;
  const look = [L.clamp((vx - NX) / 450, 0, .95), broke ? .3 : .15];
  L.panel(t, '#F4ECD8', () => {
    Q.tiles(P.x, P.y, P.w, HZ - P.y, 58, '#F4ECD8', '#CFE8DE');
    x.fillStyle = '#E8407A'; x.fillRect(P.x, 690, P.w, 14); x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 3; x.setLineDash([10, 15]); x.beginPath(); x.moveTo(P.x, 697); x.lineTo(P.x + P.w, 697); x.stroke(); x.setLineDash([]);
    Q.floorTiles(P.x, HZ, P.w, P.y + P.h - HZ); x.fillStyle = 'rgba(125,139,145,.55)'; x.fillRect(P.x, HZ - 4, P.w, 8);
    Q.windowSky(640, 270, 220, 150, () => { x.fillStyle = '#7CC08A'; x.fillRect(640, 385, 220, 40); x.fillStyle = '#FFF3A8'; x.beginPath(); x.arc(826, 320, 20, 0, 6.29); x.fill(); });
    Q.shower(150, 400, 1, T, false);
    Q.gecko(940, 520 + Math.sin(T * .6) * 10, .85, .5, T, { look: Math.sin(T * 1.1) });
    Q.floorDrain(840, 1345, 1.3); Q.puddle(840, 1335, 230, 70, T, 1);
    if (t > 3.8) Q.spray(vx, 1270, -1.57 + Math.sin(t * 9) * .9, 220, T, .8);
    const lurch = broke ? Math.max(0, 1 - (t - 3.8) * 3) : 0;
    Q.robotVac(vx, 1330, .95, T, { aim: broke ? 0 : t < 2 ? -1 : 1, tilt: broke ? Math.sin(t * 20) * .06 : rolling ? Math.sin(t * 14) * .025 : 0, lid: broke ? 14 * Math.min(1, (t - 3.8) * 10) * (.7 + .3 * Math.sin(t * 25)) : 0, dead: broke, eye: '#6FE3C8' });
    if (rolling) { x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 4; x.lineCap = 'round'; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(vx - 160 - i * 30 - go * 0, 1290 + i * 18); x.lineTo(vx - 200 - i * 30, 1290 + i * 18); x.stroke(); } }
    if (broke) { sparks(S, vx - 30, 1215, t); wisp(S, vx + 20, 1215, T); }
    if (t > 1 && t < 2.6) ringing(S, 570, 1228, -1.57, T, L.inn(t, 1, .2) * (1 - L.inn(t, 2.3, .3)), '30,150,135');
    person(S, L.NAN, NX, NY, NS, { face: broke ? 'shock' : 'happy', hands: broke ? [[-96, -200], [100, -190]] : [[-70, -60], [140, -125]], look, talk: t > .3 && t < 2.3 ? 1 : undefined, joy: broke && t < 5 });
  });
  say(S, NX, NY, NS, two('Sweetie, can you fix the pump?', 'ที่รัก ช่วยซ่อมปั๊มหน่อยนะ'), win(L, t, .3, 2.3), { size: 44, talk: 1 });
  L.sfx('BEEP!', 570, 1170, 80, L.inn(t, 1, .3) * (1 - L.inn(t, 2.2, .3)), { rot: .15, color: '#6FE3C8' });
  L.sfx('BLUB BLUB', 790, 1100, 72, L.inn(t, 4.1, .3), { rot: -.1, color: '#9AD8FF' });
  cap(S, two('The robot tried.', 'หุ่นยนต์ก็พยายามแล้ว'), 1010, 1440, L.inn(t, 4.3, .3), { right: true, size: 40 });
}

// 3. 12–18 s: NaN asks the laptop; the answer says to call a local plumber
function chatScreen(S, X, Y, W, H, t) {
  const { x, L } = S, K = L.K, q = 'Plumber who comes TODAY?', n = Math.floor(L.clamp((t - .3) / 1.2) * q.length);
  x.fillStyle = '#ECEEF4'; x.fillRect(X, Y, W, 46); x.fillStyle = '#4CC38A'; x.beginPath(); x.arc(X + 24, Y + 23, 7, 0, 6.29); x.fill(); L.txt('AI chat', X + 42, Y + 24, { size: 24, align: 'left', color: '#4A4F63' });
  x.font = `700 26px ${L.HAND}`; const bw = x.measureText(q).width + 40;
  x.fillStyle = '#D6E8FF'; x.beginPath(); x.roundRect(X + W - 18 - bw, Y + 60, bw, 60, 18); x.fill();
  L.txt(q.slice(0, n) + (n < q.length && Math.floor(t * 4) % 2 === 0 ? '|' : ''), X + W - 18 - bw + 20, Y + 91, { size: 26, align: 'left', color: '#1E2A44' });
  if (t > 1.9) {
    const dots = t < 2.6, bh = dots ? 60 : 196; x.fillStyle = '#F1F1F4'; x.strokeStyle = '#D0D3DD'; x.lineWidth = 2; x.beginPath(); x.roundRect(X + 14, Y + 142, W - 28, bh, 18); x.fill(); x.stroke();
    if (dots) for (let i = 0; i < 3; i++) { x.fillStyle = '#8A8FA3'; x.beginPath(); x.arc(X + 70 + i * 24, Y + 172 + Math.sin(t * 12 + i) * 4, 7, 0, 6.29); x.fill(); }
    else { ['I can\'t make phone calls.', 'Try contacting a local', 'plumber! :)'].forEach((l, i) => L.txt(l, X + 32, Y + 176 + i * 36, { size: 30, align: 'left', color: '#1E2A44' }));
      L.txt('ลองติดต่อช่างในพื้นที่ดูนะ', X + 32, Y + 176 + 3 * 36 + 8, { size: 27, align: 'left', color: '#3A3F52', weight: 600 }); }
    x.fillStyle = '#7B5CE0'; x.strokeStyle = K.white; x.lineWidth = 3; x.beginPath(); x.arc(X + 26, Y + 138, 18, 0, 6.29); x.fill(); x.stroke();      // the "AI" badge: a four-point spark
    x.fillStyle = K.white; x.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 4.5 : 12, a = i * Math.PI / 4 - 1.57; x.lineTo(X + 26 + Math.cos(a) * r, Y + 138 + Math.sin(a) * r); } x.closePath(); x.fill();
  }
}
export function s3Laptop(S) {
  const { x, L, Q, t, T } = S, K = L.K, P = L.P, NX = 290, NY = 1560, NS = 1.25, wow = t >= 3.3;
  const typed = L.clamp((t - .3) / 1.2), tap = !wow && t < 3.3 ? Math.sin(T * Math.PI * 2 * 6) * 6 : 0;
  const hands = wow ? [[-100, -230], [110, -240]] : [[-98, -232], [152, -176 + tap]];
  L.panel(t, '#DDF1FA', () => {
    Q.windowSky(120, 300, 230, 190, () => { x.fillStyle = '#7CC08A'; x.fillRect(120, 440, 230, 50); x.fillStyle = '#FFF3A8'; x.beginPath(); x.arc(300, 360, 22, 0, 6.29); x.fill(); });
    const cx = 900, cy = 230; x.fillStyle = K.white; ol(x, 6); x.beginPath(); x.arc(cx, cy, 72, 0, 6.29); x.fill(); x.stroke();                           // a wall clock: something that ticks
    ol(x, 6); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.moveTo(cx + Math.cos(a) * 58, cy + Math.sin(a) * 58); x.lineTo(cx + Math.cos(a) * 66, cy + Math.sin(a) * 66); x.stroke(); }
    x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(-.9) * 36, cy + Math.sin(-.9) * 36); x.stroke(); x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(.7) * 52, cy + Math.sin(.7) * 52); x.stroke();
    x.strokeStyle = '#E2463C'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(T * 6 - 1.57) * 56, cy + Math.sin(T * 6 - 1.57) * 56); x.stroke();
    if (wow) { x.save(); x.beginPath(); x.rect(P.x, P.y, P.w, 1330 - P.y); x.clip(); x.globalAlpha = L.clamp((t - 3.3) * 3); L.focusLines(NX, 1100, t); x.restore(); }          // focus lines, on the wall behind her only
    x.fillStyle = '#C79A6A'; x.fillRect(P.x, 1330, P.w, P.y + P.h - 1330);                                                                                              // wood floor planks
    x.strokeStyle = 'rgba(30,27,46,.28)'; x.lineWidth = 3; let yy = 1330, d = 44; while (yy < P.y + P.h) { x.beginPath(); x.moveTo(P.x, yy); x.lineTo(P.x + P.w, yy); x.stroke(); const st = Math.floor(yy / 40); for (let xx = P.x + (st % 3) * 120; xx < P.x + P.w; xx += 360) { x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + (xx - 540) * .08, yy + d); x.stroke(); } yy += d; d *= 1.18; }
    ol(x, 6); x.beginPath(); x.moveTo(P.x, 1330); x.lineTo(P.x + P.w, 1330); x.stroke();
    x.fillStyle = '#6E4630'; for (const lx of [440, 1000]) { x.beginPath(); x.rect(lx - 16, 1290, 32, 210); x.fill(); x.stroke(); }                                          // desk: legs, dark front band, top
    x.fillStyle = '#8A5A3A'; x.beginPath(); x.rect(420, 1240, 700, 50); x.fill(); x.stroke();
    x.fillStyle = '#D9A66E'; x.beginPath(); x.rect(420, 1196, 700, 44); x.fill(); x.stroke();
    Q.laptop(735, 1226, 1.08, (X, Y, W, H) => chatScreen(S, X, Y, W, H, t));
    person(S, L.NAN, NX, NY, NS, { face: wow ? 'shock' : 'happy', hands, look: wow ? [.9, -.1] : [.55 + .35 * typed, -.15], joy: wow, flail: wow ? .5 : 0, talk: wow ? 1 : t > .3 && t < 1.6 ? .6 : undefined });
  });
  bub(S, "I can't make phone calls.\nTry contacting a local\nplumber! :)\nลองติดต่อช่างในพื้นที่ดูนะ", 690, 500, 790, 790, L.inn(t, 2.6, .3), { size: 40, sub: 1, subSize: 34, subColor: '#3A3F52' });
  if (t > 2.6) { const a = L.back(L.clamp((t - 2.6) / .3)), bx = 445, by = 352; x.save(); x.translate(bx, by); x.scale(a, a);       // the AI's spark badge on the bubble's corner
    x.fillStyle = '#7B5CE0'; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, 30, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = K.white; x.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 7 : 20, an = i * Math.PI / 4 - 1.57 + T; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); x.fill(); x.restore(); }
  say(S, NX, NY, NS, 'THAT\'S WHAT\nI ASKED!\nก็ถามอยู่นี่ไง!', L.inn(t, 3.4, .3), { size: 46, talk: 1, cx: 250 });
}

// a floor band under the sunburst, and a soft contact shadow under each pair of feet
function floorBand(S, col) { const { x, L } = S, P = L.P; x.fillStyle = col; x.fillRect(P.x, 1500, P.w, P.y + P.h - 1500); ol(x, 5); x.beginPath(); x.moveTo(P.x, 1500); x.lineTo(P.x + P.w, 1500); x.stroke(); }
function shadow(S, px, gy, s) { const { x } = S; x.fillStyle = 'rgba(30,27,46,.2)'; x.beginPath(); x.ellipse(px, gy + 6, 66 * s, 11 * s, 0, 0, 6.29); x.fill(); }

// 4. 18–28 s: Beer walks in, finds a plumber on motdang and calls in Thai
function skeleton(S, w, y, h, t) {                                  // grey bars that shimmer while the results load
  const { x } = S; x.save(); x.beginPath();
  x.roundRect(24, y + 26, 72, 72, 16); x.roundRect(116, y + 34, 340, 30, 12); x.roundRect(116, y + 78, 220, 24, 12); x.roundRect(116, y + 116, 180, 36, 18);
  x.clip(); x.fillStyle = '#E6DAC2'; x.fillRect(0, y, w, h);
  const sx = ((t * 420) % (w + 200)) - 160; x.fillStyle = 'rgba(255,253,247,.95)'; x.beginPath(); x.moveTo(sx + 40, y); x.lineTo(sx + 130, y); x.lineTo(sx + 90, y + h); x.lineTo(sx, y + h); x.closePath(); x.fill(); x.restore();
}
function searchScreen(S, ts) {                                      // motdang's own screen, drawn 640 x 1000
  const { x, L, Q } = S, w = 640, q = 'ช่างประปา plumber', n = Math.floor(L.clamp((ts - .1) / 1.1) * q.length);
  Q.mdBar(w, 'motdang.net');
  Q.searchBox(w, 120, q.slice(0, n), ts < 1.3 && Math.floor((ts + 20) * 3) % 2 === 0);
  if (ts > .2 && ts < 1.55) { x.save(); x.beginPath(); x.rect(24, 204, w - 48, 6); x.clip(); x.fillStyle = '#C13A2E'; x.fillRect(((ts * 700) % (w + 100)) - 100, 204, 120, 6); x.restore(); }   // the search is thinking
  Q.mdMap(w, 220, 240, { pins: ts > 1.5 ? [[90, 300, .9], [260, 420, .9], [380, 120, .9], [470, 470, .9]] : [] });
  const rows = [['Plumber · ช่างประปา', '1.8 km · open now', ['comes to the house']], ['Pumps · ซ่อมปั๊ม', '3.2 km', ['open now', 'LINE']], ['Plumber · ช่างประปา', '4.5 km', ['open now']]];
  rows.forEach((r, i) => { const at = 1.5 + i * .25, y = 470 + i * 170;
    if (ts < at) { if (ts > .5) skeleton(S, w, y, 170, ts); return; }
    x.save(); x.globalAlpha = L.clamp((ts - at) * 6); x.translate(0, (1 - L.ease((ts - at) / .2)) * 24); Q.row(w, y, r[0], r[1], r[2], { hi: i === 0 && ts > 2.65, press: i === 0 ? L.clamp(1 - Math.abs(ts - 3.0) * 5) : 0 }); x.restore(); });
}
function thumb(S, tx, ty, press) {                                  // a thumb coming in from the lower right; (tx, ty) = where the pad meets the glass
  const { x } = S; x.save(); x.translate(tx, ty); x.rotate(-.42); const k = 1 - .05 * press; x.scale(k, k); x.translate(0, -34);
  x.fillStyle = '#E8B48C'; x.beginPath(); x.roundRect(-60, 0, 120, 700, [60, 60, 30, 30]); x.fill();
  x.fillStyle = 'rgba(160,100,60,.22)'; x.beginPath(); x.roundRect(30, 8, 30, 690, [30, 30, 20, 20]); x.fill();
  x.fillStyle = '#F6D6C2'; x.strokeStyle = 'rgba(160,100,60,.55)'; x.lineWidth = 3; x.beginPath(); x.roundRect(-38, 18, 76, 74, 30); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(160,100,60,.45)'; x.lineWidth = 3; x.lineCap = 'round'; for (const yy of [250, 276]) { x.beginPath(); x.moveTo(-34, yy); x.quadraticCurveTo(0, yy + 14, 34, yy); x.stroke(); }
  x.restore();
}
function pipeRack(S, T) {                                           // the plumber's shop behind her: PVC pipes in a rack (ends, bells and printed ticks show), a shelf with a coil of hose
  const { x } = S; ol(x, 5);
  x.fillStyle = '#E9E1D0'; x.fillRect(520, 400, 480, 480); x.fillStyle = '#CFC5AE'; x.fillRect(520, 815, 480, 80);
  const cols = ['#3F8FD8', '#3F8FD8', '#B9BECB', '#3F8FD8'], dark = ['#2F78BF', '#2F78BF', '#8E94A4', '#2F78BF'], xs = [668, 640, 604, 576];
  for (let k = 0; k < 4; k++) { const py = 466 + k * 52, x0 = xs[k];
    x.fillStyle = cols[k]; x.beginPath(); x.rect(x0, py - 20, 1000 - x0, 40); x.fill(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.38)'; x.fillRect(x0 + 60, py - 16, 1000 - x0 - 60, 8);
    x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 3; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(x0 + 96 + i * 48 + k * 13, py + 2); x.lineTo(x0 + 96 + i * 48 + k * 13, py + 13); x.stroke(); } ol(x, 5);
    x.fillStyle = dark[k]; x.beginPath(); x.roundRect(x0, py - 26, 62, 52, 8); x.fill(); x.stroke();                                   // the socket bell on each pipe
    x.fillStyle = '#1E1B2E'; x.beginPath(); x.ellipse(x0, py, 11, 26, 0, 0, 6.29); x.fill(); x.stroke();                                // its open end
    x.fillStyle = cols[k]; x.beginPath(); x.ellipse(x0, py, 5, 15, 0, 0, 6.29); x.fill(); }
  x.fillStyle = '#8A8FA3'; for (const ux of [740, 930]) { x.beginPath(); x.rect(ux - 10, 420, 20, 260); x.fill(); x.stroke(); x.fillStyle = '#5E6372'; x.fillRect(ux - 10, 440, 20, 8); x.fillRect(ux - 10, 648, 20, 8); x.fillStyle = '#8A8FA3'; }   // the rack's uprights
  x.fillStyle = '#B98A5A'; x.beginPath(); x.rect(840, 770, 160, 18); x.fill(); x.stroke();                                              // shelf and hose coil
  x.fillStyle = '#1E1B2E'; x.beginPath(); x.ellipse(922, 748, 52, 26, 0, 0, 6.29); x.fill(); x.fillStyle = '#E9E1D0'; x.beginPath(); x.ellipse(922, 748, 22, 9, 0, 0, 6.29); x.fill();
  x.strokeStyle = '#4C566A'; x.lineWidth = 8; for (const r of [46, 36, 26]) { x.beginPath(); x.ellipse(922, 748, r, r * .5, 0, 0, 6.29); x.stroke(); }
}
export function s4Beer(S) {
  const { x, L, Q, t, T } = S, K = L.K;
  const walk = L.ease(t / 1.1), bx = 1240 - 620 * walk, tb = t - 2.0;
  L.panel(t, '#FFF4DE', () => {
    L.rays(540, 900, '#FFE9B8', T * .1); floorBand(S, '#F3D9A0');
    if (t < 2.0) {                                                    // Beer walks in, shows NaN the phone
      const rise = L.ease((t - .8) / .3), pyp = 1170 + (1 - rise) * 190, pxp = bx + 246;
      shadow(S, 210, 1545, 1); shadow(S, bx, 1545, 1);
      person(S, L.NAN, 210, 1545, 1.0, { face: t < 1.4 ? 'shock' : 'happy', hands: [[-80, -40], [80, -40]], look: [.9, 0], joy: t > 1.5, flail: t > 1.5 ? .5 : 0 });
      const bh = [[-70, -110], t > .8 ? [96, -165 + (pyp - 1170)] : [90, -40]];
      person(S, L.BEER, bx, 1545, 1.0, { kick: t < 1.1 ? Math.sin(t * 14) : 0, face: 'happy', hands: bh, talk: t > 1.0 ? 1 : undefined, tilt: -.04 });
      if (t > .8) { x.save(); x.translate(pxp, pyp); x.scale(1, 1); x.translate(-pxp, -pyp);
        Q.phone(pxp, pyp, 280, 438, (w, h) => { x.save(); x.scale(w / 640, h / 1000); searchScreen(S, -1); x.restore(); }, { rot: -.04, thin: true }); x.restore();
        const hp = handAt(S, bx, 1545, 1.0, bh[1], {}); holdHand(S, L.BEER, hp[0], hp[1], 1.0); }
    } else if (t < 5.2) {                                              // THE INSERT: only the phone, big, and a thumb
      const pk = L.back(tb / .18), sc = .94 + .06 * pk;
      x.save(); x.translate(540, 880); x.scale(sc, sc); x.translate(-540, -880);
      Q.phone(540, 880, 800, 1250, (w, h) => { x.save(); x.scale(w / 640, h / 1000); searchScreen(S, tb); x.restore(); });
      x.restore();
      const bpt = [140 + 568 * 1.25, 255 + 555 * 1.25], press = L.clamp(1 - Math.abs(tb - 2.65) * 6);
      if (tb > .6) {                                                  // the thumb comes in from the lower right, waits over the glass, then goes to the call button
        const a = L.ease((tb - .6) / .5), b = L.ease((tb - 1.9) / .65), wait = [1000 + Math.sin(tb * 3) * 10, 1340 + Math.cos(tb * 2.4) * 12];
        const tx = (1160 + (wait[0] - 1160) * a) + (bpt[0] - (1160 + (wait[0] - 1160) * a)) * b, ty = (1800 + (wait[1] - 1800) * a) + (bpt[1] - (1800 + (wait[1] - 1800) * a)) * b;
        thumb(S, tx, ty, press);
        const rg = L.clamp((tb - 2.6) / .35); if (rg > 0 && rg < 1) { x.strokeStyle = K.ink; x.lineWidth = 5; x.globalAlpha = 1 - rg; x.beginPath(); x.arc(bpt[0], bpt[1], 12 + 48 * rg, 0, 6.29); x.stroke(); x.globalAlpha = 1; } }
    } else {                                                            // the call: Beer at her ear, the plumber in a round inset
      const BX = 300, BS = 1.15, bh = [[-104, -214], [70, -40]], talkB = t > 5.8 && t < 8.3, talkP = t > 8.4;
      const hp = handAt(S, BX, 1545, BS, bh[0], {}), pa = L.inn(t, 5.2, .3);
      ringing(S, hp[0] - 34, hp[1] - 60, -2.2, T, 1 - L.inn(t, 5.6, .3) * .4);
      if (pa > 0.5) { x.save(); x.strokeStyle = K.ink; x.lineWidth = 12; x.lineCap = 'round'; x.setLineDash([12, 18]); x.lineDashOffset = -T * 120;
        x.beginPath(); x.moveTo(hp[0] - 10, hp[1] - 80); x.bezierCurveTo(250, 1075, 640, 1090, 700, 860); x.stroke(); x.restore(); }
      shadow(S, BX, 1545, BS);
      person(S, L.BEER, BX, 1545, BS, { face: 'happy', hands: bh, talk: talkB ? 1 : undefined, tilt: -.05 + (t > 8.8 && t < 9.3 ? Math.sin((t - 8.8) * 12) * .04 : 0) });
      const secs = 7 + Math.floor(Math.max(0, t - 5.5));
      miniPhone(S, hp[0] - 22, hp[1] - 40, 86, 146, .15, (w, h) => { x.fillStyle = '#2BB35A'; x.fillRect(0, 0, w, h); x.fillStyle = '#CFE8F5'; x.beginPath(); x.arc(w / 2, 38, 20, 0, 6.29); x.fill();
        x.fillStyle = '#1F4E7A'; x.beginPath(); x.arc(w / 2, 34, 15, Math.PI, 0); x.fill(); x.fillStyle = '#C98E64'; x.beginPath(); x.arc(w / 2, 44, 11, 0, 6.29); x.fill();
        L.txt('00:' + String(secs).padStart(2, '0'), w / 2, 82, { size: 16, color: K.white }); x.fillStyle = '#E2463C'; x.beginPath(); x.arc(w / 2, h - 20, 12, 0, 6.29); x.fill(); });
      holdHand(S, L.BEER, hp[0], hp[1], BS);
      inset(S, 760, 640, 220, pa, () => {
        pipeRack(S, T);
        const PH = [-104, -214];
        person(S, L.PLUMBER, 760, 815, .62, { face: 'happy', hands: [PH, [58, -52]], grip: ['fist', undefined], talk: talkP ? 1 : undefined });
        const ph = handAt(S, 760, 815, .62, PH, {});
        miniPhone(S, ph[0] - 4, ph[1] - 18, 40, 70, .15, (w, h) => { x.fillStyle = '#2BB35A'; x.fillRect(0, 0, w, h); x.fillStyle = K.white; x.beginPath(); x.arc(w / 2, h * .4, 6, 0, 6.29); x.fill(); });
        ringing(S, ph[0] - 34, ph[1] - 40, -2.2, T, .8);
      });
    }
  });
  if (t >= 5.2) {
    say(S, 300, 1545, 1.15, 'ปั๊มตัดต่อ ท่อตัน\nอยากติดสายฉีดด้วยค่ะ\nพรุ่งนี้สิบโมงได้ไหมคะ\nPump, drain, bum gun.\nTomorrow at ten?', win(L, t, 5.8, 8.3, .3), { size: 40, sub: 2, subSize: 30, subColor: '#6A5A4A', tx: 230 });
    bub(S, two('ได้ครับ!', 'Can do!'), 770, 1010, 760, 862, L.inn(t, 8.4, .3), { size: 50 });
  } else say(S, bx, 1545, 1.0, two('Give me two minutes.', 'ขอสองนาทีค่ะ'), win(L, t, 1.0, 1.9, .2), { size: 46, cx: 420 });
}

// 5. 28–33 s: the card moves to BOOKED, the appointment lands on NaN's phone
export function s5Booked(S) {
  const { x, L, Q, t, T } = S, K = L.K, S5 = .95, GY = 1545, NX = 330, BX = 830;
  const joy = t > 2, celebrate = t > 3.9, fly = L.ease((t - 1.9) / .6), landed = t > 2.5;
  const up = L.ease((t - 3.8) / .3), hn = [147 + 14 * up, -140 - 22 * up];                  // her right hand holds the phone, and lifts it when she cheers
  const nh = [[-60 - 40 * up, -200 * up - 60 * (1 - up)], hn], hopN = { joy: celebrate };
  const fist = L.ease((t - 1.55) / .3) * (1 - L.ease((t - 2.6) / .4));
  L.panel(t, '#E4F5EC', () => {
    L.rays(540, 700, '#CFEEDD', -T * .1); floorBand(S, '#BFE3D0'); shadow(S, NX, GY, S5); shadow(S, BX, GY, S5);
    Q.kanban(540, 440, 1.2, t - .3);
    person(S, L.BEER, BX, GY, S5, { face: t > 3.0 ? 'roll' : 'happy', roll: (t - 3.0) / .6, hands: [[-80, -60], [70 + 54 * fist, -40 - 170 * fist]], tilt: t > 3.0 ? -.06 : 0 });
    const hw = handAt(S, NX, GY, S5, hn, hopN);                                              // the phone sits in her hand
    person(S, L.NAN, NX, GY, S5, { face: joy ? 'joy' : 'happy', hands: nh, joy: celebrate, flail: celebrate ? .8 : 0, talk: t > 3.0 ? 1 : undefined, smoke: t > 2.4 ? 'heart' : true, smokeX: t > 2.4 ? -150 : 112 });
    const pcx = hw[0] + 35, pcy = hw[1] - 107;
    Q.phone(pcx, pcy, 110, 196, (w, h) => { x.fillStyle = '#FFF0F5'; x.fillRect(0, 0, w, h); x.fillStyle = '#FAF5EA'; x.fillRect(0, 0, w, 24); x.fillStyle = '#C13A2E'; x.fillRect(0, 0, w, 5);
      if (t > 2.5) { x.fillStyle = K.pink; x.beginPath(); x.roundRect(8, 62, w - 16, 70, 12); x.fill(); L.txt('10:00', w / 2 - 6, 86, { size: 26, color: K.ink }); Q.ant(w / 2 - 16, 114, .5, T); } }, { rot: -.1, thin: true });
    holdHand(S, L.NAN, hw[0], hw[1], S5);
    if (t > 1.5 && t < 2.5) Q.calCard(540 + (pcx - 540) * fly, 790 + (pcy - 790) * fly, .95 - .55 * fly, L.inn(t, 1.5, .2) * (1 - L.clamp((t - 2.3) * 5)), { T });
    if (t > 2.5) Q.calCard(540, 790, 1.05, L.inn(t, 2.6, .3), { T });
  });
  say(S, NX, GY, S5, two('Beer, you are MAGIC!', 'เบียร์ เก่งเหมือนมีเวทมนตร์!'), L.inn(t, 3.0, .3), { size: 42, talk: 1, dy: -20 });
}
