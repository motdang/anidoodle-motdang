// A FILM OF DOODLER SCENES. Each shot is one spec held for whole beats; an hour range turns the day
// across it (sunrise to night in one shot). The scene's clock runs on through the cuts.
import type { Film } from "./film";
import { bkkDay, doodle, type Place } from "./mdd";

export type MdShot = { spec: string; beats: number; hours?: [number, number]; place?: Place; label?: string; push?: number; focus?: [number, number] };
export type MdFilmCfg = { title: string; W: number; H: number; fps: number; bpm: number; date: string; shots: MdShot[]; lw?: number; kind?: Film["meta"]["kind"] };

export const mdFilm = (cfg: MdFilmCfg): Film => {
  const beat = (60 * cfg.fps) / cfg.bpm, day = bkkDay(cfg.date);
  let at = 0;
  const shots = cfg.shots.map((s, i) => {
    const start = at, end = (at += s.beats * beat), len = end - start;
    return { id: `${i}-${s.spec}`, start, end, draw: (ctx: CanvasRenderingContext2D, local: number, env: Parameters<Film["shots"][0]["draw"]>[2]) => {
      const u = len > 1 ? local / (len - 1) : 0, hour = s.hours ? s.hours[0] + (s.hours[1] - s.hours[0]) * u : undefined;
      /* the camera leans in on one shot and out on the next; a film of one shot breathes in and back, so it loops */
      const push = s.push ?? 0.14, e = 0.5 - 0.5 * Math.cos(Math.PI * u), zoom = 1 + push * (cfg.shots.length === 1 ? 0.5 - 0.5 * Math.cos(2 * Math.PI * local / len) : i % 2 ? 1 - e : e);
      doodle(ctx, env, s.spec, { t: ((start + local) / cfg.fps) * 1000, day, hour, lw: cfg.lw, place: s.place, label: s.label, zoom, focus: s.focus });
    } };
  });
  return { meta: { title: cfg.title, W: cfg.W, H: cfg.H, fps: cfg.fps, bpm: cfg.bpm, durationFrames: at, kind: cfg.kind ?? (cfg.shots.length === 1 ? "loop" : "story"), raster: "cpu" }, assets: { images: {} }, shots };
};
