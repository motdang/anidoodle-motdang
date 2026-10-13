// MOT DANG'S DOODLER inside a film. doodle() draws one of the auto-doodler's scenes (the front band's,
// or a place page's portrait) into a box of the frame, at a Bangkok hour of a given day, from the
// scene's own clock t (ms). Nothing reads a clock: the day and the hour are handed in.
//   spec "market"  "food:japanese"  "moat:katam@18.5"   set[:variant][@hour]
import type { Ctx, Env } from "./core";
import { makeMDD, RIDGE } from "./mddoodler.gen";

export type Place = { set: string; place: Record<string, unknown> };
export type DoodleOpts = {
  t: number;                       // the scene's clock, ms (its walkers, flags, water)
  day: number;                     // Bangkok midnight of the day drawn, ms (bkkDay)
  hour?: number;                   // Bangkok hour, 0-24; the spec's @hour wins
  box?: [number, number, number, number]; // x, y, w, h in film px; the whole frame by default
  lw?: number;                     // the doodler's own drawing width inside the box (how close the camera sits)
  place?: Place;                   // a place page's portrait: its scene and facts
  label?: string; title?: string; seed?: number; cr?: boolean;
  zoom?: number; focus?: [number, number]; // the camera: 1 = the whole drawing; focus as fractions of it (default the deck, centre)
};
type MDD = { D: any; SKY: any };

export const bkkDay = (ymd: string) => Date.parse(`${ymd}T00:00:00+07:00`);
export const parseSpec = (s: string) => { const m = /^([a-z][a-z0-9-]*)(?::([a-z0-9-]+))?(?:@([\d.]+))?$/.exec(s); if (!m) throw new Error(`doodle spec '${s}': set[:variant][@hour]`); return { set: m[1], variant: m[2] ?? "", hour: m[3] != null ? +m[3] : undefined }; };
export const mdd = (env: Env): MDD => { let m = env.cache.get("mdd") as MDD | undefined; if (!m) { m = makeMDD(() => env.canvas(1, 1).canvas) as MDD; env.cache.set("mdd", m); } return m; };
export const sets = (env: Env): string[] => mdd(env).D.sets();
// the drawing width a frame shape reads best at: the phone band for tall frames, the desktop band for wide
export const bandWidth = (W: number, H: number) => (W >= H ? Math.min(1000, Math.round(560 * W / H)) : 480);

// sky by the sun's altitude, eased between the band's four lights (day, dusk, twilight, night)
const LIGHTS: [number, string, string][] = [[10, "#5f9fc2", "#8fbfd6"], [0, "#b9617a", "#e39a7a"], [-6, "#2a2650", "#4b3a6b"], [-12, "#121330", "#1d1f3f"]];
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, u: number) => { const p = hex(a), q = hex(b); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * u)).join(",")})`; };
const skyAt = (alt: number): [string, string] => {
  if (alt >= LIGHTS[0][0]) return [LIGHTS[0][1], LIGHTS[0][2]];
  for (let i = 0; i < LIGHTS.length - 1; i++) { const [a0, d0, s0] = LIGHTS[i], [a1, d1, s1] = LIGHTS[i + 1]; if (alt >= a1) { const u = (a0 - alt) / (a0 - a1); return [mixHex(d0, d1, u), mixHex(s0, s1, u)]; } }
  return [LIGHTS[3][1], LIGHTS[3][2]];
};

export const doodle = (ctx: Ctx, env: Env, spec: string, o: DoodleOpts) => {
  const { D, SKY } = mdd(env), p = parseSpec(spec), hour = p.hour ?? o.hour ?? 11, now = o.day + hour * 36e5;
  const [bx, by, bw, bh] = o.box ?? [0, 0, env.W, env.H], lw = o.lw ?? bandWidth(bw, bh), k = bw / lw, lh = bh / k;
  /* the doodler's own caches (the moat's water, a portrait's sky) key on the quarter hour: the scene is
     handed the quarter hour's moment and light, so a frame drawn cold matches one drawn warm */
  const lat = 18.79, lng = 98.99, q = Math.floor(now / 9e5) * 9e5, alt = D.sunAlt(q, lat, lng), skyAlt = D.sunAlt(now, lat, lng), night = alt < -4, phone = lw < 560;
  const z = Math.max(1, o.zoom ?? 1), [fx, fy] = o.focus ?? [0.5, phone ? 0.78 : 0.74], ox = fx * lw * (1 - z), oy = fy * lh * (1 - z);
  ctx.save();
  ctx.beginPath(); ctx.rect(bx * env.scale, by * env.scale, bw * env.scale, bh * env.scale); ctx.clip();
  ctx.setTransform(env.scale * k * z, 0, 0, env.scale * k * z, (bx + ox * k) * env.scale, (by + oy * k) * env.scale);
  if (o.place) { D.portrait(ctx, lw, lh, o.t, { set: o.place.set, place: o.place.place, ridge: RIDGE, now: q, alt }); ctx.restore(); return; }
  const [deep, sky] = skyAt(skyAlt), g = ctx.createLinearGradient(0, 0, 0, lh);
  g.addColorStop(0, deep); g.addColorStop(1, sky); ctx.fillStyle = g; ctx.fillRect(0, 0, lw, lh);
  if (skyAlt < -6) { const r = D.kit.rnd(9), a = Math.min(1, (-6 - skyAlt) / 6); for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,246,214,${(0.35 + 0.45 * r()) * a})`; ctx.fillRect(r() * lw, r() * lh * 0.5, 1.6, 1.6); } }
  SKY.landscape(ctx, lw, lh, { horizon: lh * (phone ? 0.6 : 0.64), night, pm25: 15, ridge: RIDGE, phone, cr: o.cr, x0: lw * 0.03, x1: lw * 0.97 });
  D.scene(ctx, lw, lh, o.t, { set: p.set, variant: p.variant, seed: o.seed ?? D.hash(spec.replace(/@.*/, "")), label: o.label ?? "", title: o.title ?? "",
    night, phone, deck: lh * (phone ? 0.84 : 0.86), x0: 0, x1: lw, alt, now: q, lat, lng });
  ctx.restore();
};
