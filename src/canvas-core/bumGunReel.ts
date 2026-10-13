// THE BUM GUN REEL · สายฉีดชำระ. NaN's plumbing gives up, her machines try, Beer books a plumber on motdang,
// the plumber finds a house Google Maps cannot and puts in a bum gun. 1080 x 1920, 30 fps, silent.
// The grid: 120 bpm, a beat is 15 frames (half a second); every cut sits on a beat.
// Scenes live in bgr/act1-3.js; the NaN & Beer kit in bgr/lib.js (from motdang-comics), props in bgr/props.js.
import type { Film, Shot } from "./film";
// @ts-ignore
import { makeLib } from "./bgr/lib.js";
// @ts-ignore
import { makeProps } from "./bgr/props.js";
// @ts-ignore
import * as A1 from "./bgr/act1.js";
// @ts-ignore
import * as A2 from "./bgr/act2.js";
// @ts-ignore
import * as A3 from "./bgr/act3.js";

const FPS = 30, BPM = 120, W = 1080, H = 1920;
// [id, seconds, scene, day] — day 2 is Tuesday: the tops go pink, the brand trims stay
export const CUES: [string, number, (S: unknown) => void, 1 | 2][] = [
  ["01-monday", 7, A1.s1Monday, 1],
  ["02-robot", 5, A1.s2Robot, 1],
  ["03-laptop", 6, A1.s3Laptop, 1],
  ["04-beer", 10, A1.s4Beer, 1],
  ["05-booked", 5, A1.s5Booked, 1],
  ["06-ride", 8, A2.s6Ride, 2],
  ["07-fix", 7, A2.s7Fix, 2],
  ["08-install", 9, A3.s8Install, 2],
  ["09-how-to", 5, A3.s9HowTo, 2],      // 1 s (two beats) moved to 10-joy: the four cards come every 1.0 s, and shot 10 carries four gags
  ["10-joy", 6, A3.s10Joy, 2],
  ["11-stars", 5, A3.s11Stars, 2],
  ["12-end", 7, A3.s12End, 2],
];

// a film of some of the cues; the act films (bgrAct1-3) let one act be rendered on its own
export const makeReel = (title: string, cues: typeof CUES): Film => {
  let at = 0;
  const shots: Shot[] = cues.map(([id, secs, scene, day]) => {
    const start = at, end = (at += secs * FPS);
    return { id, start, end, draw: (ctx, local, env) => {
      ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
      const L = makeLib(ctx);
      if (day === 2) { L.NAN = { ...L.NAN, top: "#E2457A" }; L.BEER = { ...L.BEER, top: "#D9487E" }; }
      const Q = makeProps(ctx, L);
      L.page();
      scene({ x: ctx, L, Q, t: local / FPS, T: (start + local) / FPS, env });
    } };
  });
  return { meta: { title, W, H, fps: FPS, bpm: BPM, durationFrames: at, kind: "story", raster: "cpu" }, assets: { images: {} }, shots };
};
export const ACTS = { 1: CUES.slice(0, 5), 2: CUES.slice(5, 7), 3: CUES.slice(7) };
export const bumGunReel: Film = makeReel("bumGunReel", CUES);
bumGunReel.meta.poster = 73 * FPS + 120;
