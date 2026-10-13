import { bgrAct3 as bumGunReel } from "../canvas-core/bgrAct3";
import { mountFilm } from "./page";
import { MALI } from "./bgrFonts.gen";

// Mali (Thai + Latin) is decoded before frame 0: the film's ready waits on it as well as on its assets.
const fonts = Promise.all(MALI.map(([weight, unicodeRange, b64]) => {
  const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const f = new FontFace("Mali", u8.buffer, { weight, unicodeRange }); document.fonts.add(f); return f.load();
}));
mountFilm(bumGunReel);
const F = (window as unknown as { FILM: { ready: Promise<unknown> } }).FILM;
F.ready = Promise.all([F.ready, fonts]).then(([m]) => m);
