// ANI ⇄ MOT DANG. The auto-doodler and anidoodle, both ways.
//
//   node tools/md/ani.mjs sets                                   the doodler's scenes, by name
//   node tools/md/ani.mjs film <name> <spec>... [options]        doodler scenes -> an anidoodle film
//   node tools/md/ani.mjs scene <film> --name <id> [options]     an anidoodle film -> a doodler scene
//   node tools/md/ani.mjs uninstall <id>                         take a scene back out of mot-dang
//   node tools/md/ani.mjs sync                                   re-read the doodler (runs by itself when it changes)
//
// film specs: set[:variant][@hour | @from-to][=beats]   market@16-20=6   food:japanese@12   moat:katam@5-9
//             p=<place page: cm/p/<slug> or its URL>[@hour][=beats]      a place page's portrait
// film options: --format 9x16|1x1|16x9|4x5 | --size WxH   --beats N (each spec, default 4)   --bpm 60  --fps 30
//               --date YYYY-MM-DD (default today)  --lw N (drawing width: smaller sits closer)  --push 0.14
//               --render mp4|gif|webm|apng|all   --still <frame>   --emit   --gate   --out <dir>
// scene options: --fit card|stage|cutout (default card)  --words <regex> (calendar words that call it)
//               --math "<line>"  --at <n>  --preview (a band PNG)  --install (into mot-dang/assets/front)
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { MOTDANG, stale, sync } from "./sync.mjs";

const FRONT = join(MOTDANG, "assets/front"), OUT = resolve("out");
const VAL = new Set(["format", "size", "beats", "bpm", "fps", "date", "lw", "push", "render", "still", "out", "name", "fit", "words", "math", "at"]);
const [verb, ...rest] = process.argv.slice(2), pos = [], opt = {};
for (let i = 0; i < rest.length; i++) { const a = rest[i]; if (a.startsWith("--")) opt[a.slice(2)] = VAL.has(a.slice(2)) ? rest[++i] : true; else pos.push(a); }
const die = (m) => { console.error(`ani: ${m}`); process.exit(1); };
const run = (args) => { const r = spawnSync("node", args, { stdio: "inherit" }); if (r.status) die(`${args.join(" ")} failed`); };
const ensureSync = () => { if (stale()) { const r = sync(); console.log(`synced the doodler: ${r.files} files`); } };

const bundle = async (contents, define = {}) => (await build({ stdin: { contents, resolveDir: process.cwd(), loader: "ts" }, bundle: true, format: "iife", target: "es2019", minify: true, write: false, legalComments: "none", define })).outputFiles[0].text;

// a stand-in canvas for reading the doodler's list in node: it records nothing and draws nothing
const nodeMDD = async () => {
  const js = await bundle(`import { makeMDD } from "./src/canvas-core/mddoodler.gen"; globalThis.__MDD = makeMDD;`);
  new Function(js)();
  const ctx = new Proxy({}, { get: (t, k) => (k === "getTransform" ? () => ({ a: 1 }) : typeof k === "string" && k.startsWith("create") ? () => ({ addColorStop() {} }) : () => {}) });
  return globalThis.__MDD(() => ({ width: 1, height: 1, getContext: () => ctx })).D;
};

const filmModule = (name) => {
  if (existsSync(`src/canvas-core/${name}.ts`)) return `./src/canvas-core/${name}`;
  for (const f of readdirSync("src/canvas-core").filter((n) => n.endsWith(".ts"))) if (new RegExp(`export const ${name}\\b`).test(readFileSync(`src/canvas-core/${f}`, "utf8"))) return `./src/canvas-core/${f.slice(0, -3)}`;
  die(`no film '${name}' in src/canvas-core`);
};

// a place page's portrait: its scene and facts, read from the canvas build.py wrote on it
const placeOf = async (ref) => {
  const url = /^https?:/.test(ref) ? ref : `https://motdang.net/${ref.replace(/^\/+/, "").replace(/(\.html)?$/, ".html")}`;
  const html = await (await fetch(url)).text(), m = /<canvas class="mdportrait" data-set="([^"]*)" data-p="([^"]*)"/.exec(html);
  if (!m) die(`${url}: no portrait on that page (it has a photograph, or the page moved)`);
  const un = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  return { set: un(m[1]), place: JSON.parse(un(m[2])) };
};

const FORMATS = { "1x1": [1080, 1080], "9x16": [1080, 1920], "16x9": [1920, 1080], "4x5": [1080, 1350] };

const film = async () => {
  const [name, ...specs] = pos;
  if (!name || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) die("film <name> <spec>...: the name is a bare identifier (mdMarketDay)");
  if (!specs.length) die("film: at least one spec (market, food:japanese@12, moat:katam@5-9, p=cm/p/<slug>)");
  ensureSync();
  const [W, H] = opt.size ? opt.size.split("x").map(Number) : FORMATS[opt.format ?? "9x16"] ?? die("--format 9x16|1x1|16x9|4x5, or --size WxH");
  const fps = +(opt.fps ?? 30), bpm = +(opt.bpm ?? 60), date = opt.date ?? new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
  const D = await nodeMDD(), known = new Set(D.sets());
  const shots = [];
  for (const s of specs) {
    const m = /^(p=[^@=]+|[a-z][a-z0-9-]*(?::[a-z0-9-]+)?)(?:@([\d.]+)(?:-([\d.]+))?)?(?:=(\d+))?$/.exec(s) ?? die(`spec '${s}'`);
    const shot = { spec: m[1], beats: +(m[4] ?? opt.beats ?? 4) };
    if (m[3] != null) shot.hours = [+m[2], +m[3]]; else if (m[2] != null) shot.spec += `@${m[2]}`;
    if (opt.push != null) shot.push = +opt.push;
    if (m[1].startsWith("p=")) { shot.place = await placeOf(m[1].slice(2)); shot.spec = shot.place.set + (m[2] != null && m[3] == null ? `@${m[2]}` : ""); }
    else if (!known.has(m[1].split(":")[0])) die(`'${m[1].split(":")[0]}' is not one of the doodler's scenes (ani.mjs sets)`);
    shots.push(shot);
  }
  const cfg = { title: name, W, H, fps, bpm, date, shots, ...(opt.lw ? { lw: +opt.lw } : {}) };
  writeFileSync(`src/canvas-core/${name}.ts`, `// written by tools/md/ani.mjs film\nimport { mdFilm } from "./mdFilm";\n\nexport const ${name} = mdFilm(${JSON.stringify(cfg, null, 1)});\n`);
  writeFileSync(`src/hosts/page-${name}.ts`, `import { ${name} } from "../canvas-core/${name}";\nimport { mountFilm } from "./page";\n\nmountFilm(${name});\n`);
  const secs = shots.reduce((a, s) => a + s.beats * 60 / bpm, 0);
  console.log(`${name}: ${shots.length} shot(s), ${secs} s, ${W}x${H} @ ${fps} fps, ${date}  -> src/canvas-core/${name}.ts`);
  const dir = resolve(opt.out ?? OUT); mkdirSync(dir, { recursive: true });
  if (opt.still != null) run(["tools/still.mjs", name, "--frame", String(opt.still), "--out", join(dir, `${name}-${opt.still}.png`)]);
  const fmts = opt.render === true ? ["mp4"] : opt.render === "all" ? ["mp4", "gif", "webm"] : opt.render ? opt.render.split(",") : opt.gate ? ["mp4"] : [];
  for (const f of fmts) run(["tools/render.mjs", name, "--out", join(dir, `${name}.${f}`)]);
  if (opt.gate) { if (dir !== OUT) copyFileSync(join(dir, `${name}.mp4`), join(OUT, `${name}.mp4`)); run(["tools/gate.mjs", name]); }
  if (opt.emit) run(["tools/emit.mjs", name, "--out", join(dir, `${name}.html`)]);
};

const scene = async () => {
  const [filmName] = pos, id = opt.name;
  if (!filmName || !id) die("scene <film> --name <id>");
  if (!/^[a-z][a-z0-9-]*$/.test(id)) die("--name: lower case, digits and dashes (it becomes the scene's name)");
  const fit = opt.fit ?? "card"; if (!["card", "stage", "cutout"].includes(fit)) die("--fit card|stage|cutout");
  if (filmName.startsWith("md") && existsSync(`src/canvas-core/${filmName}.ts`) && /mdFilm\(/.test(readFileSync(`src/canvas-core/${filmName}.ts`, "utf8"))) die(`${filmName} is drawn by the doodler already`);
  const file = `doodler-ani-${id}.js`, installed = existsSync(join(FRONT, file));
  const D = await nodeMDD(); if (D.sets().includes(id) && !installed) die(`'${id}' is a doodler scene already; pick another name`);
  if (opt.words) try { new RegExp(opt.words, "i"); } catch (e) { die(`--words: ${e.message}`); }
  const o = { name: id, fit, ...(opt.words ? { words: opt.words } : {}), ...(opt.math ? { math: opt.math } : {}), ...(opt.at != null ? { at: +opt.at } : {}) };
  const js = `/* ${id}: the anidoodle film '${filmName}' as a doodler scene (anidoodle-motdang, tools/md/ani.mjs scene; ${fit}) */\n` +
    await bundle(`import { ${filmName} as FILM } from "${filmModule(filmName)}"; import { sceneOf } from "./src/hosts/mdscene"; sceneOf(FILM, ${JSON.stringify(o)});`);
  mkdirSync(join(OUT, "scenes"), { recursive: true });
  const out = join(OUT, "scenes", file); writeFileSync(out, js);
  console.log(`${out}  ${(js.length / 1024).toFixed(0)} KB`);
  if (opt.preview) preview(id, out);
  if (opt.install) install(id, out);
};

// the scene on the band as the front page draws it, by day and by night, desktop and phone
const preview = (id, file) => {
  const scripts = ["skyline.js", "doodler.js"].map((n) => readFileSync(join(FRONT, n), "utf8")).join("\n") + "\n" + readFileSync(file, "utf8");
  const page = join(OUT, "scenes", `${id}-preview.html`), png = join(OUT, "scenes", `${id}-preview.png`);
  writeFileSync(page, `<!doctype html><meta charset=utf-8><body style="margin:0;background:#111"><script>${scripts}</script><script>
var cells = [[1000, 320, 11, 0], [1000, 320, 21, 0], [380, 300, 17, 1]], T = 4200;
cells.forEach(function (c) { var cv = document.createElement('canvas'); cv.width = c[0] * 2; cv.height = c[1] * 2; cv.style.cssText = 'display:block;margin:6px;width:' + c[0] + 'px'; document.body.appendChild(cv);
  var x = cv.getContext('2d'); x.setTransform(2, 0, 0, 2, 0, 0); var now = Date.parse('2026-10-10T00:00:00+07:00') + c[2] * 36e5, alt = MDDOODLER.sunAlt(now, 18.79, 98.99);
  MDDOODLER.full(x, c[0], c[1], T, { set: ${JSON.stringify(id)}, seed: 7, night: alt < -4, now: now, alt: alt, lat: 18.79, lng: 98.99 }); });
document.title = 'done';</script>`);
  execFileSync("node", ["--input-type=module", "-e", `
import { findPlaywright, findBrowser } from "./tools/detect.mjs";
const pw = findPlaywright(), br = findBrowser(pw.lib);
(async () => { const b = await pw.lib.chromium.launch({ executablePath: br.executablePath }); const p = await b.newPage({ viewport: { width: 1020, height: 1000 } });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); await p.goto("file://" + ${JSON.stringify(page)}); await p.waitForFunction(() => document.title === "done");
  await p.screenshot({ path: ${JSON.stringify(png)}, fullPage: true }); await b.close(); if (errs.length) { console.error(errs.join("\\n")); process.exit(1); } })();`], { stdio: "inherit" });
  console.log(`preview -> ${png}`);
};

const install = (id, file) => {
  const target = join(FRONT, `doodler-ani-${id}.js`), dj = join(FRONT, "doodler.js");
  copyFileSync(file, target);
  let src = readFileSync(dj, "utf8"); const entry = `'${id}': 'doodler-ani-${id}.js'`;
  if (!src.includes(entry)) { if (!/var FILES = \{ /.test(src)) die("doodler.js: no `var FILES = { ` to add the scene to"); src = src.replace("var FILES = { ", `var FILES = { ${entry}, `); writeFileSync(dj, src); }
  console.log(`installed: ${target}\n           FILES in ${dj} has '${id}'`);
};

const uninstall = () => {
  const [id] = pos, target = join(FRONT, `doodler-ani-${id}.js`), dj = join(FRONT, "doodler.js");
  if (!id || !existsSync(target)) die(`no ${target}`);
  rmSync(target); writeFileSync(dj, readFileSync(dj, "utf8").replace(`'${id}': 'doodler-ani-${id}.js', `, ""));
  console.log(`removed ${target} and its FILES entry`);
};

if (verb === "sync") { const r = sync(); console.log(`${r.files} doodler files, ${(r.bytes / 1024).toFixed(0)} KB`); }
else if (verb === "sets") { ensureSync(); const D = await nodeMDD(); const all = D.sets().sort(); console.log(all.join("  ")); console.log(`${all.length} scenes; variants: ${Object.keys(D.variants).join(", ") || "-"}`); }
else if (verb === "film") await film();
else if (verb === "scene") await scene();
else if (verb === "uninstall") uninstall();
else die("sets | film <name> <spec>... | scene <film> --name <id> | uninstall <id> | sync   (header of tools/md/ani.mjs)");
