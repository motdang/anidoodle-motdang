// written by tools/md/ani.mjs film
import { mdFilm } from "./mdFilm";

export const mdStreet = mdFilm({
 "title": "mdStreet",
 "W": 1080,
 "H": 1920,
 "fps": 30,
 "bpm": 60,
 "date": "2026-10-10",
 "shots": [
  {
   "spec": "market@11",
   "beats": 3
  },
  {
   "spec": "clocktower",
   "beats": 3,
   "hours": [
    19,
    21
   ]
  },
  {
   "spec": "alley:kadluang@10",
   "beats": 3
  }
 ]
});
