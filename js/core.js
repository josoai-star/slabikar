/* Slabikář — jádro: pomůcky, uložený stav, co dítě zná, výběr úloh */
'use strict';

const $ = id => document.getElementById(id);
const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];
const rnd = n => Math.floor(Math.random() * n);
const pickOne = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* malý opakovatelný generátor náhody: stejný kamarád vypadá vždycky stejně */
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const dayStr = d => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const tod = () => { const h = new Date().getHours(); return h < 5 ? 'night' : h < 8 ? 'dawn' : h < 18 ? 'day' : h < 20 ? 'dusk' : 'night'; };

/* písmena */
const tokens = s => { const o = []; for (let i = 0; i < s.length;) { if (s.substr(i, 2) === 'CH') { o.push('CH'); i += 2; } else { o.push(s[i]); i++; } } return o; };
const base = t => NORM[t] || t;
const isV = t => 'AEIOUYÁÉĚÍÓÚŮÝ'.includes(t);
const low = s => s.toLocaleLowerCase('cs');
let LC = false;                                   /* právě teď malá písmena? */
const shown = t => LC ? low(t) : t;
const ctok = (t, x) => `<span class="${isV(t) ? 'v' : 'c'}${x ? ' ' + x : ''}">${shown(t)}</span>`;
const colorize = s => tokens(s).map(t => ctok(t)).join('');
const arcHTML = (syl, id, mk) => `<span class="arc"${id ? ` id="${id}"` : ''}>${syl.map((s, i) => `<span>${tokens(s).map((t, j) => ctok(t, mk && mk(i, j) ? 'mk' : '')).join('')}</span>`).join('')}</span>`;
const hiArc = id => i => { const el = typeof id === 'string' ? $(id) : id; if (!el) return; [...el.children].forEach((c, j) => c.classList.toggle('hi', j === i)); };

const WORDS = RAW.split('|').map(x => x.trim()).filter(Boolean).map(x => {
  const p = x.split(' '); const syl = p[0].split('-'); const word = syl.join('');
  return { syl, word, pic: p[1], t: tokens(word).map(base) };
});

/* ---------- uložený stav ---------- */
const KEY = 'slabikar-v1';
const DEF = {
  ver: 2, case: 'mix', known: 0, rate: 0.9, voice: '', own: false, round: 8, text: false,
  stats: {}, hist: [], stick: [],
  pos: 0, step: 0, pace: 3,          /* stanice na trati, kolikátá jízda k další, jízd na písmenko */
  stars: 0, medals: 0, rides: 0,
  pets: [], pid: 0, hats: [], train: [], gifts: 0,
  egg: null, eggDay: '',             /* zlaté vajíčko, které se líhne až další den */
  dayRides: { d: '', n: 0 }, limit: 0,
  seen: {}, sfx: true, mic: false, recPlay: false
};
let S;
(function load() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (!raw) { S = JSON.parse(JSON.stringify(DEF)); return; }
  S = Object.assign(JSON.parse(JSON.stringify(DEF)), raw);
  if (!raw.ver) {                                  /* starší verze: nic se neztratí */
    if (raw.known == null) S.known = ORDER.length;
    S.train = (raw.stick || []).map(e => ({ e }));
    S.stars = (raw.hist || []).reduce((a, h) => a + (h.s || 0), 0);
    S.rides = (raw.hist || []).length;
    S.medals = MEDALS.filter(m => m <= S.stars).length;
    S.ver = 2;
  }
  ['pets', 'hats', 'train', 'hist', 'stick'].forEach(k => { if (!Array.isArray(S[k])) S[k] = []; });
  if (!S.stats || typeof S.stats !== 'object') S.stats = {};
  if (!S.seen || typeof S.seen !== 'object') S.seen = {};
  if (!S.dayRides || typeof S.dayRides !== 'object') S.dayRides = { d: '', n: 0 };
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

/* ---------- co dítě zná ---------- */
const knownN = () => Math.max(S.known | 0, Math.min(S.pos, ORDER.length));
const knownSet = () => new Set([...VOW, ...ORDER.slice(0, knownN())]);
const words = () => { const k = knownSet(); return WORDS.filter(w => w.t.every(t => k.has(t))); };
const wordsAt = fn => { const k = knownSet(); return WORDS.filter(w => k.has(fn(w))); };   /* stačí znát jednu hlásku */
const cons = () => ORDER.slice(0, knownN()).filter(t => t !== 'Y');
const syls = () => cons().flatMap(c => VOW.map(v => c + v));
const mark = (k, ok) => { const s = S.stats[k] || (S.stats[k] = { r: 0, w: 0 }); ok ? s.r++ : s.w++; s.t = Date.now(); save(); };
const wt = k => { const s = S.stats[k]; if (!s) return 1.4; return Math.max(.3, 1 + 2.5 * s.w / (s.r + s.w) - Math.min(s.r, 6) * .08); };
const sumR = p => Object.entries(S.stats).filter(e => e[0].startsWith(p)).reduce((a, e) => a + e[1].r, 0);
const weakList = n => Object.entries(S.stats).filter(e => e[1].w > 0).sort((a, b) => (b[1].w - b[1].r * .5) - (a[1].w - a[1].r * .5)).slice(0, n);

let G = null;                                     /* právě běžící jízda */
/* vážený výběr: víc toho, co nejde, a toho, co se právě učí; nikdy dvakrát totéž za sebou */
function pick(arr, kf, boost) {
  for (let n = 0; n < 4; n++) {
    const ws = arr.map(x => wt(kf(x)) * (boost ? boost(x) : 1));
    let t = ws.reduce((a, b) => a + b, 0) * Math.random(); let r = arr[arr.length - 1];
    for (let i = 0; i < arr.length; i++) { t -= ws[i]; if (t <= 0) { r = arr[i]; break; } }
    const k = kf(r);
    if (!G || arr.length < 2 || (k !== G.lastKey && !(G.used && G.used.has(k) && n < 3))) { if (G) { G.lastKey = k; G.used && G.used.add(k); } return r; }
  }
  return pickOne(arr);
}
/* písmenko, na které se v téhle jízdě míří */
const focusL = () => G && G.focus !== undefined ? G.focus : zoneLetter(S.pos);
const fboost = (has, f) => f && has ? 3.2 : 1;

/* ---------- kamarádi ---------- */
const petById = id => S.pets.find(p => p.id === id);
function badName(n) { n = n.toUpperCase(); return NAMEBAD.some(b => n.includes(b)); }
/* tři jména ze slabik, které dítě zná (nebo právě pozná) */
function nameIdeas(z) {
  let cs = cons();
  const nx = ORDER[knownN()]; if (cs.length < 3 && nx && nx !== 'Y') cs = cs.concat([nx]);
  if (cs.length < 2) cs = cs.concat(['M', 'L'].filter(c => !cs.includes(c)));
  const L = zoneLetter(z); const first = L && L !== 'Y' && cs.includes(L) ? L : null;
  const have = new Set(S.pets.map(p => p.name.join('')));
  const out = []; let guard = 0;
  while (out.length < 3 && guard++ < 400) {
    const c1 = first && out.length < 2 ? first : pickOne(cs);
    const three = cs.length >= 5 && Math.random() < .22;
    const syl = [c1 + pickOne(VOW), pickOne(cs) + pickOne(VOW)]; if (three) syl.push(pickOne(cs) + pickOne(VOW));
    const n = syl.join('');
    if (badName(n) || have.has(n) || out.some(o => o.join('') === n)) continue;
    if (syl[0] === syl[1] && Math.random() < .6) continue;
    out.push(syl);
  }
  while (out.length < 3) out.push(['M' + pickOne(VOW), 'L' + pickOne(VOW)]);
  return out;
}
function newPet(z, rare) {
  const p = { id: ++S.pid, seed: (Math.random() * 4294967296) >>> 0, name: nameIdeas(z)[0], z, rare: rare ? 1 : 0, hat: '', t: Date.now() };
  S.pets.push(p); S.train.push({ p: p.id }); save(); return p;
}

/* ---------- trať ---------- */
const stepsLeft = () => Math.max(1, (S.pace | 0) - S.step);
/* co čeká na konci téhle jízdy */
const rideReward = () => (S.pets.length === 0 || S.step + 1 >= (S.pace | 0)) ? 'egg' : 'gift';
const ridesToday = () => S.dayRides.d === dayStr() ? S.dayRides.n : 0;
const eggReady = () => !!(S.egg && S.egg.day < dayStr());
