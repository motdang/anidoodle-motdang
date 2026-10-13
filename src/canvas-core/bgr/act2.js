// ACT TWO (Tuesday, pink): the saleng rides through the moobaan, Beer's link finds the house, the drain gives up a hairball
// with NaN's feather, the pump tank gets its air back.
// @ts-nocheck
import { doodle, bkkDay } from '../mdd';
const two = (en, th) => `${en}\n${th}`;
const DAY = bkkDay('2026-10-13');
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, u) => a + (b - a) * u;
const BLUE = '#58B0E8';

// ---------- lettering: the kit's caption and bubble with roomier leading, so Thai tone marks clear the line above ----------
function cap(S, lines, px, py, a, o = {}) {
  if (a <= 0) return; const { x, L } = S, K = L.K, size = o.size || 44, LD = 1.5;
  x.save(); x.globalAlpha = L.clamp(a * 2); x.translate(0, (1 - L.ease(a)) * -30);
  x.font = `700 ${size}px ${L.HAND}`;
  const rows = lines.split('\n'), w = Math.max(...rows.map((l) => x.measureText(l).width)) + 56, h = rows.length * size * LD + 34;
  const bx = o.right ? px - w : o.center ? px - w / 2 : px;
  x.fillStyle = K.ink; x.fillRect(bx + 8, py + 8, w, h);
  x.fillStyle = o.fill || K.yellow; x.fillRect(bx, py, w, h); x.lineWidth = 5; x.strokeStyle = K.ink; x.strokeRect(bx, py, w, h);
  rows.forEach((l, i) => L.txt(l, bx + w / 2, py + 17 + size * .75 + i * size * LD, { size, color: o.color || K.ink }));
  x.restore();
}
function bub(S, lines, cx, cy, tx, ty, a, o = {}) {   // speech bubble centred on cx,cy, tail to tx,ty (tail length up to o.tail)
  if (a <= 0) return; const { x, L } = S, K = L.K, size = o.size || 50; x.font = `700 ${size}px ${L.HAND}`;
  const rows = lines.split('\n'), w = Math.max(...rows.map((l) => x.measureText(l).width)) + 70, h = rows.length * size * 1.4 + 46, k = .6 + .4 * L.back(a);
  x.save(); x.globalAlpha = L.clamp(a * 3); x.translate(cx, cy); x.scale(k, k); x.translate(-cx, -cy);
  const shape = () => {
    x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 46));
    const bx = cx + L.clamp(tx - cx, -w / 3, w / 3), by = ty > cy ? cy + h / 2 - 4 : cy - h / 2 + 4;
    const dx = tx - bx, dy = ty - by, dl = Math.hypot(dx, dy) || 1, k2 = Math.min(dl, o.tail || 110) / dl;
    x.moveTo(bx - 26, by); x.lineTo(bx + dx * k2, by + dy * k2); x.lineTo(bx + 26, by);
  };
  x.lineJoin = 'round'; shape(); x.lineWidth = 14; x.strokeStyle = K.ink; x.stroke();
  shape(); x.fillStyle = o.fill || K.white; x.fill();
  rows.forEach((l, i) => L.txt(l, cx, cy + (i - (rows.length - 1) / 2) * size * 1.4, { size, color: o.color || K.ink }));
  x.restore();
}

// ---------- the saleng: scooter, a steel sidecar deck on its near side, four blue PVC pipes lashed on, a red rag at the tail ----------
const R_PX0 = 40, R_PX1 = 360, R_S = .74, R_GY = 1510, R_WHEEL = 44 * .95 * R_S;
const rpx = (t) => { const u = cl(t / 2.4), lv = cl((t - 6.8) / 1.2); return R_PX0 + (R_PX1 - R_PX0) * (1 - (1 - u) * (1 - u)) + 960 * lv * lv; };
const rcam = (t) => 100 + 320 * Math.pow(1 - cl(t / 2.4), 2) + 300 * cl((t - 6.8) / 1.2);        // road speed under the camera, px/s
function rideState(t) {                                    // pure in t: wheel turning and road travel, integrated from 0
  let spin = 0, cam = 0; const dt = 1 / 60;
  for (let u = 0; u < t; u += dt) { const h = Math.min(dt, t - u), v = rcam(u) + (rpx(u + h) - rpx(u)) / h; spin += 16 * Math.tanh(v / R_WHEEL / 16) * h; cam += rcam(u) * h; }
  return { px: rpx(t), spin, cam, v: rcam(t) + (rpx(t + .01) - rpx(t)) / .01 };
}
function sidecar(S, spin, bob, st, t) {                    // scooter-local units, ground y = 0, faces +x
  const { x, L } = S, K = L.K, INK = K.ink, mv = cl(st.v / 260);
  x.translate(0, bob * .6); x.lineJoin = 'round'; x.lineCap = 'round';
  const WX = -118, WY = -42;
  for (let k = 0; k < 4; k++) { const f = (t * 2.4 + k / 4) % 1; x.fillStyle = `rgba(214,200,176,${.75 * mv * (1 - f)})`; x.beginPath(); x.arc(WX - 44 - f * 140, -12 - f * 36 + Math.sin(k * 5) * 6, 8 + f * 22, 0, 6.29); x.fill(); }
  x.strokeStyle = INK; x.lineWidth = 12; x.beginPath(); x.moveTo(-250, -90); x.lineTo(WX, WY); x.moveTo(-8, -90); x.lineTo(WX, WY); x.stroke();
  x.strokeStyle = '#6F7584'; x.lineWidth = 5; x.stroke();
  L.wheel(WX, WY, 44, spin);
  x.lineCap = 'butt'; x.strokeStyle = INK; x.lineWidth = 14; x.beginPath(); x.arc(WX, WY, 55, Math.PI * 1.08, Math.PI * 1.92); x.stroke();
  x.strokeStyle = '#7A7F8C'; x.lineWidth = 7; x.stroke(); x.lineCap = 'round';
  // deck
  x.fillStyle = '#7A7F8C'; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.roundRect(-272, -96, 336, 14, 3); x.fill(); x.stroke();
  x.fillStyle = '#5F6573'; x.beginPath(); x.rect(-272, -86, 336, 4); x.fill();
  x.strokeStyle = INK; x.lineWidth = 10; x.beginPath(); x.moveTo(-262, -96); x.lineTo(-262, -160); x.stroke(); x.strokeStyle = '#7A7F8C'; x.lineWidth = 5; x.stroke();     // tail rail
  // pipes, bottom to top, each a little out of step with the others while the rig rattles
  const XL = -340, XR = 80;
  for (let i = 0; i < 4; i++) {
    const yc = -100 - i * 21, dy = Math.sin(t * 31 + i * 1.9) * 1.3 * mv;
    x.save(); x.translate(0, dy);
    x.fillStyle = BLUE; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.roundRect(XL, yc - 10, XR - XL, 20, 5); x.fill(); x.stroke();
    x.fillStyle = '#2F7FC0'; x.fillRect(XL + 48, yc + 5, XR - XL - 53, 4);
    x.fillStyle = '#BFE3FA'; x.fillRect(XL + 52, yc - 6, XR - XL - 62, 3);
    x.fillStyle = BLUE; x.beginPath(); x.roundRect(XL, yc - 12, 48, 24, 5); x.fill(); x.stroke();                       // the socket bell
    x.fillStyle = '#2F7FC0'; x.fillRect(XL + 36, yc - 11, 6, 22); x.fillStyle = '#BFE3FA'; x.fillRect(XL + 6, yc - 8, 26, 3);
    x.fillStyle = '#1F5F94'; x.beginPath(); x.ellipse(XL + 1, yc, 4, 9, 0, 0, 6.29); x.fill();
    x.restore();
  }
  for (const lx of [-190, -30]) {                          // rope lashings
    x.strokeStyle = INK; x.lineWidth = 10; x.beginPath(); x.moveTo(lx - 3, -106); x.lineTo(lx + 3, -177); x.stroke();
    x.strokeStyle = '#8A5A33'; x.lineWidth = 5; x.stroke();
    x.fillStyle = '#8A5A33'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(lx + 4, -179, 6, 0, 6.29); x.fill(); x.stroke();
  }
  // the red rag on a pole at the tail end of the load
  const fl = Math.sin(t * 10), fl2 = Math.sin(t * 10 + 1.3);
  x.strokeStyle = INK; x.lineWidth = 6; x.beginPath(); x.moveTo(XL + 6, -150); x.lineTo(XL + 6, -228); x.stroke();
  x.fillStyle = K.red; x.lineWidth = 4; x.beginPath(); x.moveTo(XL + 6, -228); x.quadraticCurveTo(XL - 14, -231 + fl * 4, XL - 36, -226 + fl * 5); x.lineTo(XL - 34, -200 + fl2 * 6); x.quadraticCurveTo(XL - 14, -204 + fl2 * 3, XL + 6, -202); x.closePath(); x.fill(); x.stroke();
}
function saleng(S, px, gy, s, t, st, o = {}) {
  const { L } = S, bob = Math.sin(t * 22 + px) * 3;
  L.scooter(L.PLUMBER, px, gy, s, t, { riding: true, rider: L.PLUMBER, face: o.face || 'happy', helmet: false, spin: st.spin,
    hands: o.hands || [[170, -40], [212, -44]], grip: o.grip || ['fist', 'fist'], side: (spin, b) => sidecar(S, spin, b, st, t) });
  return { mouth: [px + -76 * s, gy + (-357 + bob) * s], bar: [px + 116 * s, gy + (-249 + bob) * s] };
}
function roadFx(S, st, gy) {                                // the near road (hides the pond): grit and lane dashes at the road's speed, a shadow under the rig, streaks behind the load
  const { x, L } = S, P = L.P, per = 210, k0 = Math.floor((P.x + st.cam) / per) - 1, top = gy + 6;
  x.fillStyle = '#6C6C72'; x.fillRect(P.x, top, P.w, P.y + P.h - top);
  x.fillStyle = 'rgba(30,27,46,.16)'; x.fillRect(P.x, top, P.w, 5);
  for (let i = 0; i < 150; i++) { const gx = (((L.rnd(i) * 1100 - st.cam) % 1100) + 1100) % 1100, gyy = top + 8 + L.rnd(i + 300) * 108; x.fillStyle = i % 2 ? 'rgba(150,150,158,.5)' : 'rgba(70,70,80,.45)'; x.fillRect(gx, gyy, 2 + L.rnd(i + 90) * 3, 2); }
  x.fillStyle = 'rgba(255,248,226,.8)'; for (let k = k0; k < k0 + 8; k++) { const xx = k * per - st.cam; x.beginPath(); x.roundRect(xx, gy + 56, 118, 11, 5); x.fill(); }
  x.fillStyle = 'rgba(30,27,46,.22)'; x.beginPath(); x.ellipse(st.px - 10, gy + 4, 250, 11, 0, 0, 6.29); x.fill();
  if (st.v > 320) { x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 4; x.lineCap = 'round'; for (let i = 0; i < 4; i++) { const yy = gy - 40 - i * 52, a = cl((st.v - 320) / 500), len = 80 + 160 * a + i * 24, x0 = st.px - 300 - i * 20;
    x.globalAlpha = a; x.beginPath(); x.moveTo(x0, yy); x.lineTo(x0 - len, yy); x.stroke(); } x.globalAlpha = 1; }
}
function miniPhone(S, px, py, rot, t) {                     // the clip-on phone on the handlebar
  const { x, L } = S, K = L.K; x.save(); x.translate(px, py); x.rotate(rot);
  x.strokeStyle = K.ink; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, 44); x.lineTo(-4, 74); x.stroke();
  x.fillStyle = K.ink; x.beginPath(); x.roundRect(-30, -50, 60, 100, 12); x.fill();
  x.save(); x.beginPath(); x.roundRect(-25, -45, 50, 90, 8); x.clip(); x.translate(-25, -45);
  if (t < 5.0) { x.fillStyle = '#E9E9E4'; x.fillRect(0, 0, 50, 90); x.fillStyle = K.white; x.beginPath(); x.roundRect(5, 12, 40, 12, 6); x.fill(); x.beginPath(); x.roundRect(6, 44, 38, 22, 5); x.fill();
    const q = 3 + Math.floor(t * 3) % 3; x.fillStyle = '#8A8FA3'; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(15 + i * 10, 55, 2.2 + (i === q % 3 ? 1.2 : 0), 0, 6.29); x.fill(); } }
  else { x.fillStyle = '#F5ECD6'; x.fillRect(0, 0, 50, 90); x.fillStyle = '#C81E2C'; x.fillRect(0, 0, 50, 16);
    x.strokeStyle = '#FFFFFF'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 54); x.lineTo(50, 50); x.moveTo(18, 90); x.lineTo(22, 16); x.stroke();
    const r = cl((t - 5.3) / 1.0); x.strokeStyle = '#2F78BF'; x.lineWidth = 3.5; x.lineJoin = 'round'; x.beginPath(); x.moveTo(6, 78); x.lineTo(6 + 24 * Math.min(1, r * 2), 78); if (r > .5) x.lineTo(30, 78 - 48 * Math.min(1, (r - .5) * 2)); x.stroke(); }
  x.restore(); x.restore();
}

// the big phone's screen: a grey map that finds nothing, Beer's message, then motdang's map with the way home
function phoneScreen(S, t, T, w, h) {
  const { x, L, Q } = S, K = L.K;
  x.fillStyle = '#E9E9E4'; x.fillRect(0, 0, w, h);
  const dr = (t * 9) % 180; x.strokeStyle = '#FFFFFF'; x.lineWidth = 16; x.lineCap = 'round';
  x.beginPath(); for (let k = -1; k < 5; k++) { x.moveTo(60 + k * 180 - dr, 0); x.lineTo(90 + k * 180 - dr, h); } x.moveTo(0, 520); x.lineTo(w, 470); x.stroke();
  x.fillStyle = K.white; x.strokeStyle = '#D2CEC4'; x.lineWidth = 3; x.beginPath(); x.roundRect(20, 40, w - 40, 70, 35); x.fill(); x.stroke();
  L.txt("NaN's house · บ้านแนน", 50, 76, { size: 28, align: 'left' });
  x.fillStyle = '#8A8FA3'; x.lineWidth = 3;
  if (t < 3.1) for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.094; x.beginPath(); x.arc(w / 2 + Math.cos(a) * 30, 330 + Math.sin(a) * 30, 9, 0, 6.29); x.fill(); }
  else {
    const c = L.back((t - 3.1) / .25);
    x.save(); x.translate(w / 2, 375); x.scale(c, c); L.shake(t, 3.25, 10); x.translate(-w / 2, -375);
    x.fillStyle = K.white; x.strokeStyle = '#D2CEC4'; x.beginPath(); x.roundRect(40, 300, w - 80, 150, 20); x.fill(); x.stroke();
    L.txt('No results', w / 2, 350, { size: 40 }); L.txt('ไม่พบผลลัพธ์', w / 2, 404, { size: 32, color: '#6A6F80' });
    x.restore();
    const q = L.inn(t, 3.35, .2); if (q > 0) { x.save(); x.translate(w - 76, 288 - Math.sin(t * 5) * 6); x.rotate(.2 + Math.sin(t * 4) * .08); const k = L.back(q); x.scale(k, k); L.txt('?', 0, 0, { size: 74, color: '#6A6F80', stroke: 10, strokeColor: K.white }); x.restore(); }
    const g = L.inn(t, 3.45, .25); if (g > 0) { x.save(); x.translate(110 + Math.sin(t * 2.2) * 8, 232); x.rotate(Math.sin(t * 3) * .12); x.globalAlpha = g; x.strokeStyle = '#8A8FA3'; x.lineWidth = 5; x.setLineDash([9, 8]);
      x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-8, -18, -24, -28, -24, -46); x.arc(0, -46, 24, Math.PI, 0); x.bezierCurveTo(24, -28, 8, -18, 0, 0); x.stroke(); x.setLineDash([]); x.restore(); }
  }
  const nb = L.ease((t - 4.2) / .18);                      // Beer's message slides down and stays until the wipe covers it
  if (nb > 0) { const y = -110 + 160 * nb; x.fillStyle = 'rgba(30,27,46,.25)'; x.beginPath(); x.roundRect(26, y + 6, w - 40, 110, 28); x.fill();
    x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 4; x.beginPath(); x.roundRect(20, y, w - 40, 110, 28); x.fill(); x.stroke();
    x.fillStyle = '#C81E2C'; x.beginPath(); x.roundRect(34, y + 20, 70, 70, 16); x.fill(); Q.ant(69, y + 55, 1.05, T);
    L.txt('Beer · motdang.net', 120, y + 38, { size: 32, align: 'left' }); L.txt('เบียร์ส่งลิงก์มา', 120, y + 82, { size: 28, align: 'left', color: '#6A6F80', weight: 600 }); }
  const wp = L.ease((t - 5.0) / .35);                                                       // wipe to motdang's map
  if (wp > 0) { const ww = w * wp; x.save(); x.beginPath(); x.rect(0, 0, ww, h); x.clip();
    x.fillStyle = '#F5ECD6'; x.fillRect(0, 0, w, h); Q.mdBar(w, 'sent by Beer · เบียร์ส่งมา'); Q.mdMap(w, 120, h - 230, { home: true, route: (t - 5.35) / 1.0, pulse: (T * 1.2) % 1 });
    x.fillStyle = K.white; x.fillRect(0, h - 110, w, 110); L.txt("NaN's house · บ้านแนน", 30, h - 74, { size: 28, align: 'left' }); L.txt('1.2 km · 4 min', 30, h - 34, { size: 24, align: 'left', color: '#1E7D4A' });
    x.restore(); if (wp < 1) { x.fillStyle = '#C81E2C'; x.fillRect(ww - 5, 0, 10, h); } }
}

// 6. 33–41 s: Tuesday; the map finds nothing; Beer's motdang link draws the way
export function s6Ride(S) {
  const { x, L, Q, t, T, env } = S, K = L.K, P = L.P, st = rideState(t), PHX = 690, PHY = 520, PHS = .85;
  L.panel(t, '#8FD3F7', () => {
    doodle(x, env, 'moobaan@10', { t: T * 1000, day: DAY, box: [P.x, P.y, P.w, P.h], zoom: 1.6, focus: [.15 + st.cam * .000477, .8] });
    { const rx = 531 - .282 * st.cam, x0 = rx - 58, w = 116;            // repaint the doodler's kerb and tarmac over its lake pavilion, which sits in the road at this zoom
      x.fillStyle = '#C9C1B0'; x.fillRect(x0, 1391, w, 12); x.fillStyle = '#B8B2A6'; x.fillRect(x0, 1403, w, 21); x.fillStyle = '#57575C'; x.fillRect(x0, 1424, w, 7);
      x.fillStyle = '#6B6B71'; x.fillRect(x0, 1431, w, 86); x.fillRect(P.x, 1480, x0 + w + 40 - P.x, 40);
      for (let i = 0; i < 140; i++) { x.fillStyle = i % 2 ? 'rgba(120,120,128,.6)' : 'rgba(80,80,88,.5)'; x.fillRect(x0 + L.rnd(i + 500) * (w - 4), 1433 + L.rnd(i + 600) * 82, 2 + L.rnd(i + 90) * 3, 2); } }
    roadFx(S, st, R_GY);
    const sc = L.ease((t - 2.6) / .3) * (1 - L.ease((t - 4.4) / .3)), wob = Math.sin(t * 14) * 6, wob2 = Math.cos(t * 14) * 4;
    const hands = [[170, -40], [mix(212, 102 + wob, sc), mix(-44, -258 + wob2, sc)]], grip = ['fist', sc > .5 ? 'open' : 'fist'];
    const face = t > 2.6 && t < 4.6 ? 'shock' : t > 6.2 ? 'joy' : 'happy';
    const sal = saleng(S, st.px, R_GY, R_S, t, st, { face, hands, grip });
    const mx = st.px + 100, my = R_GY - 236;
    const ph = L.inn(t, 2.5, .35) * (1 - L.inn(t, 7.3, .25));
    if (ph > 0) {                                           // the zoom-in inset: two leader lines from the clip-on phone to the big one
      const k = L.back(ph) * PHS, hw = 260 * k + 16 * k, hh = 380 * k + 16 * k, bx0 = PHX - hw, bx1 = PHX + hw, by = PHY + hh;
      x.save(); x.globalAlpha = ph; x.strokeStyle = K.ink; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(mx - 24, my - 54); x.lineTo(bx0 + 10, by - 6); x.moveTo(mx + 24, my - 54); x.lineTo(bx1 - 10, by - 6); x.stroke(); x.restore();
    }
    miniPhone(S, mx, my, .12, t);
    if (ph > 0) { const k = L.back(ph); x.save(); x.translate(PHX, PHY); x.scale(k * PHS, k * PHS); Q.phone(0, 0, 520, 760, (w, h) => phoneScreen(S, t, T, w, h)); x.restore(); }
    if (t > 4.2 && t < 4.9) L.sfx('DING!', 320, 330, 70, L.inn(t, 4.2, .25), { rot: -.15 });
    S.mouth = sal.mouth;
  });
  cap(S, two('Tuesday. The plumber rides over.', 'วันอังคาร ช่างขี่มาที่บ้าน'), 80, 160, L.inn(t, .2, .4) * (1 - L.inn(t, 2.4, .3)), { fill: '#FFC2DC' });
  cap(S, two("NaN's house isn't even on Google Maps.", 'บ้านแนนไม่มีใน Google Maps ด้วยซ้ำ'), 540, 900, L.inn(t, 2.9, .3) * (1 - L.inn(t, 4.8, .2)), { center: true, size: 34, fill: '#FFFFFF' });
  const m = S.mouth || [300, 1214];
  bub(S, two('เจอแล้วครับ!', 'Found it!'), Math.min(m[0] + 360, 820), 1042, m[0] + 62, m[1] - 10, L.inn(t, 6.3, .25) * (1 - L.inn(t, 7.4, .25)), { size: 46, tail: 300 });
}

// ---------- 7. 41–48 s ----------
const HOLE = [350, 792], PL_S = .74, PL_Y = 848, NAN_X = 880, NAN_GY = 842, NAN_S = .62, POP = 1.5, WHIP = 2.45, LAND = 3.1;
const teardrop = (x, px, py, r) => { x.beginPath(); x.moveTo(px, py - r * 1.7); x.quadraticCurveTo(px + r * 1.1, py + r * .2, px, py + r); x.quadraticCurveTo(px - r * 1.1, py + r * .2, px, py - r * 1.7); x.fill(); };
function strand(S, ax, ay, bx, by, w0, w1, sag, col) {     // a tapered strand along a quadratic curve
  const { x } = S, N = 14, cx = (ax + bx) / 2, cy = (ay + by) / 2 + sag, A = [], B = [];
  for (let i = 0; i <= N; i++) { const u = i / N, qx = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * cx + u * u * bx, qy = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cy + u * u * by;
    const tx = 2 * (1 - u) * (cx - ax) + 2 * u * (bx - cx), ty = 2 * (1 - u) * (cy - ay) + 2 * u * (by - cy), tl = Math.hypot(tx, ty) || 1, w = mix(w0, w1, u) / 2;
    A.push([qx - ty / tl * w, qy + tx / tl * w]); B.push([qx + ty / tl * w, qy - tx / tl * w]); }
  x.fillStyle = col; x.beginPath(); A.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); for (let i = N; i >= 0; i--) x.lineTo(B[i][0], B[i][1]); x.closePath(); x.fill();
}
function standNan(S, gy, o) {                               // NaN, with or without her feather (the kit draws it on every standing pose)
  const { x, L } = S, f0 = x.fill, s0 = x.stroke, FF = '#e7507a', FS = ['#f7a1b8', '#f7e7c8'];
  if (o.noFeather) { x.fill = function (...a) { if (String(x.fillStyle).toLowerCase() === FF) return; return f0.apply(x, a); }; x.stroke = function (...a) { if (FS.includes(String(x.strokeStyle).toLowerCase())) return; return s0.apply(x, a); }; }
  try { L.standing(L.NAN, NAN_X, gy, NAN_S, o); } finally { if (o.noFeather) { delete x.fill; delete x.stroke; } }
}
function grate(S, px, py, s) {                              // the lifted grate, set down on the floor
  const { x, L } = S, K = L.K; x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#D9DEE6'; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.ellipse(0, 0, 66, 21, 0, 0, 6.29); x.fill(); x.stroke();
  x.lineWidth = 3; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 12, -15 + Math.abs(i) * 2); x.lineTo(i * 12, 15 - Math.abs(i) * 2); x.stroke(); } x.restore();
}
function drainHole(S, a) {                                  // the open drain: rim, dark throat, a ring of water pulsing in it
  const { x, L, T } = S, K = L.K; x.save(); x.translate(HOLE[0], HOLE[1]); x.fillStyle = '#D9DEE6'; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.ellipse(0, 0, 92, 30, 0, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = '#16131F'; x.beginPath(); x.ellipse(0, 3, 70, 21, 0, 0, 6.29); x.fill(); x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 3; x.beginPath(); x.ellipse(0, 3, 56, 15, 0, 3.3, 5.3); x.stroke();
  if (a > 0) { const p = (T * .9) % 1; x.strokeStyle = `rgba(150,215,245,${.8 * a * (1 - p)})`; x.lineWidth = 4; x.beginPath(); x.ellipse(0, 6, 22 + 70 * p, 7 + 20 * p, 0, 0, 6.29); x.stroke(); }
  x.restore();
}

function topScene(S) {
  const { x, L, Q, t, T } = S, K = L.K, ease = L.ease;
  const lift = cl((t - .6) / .9), e = ease(lift), leave = ease((t - 2.95) / .45), plx = 190 - 520 * leave, dX = plx - 190;
  const walkBob = leave > 0 && leave < 1 ? -Math.abs(Math.sin(t * 17)) * 12 : 0;
  // the drain: puddle, then the open hole, whirlpool arcs, the grate set aside
  const pr = 1 - .9 * ease((t - POP) / 1.6), flood = t < POP ? 1 : pr;
  Q.puddle(HOLE[0], HOLE[1] + 12, 215 * flood + 8, 52 * flood + 3, T, 1 - .5 * ease((t - 3.0) / .6));
  drainHole(S, t > POP + .3 ? 1 : 0);
  if (t > .5 && t < 2.3) { const sw = L.inn(t, .5, .3) * (1 - L.inn(t, 2.0, .3)); x.save(); x.strokeStyle = `rgba(255,255,255,${.85 * sw})`; x.lineWidth = 4; x.lineCap = 'round';
    for (let k = 0; k < 2; k++) { x.beginPath(); for (let i = 0; i <= 18; i++) { const a = t * 4 + k * Math.PI + i * .09, r = (150 - 46 * lift) * (1 - .4 * i / 18); x.lineTo(HOLE[0] + Math.cos(a) * r, HOLE[1] + 12 + Math.sin(a) * r * .3); } x.stroke(); } x.restore(); }
  grate(S, 560, 806, .9);
  // the hook: hand, a wire 34 -> 112 long (a bent wire at its end), the clump, the rope of hair while it is stuck
  const hand0 = [326 + dX, 802], hand2 = [300 + dX, 668], whip = cl((t - WHIP) / .22), kick = Math.sin(whip * Math.PI);
  const hand = [mix(hand0[0], hand2[0], e), mix(hand0[1], hand2[1], e) + (t > WHIP ? 14 * kick : 0)];
  const sway = t > POP ? Math.sin((t - POP) * 3.4) * .05 * Math.exp(-(t - POP) * .5) : 0;
  const th = mix(-.2, -1.1, e) + sway + (t > WHIP ? -.5 * kick : 0), wl = mix(34, 112, e);
  const tip = [hand[0] + Math.cos(th) * wl, hand[1] + Math.sin(th) * wl];
  const phi = t > POP ? .28 * Math.sin((t - POP) * 4.2) * Math.exp(-(t - POP) * .7) + (t > WHIP ? .5 * kick : 0) : 0;
  const hang = [tip[0] + Math.sin(phi) * 74 + 2, tip[1] + Math.cos(phi) * 74 + 4];
  if (t < POP) {                                            // stuck: the clump stretches between the hole and the hook, hair strands along it
    const top = [tip[0], tip[1] + 6], bot = [HOLE[0], HOLE[1] - 4], len = Math.hypot(top[0] - bot[0], top[1] - bot[1]), st = Math.max(1, len / 140), ang = Math.atan2(top[1] - bot[1], top[0] - bot[0]);
    for (let i = 0; i < 4; i++) strand(S, HOLE[0] - 26 + i * 18, HOLE[1] - 2, tip[0] - 10 + i * 7, tip[1] + 24, 8, 2.4, (1 - lift) * 26 + Math.sin(T * 6 + i) * 3, i === 2 ? '#8F836F' : '#5A3E32');
    strand(S, HOLE[0] + 4, HOLE[1] - 2, tip[0] + 6, tip[1] + 30, 6, 1.6, (1 - lift) * 18, '#A9ADB8');
    if (lift > .02) { x.save(); x.translate((top[0] + bot[0]) / 2, (top[1] + bot[1]) / 2); x.rotate(ang - Math.PI / 2); x.scale(1 / Math.sqrt(st), st); Q.hairball(0, 0, 1, T, 0, { fs: 0, drip: false, sway: .3 }); x.restore(); }
  } else {
    const rise = ease((t - POP) / .14), sq = t > POP + .12 ? Math.max(0, 1 - (t - POP - .12) / .13) : 0;
    const cy = mix(HOLE[1] - 4, hang[1], rise), cx = mix(HOLE[0], hang[0], rise);
    const fs = t < WHIP + .05 ? mix(.3, 1.3, ease((t - POP) / .5)) : 0;
    const stretch = 1 + .35 * (1 - rise);
    x.save(); x.translate(cx, cy); x.rotate(phi * .6); x.scale(1 / Math.sqrt(stretch), stretch); Q.hairball(0, 0, 1, T, 0, { fs, sq, sway: 1 }); x.restore();
    S.f0 = [cx + 54, cy - 64];
    if (t < POP + .45) { const a = 1 - (t - POP) / .45; x.strokeStyle = `rgba(169,173,184,${a})`; x.lineWidth = 6 * a + 1; x.lineCap = 'round'; x.beginPath(); x.moveTo(HOLE[0] + 4, HOLE[1] - 2); x.quadraticCurveTo(HOLE[0] - 12 * a, (HOLE[1] + cy) / 2 + 40 * (1 - a), cx + 6, cy + 50); x.stroke(); }
    for (let i = 0; i < 3; i++) strand(S, tip[0] + i * 3 - 3, tip[1] + 2, cx + (i - 1) * 16, cy - 36, 3.2, 1.6, 0, '#5A3E32');
  }
  // the wire, the hook at its end
  x.save(); x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = K.ink; x.lineWidth = 10; x.beginPath(); x.moveTo(hand[0], hand[1]); x.lineTo(tip[0], tip[1]); x.arc(tip[0] + Math.cos(th + 1.57) * 9, tip[1] + Math.sin(th + 1.57) * 9, 9, th - 1.57, th + 1.2); x.stroke();
  x.strokeStyle = '#C9CED8'; x.lineWidth = 5; x.stroke(); x.restore();
  // splash at the pop
  if (t >= POP && t < POP + .6) { const u = (t - POP) / .6; x.strokeStyle = `rgba(255,255,255,${1 - u})`; x.lineWidth = 6; x.beginPath(); x.ellipse(HOLE[0], HOLE[1] + 6, 30 + 130 * u, 10 + 38 * u, 0, 0, 6.29); x.stroke();
    x.fillStyle = 'rgba(120,196,230,.95)'; for (let i = 0; i < 8; i++) { const vx = (L.rnd(i + 3) - .5) * 300, vy = -(260 + L.rnd(i + 9) * 260), px = HOLE[0] + vx * u * .6, py = HOLE[1] + vy * u * .6 + 700 * u * u * .36; teardrop(x, px, py, 6); } }
  // the plumber
  const lh = t < 1.55 ? [-70, 60] : [mix(-70, -120, L.inn(t, 1.55, .2)), mix(60, -150, L.inn(t, 1.55, .2)) - Math.sin(t * 8) * 8 * cl(1 - (t - 1.55) / 1.4)];
  const toLocal = (p) => [(p[0] - plx) / PL_S, (p[1] - (PL_Y + walkBob - 100 * PL_S)) / PL_S];       // hips sit 100 units above the feet line
  L.standing(L.PLUMBER, plx, PL_Y + walkBob, PL_S, { t: T, face: 'grin', hands: [lh, toLocal(hand)], grip: ['open', { k: 'fist', a: th }] });
}

function topNan(S) {
  const { x, L, Q, t, T } = S, K = L.K, ease = L.ease;
  const amp = 4 + 5 * L.inn(t, 1.9, .3) + 6 * L.inn(t, 3.55, .4), big = t > LAND && t < LAND + .45 ? 34 * Math.sin(Math.PI * (t - LAND) / .45) : 0;
  const hop = amp * Math.abs(Math.sin(t * 8.5)) + big, gy = NAN_GY - hop;
  x.fillStyle = 'rgba(30,27,46,.18)'; x.beginPath(); x.ellipse(NAN_X, NAN_GY + 4, 44 * (1 - hop / 120), 10 * (1 - hop / 160), 0, 0, 6.29); x.fill();
  const joy = t > 2.0, pat = t < .6 ? [[-40, -290 + Math.sin(t * 22) * 8], [40, -290 - Math.sin(t * 22) * 8]] : null;
  const wv = Math.sin(t * 9) * 16 * L.inn(t, 3.6, .4);
  let hands = pat || (joy ? [[-90, -220 + wv], [90, -220 - wv]] : [[-96, -190], [96, -190]]);
  if (t > LAND + .1 && t < LAND + .8) hands = [[-90, -220 + wv], [mix(90, 66, L.inn(t, LAND + .1, .15) * (1 - L.inn(t, LAND + .55, .2))), mix(-220, -296, L.inn(t, LAND + .1, .15) * (1 - L.inn(t, LAND + .55, .2)))]];
  standNan(S, gy, { t: T, face: joy ? 'joy' : 'shock', hands, noFeather: t < LAND });
  Q.smoke(968, 722 - hop, .8, T, t > 2.6 && t < 3.6 ? 1 : 0);
  // the feather: a whip of the wire throws it out of the clump, it tumbles over to her hair
  if (t >= WHIP + .05 && t < LAND) {
    const u = (t - WHIP - .05) / (LAND - WHIP - .05), e = ease(u), fx = 880 + 66 * NAN_S, fy = NAN_GY - hop - 100 * NAN_S - 278 * NAN_S;
    const f0 = [S.f0[0], S.f0[1]], px = mix(f0[0], fx, e), py = mix(f0[1], fy, e) - 42 * Math.sin(Math.PI * u);
    L.feather(px, py, mix(.75, .55, e) + Math.sin(u * Math.PI * 2) * .9 * (1 - u), mix(1.3, .9 * NAN_S, e));
    x.fillStyle = 'rgba(255,200,225,.9)'; for (let i = 1; i <= 4; i++) { const b = Math.max(0, u - i * .05), pe = ease(b); x.globalAlpha = .5 - i * .1; x.beginPath(); x.arc(mix(f0[0], fx, pe), mix(f0[1], fy, pe) - 42 * Math.sin(Math.PI * b), 5 - i, 0, 6.29); x.fill(); } x.globalAlpha = 1;
  }
  const sp = L.inn(t, LAND, .12) * (1 - L.inn(t, LAND + .4, .2)); if (sp > 0) { L.sparkle(930, 590, 1.2, sp); L.sparkle(970, 640, .8, sp); L.sparkle(884, 560, .7, sp); }
}

function bottomScene(S) {
  const { x, L, Q, t, T } = S, K = L.K, P = L.P, ease = L.ease, MID = 860;
  x.fillStyle = K.ink; x.fillRect(P.x, MID - 6, P.w, 12);
  x.fillStyle = '#BFE3F2'; x.fillRect(P.x, MID + 6, P.w, P.y + P.h - MID - 6);
  for (let k = 0; k < 3; k++) { const cx = P.x - 170 + ((T * 24 + k * 380) % (P.w + 340)), cy = 930 + k * 62 + Math.sin(k * 3) * 14, r = 26 + k * 5;
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); for (const [dx, dy, rr] of [[-r * 1.3, 6, r * .8], [0, 0, r], [r * 1.2, 5, r * .85], [r * .4, 12, r * .9]]) { x.moveTo(cx + dx + rr, cy + dy); x.arc(cx + dx, cy + dy, rr, 0, 6.29); } x.fill(); }
  x.fillStyle = '#EADBC2'; x.fillRect(820, MID + 6, P.x + P.w - 820, 1330 - MID - 6); x.fillStyle = '#C9BBA2'; x.fillRect(820, 1290, P.x + P.w - 820, 40);   // house wall and its plinth
  x.strokeStyle = K.ink; x.lineWidth = 5; x.strokeRect(820, MID + 6, P.x + P.w - 820 + 6, 1330 - MID - 6);
  x.fillStyle = '#9CC98C'; x.fillRect(P.x, 1330, P.w, P.y + P.h - 1330); x.strokeStyle = 'rgba(30,27,46,.3)'; x.lineWidth = 3; x.beginPath(); x.moveTo(P.x, 1330); x.lineTo(P.x + P.w, 1330); x.stroke();
  const PM = { x: 640, gy: 1380, s: 1.02 }, J = [PM.x - 150 * PM.s, PM.gy - 35 * PM.s];
  // the pump's state, all from t
  const cyc = t < 3.6 ? 1 : 1 - cl((t - 3.6) / 1.4);
  let phase = 0; for (let u = 0; u < t; u += 1 / 60) { const per = u < 3.6 ? .625 : mix(.625, 1.4, cl((u - 3.6) / 1.4)); phase += (u < 5.0 ? 1 / per : 0) / 60; }
  const swing = .6 * (ease((t - 3.6) / .3) - ease((t - 5.0) / .3)) + (t > 5.7 ? .07 * (Math.pow(Math.sin(cl((t - 5.7) / .25) * Math.PI), 2) + Math.pow(Math.sin(cl((t - 6.1) / .25) * Math.PI), 2)) : 0);
  const flow = cl((t - 3.8) / .25) * (1 - cl((t - 4.95) / .2)), level = .86 - .36 * cl((t - 3.9) / 1.1), basin = cl((t - 3.8) / 1.3) * .85;
  const nt = t - 5.3, needle = t < 4.9 ? undefined : -1.6 + (nt > 0 ? .25 * Math.exp(-nt / 1.2) * Math.sin(Math.PI * 6 * nt) + .03 * Math.sin(Math.PI * 2 * nt) * L.inn(t, 6.2, .5) : 0);
  const on = Q.pump(PM.x, PM.gy, PM.s, T, cyc, { phase, level, plug: swing / (Math.PI / 2), flow, basin, puff: t > 3.8 && t < 4.8 ? (t - 3.8) : 0, needle, slab: true });
  // the basin keeps dripping once the plug is shut
  if (t > 5.3) { const f = ((t - 5.3) * 2) % 1, tx = PM.x - 180 * PM.s, ty = PM.gy - 24 * PM.s, bx = PM.x - 198 * PM.s, by = PM.gy + 10 * PM.s;
    if (f < .55) { const g = f / .55, yy = mix(ty, by, g * g); x.fillStyle = 'rgba(93,183,230,.95)'; teardrop(x, mix(tx, bx, g), yy, 5); }
    else { const g = (f - .55) / .45; x.strokeStyle = `rgba(255,255,255,${.9 * (1 - g)})`; x.lineWidth = 3; x.beginPath(); x.ellipse(bx, by, 6 + 22 * g, 2 + 6 * g, 0, 0, 6.29); x.stroke(); } }
  // the plumber walks over, turns the plug with a wrench, wipes her brow, taps the plug twice
  const enter = ease((t - 3.3) / .5), plx = mix(-70, 215, enter), hopB = enter > 0 && enter < 1 ? -Math.abs(Math.sin(t * 15)) * 16 : -Math.abs(Math.sin((t - 5.3) * 6.5)) * 6 * L.inn(t, 5.4, .3), gy = 1520 + hopB, H = [plx, gy - 100 * .8];
  if (t >= 3.3) {
    const ws = .8, wa = Math.PI + mix(.45, 0, enter) + swing, carry = [plx + 110, H[1] - 30], cj = [carry[0] + 126, carry[1] + 61];
    const wp = enter < 1 ? [mix(cj[0], J[0], enter), mix(cj[1], J[1], enter)] : J, hand = [wp[0] + Math.cos(wa) * 140, wp[1] + Math.sin(wa) * 140], hp = [(hand[0] - H[0]) / ws, (hand[1] - H[1]) / ws];
    // wrench: head open around the nut, handle toward her hand
    x.save(); x.translate(wp[0], wp[1]); x.rotate(wa); x.lineJoin = 'round'; x.strokeStyle = K.ink; x.lineWidth = 5; x.fillStyle = '#A9B0BC';
    x.beginPath(); x.roundRect(8, -8, 152, 16, 8); x.fill(); x.stroke(); x.beginPath(); x.arc(0, 0, 26, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = '#D8B456'; x.beginPath(); x.rect(-30, -11, 30, 22); x.fill(); x.strokeStyle = K.ink; x.beginPath(); x.moveTo(-30, -11); x.lineTo(-4, -11); x.moveTo(-30, 11); x.lineTo(-4, 11); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(32, -4, 90, 3); x.restore();
    const brow = L.inn(t, 5.45, .15) * (1 - L.inn(t, 6.05, .15)), wvh = L.inn(t, 6.3, .25), lw = [mix(mix(-70, -100 + Math.sin(t * 20) * 4, brow), -118 + Math.sin(t * 9) * 12, wvh), mix(mix(60, -236 - Math.sin(t * 20) * 14, brow), -190 - Math.cos(t * 9) * 10, wvh)];
    L.standing(L.PLUMBER, plx, gy, ws, { t: T, face: t > 5.0 ? 'joy' : 'grin', hands: [enter < 1 ? [-70, 60] : lw, hp], grip: [brow > .5 || wvh > .5 ? 'open' : undefined, { k: 'fist', a: wa + Math.PI }], sweat: t > 4.2 && t < 5.0 });
    if (t > 5.7) { for (const k of [5.8, 6.2]) L.sfx('tok', J[0] + 20, J[1] - 90, 40, L.inn(t, k, .08) * (1 - L.inn(t, k + .22, .1)), { rot: -.1, color: '#E9EDF2' }); }
  }
  if (cyc > .02) { const pw = 1 + .1 * Math.sin(phase * 6.283); L.sfx('TIK!', 280, 1010, 60 * cl(cyc * 1.3) * pw, L.clamp(cyc * 3), { rot: -.2 }); L.sfx('TAK!', 900, 1030, 60 * cl(cyc * 1.3) * (2 - pw), L.clamp(cyc * 3), { rot: .2 }); }
  if (t > 3.8 && t < 4.9) L.sfx('pssss', 410, 1150, 46, L.inn(t, 3.8, .2) * (1 - L.inn(t, 4.7, .2)), { rot: -.12, color: '#FFFFFF' });
  if (t > 5.6) L.sfx('ahh…', 880, 1030 + Math.sin(t * 4) * 6, 64, L.inn(t, 5.6, .3), { rot: .1, color: '#C9F0E2' });
}

function showerHead(S) {                                    // the shower that is not quite off: why the drain flooded
  const { x, L, T } = S, K = L.K; x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
  x.strokeStyle = K.ink; x.lineWidth = 22; x.beginPath(); x.moveTo(400, 135); x.lineTo(400, 232); x.quadraticCurveTo(400, 272, 446, 274); x.stroke(); x.strokeStyle = '#B9C0CC'; x.lineWidth = 11; x.stroke();
  x.save(); x.translate(482, 296); x.rotate(.5); x.fillStyle = '#C9CED8'; x.lineWidth = 6; x.strokeStyle = K.ink; x.beginPath(); x.ellipse(0, 0, 62, 20, 0, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = K.ink; for (let i = -3; i <= 3; i++) { x.beginPath(); x.arc(i * 14, 8, 2.8, 0, 6.29); x.fill(); } x.restore();
  for (let k = 0; k < 3; k++) { const f = (T * 1.1 + k / 3) % 1, yy = 330 + f * f * 460, px = 506 + Math.sin(k * 2) * 3;
    if (f < .97) { x.fillStyle = 'rgba(93,183,230,.95)'; x.strokeStyle = K.ink; x.lineWidth = 2; teardrop(x, px, yy, 9); }
    else { const g = (f - .97) / .03; x.strokeStyle = 'rgba(255,255,255,' + .9 * (1 - g) + ')'; x.lineWidth = 4; x.beginPath(); x.ellipse(px, 800, 8 + 26 * g, 3 + 8 * g, 0, 0, 6.29); x.stroke(); } }
  x.restore();
}
export function s7Fix(S) {
  const { x, L, Q, t, T } = S, K = L.K, P = L.P;
  L.panel(t, '#F4ECD8', () => {
    Q.tiles(P.x, P.y, P.w, 560 - P.y, 76, '#F4ECD8', '#CFE8DE'); Q.floorTiles(P.x, 560, P.w, 860 - 560);
    showerHead(S); topScene(S); topNan(S); bottomScene(S);
    if (t > 1.4 && t < 1.95) L.sfx('GLUG!', 500, 700, 56, L.inn(t, 1.4, .15) * (1 - L.inn(t, 1.8, .15)), { rot: .12 });
  });
  bub(S, two('MY FEATHER!!', 'ขนนกฉัน!!'), 760, 405, 880, 598, L.inn(t, 2.0, .3) * (1 - L.inn(t, 3.0, .2)), { size: 50 });
  cap(S, two('Drain the tank: the air goes back in.', 'ระบายน้ำในถัง อากาศกลับเข้าไป'), 1010, 1440, L.inn(t, 3.4, .3), { right: true, size: 34 });
}
