// ACT THREE (Tuesday, pink): the bum gun goes in, how to use it, NaN's joy, no stars, the last word.
// Install and use steps follow the bum-gun minisite (data/core.json steps and parts; the Peach Range's peach).
// Hands are drawn here (plumberHand) so the plumber has an identity in every install panel.
// @ts-nocheck
const two = (en, th) => `${en}\n${th}`;
const TAU = 6.2832, HS = 1.12;                          // HS: the plumber's hand scale against the props
const lerp = (a, b, f) => a + (b - a) * f;

function stepTag(S, n, en, th, a) {                  // numbered step title across the top of the panel
  const { x, L } = S, K = L.K; if (a <= 0) return;
  const k = .88 + .12 * L.back(L.clamp(a * 1.8));
  x.save(); if (n === 1) x.globalAlpha = L.clamp(a * 3); x.translate(535, 251); x.scale(k, k); x.translate(-535, -251);
  x.fillStyle = K.ink; x.beginPath(); x.roundRect(96, 186, 888, 150, 24); x.fill();
  x.fillStyle = K.white; x.beginPath(); x.roundRect(86, 176, 888, 150, 24); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 6; x.stroke();
  x.fillStyle = K.pink; x.beginPath(); x.arc(170, 251, 52, 0, 6.29); x.fill(); x.stroke(); L.txt(String(n), 170, 254, { size: 64, color: K.white, stroke: 8 });
  x.font = `700 42px ${L.HAND}`; const sz = x.measureText(en).width > 700 ? 38 : 42;
  L.txt(en, 250, 222, { size: sz, align: 'left' }); L.txt(th, 250, 282, { size: 40, align: 'left', color: '#B0275E' });
  x.restore();
}

// ---- the plumber's hand -------------------------------------------------------------------------------
// plumberHand draws a forearm from (ax,ay) to the wrist (hx,hy) and a hand beyond it, in the plumber's own
// colours, no ink outline (people have none). The hand is drawn in its own frame: wrist at the origin, fingers
// along +x. The thing it holds must already be drawn: the fingers sit on it.
//   poses: open | flat | grip (a 30 px cylinder, axis across the hand) | drill (grip, index on the trigger) |
//          squeeze (index + middle on a lever, ring + little curled) | cup (fingers curved round a body) |
//          pinch (thumb pad and index pad meet at local (96,-15))
function plumberHand(S, ax, ay, hx, hy, pose = 'open') {
  const { x, L } = S, PL = L.PLUMBER, SK = PL.skin, SK2 = PL.skin2;
  const ang = Math.atan2(hy - ay, hx - ax), len = Math.hypot(hx - ax, hy - ay) / HS;
  x.save(); x.translate(hx, hy); x.rotate(ang); x.scale(HS, HS); x.lineCap = 'round'; x.lineJoin = 'round';
  const D = Math.max(40, Math.min(len - 44, 170)), wid = (d) => 44 + 12 * Math.min(1, d / 200);
  const limb = (d0, d1, pad, col) => {
    const ds = []; for (let d = d0; d < d1; d += 10) ds.push(d); ds.push(d1);
    x.fillStyle = col; x.beginPath(); ds.forEach((d) => x.lineTo(-d, -(wid(d) + pad) / 2));
    for (let i = ds.length - 1; i >= 0; i--) x.lineTo(-ds[i], (wid(ds[i]) + pad) / 2);
    x.closePath(); x.fill();
  };
  // forearm: 44 at the wrist widening to 56, a shade along the underside, the tendons fanning to the knuckles
  limb(-2, D + 8, 0, SK);
  x.strokeStyle = SK2; x.lineWidth = 5; x.globalAlpha = .5; x.beginPath(); x.moveTo(-4, 20); x.lineTo(-D, wid(D) / 2 - 3); x.stroke();
  x.lineWidth = 2.5; x.globalAlpha = .45; for (const [y0, y1] of [[-6, -9], [7, 10]]) { x.beginPath(); x.moveTo(-4, y0); x.lineTo(-D * .62, y1); x.stroke(); } x.globalAlpha = 1;
  // the rolled work-shirt sleeve: a cuff of three lighter bands, a fold at the far end
  const cw = wid(D) + 16;
  limb(D + 34, len + 6, 14, PL.top);
  for (let i = 0; i < 3; i++) { x.fillStyle = i === 1 ? '#6FA3D2' : '#5C95C8'; x.beginPath(); x.roundRect(-(D + 12 * (i + 1)), -cw / 2, 12, cw, 3); x.fill(); }
  x.strokeStyle = 'rgba(25,60,100,.4)'; x.lineWidth = 2.5; for (const d of [D + 12, D + 24, D + 36]) { x.beginPath(); x.moveTo(-d, -cw / 2 + 2); x.lineTo(-d, cw / 2 - 2); x.stroke(); }
  x.strokeStyle = '#245A8C'; x.lineWidth = 4; x.globalAlpha = .55; for (const [d, dy] of [[D + 78, 12], [D + 104, -8]]) { x.beginPath(); x.moveTo(-d, -dy - 14); x.lineTo(-d - 16, -dy + 14); x.stroke(); } x.globalAlpha = 1;
  if (len - 26 > D + 70) { x.strokeStyle = '#245A8C'; x.lineWidth = 10; x.beginPath(); x.moveTo(-(len - 26), -cw / 2 - 2); x.lineTo(-(len - 26), cw / 2 + 2); x.stroke(); }
  // the hand: [y, root x, length] for index, middle, ring, little (a knuckle arc, the middle finger furthest out)
  const FR = [[-22.5, 62, 38], [-7.5, 66, 44], [7.5, 64, 42], [22.5, 58, 34]];
  const P0 = {
    open: { sp: [-.12, -.04, .04, .12], bend: [.18, .2, .22, .25], len: [38, 44, 42, 34], th: [-.75, 40], nails: 1 },
    flat: { sp: [-.2, -.07, .07, .2], bend: [0, 0, 0, 0], len: [38, 44, 42, 34], th: [-1, 38], nails: 1 },
    grip: { sp: [0, 0, 0, 0], bend: [0, 0, 0, 0], len: [38, 44, 42, 34], th: [-.1, 48], nails: 0 },
    drill: { sp: [0, 0, 0, 0], bend: [0, 0, 0, 0], len: [50, 44, 42, 34], th: [-.1, 48], nails: 0 },
    squeeze: { sp: [0, 0, 0, 0], bend: [.5, .55, 1.05, 1.15], len: [46, 50, 30, 26], th: [-.1, 46], nails: 1 },
    cup: { sp: [-.1, -.03, .04, .1], bend: [.55, .6, .62, .6], len: [38, 44, 42, 34], th: [-.5, 38], nails: 0 },
    pinch: { sp: [-.3, .25, .3, .35], bend: [1, .2, .2, .2], len: [44, 26, 24, 22], th: [-.5, 0], nails: 1 },
  }[pose] || {};
  const fng = (i) => {
    const [ry, rx] = FR[i], ln = P0.len[i], sp = P0.sp[i], bd = P0.bend[i], l1 = ln * .55, l2 = ln - l1;
    const x1 = rx + Math.cos(sp) * l1, y1 = ry + Math.sin(sp) * l1, a2 = sp + bd, x2 = x1 + Math.cos(a2) * (l2 - 7.5), y2 = y1 + Math.sin(a2) * (l2 - 7.5);
    x.strokeStyle = SK; x.lineWidth = 15; x.beginPath(); x.moveTo(rx, ry); x.lineTo(x1, y1); x.lineTo(x2, y2); x.stroke();
    x.strokeStyle = SK2; x.lineWidth = 2.5; x.globalAlpha = .75; x.beginPath(); x.moveTo(x1 - Math.sin(sp) * 5.5, y1 + Math.cos(sp) * 5.5); x.lineTo(x1 + Math.sin(sp) * 5.5, y1 - Math.cos(sp) * 5.5); x.stroke(); x.globalAlpha = 1;
    if (P0.nails) { x.fillStyle = 'rgba(250,232,214,.72)'; x.beginPath(); x.ellipse(x2 + Math.cos(a2) * 2.5, y2 + Math.sin(a2) * 2.5, 4.4, 3.6, a2, 0, 6.29); x.fill(); }
  };
  for (const i of [3, 2, 1, 0]) fng(i);
  if (P0.bend.every((b) => b < .3)) {                 // the gaps between straight fingers
    x.strokeStyle = SK2; x.lineWidth = 2.5; x.globalAlpha = .65;
    for (let j = 0; j < 3; j++) { const yy = (FR[j][0] + FR[j + 1][0]) / 2; x.beginPath(); x.moveTo(72, yy); x.lineTo(Math.min(FR[j][1] + P0.len[j], FR[j + 1][1] + P0.len[j + 1]) - 5, yy); x.stroke(); } x.globalAlpha = 1;
  }
  x.fillStyle = SK; x.beginPath(); x.moveTo(-6, -22); x.bezierCurveTo(20, -30, 46, -32, 66, -31); x.lineTo(66, 31); x.bezierCurveTo(46, 32, 20, 30, -6, 22); x.closePath(); x.fill();      // the palm, 66 x 60
  x.strokeStyle = SK2; x.lineWidth = 2.5; x.globalAlpha = .6; for (const [yy, rx] of [[-22.5, 63], [-7.5, 67], [7.5, 65], [22.5, 59]]) { x.beginPath(); x.arc(rx - 3, yy, 7.5, -1.3, 1.3); x.stroke(); } x.globalAlpha = 1;   // knuckles
  x.fillStyle = 'rgba(255,255,255,.06)'; x.beginPath(); x.ellipse(34, -6, 22, 9, .1, 0, 6.29); x.fill();
  x.fillStyle = SK; x.beginPath(); x.ellipse(22, -22, 20, 12, -.35, 0, 6.29); x.fill();                                                            // the thenar mass
  if (pose === 'pinch') {                             // the thumb crosses over and meets the index pad
    x.strokeStyle = SK; x.lineWidth = 16; x.beginPath(); x.moveTo(24, -26); x.quadraticCurveTo(56, -52, 94, -10); x.stroke();
    x.fillStyle = 'rgba(250,232,214,.7)'; x.beginPath(); x.ellipse(70, -36, 4.4, 3.6, .9, 0, 6.29); x.fill();
  } else { const [ta, tl] = P0.th, tx = 24 + Math.cos(ta) * (tl - 8), ty = -26 + Math.sin(ta) * (tl - 8);
    x.strokeStyle = SK; x.lineWidth = 16; x.beginPath(); x.moveTo(24, -26); x.lineTo(tx, ty); x.stroke();
    if (P0.nails && pose !== 'squeeze') { x.fillStyle = 'rgba(250,232,214,.7)'; x.beginPath(); x.ellipse(tx + Math.cos(ta) * 2, ty + Math.sin(ta) * 2, 4.4, 3.6, ta, 0, 6.29); x.fill(); } }
  x.strokeStyle = SK2; x.lineWidth = 2.5; x.globalAlpha = .55; x.beginPath(); x.moveTo(42, -32); x.quadraticCurveTo(54, -27, 62, -29); x.stroke(); x.globalAlpha = 1;          // the web
  x.restore();
}
// put the hand where a grasp is wanted: G = the grasped point, h = the hand's direction (unit), cx = how far
// along the hand that point sits (unscaled), oy = its offset across the hand
function reach(S, G, h, cx, oy, pose, armLen = 520) {
  const nx = -h[1], ny = h[0], wx = G[0] - h[0] * cx * HS - nx * oy * HS, wy = G[1] - h[1] * cx * HS - ny * oy * HS;
  plumberHand(S, wx - h[0] * armLen, wy - h[1] * armLen, wx, wy, pose);
}
// NaN's fist round a wand end (avatar-local coordinates): skin disc, the thumb, three finger gaps
function fist(S, cx, cy, who) {
  const { x } = S; x.save(); x.fillStyle = who.skin; x.beginPath(); x.arc(cx, cy, 17, 0, 6.29); x.fill();
  x.fillStyle = who.skin2; x.beginPath(); x.ellipse(cx + 7, cy - 8, 9, 15, .5, 0, 6.29); x.fill();
  x.strokeStyle = who.skin2; x.lineWidth = 3; x.lineCap = 'round'; for (const dx of [-7, -1, 5]) { x.beginPath(); x.moveTo(cx + dx, cy - 4); x.lineTo(cx + dx, cy + 13); x.stroke(); }
  x.restore();
}
// a hand with one finger out (world coordinates): palm at (px,py), the index finger to (tx,ty), three folded bumps and a thumb
function pointHand(S, who, px, py, tx, ty) {
  const { x } = S, a = Math.atan2(ty - py, tx - px), d = Math.hypot(tx - px, ty - py);
  x.save(); x.translate(px, py); x.rotate(a); x.lineCap = 'round';
  x.fillStyle = who.skin; x.beginPath(); x.roundRect(-14, -21, 38, 42, 15); x.fill();
  x.strokeStyle = who.skin; x.lineWidth = 15; x.beginPath(); x.moveTo(14, -12); x.lineTo(d - 7, -12); x.stroke();                 // the index finger
  x.fillStyle = 'rgba(250,232,214,.8)'; x.beginPath(); x.ellipse(d - 9, -12, 5, 4, 0, 0, 6.29); x.fill();
  x.strokeStyle = who.skin2; x.lineWidth = 2.5; x.beginPath(); x.moveTo(d * .45, -19); x.lineTo(d * .45, -5); x.stroke();
  x.fillStyle = who.skin; for (const yy of [-2, 7, 16]) { x.beginPath(); x.ellipse(22, yy + 1, 11, 6.5, 0, 0, 6.29); x.fill(); }          // folded fingers
  x.strokeStyle = who.skin2; x.lineWidth = 2.5; for (const yy of [3, 12]) { x.beginPath(); x.moveTo(14, yy); x.lineTo(30, yy); x.stroke(); }
  x.fillStyle = who.skin; x.beginPath(); x.ellipse(8, 22, 16, 8, .5, 0, 6.29); x.fill();                                          // thumb
  x.restore();
}
const shadow = (S, px, gy, s) => { const { x } = S; x.fillStyle = 'rgba(30,27,46,.18)'; x.beginPath(); x.ellipse(px, gy + 4, 74 * s, 14 * s, 0, 0, 6.29); x.fill(); };

// ---- install props local to this act ------------------------------------------------------------------
function stub(S, px, py, s, wrap) {                  // the brass male stub left on the wall, seen end on: flange 44, thread 40, bore
  const { x, L } = S, K = L.K; x.save(); x.translate(px, py); x.scale(s, s); x.lineJoin = 'round';
  x.fillStyle = '#D8B456'; x.strokeStyle = K.ink; x.lineWidth = 4.5; x.beginPath(); x.arc(0, 0, 24, 0, 6.29); x.fill(); x.stroke();                      // the flange
  x.fillStyle = 'rgba(255,255,255,.4)'; x.beginPath(); x.ellipse(-9, -11, 9, 5, -.7, 0, 6.29); x.fill();
  x.fillStyle = '#C49A3A'; x.beginPath(); x.arc(0, 0, 16, 0, 6.29); x.fill(); x.stroke();                                                                // the thread's end
  x.strokeStyle = '#7A6320'; x.lineWidth = 3; x.setLineDash([3, 3]); x.beginPath(); x.arc(0, 0, 11, 0, 6.29); x.stroke(); x.setLineDash([]);
  x.fillStyle = '#3F3A2C'; x.beginPath(); x.arc(0, 0, 6, 0, 6.29); x.fill();
  if (wrap > 0) { x.strokeStyle = 'rgba(255,255,255,.96)'; x.lineWidth = 2 + 7 * L.clamp(wrap); x.beginPath(); x.arc(0, 0, 14.5, 0, 6.29); x.stroke(); x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 1.6; x.beginPath(); x.arc(0, 0, 18.5, 0, 6.29); x.stroke(); }
  x.restore();
}
function nutIn(S, nx, ny) {                          // the chrome inlet nut under the cistern's lower right corner
  const { x, L } = S; x.save(); x.fillStyle = '#D9DEE6'; x.strokeStyle = L.K.ink; x.lineWidth = 4; x.beginPath(); x.roundRect(nx - 12, ny - 6, 24, 22, 4); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(nx - 12, ny + 4); x.lineTo(nx + 12, ny + 4); x.stroke(); x.restore();
}
function tapeRoll(S, px, py, r, spin) {              // a white PTFE roll with its hole and a spoke that turns
  const { x, L } = S, K = L.K; x.save(); x.translate(px, py); x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, r, 0, 6.29); x.fill(); x.stroke();
  x.fillStyle = '#D6D6D2'; x.beginPath(); x.arc(0, 0, r * .42, 0, 6.29); x.fill(); x.stroke(); x.strokeStyle = 'rgba(30,27,46,.3)'; x.lineWidth = 3; x.rotate(spin);
  for (let i = 0; i < 3; i++) { x.rotate(2.0944); x.beginPath(); x.moveTo(r * .5, 0); x.lineTo(r * .9, 0); x.stroke(); } x.restore();
}
function magnifier(S, cx, cy, r, a, draw) {          // a round lens with a handle; draw() paints what it shows
  const { x, L } = S, K = L.K; if (a <= 0) return; const k = .7 + .3 * L.back(a);
  x.save(); x.globalAlpha = L.clamp(a * 3); x.translate(cx, cy); x.scale(k, k);
  x.strokeStyle = K.ink; x.lineWidth = 22; x.lineCap = 'round'; x.beginPath(); x.moveTo(-r * .72, r * .72); x.lineTo(-r * 1.1, r * 1.1); x.stroke();
  x.strokeStyle = '#B78552'; x.lineWidth = 12; x.stroke();
  x.save(); x.beginPath(); x.arc(0, 0, r, 0, 6.29); x.clip(); x.fillStyle = '#FFF7E3'; x.fillRect(-r, -r, 2 * r, 2 * r); draw(); x.restore();
  x.strokeStyle = K.ink; x.lineWidth = 14; x.beginPath(); x.arc(0, 0, r, 0, 6.29); x.stroke();
  x.strokeStyle = '#D9DEE6'; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, r, 0, 6.29); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 7; x.beginPath(); x.arc(0, 0, r - 18, 3.5, 4.4); x.stroke();
  x.restore();
}
// the parts tray across the top of the install panel: six parts from the minisite, a check when a step has used it
function partsTray(S, st, u) {
  const { x, L, Q } = S, K = L.K, e = L.ease;
  x.fillStyle = K.ink; x.beginPath(); x.roundRect(70, 360, 956, 190, 22); x.fill();
  x.fillStyle = '#E9D4AA'; x.beginPath(); x.roundRect(62, 352, 956, 190, 22); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 6; x.stroke();
  const USED = [[2, 'valve'], [1, 'tape'], [2, 'hose'], [4, 'head'], [3, 'clip'], [3, 'screws']];
  for (let i = 0; i < 6; i++) {
    const cx = 141 + i * 159, cy = 436, us = USED[i][0], live = st === us, done = st > us || (st === us && u > .6);
    x.fillStyle = live ? '#FFE58A' : '#F7EBD2'; x.beginPath(); x.roundRect(cx - 68, cy - 70, 136, 136, 16); x.fill(); x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 3; x.stroke();
    x.save(); x.translate(cx, cy);
    if (i === 0) Q.stopValve(0, -8, .85, 1, true);
    if (i === 1) { x.fillStyle = K.white; x.strokeStyle = K.ink; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, 44, 0, 6.29); x.fill(); x.stroke(); x.fillStyle = '#D6D6D2'; x.beginPath(); x.arc(0, 0, 17, 0, 6.29); x.fill(); x.stroke(); x.strokeStyle = 'rgba(30,27,46,.3)'; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 31, 0, 6.29); x.stroke(); }
    if (i === 2) Q.hose([[-48, 24], [-26, -34], [14, 36], [48, -22]], 13);
    if (i === 3) Q.sprayHead(8, 0, .62, -.5, 0);
    if (i === 4) Q.wallClip(0, 0, .95);
    if (i === 5) { x.strokeStyle = K.ink; x.lineWidth = 4; x.fillStyle = '#B9BECB'; x.beginPath(); x.roundRect(-44, -26, 40, 26, 6); x.fill(); x.stroke(); for (let j = 0; j < 3; j++) { x.beginPath(); x.moveTo(-34 + j * 10, -26); x.lineTo(-34 + j * 10, 0); x.stroke(); }
      x.fillStyle = '#E3E8EF'; x.beginPath(); x.roundRect(6, 8, 42, 14, 6); x.fill(); x.stroke(); x.beginPath(); x.roundRect(-4, 4, 14, 22, 5); x.fill(); x.stroke(); x.beginPath(); x.moveTo(-1, 10); x.lineTo(7, 20); x.stroke(); }
    x.restore();
    if (done) { const a = e((st === us ? (u - .6) / .2 : 1)); x.save(); x.translate(cx + 42, cy + 40); x.scale(.4 + .6 * L.back(a), .4 + .6 * L.back(a)); x.fillStyle = '#2BB35A'; x.strokeStyle = K.ink; x.lineWidth = 4; x.beginPath(); x.arc(0, 0, 24, 0, 6.29); x.fill(); x.stroke();
      x.strokeStyle = K.white; x.lineWidth = 8; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(-11, 0); x.lineTo(-3, 9); x.lineTo(12, -9); x.stroke(); x.restore(); }
  }
}
function priceSticker(S) {                           // the set's price, on the tray from the first frame
  const { x, L } = S, K = L.K, s = 'HANG full set ฿169 · HomePro';
  x.save(); x.translate(560, 552); x.rotate(-.025); x.font = `700 40px ${L.HAND}`; const w = x.measureText(s).width + 44;
  x.fillStyle = K.ink; x.beginPath(); x.roundRect(-w / 2 + 6, -26 + 6, w, 62, 14); x.fill();
  x.fillStyle = K.yellow; x.beginPath(); x.roundRect(-w / 2, -26, w, 62, 14); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 5; x.stroke();
  L.txt(s, 0, 5, { size: 40 }); x.restore();
}

// 8. 48-57 s: five steps, close on the wall beside the toilet
export function s8Install(S) {
  const { x, L, Q, t, T } = S, K = L.K, P = L.P, e = L.ease, cl = L.clamp, inn = L.inn;
  const SD = 1.8, st = Math.min(4, Math.floor(t / SD)), u = (t - st * SD) / SD;
  const W0 = 700, W1 = 1010, NX = 478, NY = 1104, CX = 830, CY = 860;     // the wall point, the cistern's inlet nut, the clip spot
  const LP = [597, 1034], BP = [700, 1121], HSC = 1.15;                    // the valve's left port (toilet) and bottom port (gun); the head's scale
  const cam = (X, Y) => [620 + (X - 620) * 1.25, 1050 + (Y - 1050) * 1.25];
  const R = (a, ox, oy) => [Math.cos(a) * ox - Math.sin(a) * oy, Math.sin(a) * ox + Math.cos(a) * oy];
  const sway = (a, f = 3.2) => Math.sin(T * f) * a;
  // where the head is, per step: hanging by its hose, in the clip, held over the bowl
  const hangE = [752, 1212], hangO = (r) => [hangE[0] + R(r, 112 * HSC, 0)[0], hangE[1] + R(r, 112 * HSC, 0)[1]];
  const clipO = [CX, CY - 13 * HSC], holdO = [480, 1150], holdR = 2.7;
  let head = null;                                   // head: {o, rot, sq}
  if (st === 2) { const f = cl((u - .7) / .22), r = Math.PI / 2 + sway(.12 * (1 - f * .5)); if (u > .62) head = { o: hangO(r), rot: r, sq: 0, f: e(f) }; }
  if (st === 3) { const f = e((u - .72) / .24), r = lerp(Math.PI / 2 + sway(.08), -Math.PI / 2, f), h0 = hangO(Math.PI / 2 + sway(.08)); head = { o: [lerp(h0[0], clipO[0], f), lerp(h0[1], clipO[1], f) - Math.sin(f * Math.PI) * 60], rot: r, sq: 0 }; }
  if (st === 4) { const f = e((u - .3) / .25), r = lerp(-Math.PI / 2, holdR - TAU, f); head = { o: [lerp(clipO[0], holdO[0], f), lerp(clipO[1], holdO[1], f) - Math.sin(f * Math.PI) * 50], rot: r + (f >= 1 ? sway(.025, 7) : 0), sq: .8 * e((u - .6) / .1) }; }
  const headNut = (hd) => { const p = R(hd.rot, -112 * HSC, 0); return [hd.o[0] + p[0], hd.o[1] + p[1]]; };
  const hosePath = (hd) => {                         // the gun hose from the valve's bottom port to the head's nut, one shape that moves between three
    const n = headNut(hd);
    const A = [BP, [704, 1165], [738, 1180], [hangE[0] - 4, hangE[1] - 24], hangE], B = [BP, [706, 1190], [905, 1112], [852, 1002], [CX, CY + 13 * HSC + 2]], C = [BP, [722, 1200], [684, 1214], [640, 1166], n];
    const m = (a, b, f) => a.map((p, i) => [lerp(p[0], b[i][0], f), lerp(p[1], b[i][1], f)]);
    if (st === 2) return m(A, A, 0).slice(0, 4).concat([n]);
    if (st === 3) return m(A, B, e((u - .72) / .24)).slice(0, 4).concat([n]);
    return m(B, C, e((u - .3) / .25)).slice(0, 4).concat([n]);
  };

  L.panel(t, '#F4ECD8', () => {
    Q.tiles(P.x, P.y, P.w, 1512 - P.y, 138, '#F4ECD8', '#CFE8DE'); Q.floorTiles(P.x, 1512, P.w, P.y + P.h - 1512);
    x.save(); x.translate(620, 1050); x.scale(1.25, 1.25); x.translate(-620, -1050);
    Q.toilet(330, 1600, 1.15, {}); nutIn(S, NX, NY);
    // ---- step 1: the toilet's own angle stop is shut, a hand turning the red lever across
    if (st === 0) {
      Q.hose([[NX, NY + 16], [NX + 8, 1190], [600, 1218 + sway(5, 3.1)], [690, 1192], [W0, BP[1] + 6]], 14);
      const open = 1 - e(cl((u - .14) / .5)); Q.stopValve(W0, W1, 1.5, open, false);
      const th = (1 - open) * Math.PI / 2, ca = Math.cos(th), sa = Math.sin(th), G = [W0 - sa * 60, W1 + 12 + ca * 60], slide = (1 - e(u / .12)) * 240 + e((u - .7) / .28) * 300;
      reach(S, [G[0] + ca * slide, G[1] + sa * slide], [-ca, -sa], 86, 0, 'grip');
      if (u > .62 && u < .8) L.sparkle(W0 - 84, W1 + 14, 1.1, Math.sin(Math.PI * (u - .62) / .18));
    }
    // ---- step 2: the angle stop comes off (hose swings free), tape goes on the brass stub
    if (st === 1) {
      const off = e(cl((u - .24) / .22)), hx = lerp(BP[0], 626, e(cl((u - .26) / .24))) + sway(18 * cl((u - .3) / .2), 4), hy = lerp(BP[1], 1230, e(cl((u - .26) / .24)));
      Q.hose([[NX, NY + 16], [NX + 24, 1176], [(NX + hx) / 2, hy + 46], [hx, hy]], 14);
      if (u > .3) stub(S, W0, W1, 1.5, cl((u - .46) / .46));
      if (off < 1) { x.save(); x.translate(W0 + 260 * off, W1 + 300 * off * off); x.rotate(off * 2.4 + Math.sin(u * 30) * .2 * (1 - off)); x.globalAlpha = 1 - off * off; Q.stopValve(0, 0, 1.5 * (1 + .1 * Math.min(1, u / .12)), 0, false); x.restore(); }
      if (u < .34) reach(S, [W0 + 46 + 260 * off, W1 + 24 + 300 * off * off], [-1, -.12], 84, 0, 'cup', 520);
      const wr = cl((u - .46) / .46), ph = wr * 3 * TAU, Pp = [W0 + 58 + 10 * Math.cos(ph), W1 + 12 + 10 * Math.sin(ph)], hin = (1 - e((u - .4) / .1)) * 260 + e((u - .94) / .06) * 260;
      if (u > .4) {
        const rl = [W0 + 118, W1 - 112]; x.strokeStyle = K.ink; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(rl[0] - 8, rl[1] + 26); x.lineTo(Pp[0] + 4, Pp[1] - 2); x.lineTo(W0 + 22, W1 + 2); x.stroke();
        x.strokeStyle = K.white; x.lineWidth = 7; x.stroke(); tapeRoll(S, rl[0], rl[1], 30, -ph * .6);
        const hv = [-.8, -.6]; reach(S, [Pp[0] - hv[0] * hin, Pp[1] - hv[1] * hin], hv, 96, -15, 'pinch');
      }
    }
    // ---- step 3: the two-way valve screws on, the toilet hose clicks on its left port, the gun hose on the bottom port
    if (st === 2) {
      const v = e(cl(u / .44)), vs = 1 + .12 * (1 - v);
      const toilet = e(cl((u - .48) / .14)), hx = lerp(626, LP[0], toilet) + sway(16 * (1 - toilet), 4), hy = lerp(1230, LP[1] + 4, toilet);
      Q.hose([[NX, NY + 16], [NX + 24 + 14 * toilet, 1176 - 20 * toilet], [lerp((NX + hx) / 2, 560, toilet), lerp(hy + 46, 1096, toilet)], [hx, hy]], 14);
      if (v < 1 && u < .46) stub(S, W0, W1, 1.5, 1);
      if (head) { Q.hose(hosePath(head), 14); }
      x.save(); x.translate(W0 + 60 * (1 - v), W1); x.rotate(v * TAU); x.scale(vs, vs); Q.stopValve(0, 0, 1.5, 0, true); x.restore();
      if (head) Q.sprayHead(head.o[0], head.o[1], HSC, head.rot, 0);
      if (u < .52) { const pu = Math.sin(v * 3 * TAU) * 7; reach(S, [W0 + 50 + pu + 240 * e((u - .46) / .06), W1 + 20], [-.98, -.12], 84, 0, 'cup'); }
      if (u > .6 && u < .78) L.sparkle(LP[0], LP[1], 1.2, Math.sin(Math.PI * (u - .6) / .18)); if (u > .78 && u < .94) L.sparkle(BP[0], BP[1], 1.2, Math.sin(Math.PI * (u - .78) / .16));
    }
    // ---- step 4: drill, plugs and screws, the clip, then the head into the clip
    if (st === 3) {
      Q.hose(hosePath(head), 14); Q.hose([[NX, NY + 16], [NX + 38, 1156], [560, 1096], [LP[0], LP[1] + 4]], 14);
      x.save(); Q.stopValve(W0, W1, 1.5, 0, true); x.restore();
      const dr = e(cl(u / .08)) * (1 - e(cl((u - .5) / .08))), dOn = u > .08 && u < .5;
      if (u < .12) { x.strokeStyle = K.ink; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(CX - 7, CY - 28); x.lineTo(CX + 7, CY - 28); x.moveTo(CX, CY - 35); x.lineTo(CX, CY - 21); x.stroke(); }   // the pencil mark
      if (u > .4 && u < .55) { x.fillStyle = '#3A3340'; x.beginPath(); x.arc(CX, CY - 28, 6, 0, 6.29); x.fill(); }                                                     // the hole, before its plug goes in
      if (dr > 0) {
        const rot = .45, ds = .85, tip = [CX - 6 - 120 * (1 - dr), CY - 28], jit = dOn ? Math.sin(T * 70) * 1.6 : 0, org = [tip[0] - Math.cos(rot) * 150 * ds, tip[1] - Math.sin(rot) * 150 * ds + jit];
        Q.drill(org[0], org[1], ds, rot, T, dOn);
        const hG = [org[0] + Math.cos(rot) * -44 * ds - Math.sin(rot) * 78 * ds, org[1] + Math.sin(rot) * -44 * ds + Math.cos(rot) * 78 * ds];   // the middle of the drill handle
        reach(S, hG, [Math.cos(rot), Math.sin(rot)], 86, 0, 'drill', 560);
        if (dOn) { for (let i = 0; i < 6; i++) { const f = (T * 2.2 + i / 6) % 1; x.fillStyle = `rgba(190,180,165,${.9 * (1 - f)})`; x.strokeStyle = `rgba(30,27,46,${.4 * (1 - f)})`; x.lineWidth = 2; x.beginPath(); x.arc(tip[0] + 6 + (L.rnd(i) - .3) * 40 * f, tip[1] + 8 + f * 54, 5 + f * 13, 0, 6.29); x.fill(); x.stroke(); } }
      }
      for (let i = 0; i < 2; i++) { const a = e((u - .5 - i * .05) / .05); if (a > 0) { const px = CX, py = CY + (i ? 28 : -28); x.save(); x.translate(px, py); x.scale(a, a); x.fillStyle = '#B9BECB'; x.strokeStyle = K.ink; x.lineWidth = 3.5; x.beginPath(); x.arc(0, 0, 10, 0, 6.29); x.fill(); x.stroke(); x.beginPath(); x.moveTo(-5, -1); x.lineTo(5, 1); x.stroke(); x.restore(); } }
      const ca = e((u - .6) / .12); if (ca > 0 && u < .98) { x.save(); x.translate(CX, CY); x.scale(.5 + .5 * L.back(ca), .5 + .5 * L.back(ca)); Q.wallClip(0, 0, 1.15); x.restore(); } else if (ca > 0) Q.wallClip(CX, CY, 1.15);
      Q.sprayHead(head.o[0], head.o[1], HSC, head.rot, 0);
      if (u >= .72) {
        const f = e((u - .72) / .24), slideOut = e((u - .96) / .04) * 200, c0 = R(head.rot, -13 * HSC, 0);
        if (f < 1 || slideOut < 200) reach(S, [head.o[0] + c0[0] + slideOut, head.o[1] + c0[1]], [-1, 0], 86, 0, 'grip');
      }
    }
    // ---- step 5: lever to open, the head out of the clip and over the bowl, a test squirt
    if (st === 4) {
      Q.hose([[NX, NY + 16], [NX + 38, 1156], [560, 1096], [LP[0], LP[1] + 4]], 14);
      const open = e(cl(u / .25)); Q.hose(hosePath(head), 14);
      Q.stopValve(W0, W1, 1.5, open, true);
      Q.wallClip(CX, CY, 1.15);
      Q.sprayHead(head.o[0], head.o[1], HSC, head.rot, head.sq);
      if (u < .27) { const th = (1 - open) * Math.PI / 2, ca = Math.cos(th), sa = Math.sin(th), G = [W0 - sa * 60, W1 + 12 + ca * 60], slide = e((u - .17) / .1) * 260 + (1 - e(u / .1)) * 220; reach(S, [G[0] + ca * slide, G[1] + sa * slide], [-ca, -sa], 86, 0, 'grip'); }
      else { const f = e((u - .3) / .25), ha = lerp(Math.PI, 4.2686, f), h = [Math.cos(ha), Math.sin(ha)], c0 = R(head.rot, -13 * HSC, 0), arm = 560, slide = (1 - e((u - .26) / .06)) * 220;
        reach(S, [head.o[0] + c0[0] - h[0] * slide, head.o[1] + c0[1] - h[1] * slide], h, f > .6 ? 64 : 86, 0, f > .6 ? 'squeeze' : 'grip', arm); }
      if (u > .58) {
        const tp = R(head.rot, 105, 0), tx = head.o[0] + tp[0], ty = head.o[1] + tp[1], a = head.rot - 0 + .0, g = cl((u - .58) / .08);
        Q.spray(tx, ty, a, 150, T, .9 * g);
        for (let j = 0; j < 3; j++) { const f = (T * 1.6 + j / 3) % 1; x.strokeStyle = `rgba(255,255,255,${1 - f})`; x.lineWidth = 4; x.beginPath(); x.ellipse(332, 1262, 14 + 70 * f, 4 + 16 * f, 0, 0, 6.29); x.stroke(); }
        x.fillStyle = 'rgba(150,215,245,.9)'; x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 2; for (let j = 0; j < 5; j++) { const f = (T * 2.4 + j * .37) % 1; x.beginPath(); x.ellipse(320 + (L.rnd(j) - .5) * 70, 1256 - Math.sin(f * Math.PI) * 34, 4, 5, 0, 0, 6.29); x.fill(); x.stroke(); }
      }
    }
    x.restore();
    partsTray(S, st, u); priceSticker(S);
    // the magnifier on the thread (step 2): twelve turns of tape, clockwise
    const ma = inn(u, .36, .18) * (1 - inn(u, .9, .1)) * (st === 1 ? 1 : 0);
    if (ma > 0) {
      const wm = cl((u - .46) / .46), S0 = cam(W0, W1);
      x.strokeStyle = K.ink; x.lineWidth = 5; x.setLineDash([12, 10]); x.beginPath(); x.moveTo(330 + 130, 800 + 70); x.lineTo(S0[0] - 52, S0[1] - 28); x.stroke(); x.setLineDash([]);
      x.beginPath(); x.arc(S0[0], S0[1], 52, 0, 6.29); x.stroke();
      magnifier(S, 330, 800, 150, ma, () => {
        Q.threadTape(-30, 10, 1.0, wm);
        x.strokeStyle = K.ink; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.arc(40, -10, 56, -2.6, -0.2); x.stroke(); x.beginPath(); x.moveTo(104, -34); x.lineTo(98, -10); x.lineTo(80, -22); x.stroke();   // clockwise
        L.txt('12 ×', 52, 100, { size: 40, color: '#B0275E', stroke: 8, strokeColor: '#FFF7E3' });
      });
    }
  });
  const S5 = [['Shut the water', 'ปิดน้ำ'], ['Thread tape on the thread', 'พันเทปพันเกลียว'], ['Valve on, hoses on', 'ขันวาล์ว ต่อสาย'], ['Clip on the wall', 'ยึดขอแขวนกับผนัง'], ['Open it, then a test squirt', 'เปิดน้ำ ฉีดลงโถก่อน']];
  stepTag(S, st + 1, S5[st][0], S5[st][1], inn(u, 0, .25));
  if (st === 3 && u > .08 && u < .5) L.sfx('BZZZ', 330, 690, 60, inn(u, .08, .1), { rot: -.15 });
}

// 9. 57-62 s: how to use it, four cards
export function s9HowTo(S) {
  const { x, L, Q, t, T } = S, K = L.K, e = L.ease;
  L.panel(t, '#FFF0F5', () => {
    L.rays(540, 900, '#FFDDE9', T * .08);
    if (t < .2) { x.save(); x.globalAlpha = 1 - t / .2; x.translate(620, 1050); x.scale(1.25, 1.25); x.translate(-620, -1050); Q.spray(385, 1195, 2.7, 150, T, .9); x.restore(); }   // the test squirt, still falling from shot 8
    const cards = [['Open the valve', 'เปิดวาล์ว'], ['A test squirt', 'ฉีดลงโถก่อน'], ['Squeeze gently,\nfront to back', 'บีบเบาๆ หน้าไปหลัง'], ['Pat dry,\nclose the valve', 'ซับให้แห้ง ปิดวาล์ว']];
    cards.forEach(([en, th], i) => {
      const a = i ? L.inn(t, i * 1.0, .35) : .4 + .6 * L.inn(t, 0, .3); if (a <= 0) return;
      const cx = i % 2 ? 790 : 290, cy = i < 2 ? 640 : 1200, k = .7 + .3 * L.back(a), lt = t - i * 1.0;
      x.save(); x.translate(cx, cy); x.scale(k, k);
      x.fillStyle = K.ink; x.beginPath(); x.roundRect(-218, -238, 450, 500, 26); x.fill();
      x.fillStyle = K.white; x.beginPath(); x.roundRect(-226, -246, 450, 500, 26); x.fill();
      x.save(); x.beginPath(); x.roundRect(-226, -246, 450, 500, 26); x.clip();           // the art stays inside the card
      if (i === 0) {
        const op = e(lt / .8); Q.stopValve(0, -102, 1.8, op, false);
        x.strokeStyle = K.ink; x.lineWidth = 7; x.setLineDash([14, 11]); x.lineCap = 'round'; x.beginPath(); x.arc(0, -102 + 14, 124, Math.PI, Math.PI / 2, true); x.stroke(); x.setLineDash([]);
        x.beginPath(); x.moveTo(-18, 22); x.lineTo(4, 38); x.lineTo(-4, 12); x.stroke();
        if (op > .85) for (let j = 0; j < 4; j++) { const f = (T * 2 + j / 4) % 1; x.fillStyle = 'rgba(110,190,235,.95)'; x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 2; x.beginPath(); x.ellipse(0, 36 + f * 50, 7, 10, 0, 0, 6.29); x.fill(); x.stroke(); }
      }
      if (i === 1) {
        Q.toilet(-55, 75, .45, {}); Q.hose([[200, -158], [222, -194], [250, -236]], 12); Q.sprayHead(122, -147, .7, 3.0, .8); Q.spray(62, -139, 3.0, 120, T, .8);
        for (let j = 0; j < 2; j++) { const f = (T * 1.6 + j / 2) % 1; x.strokeStyle = `rgba(255,255,255,${1 - f})`; x.lineWidth = 3; x.beginPath(); x.ellipse(-48, -57, 8 + 36 * f, 3 + 9 * f, 0, 0, 6.29); x.stroke(); }
      }
      if (i === 2) {
        const f = (lt * .5) % 1, ty = -105 + 135 * f, tip = [108, -159], ang = Math.atan2(ty - tip[1], 0 - tip[0]), o = [tip[0] - Math.cos(ang) * 52, tip[1] - Math.sin(ang) * 52];
        Q.peach(0, -50, 1.5, T, .55); Q.hose([[o[0] + Math.cos(ang + Math.PI) * 67, o[1] + Math.sin(ang + Math.PI) * 67], [200, -200], [250, -240]], 12); Q.sprayHead(o[0], o[1], .6, ang, .5);
        Q.spray(tip[0], tip[1], ang, Math.hypot(0 - tip[0], ty - tip[1]) * 1.1, T, .5);
        x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 7; x.setLineDash([14, 12]); x.lineDashOffset = -T * 40; x.beginPath(); x.moveTo(0, -108); x.quadraticCurveTo(-9, -30, 0, 38); x.stroke(); x.setLineDash([]); x.lineDashOffset = 0;
        x.strokeStyle = K.ink; x.lineWidth = 6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(14, 8); x.lineTo(14, 46); x.moveTo(2, 34); x.lineTo(14, 48); x.lineTo(26, 34); x.stroke();
      }
      if (i === 3) {
        Q.stopValve(130, -150, .9, 1 - e((lt - .5) / .8), false);
        Q.paperHolder(-85, -205, .7, 1);
        const dab = Math.sin(lt * 6) * 14; Q.peach(-70, -46, .85, T, 0);
        const wadC = [-10, -46 + dab]; x.fillStyle = '#FBFAF6'; x.strokeStyle = K.ink; x.lineWidth = 4; x.lineJoin = 'round'; x.beginPath(); x.roundRect(wadC[0] - 24, wadC[1] - 22, 54, 46, 12); x.fill(); x.stroke();
        x.strokeStyle = 'rgba(30,27,46,.3)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(wadC[0] - 14, wadC[1] - 8); x.lineTo(wadC[0] + 16, wadC[1] - 4); x.moveTo(wadC[0] - 14, wadC[1] + 8); x.lineTo(wadC[0] + 12, wadC[1] + 12); x.stroke();
        reach(S, [wadC[0] + 18, wadC[1] - 4], [-.97, -.1], 96, -15, 'pinch', 360);
      }
      x.restore();
      x.fillStyle = K.pink; x.beginPath(); x.arc(-180, -200, 34, 0, 6.29); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 6; x.stroke(); L.txt(String(i + 1), -180, -197, { size: 40, color: K.white, stroke: 6 });
      x.strokeStyle = K.ink; x.lineWidth = 6; x.beginPath(); x.roundRect(-226, -246, 450, 500, 26); x.stroke();
      const two2 = en.includes('\n'); L.txt(en, 0, two2 ? 112 : 128, { size: 40 }); L.txt(th, 0, 208, { size: 38, color: '#B0275E' });
      x.restore();
    });
  });
  L.caption(two('How to use it', 'วิธีใช้'), 540, 170, .5 + .5 * L.inn(t, 0, .25), { center: true, size: 50 });
}

// 10. 62-68 s: NaN hugs the bum gun; Beer pays by QR; the plumber wais; the gecko chirps
export function s10Joy(S) {
  const { x, L, Q, t, T } = S, K = L.K, e = L.ease, inn = L.inn, cl = L.clamp;
  const gy = 1545, NX = 250, NS = 1.05, BX = 540, BS = .85, QX = 715, PXL = 905, PS = .85;
  L.panel(t, '#FFE3EE', () => {
    L.rays(420, 900, '#FFC2DC', T * .25);
    L.confetti(420, 700, t - .2, 90, 3);
    Q.floorTiles(L.P.x, 1500, L.P.w, 100);
    // the rafter the gecko walks on
    x.fillStyle = K.ink; x.beginPath(); x.roundRect(660 + 6, 262 + 6, 420, 92, 14); x.fill(); x.fillStyle = '#9A6540'; x.beginPath(); x.roundRect(660, 262, 420, 92, 14); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 6; x.stroke();
    x.strokeStyle = 'rgba(60,30,15,.35)'; x.lineWidth = 3; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(680, 282 + i * 20); x.bezierCurveTo(780, 276 + i * 20, 900, 292 + i * 20, 1060, 284 + i * 20); x.stroke(); }
    // NaN hugs the gun: hose behind her, hands drawn over the wand ends
    shadow(S, NX, gy, NS);
    x.save(); x.translate(NX, gy); x.rotate(.07); x.translate(-NX, -gy);
    Q.hose([[NX - 100 * NS, gy - 100 * NS - 62 * NS], [NX - 176 * NS, gy - 100 * NS - 22 * NS], [NX - 178 * NS, gy - 90], [NX - 150 * NS, gy + 6], [NX - 118 * NS, 1596]], 14);
    L.standing(L.NAN, NX, gy, NS, { t: T, face: t < 1 ? 'happy' : 'joy', hands: [[-56, -62], [52, -58]] });
    x.save(); x.translate(NX, gy - 100 * NS); x.scale(NS, NS); Q.sprayHead(6, -62, 1.1, -.5, .6); fist(S, -56, -62, L.NAN); fist(S, 52, -58, L.NAN); x.restore();
    x.restore();
    const nz = [NX + 76 * NS + 4, gy - 100 * NS - 66 * NS];
    for (let i = 0; i < 2; i++) { const f = ((t + i * .5) % 1), pop = L.back(cl(f / .25)); if (t + i * .5 < .2) continue;
      x.save(); x.globalAlpha = f > .75 ? (1 - f) * 4 : 1; Q.heart(nz[0] + f * 120 + Math.sin(f * 9 + i) * 10, nz[1] - f * 230, (14 + 12 * f) * pop, K.pink); x.restore(); }
    Q.smoke(NX + 105 * NS, gy - 100 * NS - 330 * NS, .8, T, 1);
    // Beer scans the QR on its stand
    shadow(S, QX, gy, .95); Q.qrStand(QX, gy, 1, cl((t - 1.6) / 1.2) + (t > 2.8 ? 1 : 0));
    shadow(S, BX, gy, BS);
    const hp = e((t - 1.0) / .5), bh = [100 + 6 * (1 - hp), -128 + 60 * (1 - hp)];
    L.standing(L.BEER, BX, gy, BS, { t: T, face: 'happy', hands: [[-78, -20], bh] });
    { const wx = BX + bh[0] * BS, wy = gy - 100 * BS + bh[1] * BS; x.save(); x.translate(wx + 4, wy - 34); x.rotate(.3); x.scale(.72, .72);
      Q.phone(0, 0, 64, 120, (w, h) => { x.fillStyle = '#123E7A'; x.fillRect(0, 0, w, h);
        if (t < 2.8) { x.strokeStyle = '#7FD4FF'; x.lineWidth = 4; for (const [cx2, cy2, dx, dy] of [[10, 22, 1, 1], [w - 10, 22, -1, 1], [10, h - 22, 1, -1], [w - 10, h - 22, -1, -1]]) { x.beginPath(); x.moveTo(cx2 + dx * 16, cy2); x.lineTo(cx2, cy2); x.lineTo(cx2, cy2 + dy * 16); x.stroke(); }
          const sc = cl((t - 1.6) / 1.2); x.fillStyle = 'rgba(43,179,90,.7)'; x.fillRect(12, 30 + sc * (h - 66), w - 24, 5); }
        else { x.fillStyle = '#2BB35A'; x.beginPath(); x.arc(w / 2, h / 2, 22, 0, 6.29); x.fill(); x.strokeStyle = K.white; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(w / 2 - 10, h / 2); x.lineTo(w / 2 - 2, h / 2 + 9); x.lineTo(w / 2 + 12, h / 2 - 8); x.stroke(); } });
      x.fillStyle = L.BEER.skin; x.beginPath(); x.ellipse(6, 54, 11, 18, -.3, 0, 6.29); x.fill();                           // her thumb over the lower edge
      x.fillStyle = L.BEER.skin; for (let i = 0; i < 3; i++) { x.beginPath(); x.ellipse(40, 28 + i * 18, 7, 9, 0, 0, 6.29); x.fill(); }   // fingertips round the far edge
      x.restore(); }
    if (t > 2.8) L.sfx('ปิ๊บ!', 640, 1130, 56, inn(t, 2.8, .25), { rot: -.08, color: '#7CFFB2' });
    // the plumber arrives on the right, then wais
    const pin = e((t - .8) / .6), px = lerp(1130, PXL, pin), wai = inn(t, 3.0, .25), bow = (.5 - .5 * Math.cos(2 * Math.PI * cl((t - 3.2) / .9))) * .2 * (t > 3.2 ? 1 : 0);
    if (pin > 0) {
      shadow(S, px, gy, PS);
      x.save(); x.translate(px, gy); x.rotate(-bow); x.translate(-px, -gy);
      L.standing(L.PLUMBER, px, gy, PS, { t: T, face: wai > 0 ? 'joy' : 'happy', hands: wai > 0 ? [[-14, -104], [14, -104]] : [[-62, -20], [62, -20]] });
      if (wai > 0) { x.save(); x.translate(px, gy - 100 * PS); x.scale(PS, PS); x.globalAlpha = L.clamp(wai * 2); x.fillStyle = L.PLUMBER.skin;
        for (const sd of [-1, 1]) { x.save(); x.translate(sd * 11, -94); x.rotate(-sd * .1); x.beginPath(); x.ellipse(0, 0, 14, 34, 0, 0, 6.29); x.fill(); x.restore(); }
        x.strokeStyle = L.PLUMBER.skin2; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -122); x.lineTo(0, -64); x.stroke(); for (const dx of [-8, 8]) { x.beginPath(); x.moveTo(dx, -118); x.lineTo(dx, -100); x.stroke(); }
        x.fillStyle = L.PLUMBER.skin2; for (const sd of [-1, 1]) { x.beginPath(); x.ellipse(sd * 6, -68, 5, 9, -sd * .3, 0, 6.29); x.fill(); }
        x.restore(); }
      x.restore();
    }
    // the gecko comes in along the rafter, stops and turns its head to the plumber
    Q.gecko(1000 - 150 * e((t - .4) / 1.6), 308, 1.3, -1.57, T, { walk: t < 2.2, look: t > 3.2 ? 1 : 0 });
    if (t > 3.6) L.sfx('จุ๊ จุ๊!', 900, 430, 46, inn(t, 3.6, .3), { rot: -.1, color: '#D9C3A0' });
  });
  L.bubble(two('BEST DAY OF MY LIFE!', 'วันที่ดีที่สุดในชีวิต!'), 420, 760, 300, 1080, inn(t, .4, .3) * (1 - inn(t, 2.6, .25) * .0), { size: 50 });
}

// 11. 68-73 s: NaN wants to leave five stars; motdang has none
function placeScreen(S, w, h) {                      // the plumber's listing; the strip under the title is where stars would go
  const { x, L, Q } = S, K = L.K;
  Q.mdBar(w, 'motdang.net');
  Q.mdMap(w, 120, 290, { pins: [[260, 330, 1]] });
  L.txt('Plumber · ช่างประปา', 30, 452, { size: 52, align: 'left' }); L.txt('1.8 km · open now', 30, 508, { size: 34, align: 'left', color: '#1E7D4A' });
  const btn = [['Call', '#2BB35A'], ['LINE', '#06C755'], ['Map', '#E8384F']], bw = (w - 48) / 3 - 12;
  btn.forEach(([s, c], i) => { const bx = 24 + i * (bw + 12); x.fillStyle = c; x.beginPath(); x.roundRect(bx, 680, bw, 64, 16); x.fill(); L.txt(s, bx + bw / 2, 714, { size: 34, color: K.white }); });
}
export function s11Stars(S) {
  const { x, L, Q, t, T } = S, K = L.K, e = L.ease, inn = L.inn, cl = L.clamp;
  const gy = 1545, NX = 230, NS = 1.3, BX = 925, BS = .9, PC = [605, 1188], PW = 440, PH = 600, PK = PW / 640;
  const sy = PC[1] - PH / 2 + 605 * PK, sx = (i) => PC[0] + (i - 2) * 66;       // the empty strip's middle; star centres
  // her finger taps the first three stars in turn (a ripple, nothing happens), then she sees there is nothing to tap
  const TAPS = [0, 1, 2, 1], TS = .9, TD = .42, shock = t > 2.6;
  const tk = Math.min(TAPS.length - 1, Math.max(0, Math.floor((t - TS) / TD))), fr = cl((t - TS) / TD - tk), prev = tk ? TAPS[tk - 1] : 0;
  const tapping = t > TS - .2 && !shock, tipX = lerp(sx(prev), sx(TAPS[tk]), e(cl(fr * 2))) - 4, poke = t > TS ? Math.sin(Math.PI * fr) * 12 : 0;
  L.panel(t, '#EAF0FF', () => {
    L.rays(540, 1100, '#DCE6FF', T * .1);
    Q.floorTiles(L.P.x, 1500, L.P.w, 100);
    shadow(S, PC[0], 1504, 2.3);
    Q.phone(PC[0], PC[1], PW, PH, (w, h) => { x.save(); x.scale(PK, PK); placeScreen(S, 640, PH / PK); x.restore(); });
    shadow(S, NX, gy, NS);
    const palm = [tipX - 62 + poke, sy + 14 + poke * .3], hips = gy - 100 * NS;
    L.standing(L.NAN, NX, gy, NS, { t: T, face: shock ? 'shock' : 'happy', hands: [shock ? [-60, -70] : [-125, -235 + 10 * Math.sin(T * 9)], tapping ? [(palm[0] - NX) / NS, (palm[1] - hips) / NS] : [70, -50]] });
    if (tapping) pointHand(S, L.NAN, palm[0], palm[1], palm[0] + 62, palm[1] - 4);
    // the five dashed stars sit in the strip; the finger passes through (nothing happens)
    const sa = inn(t, .9, .4) * (1 - inn(t, 3.4, .15));
    for (let i = 0; i < 5; i++) Q.star(sx(i), sy, 30, null, sa);
    if (t > TS && t < 2.6) for (let k = 0; k < 4; k++) { const f = (t - TS - k * TD - TD * .5) / .5; if (f > 0 && f < 1) { x.strokeStyle = `rgba(30,27,46,${.7 * (1 - f)})`; x.lineWidth = 4; x.beginPath(); x.arc(sx(TAPS[k]), sy, 26 + f * 40, 0, 6.29); x.stroke(); } }
    if (t > 3.4) for (let i = 0; i < 5; i++) { const f = cl((t - 3.4) / .6); x.fillStyle = `rgba(206,210,222,${1 - f})`; x.beginPath(); x.arc(sx(i), sy, 26 + f * 40, 0, 6.29); x.fill(); }
    Q.smoke(NX + 105 * NS, gy - 100 * NS - 330 * NS, .8, T);
    shadow(S, BX, gy, BS);
    L.standing(L.BEER, BX, gy, BS, { t: T, face: (t > .9 && t < 2.4) ? 'roll' : 'happy', hands: [[-90, -60], [70, -40]] });
    if (shock) L.sfx('?', 330, 930, 110, inn(t, 2.6, .25), { rot: .2 });
  });
  L.bubble(two('Five stars! Where do I tap?', 'ห้าดาว! กดตรงไหน?'), 440, 640, 260, 940, inn(t, .3, .3) * (1 - inn(t, 2.4, .2)), { size: 42 });
  L.bubble(two('motdang has no stars.', 'มดแดงไม่มีดาวค่ะ'), 690, 640, 880, 1060, inn(t, 2.5, .3), { size: 46 });
}

// 12. 72-79 s: the last word
export function s12End(S) {
  const { x, L, Q, t, T } = S, K = L.K, e = L.ease, inn = L.inn, cl = L.clamp;
  const gy = 1545, NX = 330, NS = .95, BX = 760;
  L.panel(t, '#C81E2C', () => {
    const ra = inn(t, .4, .3); if (ra > 0) { x.save(); x.globalAlpha = ra; L.rays(540, 1250, '#E0353F', T * .15); x.restore(); }
    x.fillStyle = '#F4E3C9'; x.fillRect(L.P.x, 1500, L.P.w, 100); x.fillStyle = 'rgba(30,27,46,.14)'; x.fillRect(L.P.x, 1500, L.P.w, 6);
    // the squirt: thirty drops from the raised head, up across the last line and down onto the floor
    if (t > 2.6) for (let j = 0; j < 30; j++) { const f = (((t - 2.6) * .55 + j / 30) % 1), x0 = NX + 152 * NS + 4, xe = 520 + (L.rnd(j + 4) - .5) * 220, ye = 1500 + L.rnd(j) * 40, sx2 = x0 + (xe - x0) * f + (L.rnd(j + 9) - .5) * 40 * Math.sin(f * Math.PI), sy2 = lerp(1130, ye, f) - Math.sin(f * Math.PI) * (700 + L.rnd(j + 2) * 80);
      x.fillStyle = 'rgba(150,215,245,.95)'; x.strokeStyle = 'rgba(30,27,46,.5)'; x.lineWidth = 2; x.beginPath(); x.ellipse(sx2, sy2, 7 + 3 * L.rnd(j + 7), 9 + 3 * L.rnd(j + 7), 0, 0, 6.29); x.fill(); x.stroke(); }
    if (t > 2.6) for (let j = 0; j < 4; j++) { const f = cl(((t - 2.6) * .55 + j * .22) % 1.2 - .6) ; if (f <= 0) continue; x.fillStyle = 'rgba(150,215,245,.9)'; x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 2; x.beginPath(); x.ellipse(430 + j * 70 + (L.rnd(j) - .5) * 20, 1540, 16 * f, 6 * f, 0, 0, 6.29); x.fill(); x.stroke(); }
    shadow(S, NX, gy, NS); shadow(S, BX, gy, NS);
    const up = t > 2.2 ? e((t - 2.2) / .35) : 0, arc = Math.sin(Math.PI * up) * 80;
    const rh = [lerp(52, 152, up) + arc, lerp(-58, -300, up)], hd = [lerp(6, 152, up) + arc, lerp(-62, -330, up)], lh = [lerp(-56, -66, up), lerp(-62, -34, up)];
    L.standing(L.NAN, NX, gy, NS, { t: T, face: 'joy', hands: [lh, rh] });
    x.save(); x.translate(NX, gy - 100 * NS); x.scale(NS, NS);
    Q.sprayHead(hd[0], hd[1], .8, lerp(-.12, -1.45, up), up < 1 ? lerp(.6, .9, up) : .9);
    if (up < 1) fist(S, lh[0], lh[1], L.NAN);
    fist(S, rh[0], rh[1], L.NAN); x.restore();
    Q.smoke(NX + 105 * NS, gy - 100 * NS - 330 * NS, .8, T, 1);
    L.standing(L.BEER, BX, gy, NS, { t: T, face: 'happy', hands: [[-80, -40], [110, -260]] });
    // the red ant walks the floor in front of their feet, outlined white so it does not melt into the red
    const ax = 540 + Math.sin(T * 1.2) * 300, dir = Math.cos(T * 1.2) >= 0 ? 1 : -1;
    x.save(); x.translate(ax, 1562); x.scale(dir * 1.35, 1.35); x.lineCap = 'round'; x.strokeStyle = K.white; x.fillStyle = K.white; x.lineWidth = 8;
    for (let i = 0; i < 3; i++) for (const d of [-1, 1]) { const w = Math.sin(T * 14 + i * 2 + (d > 0 ? 1 : 0)) * 4; x.beginPath(); x.moveTo(-6 + i * 10, 0); x.lineTo(-12 + i * 12 + w, d * 18); x.lineTo(-18 + i * 14 + w, d * 22); x.stroke(); }
    x.beginPath(); x.ellipse(-18, 0, 17.5, 14.5, 0, 0, 6.29); x.fill(); x.beginPath(); x.ellipse(2, 0, 13.5, 11.5, 0, 0, 6.29); x.fill(); x.beginPath(); x.arc(18, -2, 13.5, 0, 6.29); x.fill(); x.beginPath(); x.moveTo(22, -8); x.quadraticCurveTo(30, -22, 36, -20); x.moveTo(24, -6); x.quadraticCurveTo(36, -14, 40, -10); x.stroke();
    x.restore();
    x.save(); x.translate(ax, 1562); x.scale(dir, 1); x.translate(-ax, -1562); Q.ant(ax, 1562, 1.35, T); x.restore();
  });
  const a = L.inn(t, .2, .4), b = L.inn(t, 1.4, .4), c = L.inn(t, 2.6, .4);
  L.txt('Motdang won\'t tell you', 540, 210, { size: 50, color: K.white, stroke: 10, alpha: a });
  L.txt('how many stars a place has', 540, 270, { size: 50, color: K.white, stroke: 10, alpha: a });
  L.txt('or wash your ass for you,', 540, 350, { size: 50, color: K.white, stroke: 10, alpha: b });
  L.sfx('but they will help you', 540, 440, 56, c, { color: '#FFD23F' });
  L.sfx('install a bum gun!', 540, 520, 72, c, { color: '#FFD23F' });
  L.txt('มดแดงไม่บอกว่าร้านไหนได้กี่ดาว', 540, 610, { size: 38, color: K.white, stroke: 8, alpha: a });
  L.txt('ไม่ล้างก้นให้ด้วย', 540, 662, { size: 38, color: K.white, stroke: 8, alpha: b });
  L.txt('แต่ช่วยให้คุณได้ติดสายฉีดชำระ!', 540, 725, { size: 44, color: '#FFD23F', stroke: 9, alpha: c });
  L.caption('motdang.net/sites/bum-gun', 540, 800, L.inn(t, 3.6, .4), { center: true, size: 40, fill: '#FFFFFF' });
  if (t < .2) { x.save(); x.fillStyle = `rgba(255,255,255,${1 - t / .2})`; x.fillRect(0, 0, 1080, 1920); x.restore(); }
}
