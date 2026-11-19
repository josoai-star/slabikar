/* Slabikář — zvuk: efekty (syntéza), hlas (nahrávky nebo předčítání), mikrofon */
'use strict';

/* ---------- Web Audio ---------- */
let AC = null, sfxBus = null, voiceBus = null;
function ac() {
  if (AC) return AC;
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
  try {
    AC = new C();
    const comp = AC.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 4; comp.connect(AC.destination);
    sfxBus = AC.createGain(); sfxBus.gain.value = .55; sfxBus.connect(comp);
    voiceBus = AC.createGain(); voiceBus.gain.value = 1.15; voiceBus.connect(comp);
  } catch (e) { AC = null; }
  return AC;
}
let ttsPrimed = false;
/* iPhone: bez tohohle tichý režim (přepínač na boku) umlčí efekty, ale nahrávky ne */
let keepAlive = null;
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function keepPlayback() {
  try { if (navigator.audioSession) { if (!cap) navigator.audioSession.type = 'playback'; return; } } catch (e) {}
  if (!/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) || !('ontouchend' in document)) return;
  try {
    if (!keepAlive) { keepAlive = new Audio(SILENT); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); }
    if (keepAlive.paused) keepAlive.play().catch(() => {});
  } catch (e) {}
}
function unlock() {
  const a = ac();
  if (a && a.state !== 'running') { try { a.resume(); } catch (e) {} }
  keepPlayback();
  if (!ttsPrimed && hasTTS) { ttsPrimed = true; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {} }
}
['pointerdown', 'touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, true));
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopVoice(); try { keepAlive && keepAlive.pause(); } catch (e) {} } });
/* zvukové jádro bývá uspané (první ťuknutí, návrat do aplikace, po předčítání): probudit a počkat */
function acReady() {
  const a = ac(); if (!a) return Promise.resolve(false);
  if (a.state === 'running') return Promise.resolve(true);
  try { return Promise.race([a.resume().then(() => a.state === 'running', () => false), wait(400).then(() => a.state === 'running')]); } catch (e) { return Promise.resolve(false); }
}

function tone(o) {
  const a = AC, t0 = a.currentTime + (o.t || 0), d = o.d || .2;
  const osc = a.createOscillator(), g = a.createGain();
  osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.f, t0);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t0 + d);
  if (o.vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = o.vib; lg.gain.value = o.f * .012; l.connect(lg); lg.connect(osc.frequency); l.start(t0); l.stop(t0 + d + .05); }
  const v = o.v == null ? .25 : o.v, at = o.a || .006;
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(v, t0 + at);
  if (o.hold) { g.gain.setValueAtTime(v, t0 + d - .06); g.gain.linearRampToValueAtTime(0.0001, t0 + d); }
  else g.gain.exponentialRampToValueAtTime(0.0008, t0 + d);
  osc.connect(g); g.connect(sfxBus); osc.start(t0); osc.stop(t0 + d + .03);
}
let noiseBuf = null;
function noise(o) {
  const a = AC, t0 = a.currentTime + (o.t || 0), d = o.d || .1;
  if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
  const s = a.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = a.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t0); f.Q.value = o.q || .8;
  if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
  const g = a.createGain(), v = o.v == null ? .3 : o.v;
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(v, t0 + (o.a || .004)); g.gain.exponentialRampToValueAtTime(0.0008, t0 + d);
  s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t0, Math.random() * .5); s.stop(t0 + d + .03);
}
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
const SFX = {
  tap() { tone({ f: 560, f2: 380, d: .07, type: 'triangle', v: .16 }); },
  pop() { tone({ f: 880, f2: 180, d: .11, v: .32 }); noise({ f: 4000, d: .04, v: .22, type: 'highpass' }); },
  ok(n) { const up = Math.min(n || 0, 6); [84, 88, 91].forEach((m, i) => { tone({ f: NOTE(m + up), t: i * .075, d: .26, type: 'triangle', v: .22 }); tone({ f: NOTE(m + up + 12), t: i * .075, d: .18, v: .07 }); }); },
  no() { tone({ f: 310, f2: 250, d: .16, v: .22, type: 'triangle' }); tone({ f: 240, f2: 180, t: .15, d: .24, v: .2, type: 'triangle' }); },
  star() { for (let i = 0; i < 3; i++) tone({ f: 1700 + Math.random() * 1100, t: i * .06, d: .16, v: .09 }); },
  ping(n) { tone({ f: NOTE(84 + (n || 0)), d: .2, type: 'triangle', v: .2 }); tone({ f: NOTE(96 + (n || 0)), d: .12, v: .06 }); },
  clap() { noise({ f: 1400, q: .7, d: .1, v: .55 }); noise({ f: 3200, q: .9, d: .05, v: .3 }); },
  whistle() { [[0, .32], [.42, .95]].forEach(([t, d]) => { tone({ f: 740, t, d, type: 'triangle', v: .13, hold: 1, vib: 6, a: .03 }); tone({ f: 932, t, d, type: 'triangle', v: .1, hold: 1, vib: 6, a: .03 }); noise({ f: 2600, t, d, v: .035, type: 'highpass', a: .03 }); }); },
  chug() { let t = 0, gap = .3; for (let i = 0; i < 12; i++) { noise({ f: 700, q: .6, t, d: .1, v: i % 2 ? .2 : .3, type: 'lowpass' }); t += gap; gap = Math.max(.1, gap * .86); } },
  brake() { noise({ f: 3000, f2: 1200, d: .5, v: .1, q: 3 }); tone({ f: 1500, f2: 900, d: .45, v: .03, type: 'sawtooth' }); },
  steam() { noise({ f: 2500, f2: 5000, d: .5, v: .18, type: 'highpass', a: .02 }); },
  crack() { noise({ f: 2600, d: .05, v: .5, type: 'highpass' }); tone({ f: 190, f2: 90, d: .07, v: .3 }); },
  hatch() { tone({ f: 380, f2: 1500, d: .34, type: 'triangle', v: .2 }); [0, 1, 2, 3, 4].forEach(i => tone({ f: NOTE([84, 88, 91, 96, 100][i]), t: .3 + i * .06, d: .3, v: .12 })); noise({ f: 5000, t: .3, d: .25, v: .12, type: 'highpass' }); },
  fanfare() { [[79, 0, .14], [84, .15, .14], [88, .3, .14], [91, .45, .5]].forEach(([m, t, d]) => { tone({ f: NOTE(m), t, d: d + .1, type: 'sawtooth', v: .09, hold: 1 }); tone({ f: NOTE(m), t, d: d + .1, type: 'triangle', v: .16, hold: 1 }); }); [72, 76].forEach(m => tone({ f: NOTE(m), t: .45, d: .6, type: 'triangle', v: .12, hold: 1 })); },
  magic() { [72, 74, 76, 79, 81, 84, 86, 88, 91].forEach((m, i) => tone({ f: NOTE(m + 12), t: i * .05, d: .22, v: .1 })); },
  hoot() { tone({ f: 430, f2: 390, d: .2, v: .26, a: .03 }); tone({ f: 410, f2: 330, t: .27, d: .45, v: .26, a: .03 }); },
  whoosh() { noise({ f: 500, f2: 3000, d: .3, v: .2, q: 1.2 }); },
  thud() { tone({ f: 170, f2: 60, d: .16, v: .45 }); noise({ f: 300, d: .08, v: .2, type: 'lowpass' }); },
  munch() { [0, .13, .26].forEach(t => noise({ f: 800, t, d: .07, v: .35, type: 'lowpass' })); },
  flip() { noise({ f: 2000, d: .05, v: .16, type: 'highpass' }); tone({ f: 520, f2: 760, d: .06, v: .12, type: 'triangle' }); },
  beep() { tone({ f: 880, d: .13, v: .2, hold: 1 }); },
  boing() { tone({ f: 220, f2: 520, d: .22, v: .25, type: 'triangle' }); },
  drip() { tone({ f: 1300, f2: 600, d: .08, v: .15 }); },
  squeak(seed) { const r = mulberry((seed || 1) >>> 0), b = 620 + r() * 700, n = 2 + Math.floor(r() * 2); for (let i = 0; i < n; i++) { const f = b * (1 + (r() - .4) * .5); tone({ f, f2: f * (r() < .5 ? 1.35 : .75), t: i * .1, d: .1, v: .2, type: r() < .5 ? 'triangle' : 'sine' }); } }
};
function sfx(name, arg) {
  if (!S.sfx || !SFX[name]) return; const a = ac(); if (!a) return;
  const go = () => { try { SFX[name](arg); } catch (e) {} };
  if (a.state === 'running') go(); else { const t = Date.now(); acReady().then(ok => { if (ok && Date.now() - t < 600) go(); }); }
}

/* ---------- předčítání ---------- */
const hasTTS = 'speechSynthesis' in window;
let voice = null, csV = [];
const vscore = v => (/natural|neural|online/i.test(v.name) ? 6 : 0) + (/premium/i.test(v.name) ? 5 : 0) + (/enhanced|vylepšen/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 3 : 0) + (v.localService === false ? 1 : 0);
function loadV() {
  if (!hasTTS) return;
  try { csV = speechSynthesis.getVoices().filter(v => /^cs/i.test(v.lang)).sort((a, b) => vscore(b) - vscore(a)); voice = csV.find(v => v.name === S.voice) || csV[0] || null; } catch (e) {}
  if (typeof renderVoice === 'function') renderVoice();
}
let ttsDone = null;
function tts(t) {
  return new Promise(res => {
    let d = false; const f = () => { if (!d) { d = true; ttsDone = null; res(); } }; ttsDone = f;
    setTimeout(f, 2400 + t.length * 260 / S.rate);
    if (!hasTTS) return setTimeout(f, 500);
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(low(t) + (t.length <= 4 && !/[.!?]$/.test(t) ? '.' : ''));
      u.lang = 'cs-CZ'; if (voice) u.voice = voice; u.rate = S.rate; u.pitch = 1; u.onend = f; u.onerror = f;
      setTimeout(() => { try { speechSynthesis.speak(u); } catch (e) { f(); } }, 60);
    } catch (e) { f(); }
  });
}

/* ---------- nahrávky v tomhle prohlížeči (IndexedDB) ---------- */
let dbp = null;
const db = () => dbp || (dbp = new Promise(res => {
  try {
    const q = indexedDB.open('slabikar', 2);
    q.onupgradeneeded = () => { const d = q.result; if (!d.objectStoreNames.contains('rec')) d.createObjectStore('rec'); if (!d.objectStoreNames.contains('pack')) d.createObjectStore('pack'); };
    q.onsuccess = () => res(q.result); q.onerror = () => res(null); q.onblocked = () => res(null);
  } catch (e) { res(null); }
}));
const idb = (mode, fn, store) => db().then(d => d ? new Promise(r => { try { const s = d.transaction(store || 'rec', mode).objectStore(store || 'rec'); const q = fn(s); q.onsuccess = () => r(q.result); q.onerror = () => r(null); } catch (e) { r(null); } }) : null);
const getRec = async k => (await idb('readonly', s => s.get(k))) || (await idb('readonly', s => s.get(k), 'pack')) || null;
const putRec = (k, b) => { bufCache.delete(k); REC.add(k); return idb('readwrite', s => s.put(b, k)); };
const delRec = k => { bufCache.delete(k); return idb('readwrite', s => s.delete(k)).then(reloadRec); };
const countRec = async () => { const a = await idb('readonly', s => s.count()), b = await idb('readonly', s => s.count(), 'pack'); return a == null ? null : a + (b || 0); };
const clearRec = () => { bufCache.clear(); return idb('readwrite', s => s.clear()).then(reloadRec); };
const allKeys = async () => { const a = (await idb('readonly', s => s.getAllKeys())) || [], b = (await idb('readonly', s => s.getAllKeys(), 'pack')) || []; return [...new Set([...a, ...b])]; };

/* Hlas: 'own' = jen moje nahrávky (co chybí, hra nevybírá / neřekne), 'mix' = nahrávky + předčítání, 'tts' = jen předčítání */
const vmode = () => S.vmode || (S.own ? 'own' : 'tts');
const useRec = () => vmode() !== 'tts';
const onlyOwn = () => vmode() === 'own';
const REC = new Set();                              /* klíče všech nahrávek, ať jde rychle zjistit, co je nahrané */
const hasK = k => REC.has(low(k));
const canSay = t => !onlyOwn() || hasK(t);
const recOnly = () => useRec() && !!S.recOnly;          /* volitelné: vybírat jen nahrané */
let recLoad = null;
const reloadRec = () => (recLoad = allKeys().then(ks => { REC.clear(); ks.forEach(k => REC.add(k)); }));
const bufCache = new Map();
let curSrc = null, curA = null, voiceTok = 0;
const decode = ab => new Promise((res, rej) => { try { const p = AC.decodeAudioData(ab, res, rej); if (p && p.catch) p.catch(rej); } catch (e) { rej(e); } });
const blobAB = b => b.arrayBuffer ? b.arrayBuffer() : new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsArrayBuffer(b); });
function stopVoice() {
  voiceTok++;
  try { if (curSrc) { curSrc.onended = null; curSrc.stop(); } } catch (e) {} curSrc = null;
  try { if (curA) curA.pause(); } catch (e) {} curA = null;
  try { if (hasTTS) speechSynthesis.cancel(); } catch (e) {}
  if (ttsDone) ttsDone();
}
function playBuf(buf, rate) {
  return new Promise(res => {
    const a = ac(); if (!a) return res();
    try {
      const s = a.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate || 1; s.connect(voiceBus);
      let d = false; const f = () => { if (!d) { d = true; if (curSrc === s) curSrc = null; res(); } };
      s.onended = f; setTimeout(f, buf.duration / (rate || 1) * 1000 + 400); curSrc = s; s.start();
    } catch (e) { res(); }
  });
}
function playBlobEl(b) {
  return new Promise(res => {
    try { const a = new Audio(URL.createObjectURL(b)); curA = a; let d = false; const f = () => { if (!d) { d = true; res(); } }; a.onended = f; a.onerror = f; setTimeout(f, 9000); a.play().catch(f); } catch (e) { res(); }
  });
}
async function playBlob(b, key, rate) {
  stopVoice(); const tk = voiceTok; const a = ac();
  if (a && await acReady()) {
    try {
      let buf = key && bufCache.get(key);
      if (!buf) { buf = await decode(await blobAB(b)); if (key) { bufCache.set(key, buf); if (bufCache.size > 90) bufCache.delete(bufCache.keys().next().value); } }
      if (tk !== voiceTok) return;
      return playBuf(buf, rate);
    } catch (e) {}
  }
  if (tk !== voiceTok) return;
  return playBlobEl(b);
}
async function playKey(k) { const r = await getRec(k); if (!r) return false; await playBlob(r, k); return true; }
const hasRec = async k => useRec() && hasK(k);

function showText(t) { const el = $('sayText'); if (!el) return; if ((!voice && !useRec()) || S.text) { el.hidden = false; el.textContent = `Řekni nahlas: „${low(t)}“`; } else el.hidden = true; }
/* řekne text: vlastní nahrávka, jinak předčítání */
async function say(t) {
  if (!t) return; showText(t); stopVoice(); const tk = voiceTok;
  if (useRec()) { const r = await getRec(low(t)); if (tk !== voiceTok) return; if (r) { const el = $('sayText'); if (el) el.hidden = !S.text; return playBlob(r, low(t)); } }
  if (onlyOwn()) return;                             /* jen můj hlas: Zuzana nikdy nenaskočí */
  return tts(t);
}
async function sayList(arr, on, gap) { const tk0 = G && G.tk;
  if (arr.length === 1) { on && on(0); await wait(350); on && on(-1); return; }   /* jednoslabičné slovo: neříkat ho dvakrát */ for (let i = 0; i < arr.length; i++) { if (G && G.tk !== tk0) return; on && on(i); await say(arr[i]); await wait(gap == null ? 200 : gap); } on && on(-1); }
const sayPh = id => say(PH[id]);
/* hláska: jen z nahrávky (předčítání neumí „mmm“), samohlásku zvládne i hlas */
async function playH(L) { if (useRec() && await playKey('h:' + low(L))) return true; if (!onlyOwn() && VOW.includes(L)) { await tts(L); return true; } return false; }
/* jméno kamaráda: po slabikách z nahrávek, jinak vcelku */
async function sayName(syl, on) {
  const whole = syl.join('');
  if (useRec() && hasK(whole)) { stopVoice(); on && on(-1); return playKey(low(whole)); }   /* jméno nahrané vcelku */
  if (useRec()) { let all = true; for (const s of syl) if (!(await getRec(low(s)))) { all = false; break; } if (all) { for (let i = 0; i < syl.length; i++) { on && on(i); await playKey(low(syl[i])); await wait(40); } on && on(-1); return; } }
  on && on(-1); if (onlyOwn()) return; return tts(syl.join(''));
}
/* pochvala a povzbuzení: vybere jen věty, které jdou říct (v režimu „jen můj hlas“ ty nahrané) */
const lastG = {};
function sayGroup(g) {
  const ids = (PHG[g] || []).filter(id => canSay(PH[id])); if (!ids.length) return Promise.resolve(false);
  let id = pickOne(ids); if (ids.length > 1) while (id === lastG[g]) id = pickOne(ids);
  lastG[g] = id; return say(PH[id]).then(() => true);
}
const praise = () => sayGroup('praise');

/* ---------- mikrofon: nechá se otevřený, drží 0,6 s předstih, najde hlas, ořízne, srovná hlasitost ---------- */
let cap = null, capT = null, micStream = null;
/* povolení stačí jednou: stream se drží po celou dobu běhu aplikace, mezi nahráváním je jen ztlumený */
async function openMic() {
  if (cap) { clearTimeout(capT); if (cap.ac.state === 'suspended') await cap.ac.resume(); return cap; }
  try { if (navigator.audioSession) navigator.audioSession.type = 'play-and-record'; } catch (e) {}
  if (!micStream || micStream.getTracks().every(t => t.readyState === 'ended'))
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
  const st = micStream; st.getTracks().forEach(t => { t.enabled = true; });
  const a = ac(); await a.resume();
  const src = a.createMediaStreamSource(st), hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 90;
  const pr = a.createScriptProcessor(2048, 1, 1), mute = a.createGain(); mute.gain.value = 0;
  src.connect(hp); hp.connect(pr); pr.connect(mute); mute.connect(a.destination);
  const c = { st, ac: a, src, pr, sr: a.sampleRate, ring: [], job: null };
  pr.onaudioprocess = e => {
    const d = new Float32Array(e.inputBuffer.getChannelData(0)); let q = 0; for (let i = 0; i < d.length; i++) q += d[i] * d[i]; const r = Math.sqrt(q / d.length);
    if (c.job) c.job.feed(d, r); else { c.ring.push({ d, r }); if (c.ring.length > 16) c.ring.shift(); }
  };
  cap = c; if (!S.mic) { S.mic = true; save(); } await wait(450); return c;
}
function closeMic() {
  if (!cap) return; clearTimeout(capT);
  try { cap.pr.onaudioprocess = null; cap.src.disconnect(); cap.pr.disconnect(); cap.st.getTracks().forEach(t => { t.enabled = false; }); } catch (e) {}
  cap = null; try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
}
const idleMic = () => { clearTimeout(capT); capT = setTimeout(closeMic, 25000); };
function toWav(f, sr) {
  let k = 1; while (sr / k > 26000 && k < 4) k++;
  const n = Math.floor(f.length / k), o = new DataView(new ArrayBuffer(44 + n * 2)), w = (i, t) => [...t].forEach((c, j) => o.setUint8(i + j, c.charCodeAt(0))), r = Math.round(sr / k);
  w(0, 'RIFF'); o.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); o.setUint32(16, 16, true); o.setUint16(20, 1, true); o.setUint16(22, 1, true); o.setUint32(24, r, true); o.setUint32(28, r * 2, true); o.setUint16(32, 2, true); o.setUint16(34, 16, true); w(36, 'data'); o.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) { let v = 0; for (let j = 0; j < k; j++) v += f[i * k + j]; v /= k; o.setInt16(44 + i * 2, Math.max(-1, Math.min(1, v)) * 32767, true); }
  return new Blob([o], { type: 'audio/wav' });
}
function trimTake(chs, rs, sr, thr) {
  let a = -1, z = -1; rs.forEach((r, i) => { if (r > thr) { if (a < 0) a = i; z = i; } }); if (a < 0) return null;
  a = Math.max(0, a - 5); z = Math.min(chs.length - 1, z + 6);
  const len = chs.slice(a, z + 1).reduce((n, c) => n + c.length, 0), f = new Float32Array(len); let p = 0; chs.slice(a, z + 1).forEach(c => { f.set(c, p); p += c.length; });
  let pk = 0; for (let i = 0; i < f.length; i++) pk = Math.max(pk, Math.abs(f[i])); const g = Math.min(8, .9 / (pk || 1)); const fd = Math.floor(sr * .012);
  for (let i = 0; i < f.length; i++) { let m = g; if (i < fd) m *= i / fd; if (f.length - i < fd) m *= (f.length - i) / fd; f[i] *= m; }
  return f;
}
/* Nahraje jednu větu. onDone dostane {f, sr} nebo null. Druhé zavolání během nahrávání ji ukončí. */
async function capture(onDone, opts) {
  opts = opts || {};
  if (cap && cap.job) { cap.job.stop(); return true; }
  let c; try { c = await openMic(); } catch (e) { return false; }
  const pre = c.ring.slice(); c.ring = []; const rs = pre.map(x => x.r), chs = pre.map(x => x.d);
  const sorted = [...rs].sort((x, y) => x - y); const floor = sorted.length ? sorted[Math.floor(sorted.length * .25)] : .005; const thr = Math.max(.018, floor * 4);
  let quiet = 0, hot = 0, began = false, fin = false; const maxT = opts.max || 7, idleT = opts.idle || 5;
  const job = {
    feed(d, r) {
      chs.push(d); rs.push(r);
      if (r > thr) { hot++; quiet = 0; if (hot >= 2) began = true; } else { hot = 0; if (began) quiet++; }
      opts.level && opts.level(r, began);
      const t = (chs.length - pre.length) * d.length / c.sr;
      if (!fin && ((began && quiet >= 16) || t > maxT || (!began && t > idleT))) job.stop();
    },
    stop() { if (fin) return; fin = true; c.job = null; idleMic(); const f = trimTake(chs, rs, c.sr, thr); onDone && onDone(f ? { f, sr: c.sr } : null); },
    cancel() { if (fin) return; fin = true; c.job = null; idleMic(); }
  };
  c.job = job; return true;
}
/* nahraje a uloží pod klíč (text malými písmeny) */
async function recordTo(text, btn, onDone) {
  const busy = !!(cap && cap.job);
  const ok = await capture(async take => {
    btn && btn.classList.remove('on');
    let b = null; if (take) { b = toWav(take.f, take.sr); await putRec(low(text), b); }
    onDone && onDone(b);
  });
  if (ok && !busy && btn) btn.classList.add('on');
  return ok;
}
/* přehraje právě nahraný hlas legračně vysoko (kamarád opakuje) */
function parrot(take, rate) {
  const a = ac(); if (!a || !take) return Promise.resolve();
  const buf = a.createBuffer(1, take.f.length, take.sr); buf.getChannelData(0).set(take.f); stopVoice(); return playBuf(buf, rate || 1.45);
}

/* ---------- balíček s hlasem: záloha, přenos mezi zařízeními, hlas uložený přímo u hry ---------- */
const blobURL = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
function urlBlob(u) { const i = u.indexOf(','), mime = (u.slice(5, i).split(';')[0]) || 'audio/wav', bin = atob(u.slice(i + 1)), a = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) a[j] = bin.charCodeAt(j); return new Blob([a], { type: mime }); }
async function exportPack() {
  const keys = (await idb('readonly', s => s.getAllKeys())) || []; const parts = ['{"slabikar":1,"items":{']; let n = 0;
  for (const k of keys) { const b = await idb('readonly', s => s.get(k)); if (!b) continue; parts.push((n++ ? ',' : '') + JSON.stringify(k) + ':' + JSON.stringify(await blobURL(b))); }
  parts.push('}}'); return { blob: new Blob(parts, { type: 'application/json' }), n };
}
async function importPack(text, store) {
  const j = JSON.parse(text); if (!j || !j.items) throw new Error('bad'); let n = 0;
  if (store === 'pack') await idb('readwrite', s => s.clear(), 'pack');
  for (const k of Object.keys(j.items)) { try { await idb('readwrite', s => s.put(urlBlob(j.items[k]), k), store || 'rec'); n++; } catch (e) {} }
  bufCache.clear(); await reloadRec(); return n;
}
/* když u hry leží hlas.json, načte se jednou do každého zařízení */
async function loadSitePack() {
  if (location.protocol === 'file:') return;
  try {
    const head = await fetch('hlas.json', { method: 'HEAD', cache: 'no-cache' }); if (!head.ok) return;
    const sig = (head.headers.get('etag') || '') + '|' + (head.headers.get('content-length') || '') + '|' + (head.headers.get('last-modified') || '');
    if (S.packSig === sig) return;
    const r = await fetch('hlas.json', { cache: 'no-cache' }); if (!r.ok) return;
    const n = await importPack(await r.text(), 'pack'); S.packSig = sig; if (n && vmode() === 'tts') S.vmode = 'own'; save();
  } catch (e) {}
}

reloadRec();
addEventListener('pagehide', () => { try { micStream && micStream.getTracks().forEach(t => t.stop()); } catch (e) {} micStream = null; });
