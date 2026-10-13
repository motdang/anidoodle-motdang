ANIDOODLE ⇄ MOT DANG DOODLER

Built 2026-10-10. The anidoodle engine (scaffolded from the skill) plus a bridge to the Mot Dang auto-doodler in mot-dang/assets/front. Commands run from this folder.

DOODLER TO ANIDOODLE

node tools/md/ani.mjs sets
  The doodler's scenes by name (104 on 2026-10-10).

node tools/md/ani.mjs film <name> <spec>... [options]
  A film of doodler scenes, one shot per spec. Spec: set[:variant][@hour | @from-to][=beats], or p=<place page> for a place portrait.
  Examples:
    node tools/md/ani.mjs film mdMarketDay market@6-20=8 --format 9x16 --render mp4
    node tools/md/ani.mjs film mdMoat moat:chaeng-katam@5-9=6 moat:suan-dok-gate@17-19=6 --format 1x1 --render all
    node tools/md/ani.mjs film mdShop p=cm/p/<slug> --format 4x5 --still 30
  Options: --format 9x16|1x1|16x9|4x5 or --size WxH · --beats N (each spec, default 4) · --bpm 60 · --fps 30 · --date YYYY-MM-DD (default today, Bangkok) · --lw N (smaller sits closer) · --push 0.14 (the camera's lean) · --render mp4|gif|webm|apng|all · --still <frame> · --emit (offline player) · --gate · --out <dir>
  An hour range turns the day across the shot. The camera leans in on one shot and out on the next. Silent.

DOODLER INSIDE ANY ANIDOODLE FILM

src/canvas-core/mdd.ts: doodle(ctx, env, spec, { t, day, hour, box, lw, place, zoom, focus }) draws a doodler scene into a box of the frame, so a film can put its own characters in front of the band's landscape.

ANIDOODLE TO DOODLER

node tools/md/ani.mjs scene <film> --name <id> [--fit card|stage|cutout] [--words <regex>] [--math "<line>"] [--preview] [--install]
  Packs an anidoodle film into doodler-ani-<id>.js, a scene file like the others. card: on a paper card on the deck. stage: covering the stage. cutout: its paper keyed away, standing in the landscape.
  --preview draws it on the band by day, by night and on a phone (out/scenes/<id>-preview.png).
  --install copies it into mot-dang/assets/front and adds it to FILES in doodler.js. Without --words no calendar event calls it; it is drawn when a curated day or a sheet names it. With --words, events whose words match get it.
  The film is handed the band's moment as env.md (night, alt, now, seed, phone, set, variant, place, label).
node tools/md/ani.mjs uninstall <id>
  Takes it back out.

An installed scene comes back through sync, so it can appear in a doodler film too.

SYNC

node tools/md/ani.mjs sync rewrites src/canvas-core/mddoodler.gen.ts from mot-dang/assets/front; film and sets run it when a doodler file is newer. The rewrite hands every drawing its moment, so the gate's contract scan reads the doodler too.

EXAMPLES ON DISK

out/mdStreet.mp4: market, the Chiang Rai clock tower at dusk, a Kad Luang soi; 9:16, 9 s; gate 14/14.
out/scenes/doodler-ani-koi-pond.js and koi-pond-preview.png: the koi plate as a band scene (not installed).
out/bumGunReel.mp4: the NaN & Beer bum gun reel (src/canvas-core/bumGunReel.ts, scenes in bgr/; bgrAct1-3 render one act each); 9:16, 80 s; gate 14/14. Copy with a silent audio track in ~/Desktop/1 — NEXT UP/bum gun reel/ (go/bum-gun-reel).
