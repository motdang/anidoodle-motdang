// AN ANIDOODLE FILM AS ONE OF THE DOODLER'S SCENES. Bundled by `ani.mjs scene` into
// mot-dang/assets/front/doodler-ani-<name>.js, it registers with MDDOODLER.addScene like any scene file:
// the band, the place portraits, doodler_sheet.py and the doodle repository draw it from then on.
// The film plays from the band's clock t, looping, inside the stage:
//   card    on a paper card standing on the deck, the landscape around it
//   stage   covering the stage
//   cutout  its paper keyed away, the subject standing on the deck in the landscape
// The film is handed the band's moment as env.md (night, alt, now, seed, phone, set, variant, place,
// label): a piece made for the band can read it; any other piece ignores it.
import type { Env, Layer } from "../canvas-core/core";
import { renderFrame, type Film } from "../canvas-core/film";

export type SceneOpts = { name: string; words?: string; math?: string; at?: number; fit?: "card" | "stage" | "cutout" };
type S = { c: CanvasRenderingContext2D; W: number; H: number; t: number; x0: number; x1: number; span: number; deck: number; night: boolean; phone: boolean; seed: number; set: string; variant: string; alt?: number; now: number; place?: unknown; label: string; hits: { k: string; x0: number; x1: number; y0: number; y1: number }[] };

const surface = (w: number, h: number): Layer => { const c = document.createElement("canvas"); c.width = Math.max(1, w); c.height = Math.max(1, h); return { canvas: c, ctx: c.getContext("2d")! } as Layer; };

// the film's own paper (its corner) faded to nothing, softly at the edge
const keyOut = (L: Layer) => {
  const { width: w, height: h } = L.canvas, im = L.ctx.getImageData(0, 0, w, h), d = im.data, r0 = d[0], g0 = d[1], b0 = d[2];
  for (let i = 0; i < d.length; i += 4) { const e = Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0); if (e < 60) d[i + 3] = Math.round(d[i + 3] * Math.max(0, (e - 24) / 36)); }
  L.ctx.putImageData(im, 0, 0);
};

export const sceneOf = (film: Film, o: SceneOpts) => {
  const w = window as unknown as { MDDOODLER?: { addScene: Function; ani?: Record<string, Film> } }, D = w.MDDOODLER;
  if (!D || (D.ani && D.ani[o.name])) return;
  const { W, H, fps, durationFrames: N } = film.meta, fit = o.fit ?? "card";
  let layer: Layer | null = null, cache = new Map<string, unknown>();
  const draw = (s: S) => {
    const c = s.c, dpr = (c.getTransform ? c.getTransform().a : 1) || 1, top = s.H * 0.05, bot = fit === "stage" ? s.H : s.deck;
    const k = fit === "stage" ? Math.max(s.span / W, s.H / H) : Math.min((s.span * 0.9) / W, (bot - top) / H) * (fit === "card" ? 0.9 : 1);
    const bw = W * k, bh = H * k, m = Math.max(3, bw * 0.035), bx = s.x0 + (s.span - bw) / 2, by = fit === "stage" ? (s.H - bh) / 2 : bot - bh - (fit === "card" ? m : 0);
    const pw = Math.round(bw * dpr), ph = Math.round(bh * dpr);
    if (pw < 8 || ph < 8) return;
    if (!layer || layer.canvas.width !== pw || layer.canvas.height !== ph) { layer = surface(pw, ph); cache = new Map(); }
    const env = { W, H, scale: pw / W, canvas: surface, cache,
      md: { night: s.night, alt: s.alt, now: s.now, seed: s.seed, phone: s.phone, set: s.set, variant: s.variant, place: s.place, label: s.label } } as Env;
    renderFrame(film, layer.ctx, Math.floor((s.t / 1000) * fps) % N, env);
    if (fit === "cutout") keyOut(layer);
    if (fit === "card") {
      c.save(); c.shadowColor = "rgba(20,12,4,.35)"; c.shadowBlur = m * 2; c.shadowOffsetY = m * 0.6;
      c.fillStyle = "#f4efe2"; c.fillRect(bx - m, by - m, bw + 2 * m, bh + 2 * m); c.restore();
    }
    c.drawImage(layer.canvas, bx, by, bw, bh);
    s.hits.push({ k: "event", x0: bx, x1: bx + bw, y0: by, y1: by + bh });
  };
  D.addScene(o.name, draw, o.words ? new RegExp(o.words, "i") : null, o.math ?? null, o.at ?? null);
  (D.ani = D.ani || {})[o.name] = film;
};
