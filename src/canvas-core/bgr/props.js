// PROPS FOR THE BUM GUN REEL. Objects carry ink outlines; people do not (the brand avatars).
// Reference: the bum-gun minisite's parts (stop valve, thread tape, hose, spray head with its lever, clip,
// plugs and screws) and the pump-filter-drain minisite's pressure-tank pump, floor drain and grate.
// @ts-nocheck
export function makeProps(x, L) {
  const { K, txt, clamp, ease, back, rnd } = L;
  const INK = K.ink, CHROME = '#D9DEE6', CHROME2 = '#A9B0BC', WHITE = '#FBFAF6';
  const ol = (w = 5) => { x.strokeStyle = INK; x.lineWidth = w; x.lineJoin = 'round'; x.lineCap = 'round'; };

  // ---------- the bathroom ----------
  function tiles(x0, y0, w, h, size, c1, c2, grout = 'rgba(30,27,46,.16)') {
    x.fillStyle = c1; x.fillRect(x0, y0, w, h);
    for (let j = 0; j * size < h; j++) for (let i = 0; i * size < w; i++) if ((i * 7 + j * 3) % 11 === 0) { x.fillStyle = c2; x.fillRect(x0 + i * size, y0 + j * size, size, size); }
    x.strokeStyle = grout; x.lineWidth = 3; x.beginPath();
    for (let i = 0; i <= w / size; i++) { x.moveTo(x0 + i * size, y0); x.lineTo(x0 + i * size, y0 + h); }
    for (let j = 0; j <= h / size; j++) { x.moveTo(x0, y0 + j * size); x.lineTo(x0 + w, y0 + j * size); }
    x.stroke();
  }
  function floorTiles(x0, y0, w, h) {                // the floor in perspective: rows get deeper toward the viewer
    x.fillStyle = '#9FB7C2'; x.fillRect(x0, y0, w, h);
    x.strokeStyle = 'rgba(30,27,46,.2)'; x.lineWidth = 3; x.beginPath();
    let yy = y0, d = 30; while (yy < y0 + h) { x.moveTo(x0, yy); x.lineTo(x0 + w, yy); yy += d; d *= 1.35; }
    const cx = x0 + w / 2; for (let i = -8; i <= 8; i++) { x.moveTo(cx + i * 70, y0); x.lineTo(cx + i * 190, y0 + h); }
    x.stroke();
  }
  // a western toilet seen from the front, lid up; origin on the floor under its middle
  function toilet(px, gy, s, o = {}) {
    x.save(); x.translate(px, gy); x.scale(s, s); ol(6);
    x.fillStyle = WHITE; x.beginPath(); x.roundRect(-130, -600, 260, 170, 18); x.fill(); x.stroke();          // cistern
    x.fillStyle = '#EDEBE4'; x.beginPath(); x.roundRect(-140, -616, 280, 30, 10); x.fill(); x.stroke();        // its lid
    x.fillStyle = CHROME; x.beginPath(); x.ellipse(0, -601, 30, 9, 0, 0, 6.29); x.fill(); x.stroke();          // dual flush button
    x.beginPath(); x.moveTo(0, -609); x.lineTo(0, -593); x.stroke();
    x.fillStyle = WHITE; x.beginPath(); x.roundRect(-112, -500, 224, 190, [60, 60, 20, 20]); x.fill(); x.stroke(); // the lid, up
    x.strokeStyle = 'rgba(30,27,46,.15)'; x.lineWidth = 4; x.beginPath(); x.roundRect(-92, -482, 184, 150, [48, 48, 14, 14]); x.stroke(); ol(6);
    x.fillStyle = WHITE; x.beginPath(); x.moveTo(-74, 0); x.lineTo(-62, -170); x.lineTo(62, -170); x.lineTo(74, 0); x.closePath(); x.fill(); x.stroke(); // pedestal
    x.beginPath(); x.moveTo(-150, -300); x.bezierCurveTo(-150, -200, -90, -160, 0, -160); x.bezierCurveTo(90, -160, 150, -200, 150, -300); x.closePath(); x.fill(); x.stroke(); // bowl
    x.fillStyle = '#F1EFE8'; x.beginPath(); x.ellipse(0, -300, 152, 34, 0, 0, 6.29); x.fill(); x.stroke();     // seat
    x.fillStyle = o.water || '#BFE6F4'; x.beginPath(); x.ellipse(0, -300, 108, 20, 0, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(-30, -304, 40, 6, 0, 0, 6.29); x.fill();
    x.restore();
  }
  function floorDrain(px, py, s, rise = 0, t = 0) {  // round stainless grate in the floor; rise 0..1 = water welling up through the slots
    x.save(); x.translate(px, py); x.scale(s, s); ol(5);
    x.fillStyle = CHROME; x.beginPath(); x.ellipse(0, 0, 60, 20, 0, 0, 6.29); x.fill(); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 3; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 13, -15 + Math.abs(i) * 2); x.lineTo(i * 13, 15 - Math.abs(i) * 2); x.stroke(); }
    if (rise > 0) {
      const r = clamp(rise);
      x.fillStyle = 'rgba(120,196,230,.88)'; x.strokeStyle = 'rgba(30,27,46,.55)'; x.lineWidth = 4;        // a low dome of water pushing up through the grate
      x.beginPath(); x.ellipse(0, -2, 50 * r, 14 * r, 0, 0, 6.29); x.fill(); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(-14 * r, -6 * r, 12 * r, 4 * r, -.2, 0, 6.29); x.fill();
      for (let k = 0; k < 3; k++) {                                                                       // three bubbles that rise and pop
        const f = (t * .8 + k / 3) % 1, bx = (k - 1) * 26 + Math.sin(f * 6 + k) * 5, by = -8 - f * 110 * r, br = 7 + (k % 2) * 4;
        if (f < .86) { x.fillStyle = 'rgba(190,232,250,.92)'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(bx, by, br, 0, 6.29); x.fill(); x.stroke();
          x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(bx - br * .3, by - br * .3, br * .28, 0, 6.29); x.fill(); }
        else { const p = (f - .86) / .14; x.strokeStyle = 'rgba(30,27,46,' + (1 - p) + ')'; x.lineWidth = 3; for (let q = 0; q < 5; q++) { const a = q * 1.2566 - 1.57; x.beginPath(); x.moveTo(bx + Math.cos(a) * (br + 2), by + Math.sin(a) * (br + 2)); x.lineTo(bx + Math.cos(a) * (br + 8 + p * 8), by + Math.sin(a) * (br + 8 + p * 8)); x.stroke(); } }
      }
    }
    x.restore();
  }
  function puddle(px, py, rx, ry, t, a = 1) {        // standing water with a slow ripple
    if (a <= 0) return; x.save(); x.globalAlpha *= clamp(a);
    x.fillStyle = 'rgba(120,196,230,.75)'; x.strokeStyle = 'rgba(30,27,46,.5)'; x.lineWidth = 4;
    x.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * 6.283, w = 1 + .06 * Math.sin(an * 3 + t * 2); x.lineTo(px + Math.cos(an) * rx * w, py + Math.sin(an) * ry * w); } x.fill(); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3;
    for (let k = 0; k < 2; k++) { const f = (t * .6 + k / 2) % 1; x.globalAlpha = (1 - f) * .9 * clamp(a); x.beginPath(); x.ellipse(px + rx * .2, py, rx * .7 * f, ry * .7 * f, 0, 0, 6.29); x.stroke(); }
    x.restore();
  }
  function paperHolder(px, py, s, left = 0, spin = 0) {  // left: 0 = an empty tube, 1 = a full roll; spin = the empty tube turning on its axis (radians)
    x.save(); x.translate(px, py); x.scale(s, s); ol(5);
    x.fillStyle = CHROME; x.beginPath(); x.roundRect(-70, -10, 140, 20, 8); x.fill(); x.stroke();
    const r = 22 + 30 * left; x.fillStyle = left > .05 ? WHITE : '#C9A27A';
    x.beginPath(); x.roundRect(-55, 10, 110, r * 2, r); x.fill(); x.stroke();
    if (left <= .05) {
      x.save(); x.beginPath(); x.roundRect(-55, 10, 110, r * 2, r); x.clip();                                // the cardboard seam lines slide round the tube as it spins
      x.strokeStyle = 'rgba(30,27,46,.32)'; x.lineWidth = 3;
      for (let k = 0; k < 6; k++) { const a = spin + k * 1.047; if (Math.cos(a) > 0) { const yy = 10 + r + Math.sin(a) * r * .86; x.beginPath(); x.moveTo(-55, yy); x.lineTo(55, yy); x.stroke(); } }
      x.restore();
      x.fillStyle = '#A9825A'; x.beginPath(); x.ellipse(55, 10 + r, 7, r, 0, 0, 6.29); x.fill(); x.stroke();
    }
    x.restore();
  }
  function shower(px, py, s, t, on) {                // wall shower: flange, arm out from the wall, a head bending down; drips when off, sprays when on
    x.save(); x.translate(px, py); x.scale(s, s); ol(5);
    x.fillStyle = CHROME; x.beginPath(); x.ellipse(0, 0, 20, 26, 0, 0, 6.29); x.fill(); x.stroke();            // wall flange
    x.lineCap = 'butt'; x.lineJoin = 'round';
    const arm = () => { x.beginPath(); x.moveTo(0, 0); x.lineTo(52, 0); x.quadraticCurveTo(86, 0, 86, 34); x.lineTo(86, 50); };
    arm(); x.strokeStyle = INK; x.lineWidth = 24; x.stroke(); arm(); x.strokeStyle = CHROME; x.lineWidth = 14; x.stroke();
    ol(5); x.save(); x.translate(86, 50); x.rotate(.1);
    x.fillStyle = CHROME; x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.lineTo(50, 36); x.lineTo(-50, 36); x.closePath(); x.fill(); x.stroke();   // the head's cone
    x.fillStyle = CHROME2; x.beginPath(); x.ellipse(0, 38, 52, 11, 0, 0, 6.29); x.fill(); x.stroke();                                          // its face plate
    x.fillStyle = INK; for (let i = -3; i <= 3; i++) { x.beginPath(); x.arc(i * 14, 38 + Math.abs(i) * .6, 2.4, 0, 6.29); x.fill(); }
    x.restore();
    if (on) { x.strokeStyle = 'rgba(120,196,230,.9)'; x.lineWidth = 4; for (let i = 0; i < 9; i++) { const f = (t * 3 + i / 9) % 1, sx = 44 + i * 10; x.beginPath(); x.moveTo(sx, 100 + f * 300); x.lineTo(sx + 6, 120 + f * 300); x.stroke(); } }
    else for (let k = 0; k < 2; k++) {                                                                       // a slow drip off the head: swells, lets go, falls
      const f = (t * .8 + k * .5) % 1, hang = Math.min(f / .35, 1), fall = f > .35 ? (f - .35) / .65 : 0, dy = 94 + (fall * fall) * 230 + hang * 4, a = 1 - Math.max(0, fall - .7) / .3, dx = 56 + k * 22;
      x.fillStyle = 'rgba(120,196,230,' + a + ')'; x.strokeStyle = 'rgba(30,27,46,' + a * .6 + ')'; x.lineWidth = 3;
      x.beginPath(); x.moveTo(dx, dy - 9 - 5 * (fall > 0 ? 1 : 0)); x.quadraticCurveTo(dx + 8, dy + 2, dx, dy + 7 * hang + 2); x.quadraticCurveTo(dx - 8, dy + 2, dx, dy - 9 - 5 * (fall > 0 ? 1 : 0)); x.fill(); x.stroke();
    }
    x.restore();
  }
  function windowSky(px, py, w, h, inside) {         // a small high bathroom window with louvres; inside() draws what is beyond
    x.save(); x.beginPath(); x.rect(px, py, w, h); x.clip(); x.fillStyle = '#9FD8F2'; x.fillRect(px, py, w, h); if (inside) inside(); x.restore();
    ol(6); x.strokeRect(px, py, w, h);
    x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 6; for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(px, py + i * h / 5); x.lineTo(px + w, py + i * h / 5 - 6); x.stroke(); }
  }
  // the house gecko (jing-jok), seen from above on the wall; `look` turns the head
  function gecko(px, py, s, rot, t, o = {}) {
    // Hemidactylus, as on a Chiang Mai bathroom wall: pale pinkish body, pointed snout, bulging eyes with slit pupils,
    // splayed limbs with padded toes, a banded tail that tapers. Head along -y; `look` turns the head, `walk` steps the legs.
    x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s);
    const C = '#E9D2BC', D = '#8A6E55', PAD = '#D9BFA0', wig = o.walk ? Math.sin(t * 9) * .35 : Math.sin(t * 1.3) * .04;
    x.fillStyle = 'rgba(30,27,46,.16)'; x.beginPath(); x.ellipse(4, 8, 17, 36, 0, 0, 6.29); x.fill();               // its shadow on the wall
    const tail = []; for (let i = 0; i <= 18; i++) { const u = i / 18; tail.push([Math.sin(u * 4.4 + t * 2) * 13 * u, 28 + u * 92, 5 - 4 * u]); }
    const side = (d) => tail.map(([cx, cy, w], i) => { const n = tail[Math.min(i + 1, 18)], q = tail[Math.max(i - 1, 0)], dx = n[0] - q[0], dy = n[1] - q[1], l = Math.hypot(dx, dy) || 1; return [cx - dy / l * w * d, cy + dx / l * w * d]; });
    const lt = side(1), rt = side(-1).reverse();
    x.fillStyle = C; x.strokeStyle = INK; x.lineWidth = 3; x.lineJoin = 'round';
    x.beginPath(); [...lt, ...rt].forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(138,110,85,.55)'; x.lineWidth = 3; for (let k = 1; k <= 5; k++) { const i = k * 3; x.beginPath(); x.moveTo(lt[i][0], lt[i][1]); x.lineTo(side(-1)[i][0], side(-1)[i][1]); x.stroke(); }
    const limb = (sx, sy, out, fwd, ph) => {                // shoulder or hip -> elbow (out) -> wrist (back), five padded toes
      const ax = sx * 11, ay = sy, ex = sx * (11 + out), ey = sy + fwd * .5 + ph * 6, wx = ex + sx * 6, wy = ey + fwd + ph * 10;
      x.lineCap = 'round'; for (const [col, w] of [[INK, 11], [C, 6]]) { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(ex, ey); x.lineTo(wx, wy); x.stroke(); }
      const base = Math.atan2(wy - ey, wx - ex);
      for (let k = -2; k <= 2; k++) { const an = base + k * .42, tx = wx + Math.cos(an) * 10, ty = wy + Math.sin(an) * 10;
        x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(wx, wy); x.lineTo(tx, ty); x.stroke();
        x.fillStyle = PAD; x.beginPath(); x.arc(tx, ty, 3.5, 0, 6.29); x.fill(); x.lineWidth = 1.5; x.stroke(); }
    };
    limb(-1, -18, 18, -16, wig); limb(1, -18, 18, -16, -wig); limb(-1, 20, 20, 14, -wig); limb(1, 20, 20, 14, wig);
    x.fillStyle = C; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.ellipse(0, 0, 15, 32, 0, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = D; for (const [a, b, r] of [[-6, -18, 2.6], [5, -10, 2.2], [-4, -2, 3], [7, 6, 2.4], [-7, 12, 2.2], [3, 18, 2.8], [-2, 26, 2.2], [8, -22, 2.2]]) { x.beginPath(); x.arc(a, b, r, 0, 6.29); x.fill(); }
    x.save(); x.translate(0, -28); x.rotate((o.look || 0) * .45);
    x.fillStyle = C; x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.moveTo(0, -30); x.bezierCurveTo(9, -27, 15, -16, 15, -8); x.bezierCurveTo(15, 0, 9, 4, 0, 4); x.bezierCurveTo(-9, 4, -15, 0, -15, -8); x.bezierCurveTo(-15, -16, -9, -27, 0, -30); x.closePath(); x.fill(); x.stroke();
    for (const d of [-1, 1]) { x.fillStyle = '#F7EBD8'; x.beginPath(); x.arc(d * 10, -16, 6, 0, 6.29); x.fill(); x.lineWidth = 2.5; x.stroke();
      x.fillStyle = INK; x.beginPath(); x.ellipse(d * 10, -16, 1.2, 4.5, 0, 0, 6.29); x.fill(); }
    x.restore();
    x.restore();
  }

  // ---------- the bum gun and its parts ----------
  // spray head, nozzle pointing along +x, lever underneath; squeeze 0..1 closes the lever
  function sprayHead(px, py, s, rot, squeeze = 0) {
    x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s); ol(5);
    x.fillStyle = WHITE;
    x.save(); x.translate(60, 18); x.rotate(.5 * (1 - clamp(squeeze))); x.fillStyle = CHROME2; x.beginPath(); x.roundRect(-130, -4, 130, 22, 10); x.fill(); x.stroke();   // lever, hinged at the nose
    x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 6; x.beginPath(); x.moveTo(-122, 14); x.lineTo(-8, 14); x.stroke(); x.restore(); x.fillStyle = WHITE; ol(5);
    x.beginPath(); x.moveTo(-90, -14); x.quadraticCurveTo(-60, -26, 40, -24); x.quadraticCurveTo(84, -22, 86, 0); x.quadraticCurveTo(84, 20, 40, 20); x.lineTo(-90, 16); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = CHROME; x.beginPath(); x.ellipse(86, 0, 8, 18, 0, 0, 6.29); x.fill(); x.stroke();              // nozzle face
    x.fillStyle = INK; for (const hy of [-9, 0, 9]) { x.beginPath(); x.arc(87, hy, 2.4, 0, 6.29); x.fill(); }      // spray holes
    x.fillStyle = 'rgba(30,27,46,.14)'; x.beginPath(); x.roundRect(-70, 4, 100, 12, 6); x.fill();                  // grip shade under the body
    x.fillStyle = CHROME2; x.beginPath(); x.roundRect(-112, -12, 26, 24, 5); x.fill(); x.stroke();                 // hose nut
    x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 3; for (const nx of [-104, -96]) { x.beginPath(); x.moveTo(nx, -10); x.lineTo(nx, 10); x.stroke(); }
    x.restore();
  }
  function hose(pts, w = 16, col = CHROME) {         // a braided hose along a smooth path
    const path = () => { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; x.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } x.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
    x.lineCap = 'round'; x.lineJoin = 'round'; path(); x.strokeStyle = INK; x.lineWidth = w + 8; x.stroke(); path(); x.strokeStyle = col; x.lineWidth = w; x.stroke();
    path(); x.setLineDash([6, 8]); x.strokeStyle = 'rgba(30,27,46,.28)'; x.lineWidth = w * .5; x.stroke(); x.setLineDash([]);
  }
  // stop valve on the wall, two outlets (toilet + gun); open: lever along the pipe (down), shut: across
  function stopValve(px, py, s, open = 1, two = true) {
    x.save(); x.translate(px, py); x.scale(s, s); ol(5);
    x.fillStyle = CHROME; x.beginPath(); x.ellipse(0, 0, 44, 44, 0, 0, 6.29); x.fill(); x.stroke();               // wall flange
    x.beginPath(); x.roundRect(-22, -22, 44, 70, 14); x.fill(); x.stroke();                                         // body
    x.beginPath(); x.roundRect(-14, 44, 28, 26, 6); x.fill(); x.stroke();                                           // outlet to the gun
    if (two) { x.beginPath(); x.roundRect(-70, 4, 50, 24, 6); x.fill(); x.stroke(); }                               // outlet to the toilet
    x.save(); x.translate(0, 8); x.rotate((1 - clamp(open)) * Math.PI / 2);
    x.fillStyle = '#E2463C'; x.beginPath(); x.roundRect(-9, -8, 18, 70, 9); x.fill(); x.stroke(); x.restore();      // the lever
    x.fillStyle = CHROME2; x.beginPath(); x.arc(0, 8, 9, 0, 6.29); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 3;                                                           // hex nut flats on the outlets
    for (const ny of [52, 60]) { x.beginPath(); x.moveTo(-14, ny); x.lineTo(14, ny); x.stroke(); }
    if (two) for (const nx of [-62, -54]) { x.beginPath(); x.moveTo(nx, 4); x.lineTo(nx, 28); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 5; x.beginPath(); x.moveTo(-14, -14); x.lineTo(-14, 30); x.stroke(); // shine on the body
    x.restore();
  }
  function wallClip(px, py, s) {
    x.save(); x.translate(px, py); x.scale(s, s); ol(5); x.fillStyle = WHITE;
    x.beginPath(); x.roundRect(-30, -40, 60, 80, 14); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(-26, 10); x.lineTo(-26, 40); x.quadraticCurveTo(0, 60, 26, 40); x.lineTo(26, 10); x.stroke();
    x.fillStyle = CHROME2; for (const d of [-22, 22]) { x.beginPath(); x.arc(0, d, 6, 0, 6.29); x.fill(); x.stroke(); }
    x.restore();
  }
  function spray(px, py, ang, len, t, k = 1, col = 'rgba(110,190,235,.95)') { // a fan of drops; k = force
    if (k <= 0) return;
    for (let i = 0; i < 46; i++) {
      const f = (t * 2.6 + rnd(i) ) % 1, sp = (rnd(i + 5) - .5) * .5, d = f * len * (.6 + .4 * k) * (.82 + .3 * rnd(i + 11)), g = f * f * 90 * (1.2 - k * .4);
      const xx = px + Math.cos(ang + sp) * d, yy = py + Math.sin(ang + sp) * d + g;
      x.fillStyle = col; x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 2;
      x.beginPath(); x.ellipse(xx, yy, 6 + 6 * k * (1 - f), 4 + 3 * k * (1 - f), ang, 0, 6.29); x.fill(); x.stroke();
    }
  }
  function threadTape(px, py, s, wrap) {             // a brass thread taking turns of white PTFE tape
    x.save(); x.translate(px, py); x.scale(s, s); ol(5);
    x.fillStyle = '#D8B456'; x.beginPath(); x.roundRect(-30, -90, 60, 180, 8); x.fill(); x.stroke();
    x.strokeStyle = '#8E7428'; x.lineWidth = 4; for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo(-30, -80 + i * 14); x.lineTo(30, -74 + i * 14); x.stroke(); }
    const n = Math.floor(clamp(wrap) * 12); x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 2;
    for (let i = 0; i < n; i++) { x.beginPath(); x.moveTo(-32, -84 + i * 14); x.lineTo(32, -78 + i * 14); x.lineTo(32, -66 + i * 14); x.lineTo(-32, -72 + i * 14); x.closePath(); x.fill(); x.stroke(); }
    if (wrap > 0 && wrap < 1) { const yy = -78 + n * 14; x.fillStyle = WHITE; ol(4); x.beginPath(); x.arc(70, yy - 10, 34, 0, 6.29); x.fill(); x.stroke(); x.fillStyle = '#E3E3E3'; x.beginPath(); x.arc(70, yy - 10, 14, 0, 6.29); x.fill(); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 10; x.beginPath(); x.moveTo(36, yy - 10); x.lineTo(32, yy); x.stroke(); }
    x.restore();
  }
  function drill(px, py, s, rot, t, on, flip = false) {  // bit points along +x (along -x when flip), handle underneath
    x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); ol(5);
    x.fillStyle = '#F2B233'; x.beginPath(); x.roundRect(-110, -40, 150, 70, 20); x.fill(); x.stroke();
    x.beginPath(); x.roundRect(-80, 20, 50, 110, 14); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 4; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-100 + i * 14, -22); x.lineTo(-100 + i * 14, 8); x.stroke(); }   // vents
    x.fillStyle = '#2B2B33'; x.beginPath(); x.roundRect(-34, 30, 14, 22, 5); x.fill();                              // trigger, on the nose side of the handle
    x.fillStyle = '#2B2B33'; x.beginPath(); x.roundRect(-92, 120, 74, 46, 8); x.fill(); ol(5); x.stroke();
    x.fillStyle = CHROME; x.beginPath(); x.roundRect(40, -20, 34, 30, 6); x.fill(); x.stroke();
    x.strokeStyle = CHROME2; x.lineWidth = 8; x.beginPath(); x.moveTo(74, -5); x.lineTo(150, -5); x.stroke();
    if (on) { x.strokeStyle = INK; x.lineWidth = 3; for (let i = 0; i < 4; i++) { const yy = -5 + Math.sin(t * 60 + i) * 6; x.beginPath(); x.moveTo(80 + i * 18, yy - 6); x.lineTo(90 + i * 18, yy + 6); x.stroke(); } }
    x.restore();
  }
  function peach(px, py, s, t, wet = 0) {            // the Peach Range target from the minisite: two lobes, a cleft, a leaf, a face
    const w = clamp(wet);
    x.save(); x.translate(px, py); x.rotate(Math.sin(t * 50) * .1 * w); x.scale(s, s); ol(6);
    x.strokeStyle = INK; x.lineWidth = 12;                                           // outline first; the fill hides the inner halves of it
    for (const cx of [-26, 26]) { x.beginPath(); x.arc(cx, 6, 58, 0, 6.29); x.stroke(); }
    const gr = x.createRadialGradient(-20, -24, 10, 0, 0, 80); gr.addColorStop(0, '#FFD3A8'); gr.addColorStop(.6, '#FF9E7A'); gr.addColorStop(1, '#F2667A');
    x.fillStyle = gr; for (const cx of [-26, 26]) { x.beginPath(); x.arc(cx, 6, 58, 0, 6.29); x.fill(); }
    x.fillStyle = 'rgba(255,255,255,.4)'; x.beginPath(); x.ellipse(-52, -18, 12, 22, -.4, 0, 6.29); x.fill();       // light on the left lobe
    x.strokeStyle = 'rgba(150,40,70,.7)'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -40); x.quadraticCurveTo(-6, 10, 0, 58); x.stroke();   // the cleft
    x.fillStyle = '#4CAF6A'; ol(5); x.beginPath(); x.ellipse(18, -58, 26, 11, -.5, 0, 6.29); x.fill(); x.stroke();                          // leaf
    x.fillStyle = INK; for (const ex of [-30, 30]) { x.beginPath(); x.arc(ex, -4, 5, 0, 6.29); x.fill(); }                                   // eyes
    x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); if (w > .6) x.arc(0, 26, 10, 0, 6.29); else x.arc(0, 14, 13, .2, Math.PI - .2); x.stroke();   // smile, or an "oh" when sprayed hard
    if (w > .3) { x.fillStyle = `rgba(255,70,120,${.55 * w})`; for (const bx of [-46, 46]) { x.beginPath(); x.arc(bx, 12, 11, 0, 6.29); x.fill(); } }  // blush
    if (w > 0) { x.fillStyle = `rgba(150,215,245,${.85 * w})`; x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 2; for (let i = 0; i < 6; i++) { const yy = -40 + i * 18 + (t * 60 % 18); x.beginPath(); x.arc(-40 + rnd(i) * 80, yy, 5, 0, 6.29); x.fill(); x.stroke(); } }
    x.restore();
  }

  // ---------- the pump ----------
  // A household automatic pump with a round steel pressure tank drawn as a section (wall, water, air), pump head with its
  // air-intake valve and drain plug, motor, pressure switch with its gauge. cyc 0..1 = how hard it cycles.
  // o: phase (clicks, in cycles; the first half of each is "on"), level 0..1 (tank water, .86 = waterlogged), plug 0..1 (turn),
  //    flow 0..1 (water from the spout), basin 0..1 (water in the basin), puff 0..1 (air entering the valve), needle (radians), slab
  function pump(px, gy, s, t, cyc = 0, o = {}) {
    const ph = o.phase != null ? o.phase : t * 1.6, on = cyc > 0 && (((ph % 1) + 1) % 1) < .5, jig = on ? Math.sin(t * 90) * 3 * cyc : 0;
    const level = o.level != null ? o.level : .86, plug = o.plug || 0, flow = o.flow || 0, TC = [-20, -330];
    const pipe = (x1, y1, x2, y2, w = 24) => { x.lineCap = 'butt'; x.strokeStyle = INK; x.lineWidth = w + 10; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
      x.strokeStyle = '#3F8FD8'; x.lineWidth = w; x.stroke(); x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 4; x.beginPath(); x.moveTo(x1, y1 - w * .25); x.lineTo(x2, y2 - w * .25); x.stroke(); };
    x.save(); x.translate(px + jig, gy); x.scale(s, s); ol(6);
    if (o.slab) { x.fillStyle = '#C8C4B8'; x.beginPath(); x.roundRect(-220, 10, 440, 24, 5); x.fill(); x.stroke();
      x.strokeStyle = 'rgba(30,27,46,.22)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-90, 14); x.lineTo(-96, 24); x.lineTo(-86, 33); x.moveTo(120, 12); x.lineTo(112, 22); x.stroke(); ol(6); }
    x.fillStyle = '#6B7180'; x.beginPath(); x.roundRect(-190, -20, 380, 30, 6); x.fill(); x.stroke();                          // base plate
    x.fillStyle = CHROME2; for (const bx of [-172, -40, 40, 172]) { x.beginPath(); x.arc(bx, -5, 5, 0, 6.29); x.fill(); }
    pipe(-320, -90, -170, -90);                                                                                                // inlet pipe
    ol(5); x.fillStyle = '#2F78BF'; x.beginPath(); x.roundRect(-262, -112, 16, 44, 4); x.fill(); x.stroke();                     // union nut
    ol(6); x.fillStyle = '#2F78BF'; x.beginPath(); x.roundRect(-170, -150, 150, 130, 16); x.fill(); x.stroke();                    // pump head
    x.fillStyle = '#E9EDF2'; x.beginPath(); x.roundRect(-30, -170, 200, 150, 30); x.fill(); x.stroke();                            // motor
    x.strokeStyle = 'rgba(30,27,46,.35)'; x.lineWidth = 4; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(110 + i * 9, -150); x.lineTo(110 + i * 9, -40); x.stroke(); }
    ol(5); x.fillStyle = '#D8B456'; x.beginPath(); x.roundRect(-149, -184, 28, 38, 5); x.fill(); x.stroke();                      // air-intake valve
    x.fillStyle = '#B8923A'; x.beginPath(); x.roundRect(-153, -192, 36, 11, 4); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-142, -170); x.lineTo(-128, -170); x.stroke();
    // the tank: steel wall, then the section
    ol(6); x.fillStyle = '#2F78BF'; x.beginPath(); x.arc(TC[0], TC[1], 150, 0, 6.29); x.fill(); x.stroke();
    const ys = TC[1] + 136 - 272 * clamp(level), amp = 3.5 + 4 * cyc, off = (t * 34) % 56, airH = ys - (TC[1] - 136), watH = TC[1] + 136 - ys;
    x.save(); x.beginPath(); x.arc(TC[0], TC[1], 136, 0, 6.29); x.clip();
    x.fillStyle = '#EAF6FB'; x.fillRect(TC[0] - 140, TC[1] - 140, 280, 280);
    x.fillStyle = '#5DB7E6'; x.beginPath(); x.moveTo(TC[0] - 140, TC[1] + 140);
    for (let xx = TC[0] - 140; xx <= TC[0] + 140; xx += 4) x.lineTo(xx, ys + amp * Math.sin((xx + off) / 8.9));
    x.lineTo(TC[0] + 140, TC[1] + 140); x.closePath(); x.fill();
    x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); for (let xx = TC[0] - 140; xx <= TC[0] + 140; xx += 4) { const yy = ys + amp * Math.sin((xx + off) / 8.9); if (xx === TC[0] - 140) x.moveTo(xx, yy); else x.lineTo(xx, yy); } x.stroke();
    x.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 9; i++) { const f = (t * (.28 + rnd(i + 20) * .3) + i * .37) % 1, bx = TC[0] - 80 + rnd(i + 4) * 160 + Math.sin(t * 2 + i) * 4, by = TC[1] + 130 - f * Math.max(0, watH - 8); if (watH > 30) { x.beginPath(); x.arc(bx, by, 3 + rnd(i) * 3, 0, 6.29); x.fill(); } }
    if (airH > 56) txt('อากาศ · air', TC[0], ys - Math.min(48, airH * .45), {size: 20, color: '#2F78BF', alpha: clamp((airH - 56) / 26)});
    if (watH > 56) txt('น้ำ · water', TC[0], ys + Math.min(60, watH * .4), {size: 20, color: '#FFFFFF', alpha: clamp((watH - 56) / 26)});
    x.restore();
    x.strokeStyle = 'rgba(30,27,46,.55)'; x.lineWidth = 3; x.beginPath(); x.arc(TC[0], TC[1], 136, 0, 6.29); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 3.5; x.lineCap = 'round'; x.beginPath(); x.arc(TC[0], TC[1], 143, 3.55, 4.15); x.stroke(); x.beginPath(); x.arc(TC[0], TC[1], 143, 4.3, 4.45); x.stroke();
    x.fillStyle = '#9CC8F0'; for (const sd of [-1, 1]) { x.fillRect(TC[0] + sd * 143 - 7, TC[1] - 3, 14, 6); for (let k = -1; k <= 1; k++) { x.fillStyle = '#EAF3FB'; x.beginPath(); x.arc(TC[0] + sd * 143, TC[1] + k * 17, 2.6, 0, 6.29); x.fill(); } x.fillStyle = '#9CC8F0'; }
    ol(5); x.fillStyle = '#D8B456'; x.beginPath(); x.roundRect(-36, -194, 32, 26, 5); x.fill(); x.stroke();                      // nipple under the tank
    // air going in at the valve
    if (o.puff > 0) for (let i = 0; i < 3; i++) { const f = ((o.puff * 2.2) + i / 3) % 1, k = f, bx = -135 + 62 * k + Math.sin(k * 6 + i) * 6, by = -196 - 52 * k;
      x.globalAlpha = clamp(1.6 - f * 1.6); x.fillStyle = '#FFFFFF'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(bx, by, 11 - 5 * f, 0, 6.29); x.fill(); x.stroke(); } x.globalAlpha = 1;
    // pressure switch, gauge, adjust screws, conduit to the motor
    x.strokeStyle = '#2A2A33'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(176, -250); x.quadraticCurveTo(206, -212, 150, -170); x.stroke();
    ol(5); x.fillStyle = '#E9EDF2'; x.beginPath(); x.roundRect(90, -300, 90, 110, 12); x.fill(); x.stroke();
    x.fillStyle = WHITE; x.beginPath(); x.arc(135, -258, 31, 0, 6.29); x.fill(); x.stroke();
    x.lineCap = 'butt'; x.lineWidth = 7; x.strokeStyle = '#E2463C'; x.globalAlpha = .55; for (const [a, b] of [[-2.5, -2.2], [-.95, -.65]]) { x.beginPath(); x.arc(135, -258, 22, a, b); x.stroke(); } x.globalAlpha = 1;
    x.strokeStyle = '#3DBE6B'; x.beginPath(); x.arc(135, -258, 22, -1.9, -1.3); x.stroke();
    const needle = o.needle != null ? o.needle : -1.6 + (on ? .4 : -.4) * cyc + Math.sin(t * 12) * .1 * cyc;
    x.strokeStyle = INK; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(135, -258); x.lineTo(135 + Math.cos(needle) * 25, -258 + Math.sin(needle) * 25); x.stroke();
    x.fillStyle = INK; x.beginPath(); x.arc(135, -258, 4.5, 0, 6.29); x.fill();
    for (const sx of [112, 158]) { ol(3); x.fillStyle = CHROME2; x.beginPath(); x.arc(sx, -207, 7, 0, 6.29); x.fill(); x.stroke(); x.beginPath(); x.moveTo(sx - 4, -207 - 2); x.lineTo(sx + 4, -207 + 2); x.stroke(); }
    ol(6); pipe(170, -110, 330, -110);                                                                                          // outlet
    // drain plug (a hex nut with a slot) and its spout
    x.lineCap = 'butt'; x.strokeStyle = INK; x.lineWidth = 19; x.beginPath(); x.moveTo(-160, -37); x.lineTo(-178, -27); x.stroke(); x.strokeStyle = '#D8B456'; x.lineWidth = 11; x.stroke();
    x.save(); x.translate(-150, -35); x.rotate(plug * Math.PI / 2); ol(5); x.fillStyle = '#D8B456'; x.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; x.lineTo(Math.cos(a) * 18, Math.sin(a) * 18); } x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-10, 0); x.lineTo(10, 0); x.stroke(); x.restore();
    // the basin under the spout, and the stream into it
    const bc = [-216, 8];
    ol(5); x.fillStyle = '#E8833A'; x.beginPath(); x.moveTo(bc[0] - 64, bc[1]); x.lineTo(bc[0] - 54, bc[1] + 32); x.ellipse(bc[0], bc[1] + 32, 54, 13, 0, Math.PI, 0, true); x.lineTo(bc[0] + 64, bc[1]); x.ellipse(bc[0], bc[1], 64, 16, 0, 0, Math.PI, false); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#C9692A'; x.beginPath(); x.ellipse(bc[0], bc[1], 64, 16, 0, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = '#7A3E18'; x.beginPath(); x.ellipse(bc[0], bc[1], 54, 11, 0, 0, 6.29); x.fill();
    const bw = clamp(o.basin || 0); if (bw > 0) { x.fillStyle = '#5DB7E6'; x.beginPath(); x.ellipse(bc[0], bc[1] + 2 - bw * 2, 54 - 4 * (1 - bw), 11 - 2 * (1 - bw), 0, 0, 6.29); x.fill(); }
    if (flow > .02) { x.lineCap = 'round'; x.strokeStyle = '#5DB7E6'; x.lineWidth = 4 + 6 * flow; x.beginPath(); x.moveTo(-180, -24); x.quadraticCurveTo(-190, -10, -198, bc[1] + 2); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-181, -24); x.quadraticCurveTo(-190, -12, -197, bc[1] + 1); x.stroke();
      x.fillStyle = 'rgba(120,196,230,.9)'; for (let i = 0; i < 4; i++) { const f = (t * 2.4 + i / 4) % 1, bx = -198 + (rnd(i + 2) - .5) * 70 * f, by = bc[1] - Math.sin(f * Math.PI) * 26 * flow; x.beginPath(); x.arc(bx, by, 3.5, 0, 6.29); x.fill(); } }
    if (on) { x.strokeStyle = INK; x.lineWidth = 6; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(-20, -330, 175 + i * 22, d > 0 ? -.5 : Math.PI - .5, d > 0 ? .5 : Math.PI + .5); x.globalAlpha = (.6 - i * .18) * clamp(cyc * 1.5); x.stroke(); } x.globalAlpha = 1; }
    x.restore();
    return on;
  }
  // the drain's hairball: a dark wet clump, long brown and silver hair over it, a pink feather stuck in
  // o: sq 0..1 squash (wide and flat), fs feather scale, drip (false hides the drops), sway
  function hairball(px, py, s, t, lift, o = {}) {
    const sq = o.sq || 0, fs = o.fs != null ? o.fs : .9, R = 68, N = 9;
    x.save(); x.translate(px, py); x.scale(s * (1 + .15 * sq), s * (1 - .15 * sq));
    const pts = []; for (let i = 0; i < N; i++) { const a = i / N * 6.283, r = R * (.84 + .3 * rnd(i + 11)); pts.push([Math.cos(a) * r, Math.sin(a) * r * .92]); }
    const blob = () => { x.beginPath(); x.moveTo((pts[N - 1][0] + pts[0][0]) / 2, (pts[N - 1][1] + pts[0][1]) / 2); for (let i = 0; i < N; i++) { const a = pts[i], b = pts[(i + 1) % N]; x.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } x.closePath(); };
    blob(); x.fillStyle = '#4A3328'; x.fill(); x.strokeStyle = '#2E1F18'; x.lineWidth = 5; x.lineJoin = 'round'; x.stroke();
    x.lineCap = 'round';
    for (let i = 0; i < 30; i++) { const a = rnd(i) * 6.28, r = 16 + rnd(i + 3) * 50, w = Math.sin(t * 3 + i) * 3 * (o.sway == null ? 1 : o.sway);
      x.strokeStyle = i % 5 === 0 ? '#DDD4C2' : i % 4 === 0 ? '#2B1E18' : '#65463A'; x.lineWidth = i % 5 === 0 ? 3.2 : 4.4;
      x.beginPath(); x.moveTo(Math.cos(a) * r * .25, Math.sin(a) * r * .25); x.bezierCurveTo(Math.cos(a + 1) * r, Math.sin(a + 1) * r, Math.cos(a + 2) * r * 1.1, Math.sin(a + 2.3) * r * 1.1, Math.cos(a + 3) * (R * .95) + w, Math.sin(a + 3) * (R * .92) + 6 + w); x.stroke(); }
    x.strokeStyle = 'rgba(214,190,170,.75)'; x.lineWidth = 3.4;                                                                  // wet sheen
    for (const [a0, a1, rr] of [[3.5, 4.2, 48], [4.4, 4.8, 36], [3.0, 3.3, 56]]) { x.beginPath(); x.arc(0, 0, rr, a0, a1); x.stroke(); }
    x.fillStyle = 'rgba(255,255,255,.7)'; for (const [dx, dy] of [[-30, -34], [22, -40], [-44, 4]]) { x.beginPath(); x.arc(dx, dy, 3, 0, 6.29); x.fill(); }
    const fr = .75 + Math.sin(t * 3) * .06, fd = 78 * fs - 22; L.feather(Math.sin(fr) * fd, -Math.cos(fr) * fd - 6, fr, fs);
    if (o.drip !== false) for (let i = 0; i < 5; i++) { const f = (t * 1.4 + i / 5) % 1, dx = -34 + i * 17, dy = 52 + f * 150; x.fillStyle = 'rgba(120,196,230,.92)'; x.strokeStyle = 'rgba(30,27,46,.5)'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(dx, dy - 11); x.quadraticCurveTo(dx + 8, dy + 2, dx, dy + 8); x.quadraticCurveTo(dx - 8, dy + 2, dx, dy - 11); x.fill(); x.stroke(); }
    x.restore();
  }

  // ---------- machines that try ----------
  function robotVac(px, gy, s, t, o = {}) {          // a round robot vacuum, 3/4 view, driving right. o.aim -1..1 turns the lidar turret; o.lid lifts the lid (px); o.dead = X eye; o.tilt rocks the body; o.spin kept for older callers
    x.save(); x.translate(px, gy); x.scale(s, s); x.rotate(o.tilt || 0); ol(6);
    const lid = o.lid || 0, aim = o.aim != null ? o.aim : Math.sin(o.spin || 0);
    x.fillStyle = 'rgba(30,27,46,.18)'; x.beginPath(); x.ellipse(0, 6, 150, 34, 0, 0, 6.29); x.fill();
    x.fillStyle = INK; for (const d of [-1, 1]) { x.beginPath(); x.roundRect(d * 100 - 16, -8, 32, 20, 7); x.fill(); }          // the two drive wheels peeking out under the rim
    x.fillStyle = '#3A3D4A'; x.beginPath(); x.ellipse(0, -14, 150, 46, 0, 0, Math.PI); x.lineTo(-150, -40); x.ellipse(0, -40, 150, 46, 0, Math.PI, 0, true); x.closePath(); x.fill(); x.stroke();
    x.lineCap = 'round'; x.beginPath(); x.ellipse(0, -27, 146, 42, 0, .12, 1.45); x.strokeStyle = INK; x.lineWidth = 22; x.stroke(); x.strokeStyle = '#8E94A4'; x.lineWidth = 13; x.stroke();   // the front bumper
    for (const a of [.62, 1.0]) { const wx = Math.cos(a) * 146, wy = -27 + Math.sin(a) * 42; x.fillStyle = INK; x.beginPath(); x.ellipse(wx, wy, 10, 6, 0, 0, 6.29); x.fill(); x.fillStyle = '#6FB8E8'; x.beginPath(); x.arc(wx - 2, wy - 1, 2.2, 0, 6.29); x.fill(); }   // cliff / wet-floor sensor windows
    ol(6);
    if (lid > 0) { x.fillStyle = '#1E1B2E'; x.beginPath(); x.ellipse(0, -40, 150, 46, 0, 0, 6.29); x.fill(); }
    x.fillStyle = '#F2F3F6'; x.beginPath(); x.ellipse(0, -40 - lid, 150, 46, 0, 0, 6.29); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(30,27,46,.18)'; x.lineWidth = 3; x.beginPath(); x.ellipse(0, -40 - lid, 118, 34, 0, 0, 6.29); x.stroke(); ol(6);                                                    // the lid's seam
    x.fillStyle = '#DADDE5'; x.beginPath(); x.ellipse(-86, -36 - lid, 24, 8, 0, 0, 6.29); x.fill(); x.lineWidth = 3; x.stroke();                                                     // power button, its LED
    x.fillStyle = o.dead ? '#B5524A' : '#4CC38A'; x.beginPath(); x.arc(-86, -37 - lid, 3.4, 0, 6.29); x.fill();
    x.fillStyle = '#C3C8D2'; for (const d of [0, 1]) { x.beginPath(); x.ellipse(-46 + d * 24, -30 - lid, 7, 3.4, 0, 0, 6.29); x.fill(); }
    const tx = aim * 30, ty = -50 - lid;                                                                                                                                             // lidar turret under its cap
    x.fillStyle = '#3A3D4A'; x.lineWidth = 6; x.beginPath(); x.ellipse(tx, ty, 40, 13, 0, 0, Math.PI); x.lineTo(tx - 40, ty - 18); x.ellipse(tx, ty - 18, 40, 13, 0, Math.PI, 0, true); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#4A4E5E'; x.beginPath(); x.ellipse(tx, ty - 18, 40, 13, 0, 0, 6.29); x.fill(); x.stroke();
    x.fillStyle = '#1E1B2E'; x.beginPath(); x.roundRect(tx - 26 + aim * 6, ty - 12, 52, 8, 4); x.fill();                                                                            // the slit the laser looks out of
    const ex = tx + aim * 17, ey = ty - 8;
    if (o.dead) { x.fillStyle = '#FF6B6B'; x.beginPath(); x.arc(ex, ey, 9, 0, 6.29); x.fill(); x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(ex - 7, ey - 7); x.lineTo(ex + 7, ey + 7); x.moveTo(ex + 7, ey - 7); x.lineTo(ex - 7, ey + 7); x.stroke(); }
    else { x.fillStyle = o.eye || '#6FE3C8'; x.beginPath(); x.arc(ex, ey, 6.5, 0, 6.29); x.fill(); }
    x.strokeStyle = INK; x.lineWidth = 4; for (let i = 0; i < 3; i++) { const a = (o.dead ? 0 : t) * 9 + i * 2.1; x.beginPath(); x.moveTo(-120 + Math.cos(a) * 26, 6 + Math.sin(a) * 6); x.lineTo(-120 - Math.cos(a) * 26, 6 - Math.sin(a) * 6); x.stroke(); } // side brush
    x.restore();
  }
  function laptop(px, gy, s, screen) {              // origin = the middle of the front edge of the base. screen(x, y, w, h) draws into the 464 x 386 display
    x.save(); x.translate(px, gy); x.scale(s, s); ol(6);
    x.fillStyle = '#C9CED8'; x.beginPath(); x.moveTo(-285, 0); x.lineTo(285, 0); x.lineTo(262, -58); x.lineTo(-262, -58); x.closePath(); x.fill(); x.stroke();   // base, top face
    x.fillStyle = '#A9B0BC'; x.beginPath(); x.roundRect(-285, 0, 570, 10, [0, 0, 8, 8]); x.fill(); x.stroke();                                                  // its front lip
    const rows = [[-48, 12, 14], [-32, 12, 14], [-16, 12, 12]];                                                                                                    // three rows of keycaps, narrower toward the back
    rows.forEach(([ry, kh, n], j) => { const f = 1 - (j + .6) / 4.2, half = 252 * (.94 + .06 * (1 - f)), kw = (2 * half - n * 4) / n;
      for (let i = 0; i < n; i++) { if (j === 2 && i > 3 && i < n - 4) continue; x.fillStyle = '#F2F3F6'; x.strokeStyle = 'rgba(30,27,46,.55)'; x.lineWidth = 2; x.beginPath(); x.roundRect(-half + i * (kw + 4), ry, kw, kh, 3); x.fill(); x.stroke(); }
      if (j === 2) { const a = -half + 4 * (kw + 4), b = half - 4 * (kw + 4) - 4; x.beginPath(); x.roundRect(a, ry, b - a, kh, 3); x.fillStyle = '#F2F3F6'; x.fill(); x.stroke(); } });
    x.fillStyle = '#B8BEC9'; x.strokeStyle = 'rgba(30,27,46,.45)'; x.lineWidth = 2; x.beginPath(); x.roundRect(-52, -2, 104, 0, 4); x.stroke();
    x.fillStyle = '#2B2E3A'; x.beginPath(); x.roundRect(-250, -480, 500, 424, 18); x.fill(); ol(6); x.stroke();
    x.save(); x.beginPath(); x.rect(-232, -462, 464, 386); x.clip(); x.fillStyle = '#F7F7FA'; x.fillRect(-232, -462, 464, 386); if (screen) screen(-232, -462, 464, 386); x.restore();
    x.restore();
  }
  // ---------- phones and the motdang screens ----------
  function phone(px, py, w, h, draw, o = {}) {       // a phone, screen origin at (0,0) inside draw(); o.thin = a thinner bezel for small phones
    const bz = o.thin ? clamp(w * .06, 6, 18) : 18, rs = o.thin ? Math.min(32, w * .16) : 32;
    x.save(); x.translate(px, py); x.rotate(o.rot || 0);
    x.fillStyle = INK; x.beginPath(); x.roundRect(-w / 2 - bz, -h / 2 - bz, w + 2 * bz, h + 2 * bz, rs + bz * .78); x.fill();
    x.fillStyle = '#3A3D4A'; x.beginPath(); x.roundRect(-w / 2 - bz * .67, -h / 2 - bz * .67, w + bz * 1.33, h + bz * 1.33, rs + bz * .45); x.fill();
    x.save(); x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, rs); x.clip(); x.translate(-w / 2, -h / 2); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, w, h); draw(w, h); x.restore();
    const nw = clamp(w * .19, 26, 92), nh = clamp(w * .04, 7, 22);
    x.fillStyle = INK; x.beginPath(); x.roundRect(-nw / 2, -h / 2 + 8, nw, nh, nh / 2); x.fill();
    x.restore();
  }
  function ant(px, py, s, t = 0) {                   // the red ant (mot daeng), in the site's ant red
    x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#C13A2E'; x.strokeStyle = INK; x.lineWidth = 3; x.lineCap = 'round';
    for (let i = 0; i < 3; i++) for (const d of [-1, 1]) { const w = Math.sin(t * 14 + i * 2 + (d > 0 ? 1 : 0)) * 4; x.beginPath(); x.moveTo(-6 + i * 10, 0); x.lineTo(-12 + i * 12 + w, d * 18); x.lineTo(-18 + i * 14 + w, d * 22); x.stroke(); }
    x.beginPath(); x.ellipse(-18, 0, 13, 10, 0, 0, 6.29); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(2, 0, 9, 7, 0, 0, 6.29); x.fill(); x.stroke();
    x.beginPath(); x.arc(18, -2, 9, 0, 6.29); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(22, -8); x.quadraticCurveTo(30, -22, 36, -20); x.moveTo(24, -6); x.quadraticCurveTo(36, -14, 40, -10); x.stroke();
    x.restore();
  }
  function mdBar(w, title = 'motdang') {             // motdang's header as the site draws it: cream, the tin-chok stripe on top, ink type
    x.fillStyle = '#FAF5EA'; x.fillRect(0, 0, w, 100);
    for (let sx = 0; sx < w; sx += 68) { x.fillStyle = '#C13A2E'; x.fillRect(sx, 0, Math.min(44, w - sx), 8); if (sx + 52 < w) { x.fillStyle = '#C08A2D'; x.fillRect(sx + 52, 0, Math.min(8, w - sx - 52), 8); } }
    x.fillStyle = '#E3D5BC'; x.fillRect(0, 97, w, 3);
    ant(54, 58, 1.2); txt('มดแดง', 112, 46, {size: 36, color: '#2A1E16', align: 'left'}); txt(title, 112, 80, {size: 22, color: '#7D6B51', weight: 600, align: 'left'});
  }
  function searchBox(w, y, q, caret) {
    x.fillStyle = '#FFFDF7'; x.strokeStyle = '#E3D5BC'; x.lineWidth = 3; x.beginPath(); x.roundRect(24, y, w - 48, 80, 40); x.fill(); x.stroke();
    x.strokeStyle = '#7D6B51'; x.lineWidth = 5; x.beginPath(); x.arc(68, y + 36, 13, 0, 6.29); x.moveTo(78, y + 46); x.lineTo(90, y + 58); x.stroke();
    txt(q + (caret ? '|' : ''), 112, y + 41, {size: 38, align: 'left', color: '#2A1E16'});
  }
  function pinAt(px, py, s, col = '#C13A2E', pulse = 0) {
    if (pulse > 0) { x.strokeStyle = col; x.lineWidth = 4; x.globalAlpha = 1 - pulse; x.beginPath(); x.ellipse(px, py, 20 + pulse * 50, 8 + pulse * 18, 0, 0, 6.29); x.stroke(); x.globalAlpha = 1; }
    x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 4;
    x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-8, -18, -24, -28, -24, -46); x.arc(0, -46, 24, Math.PI, 0); x.bezierCurveTo(24, -28, 8, -18, 0, 0); x.fill(); x.stroke();
    x.fillStyle = K.white; x.beginPath(); x.arc(0, -46, 9, 0, 6.29); x.fill(); x.restore();
  }
  // a doodle-map tile: cream ground, the moobaan's sois, a canal; route 0..1 draws the line home
  const ROUTE = [[40, 520], [150, 520], [150, 360], [300, 360], [300, 250], [430, 250], [430, 170]];
  function mdMap(w, y, h, o = {}) {
    x.save(); x.beginPath(); x.rect(0, y, w, h); x.clip(); x.translate(0, y);
    x.fillStyle = '#F5ECD6'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#BFE3C9'; x.beginPath(); x.ellipse(w * .78, h * .72, 120, 70, .3, 0, 6.29); x.fill();
    x.strokeStyle = '#8CCBEA'; x.lineWidth = 18; x.beginPath(); x.moveTo(-20, h * .82); x.quadraticCurveTo(w * .4, h * .7, w + 20, h * .9); x.stroke();
    x.strokeStyle = '#FFFFFF'; x.lineCap = 'round'; x.lineWidth = 22; x.beginPath();
    for (const [a, b, c, d] of [[0, 520, w, 520], [150, 0, 150, 620], [300, 120, 300, 520], [150, 360, w, 360], [300, 250, w, 250], [430, 90, 430, 360], [0, 170, w, 170]]) { x.moveTo(a, b * h / 620); x.lineTo(c, d * h / 620); }
    x.stroke(); x.strokeStyle = '#E2D6B8'; x.lineWidth = 3; x.stroke();
    for (let i = 0; i < 14; i++) { x.fillStyle = ['#F6C6A8', '#E7D2F0', '#CFE6F7'][i % 3]; const hx = 20 + (i % 7) * 76, hy = (i < 7 ? 200 : 400) * h / 620 + (rnd(i) - .5) * 20; x.fillRect(hx, hy, 40, 30); }
    if (o.route) { const pts = ROUTE.map(([a, b]) => [a, b * h / 620]); let len = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); len += d; }
      let left = len * clamp(o.route); x.strokeStyle = '#2F78BF'; x.lineWidth = 12; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); let last = pts[0];
      for (let i = 1; i < pts.length && left > 0; i++) { const u = Math.min(1, left / seg[i - 1]); last = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]; x.lineTo(last[0], last[1]); left -= seg[i - 1]; }
      x.stroke(); x.fillStyle = '#2F78BF'; x.strokeStyle = K.white; x.lineWidth = 5; x.beginPath(); x.arc(last[0], last[1], 14, 0, 6.29); x.fill(); x.stroke(); }
    if (o.pins) for (const [a, b, k] of o.pins) pinAt(a, b * h / 620, k || .9, '#C13A2E');
    if (o.home) pinAt(430, 170 * h / 620, 1.2, '#C13A2E', o.pulse || 0);
    x.restore();
  }
  function chip(px, py, s, bg = '#FFFDF7', fg = '#2A1E16', size = 28) {   // a pill chip as the site draws them: a line and a hard offset shadow
    x.font = `700 ${size}px ${L.HAND}`; const w = x.measureText(s).width + 32, h = size + 18;
    x.fillStyle = '#E3D5BC'; x.beginPath(); x.roundRect(px + 4, py + 4, w, h, h / 2); x.fill();
    x.fillStyle = bg; x.strokeStyle = '#E3D5BC'; x.lineWidth = 3; x.beginPath(); x.roundRect(px, py, w, h, h / 2); x.fill(); x.stroke();
    txt(s, px + w / 2, py + h / 2 + 1, {size, color: fg}); return w + 4;
  }
  function callBtn(px, py, r, col = '#2BB35A', pressed = 0) {
    x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(px, py, r * (1 - .12 * pressed), 0, 6.29); x.fill(); x.stroke();
    x.save(); x.translate(px, py); x.rotate(-.6); x.fillStyle = K.white; x.beginPath(); x.roundRect(-r * .42, -r * .12, r * .84, r * .24, r * .1); x.fill();
    x.beginPath(); x.roundRect(-r * .48, -r * .2, r * .26, r * .4, r * .1); x.roundRect(r * .22, -r * .2, r * .26, r * .4, r * .1); x.fill(); x.restore();
  }
  function row(w, y, title, sub, chips, o = {}) {    // a listing row: icon, name, chips, call
    const h = 170;
    x.fillStyle = o.hi ? '#FCF3DC' : '#FFFDF7'; x.fillRect(0, y, w, h); x.strokeStyle = '#E3D5BC'; x.lineWidth = 3; x.beginPath(); x.moveTo(24, y + h); x.lineTo(w - 24, y + h); x.stroke();
    x.fillStyle = '#2F78BF'; x.beginPath(); x.roundRect(24, y + 26, 72, 72, 16); x.fill();
    x.strokeStyle = K.white; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(42, y + 80); x.lineTo(70, y + 52); x.moveTo(62, y + 44); x.lineTo(80, y + 62); x.stroke();
    txt(title, 116, y + 50, {size: 38, align: 'left', color: '#2A1E16'}); txt(sub, 116, y + 91, {size: 28, align: 'left', color: '#7D6B51', weight: 600});
    let cx = 116; for (const c of chips) cx += chip(cx, y + 112, c) + 8;
    callBtn(w - 68, y + 78, 40, '#2BB35A', o.press || 0);
  }
  function calCard(px, py, s, a, o = {}) {           // a calendar event card
    if (a <= 0) return; x.save(); x.translate(px, py); x.scale(s * (.7 + .3 * back(a)), s * (.7 + .3 * back(a))); x.globalAlpha *= clamp(a * 2);
    x.fillStyle = INK; x.beginPath(); x.roundRect(-246, -96, 500, 200, 22); x.fill();
    x.fillStyle = K.white; x.beginPath(); x.roundRect(-250, -100, 500, 200, 22); x.fill(); x.strokeStyle = INK; x.lineWidth = 5; x.stroke();
    x.fillStyle = K.pink; x.beginPath(); x.roundRect(-250, -100, 24, 200, [22, 0, 0, 22]); x.fill();
    txt(o.day || 'Tue 13 Oct · อ. 13 ต.ค.', -206, -52, {size: 28, align: 'left', color: '#B0275E'});
    const title = o.title || '10:00  Plumber · ช่างประปา'; x.font = `700 32px ${L.HAND}`; const tw = x.measureText(title).width, ts = Math.min(32, 32 * 440 / tw);
    txt(title, -206, 0, {size: ts, align: 'left'});
    ant(-196, 56, .72, o.T || 0); txt(o.via || 'booked by Beer on motdang', -160, 56, {size: 24, align: 'left', color: '#6A6F80', weight: 600});
    x.restore();
  }
  function kanban(px, py, s, u) {                   // Beer's board: the PLUMBER card goes from TO DO to BOOKED. u = seconds since the cursor came in
    const ap = ease(u / .45), press = clamp((u - .45) / .3), mv = ease((u - .55) / .8), landed = u - 1.35;
    const cx = -115 + 230 * mv, cy = -88 - Math.sin(mv * Math.PI) * 56, rot = u < 1.35 ? Math.sin(mv * Math.PI) * .2 : 0;
    const sq = landed >= 0 && landed < .2 ? 1 + .08 * (1 - landed / .2) : (u > .45 && u < 1.35 ? 1.04 : 1);
    x.save(); x.translate(px, py); x.scale(s, s); x.lineJoin = 'round';
    x.fillStyle = '#F7F3EA'; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.roundRect(-230, -190, 460, 380, 16); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(0, -170); x.lineTo(0, 170); x.stroke();
    txt('TO DO', -115, -152, {size: 26}); txt('BOOKED', 115, -152, {size: 26, color: '#1E7D4A'});
    if (landed > 0) { const k = back(clamp(landed / .3)); x.save(); x.translate(196, -152); x.scale(k, k); x.fillStyle = '#2BB35A'; x.beginPath(); x.arc(0, 0, 14, 0, 6.29); x.fill(); x.strokeStyle = K.white; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(-6, 0); x.lineTo(-1, 6); x.lineTo(8, -6); x.stroke(); x.restore(); }
    const notes = [['#FFE58A', 'toilet paper', 'ทิชชู'], ['#C9F0E2', 'light bulb', 'หลอดไฟ']];     // the two that never get done: that is the joke
    notes.forEach(([c, en, th], i) => { const ny = 0 + i * 88; x.fillStyle = c; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.rect(-200, ny - 38, 170, 76); x.fill(); x.stroke();
      txt(en, -115, ny - 14, {size: 24}); txt(th, -115, ny + 18, {size: 24}); });
    if (mv > 0) { x.strokeStyle = 'rgba(30,27,46,.3)'; x.lineWidth = 3; x.setLineDash([8, 8]); x.strokeRect(-200, -126, 170, 76); x.setLineDash([]); }
    x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(sq, sq); x.fillStyle = '#FF9EC4'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.rect(-85, -38, 170, 76); x.fill(); x.stroke();
    txt('PLUMBER', 14, -12, {size: 26}); txt('ช่างประปา', 14, 18, {size: 24}); x.restore();
    if (landed >= 0 && landed < .28) { x.strokeStyle = INK; x.lineWidth = 4; x.lineCap = 'round'; const g = landed / .28;                       // three impact ticks off the top edge
      for (const [ox, a] of [[-70, -2.2], [0, -1.57], [70, -.94]]) { x.beginPath(); x.moveTo(115 + ox + Math.cos(a) * (8 + 6 * g), -88 - 44 + Math.sin(a) * (8 + 6 * g)); x.lineTo(115 + ox + Math.cos(a) * (18 + 14 * g), -88 - 44 + Math.sin(a) * (18 + 14 * g)); x.stroke(); } }
    const ca = (u > 0 ? 1 : 0) * (1 - clamp((u - 1.9) / .3));                                                                                       // the cursor: comes in, grabs the card's top-left corner, drags, lets go
    if (ca > 0) { const hx = cx + (-85 + 3) * sq, hy = cy + (-38 + 3) * sq, sx = -40 + (hx + 40) * 1, ax = hx + (1 - ap) * 150, ay = hy + (1 - ap) * 190;
      if (press > 0 && press < 1) { x.strokeStyle = INK; x.lineWidth = 3; x.globalAlpha = 1 - press; x.beginPath(); x.arc(hx, hy, 8 + 34 * press, 0, 6.29); x.stroke(); x.globalAlpha = 1; }
      x.save(); x.globalAlpha = ca; x.translate(ax, ay); x.fillStyle = K.white; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath();
      x.moveTo(0, 0); x.lineTo(0, 32); x.lineTo(8, 25); x.lineTo(14, 38); x.lineTo(21, 35); x.lineTo(15, 22); x.lineTo(26, 22); x.closePath(); x.fill(); x.stroke(); x.restore(); }
    x.restore();
  }
  function qr(px, py, s, scan) {                     // a PromptPay-style QR on a stand
    x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#123E7A'; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.roundRect(-110, -150, 220, 280, 16); x.fill(); x.stroke();
    txt('PromptPay', 0, -118, {size: 26, color: K.white});
    x.fillStyle = K.white; x.fillRect(-80, -90, 160, 160); x.fillStyle = '#111';
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) if (rnd(i * 13 + j * 7 + 3) > .5 || ((i < 3 || i > 8) && (j < 3 || j > 8))) x.fillRect(-72 + i * 12, -82 + j * 12, 12, 12);
    if (scan > 0 && scan < 1) { x.fillStyle = 'rgba(43,179,90,.5)'; x.fillRect(-84, -90 + scan * 160, 168, 8); }
    if (scan >= 1) { x.fillStyle = '#2BB35A'; x.beginPath(); x.arc(0, -10, 50, 0, 6.29); x.fill(); x.strokeStyle = K.white; x.lineWidth = 12; x.beginPath(); x.moveTo(-22, -10); x.lineTo(-4, 10); x.lineTo(26, -26); x.stroke(); }
    x.restore();
  }
  // a PromptPay tent card on a low red stool: the card leans back on a foot wedge. Origin on the floor under the stool.
  function qrStand(px, gy, s, scan) {
    x.save(); x.translate(px, gy); x.scale(s, s); x.lineJoin = 'round'; ol(5);
    x.fillStyle = 'rgba(30,27,46,.18)'; x.beginPath(); x.ellipse(0, 4, 92, 12, 0, 0, 6.29); x.fill();
    x.fillStyle = '#C21F2B'; for (const sd of [-1, 1]) { x.beginPath(); x.moveTo(sd * 52, -44); x.lineTo(sd * 66, -44); x.lineTo(sd * 60, 0); x.lineTo(sd * 44, 0); x.closePath(); x.fill(); x.stroke(); }   // legs
    x.beginPath(); x.moveTo(-50, -22); x.lineTo(50, -22); x.lineWidth = 6; x.stroke(); ol(5);                                                                                        // cross brace
    x.fillStyle = '#E2323E'; x.beginPath(); x.roundRect(-76, -64, 152, 24, 9); x.fill(); x.stroke();                                                                               // the seat
    x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.roundRect(-64, -60, 70, 6, 3); x.fill();
    x.fillStyle = '#0B2A55'; x.beginPath(); x.moveTo(95, -64); x.lineTo(103, -70); x.lineTo(103, -312); x.lineTo(95, -304); x.closePath(); x.fill();                                   // the card's thickness
    qr(0, -196 - 22, .86, scan);
    x.fillStyle = '#F4F1E6'; x.beginPath(); x.roundRect(-84, -88, 168, 24, 8); x.fill(); x.stroke();                                                                                // the foot wedge it leans on
    x.strokeStyle = 'rgba(30,27,46,.4)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-70, -76); x.lineTo(70, -76); x.stroke();
    x.restore();
  }
  // a puff of smoke that follows NaN everywhere (the running joke): three scalloped clouds on a lazy S, each trailing a thin wisp. Origin = where it leaves her.
  function smoke(px, py, s, t, heart = 0) {
    const ink = (a) => 'rgba(30,27,46,' + a + ')', path = (c, f, k) => ({ x: Math.sin(f * 5 + k) * 16 + f * 24, y: -f * 140 });
    x.save(); x.translate(px, py); x.scale(s, s); x.lineJoin = 'round'; x.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      const f = (t * .4 + k / 3) % 1, P = path(0, f, k), r = 16 + f * 26, al = 1 - f;
      x.strokeStyle = ink(.6 * al); x.lineWidth = 3; x.beginPath();                                                                                   // the wisp trailing behind the cloud
      for (let i = 0; i <= 8; i++) { const q = path(0, Math.max(0, f - i * .02), k), wx = q.x + Math.sin(i * .95 + f * 9 + k) * 6 * (i / 8), wy = q.y + r * .75 + i * 6; if (i) x.lineTo(wx, wy); else x.moveTo(wx, wy); }
      x.stroke();
      x.save(); x.translate(P.x, P.y); x.globalAlpha *= al;
      if (heart > 0 && k === 1) { const h = r * 1.15; x.fillStyle = '#FFB3D1'; x.strokeStyle = ink(.75); x.lineWidth = 4; x.beginPath(); x.moveTo(0, h * .9); x.bezierCurveTo(-h * 1.6, -h * .1, -h * .5, -h * 1.3, 0, -h * .4); x.bezierCurveTo(h * .5, -h * 1.3, h * 1.6, -h * .1, 0, h * .9); x.fill(); x.stroke(); }
      else {
        const R = r * .55, rho = r * .48, n = 6, off = Math.sqrt(rho * rho - R * R / 4);                                                              // six overlapping lobes; one outline round the whole
        x.scale(1, .86); x.beginPath();
        for (let i = 0; i < n; i++) { const a = i * 6.2832 / n + k, cx = Math.cos(a) * R, cy = Math.sin(a) * R;
          const a0 = Math.atan2(Math.sin(a - 3.1416 / n) * (R * Math.cos(3.1416 / n) + off) - cy, Math.cos(a - 3.1416 / n) * (R * Math.cos(3.1416 / n) + off) - cx);
          const a1 = Math.atan2(Math.sin(a + 3.1416 / n) * (R * Math.cos(3.1416 / n) + off) - cy, Math.cos(a + 3.1416 / n) * (R * Math.cos(3.1416 / n) + off) - cx);
          x.arc(cx, cy, rho, a0, a1 < a0 ? a1 + 6.2832 : a1); }
        x.closePath(); x.fillStyle = '#F6F7FB'; x.fill(); x.strokeStyle = ink(.8); x.lineWidth = 4; x.stroke();
        x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 3; x.beginPath(); x.arc(-r * .12, -r * .08, r * .62, 3.6, 4.5); x.stroke(); x.beginPath(); x.arc(-r * .12, -r * .08, r * .4, 3.4, 4.1); x.stroke();
      }
      x.restore();
    }
    x.restore();
  }
  function heart(px, py, r, col = K.pink) {
    x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(px, py + r); x.bezierCurveTo(px - r * 1.6, py - r * .2, px - r * .5, py - r * 1.3, px, py - r * .4);
    x.bezierCurveTo(px + r * .5, py - r * 1.3, px + r * 1.6, py - r * .2, px, py + r); x.fill(); x.stroke();
  }
  function star(px, py, r, fill, a = 1) {
    x.save(); x.globalAlpha *= a; x.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, an = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(px + Math.cos(an) * rr, py + Math.sin(an) * rr); } x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); } x.strokeStyle = INK; x.lineWidth = 4; x.setLineDash(fill ? [] : [8, 8]); x.stroke(); x.setLineDash([]); x.restore();
  }
  return { tiles, floorTiles, toilet, floorDrain, puddle, paperHolder, shower, windowSky, gecko, sprayHead, hose, stopValve, wallClip, spray, threadTape, drill, peach,
    pump, hairball, robotVac, laptop, phone, ant, mdBar, searchBox, pinAt, mdMap, chip, callBtn, row, calCard, kanban, qr, qrStand, smoke, heart, star };
}
