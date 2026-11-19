/* Slabikář — hry. Každá úloha: slyším / vidím → ťuknu. Chyba nic nebere, po druhé sova ukáže řešení. */
'use strict';

const GM = {
  first: { c: '#ffd9c9', n: 'Balónky', d: 'Co slyšíš na začátku a na konci', ex: '🎈', e: 1, w: 1 },
  mole: { c: '#d9f2c8', n: 'Kdo vykoukl?', d: 'Chyť písmenko, kterým to začíná', ex: '🕳️', e: 1, w: .8 },
  clap: { c: '#e3dcff', n: 'Vytleskej', d: 'Kolik má slovo slabik', ex: '👏', e: 1, w: .8 },
  find: { c: '#cfeaff', n: 'Bubliny', d: 'Slyšíš slabiku, praskni ji', ex: '<span class="c">L</span><span class="v">A</span> <span class="c">L</span><span class="v">E</span>', w: 1.1 },
  build: { c: '#d3f5df', n: 'Slož slabiku', d: 'Souhláska a samohláska', ex: '<span class="c">M</span> + <span class="v">A</span>', w: 1 },
  word: { c: '#ffe6a8', n: 'Slovní vláček', d: 'Slož slovo ze slabik', ex: '🚂', e: 1, w: 1.2 },
  read: { c: '#ffd6ea', n: 'Přečti', d: 'Přečti slovo a najdi obrázek', ex: '<span class="c">P</span><span class="v">E</span><span class="c">S</span>', w: 1.3 },
  pick: { c: '#ffe0c2', n: 'Najdi slovo', d: 'Které slovo patří k obrázku', ex: '🔎', e: 1, w: 1.1 },
  pairs: { c: '#cdeee8', n: 'Pexeso', d: 'Najdi velké a malé písmeno', ex: '<span class="c">M</span> <span class="c">m</span>', w: .6 },
  paint: { c: '#fff0a8', n: 'Maluj písmenko', d: 'Vybarvi ho prstem', ex: '🖌️', e: 1, w: .5 },
  speak: { c: '#ffd0d0', n: 'Řekni to', d: 'Čti nahlas, kamarád to zopakuje', ex: '🎤', e: 1, w: .7 }
};
const BALC = ['#ff5d5d', '#3d8bff', '#2fbf71', '#ffb020', '#b36cff', '#ff7ab6', '#14b8a6'];
/* na konci slova znělé souhlásky znějí jinak, než se píšou (zub → „zup“), a y zní jako i */
const ENDBAD = ['B', 'D', 'G', 'H', 'V', 'Z', 'Ž', 'Y'];

/* které hry jdou hrát s tím, co dítě zná */
function avail() {
  const a = [], nw = words(), hasC = cons().length > 0, rnw = RW(nw);
  if (RW(wordsAt(w => w.t[0])).length >= 4) a.push('first', 'mole');
  if (RW(WORDS).length >= 3) a.push('clap');
  if (hasC ? RS(syls()).length : RS(VOW.map(v => 'h:' + v)).length) a.push('find');
  if ([...knownSet()].filter(x => x !== 'Y').length >= 4) a.push('pairs');
  if (hasC && RS(syls()).length) a.push('build');
  if (nw.filter(w => w.syl.length > 1).length >= 3 && rnw.filter(w => w.syl.length > 1).length) a.push('word');
  if (nw.length >= 4 && rnw.length) a.push('read', 'pick');
  a.push('paint');
  if (S.mic && S.speak !== false && (rnw.length >= 2 || (hasC && RS(syls()).length >= 2))) a.push('speak');
  return a;
}

/* ---------- společné ---------- */
const stageEl = () => $('stage');
const q = sel => $('stage').querySelector(sel);
function setStage(html) { const s = $('stage'); s.classList.remove('in'); s.innerHTML = html; void s.offsetWidth; s.classList.add('in'); }
function owlDo(c) { const o = $('owl'); if (!o) return; o.classList.remove('hop', 'huh'); void o.getBoundingClientRect(); o.classList.add(c); }
function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
const live = tk => G && !G.dead && G.tk === tk;
/* začátek úlohy: titulek, co se říká, úklid po minulé */
function task(type, title, text, o) {
  o = o || {};
  (G.clean || []).forEach(f => { try { f(); } catch (e) {} }); G.clean = [];
  LC = S.case === 'lower' || (S.case === 'mix' && Math.random() < .5);
  if (o.upper) LC = false;
  G.type = type; G.tk++; G.text = text; G.tries = 0; G.lock = false; G.revealed = false;
  const tk = G.tk, ph = o.ph || type;
  const sayIt = o.replay || (text ? () => say(text) : null);
  G.replay = sayIt;
  G.help = async () => { await sayPh(ph); if (live(tk) && sayIt) await sayIt(); };
  $('ptitle').textContent = title; $('sayBtn').hidden = !sayIt; $('recBtn').hidden = !(useRec() && S.recPlay && text); $('sayText').hidden = true; $('recMsg').hidden = true;
  setTimeout(async () => {
    if (!live(tk)) return;
    if (!G.told.has(ph)) { G.told.add(ph); await sayPh(ph); if (!live(tk) || G.tries || G.lock) return; await wait(120); }
    if (live(tk) && sayIt && !G.lock) { pokeCls($('sayBtn'), 'ring', 2400); sayIt(); }
  }, 380);
  /* když dítě chvíli nic neťukne, zopakovat (nejvýš dvakrát) */
  G.lastTap = Date.now(); let reps = 0;
  if (sayIt) { const iv = setInterval(() => { if (!live(tk) || G.lock || reps >= 2) return clearInterval(iv); if (Date.now() - G.lastTap > 7500) { reps++; G.lastTap = Date.now(); pokeCls($('sayBtn'), 'ring', 2400); sayIt(); } }, 1000); G.clean.push(() => clearInterval(iv)); }
  return tk;
}
function wrong(el, key) { stopVoice(); owlDo('huh'); sfx('no'); if (G.tries === 0 && key) mark(key, false); G.tries++; G.streak = 0; shake(el); if (G.tries >= 2) { G.revealed = true; return true; } return false; }
/* po chybě: občas povzbudit, pak znovu přehrát */
function oops(fn) {
  const tk = G.tk; const p = Math.random() < .5 ? sayGroup('oops') : Promise.resolve();
  p.then(() => { if (live(tk) && !G.lock) fn(); });
}
function right(key) { if (G.tries === 0 && key) mark(key, true); }
/* konec úlohy: hvězdička za první pokus, vláček popojede */
async function done(first) {
  if (!G || G.dead) return; const tk = G.tk; G.lock = true;
  if (first) {
    G.streak++; owlDo('hop'); sfx('ok', G.streak - 1);
    burstAt(q('.ok') || q('.pic') || stageEl(), 10);
    if (G.streak >= 3 && G.streak % 2) floatTxt(stageEl(), G.streak + '× ★');
  } else sfx('ping');
  G.res.push(!!first); G.i++; renderTrack();
  const own = useRec() && PHG.praise.some(id => hasK(PH[id]));
  if (first && (own ? Math.random() < .55 : G.streak === 3 || G.streak === 6)) { await wait(250); if (live(tk)) await praise(); }
  else if (!first && !G.revealed) { await wait(200); if (live(tk)) await sayGroup('retry'); }
  else if (G.revealed && Math.random() < .6) { await wait(200); if (live(tk)) await sayGroup('hard'); }
  await wait(first ? 650 : 450);
  if (live(tk)) next();
}
function tiles(list, cls) { return list.map((c, i) => `<button class="tile${cls ? ' ' + cls : ''}" data-i="${i}">${colorize(c)}</button>`).join(''); }
function bind(sel, fn) { $$(sel, $('stage')).forEach(b => b.onclick = () => { if (G && !G.lock) { fn(b, +b.dataset.i); } }); }
async function blend(s, into) {
  const d = document.createElement('div'); d.className = 'bcard pop ok';
  d.innerHTML = `<div class="blend">${tokens(s).map(t => `<span>${ctok(t)}</span>`).join('')}</div>`;
  (into || $('stage')).appendChild(d); await wait(420); d.firstChild.classList.add('join'); sfx('flip'); await wait(420); await say(s);
}
const picHTML = (w, cls) => `<div class="pic${cls ? ' ' + cls : ''}">${w.pic}</div>`;

const MAKE = {};

/* ---------- Balónky: první / poslední hláska ---------- */
function firstTask(type) {
  const k = knownSet(), f = focusL();
  const endOK = type === 'first' && (S.pos === 0 && knownN() === 0 || sumR('f:') >= 12);
  const endM = endOK && Math.random() < (knownN() === 0 ? .45 : .3), px = endM ? 'e:' : 'f:';
  const pos = w => endM ? w.t[w.t.length - 1] : w.t[0];
  let pool = RW(WORDS.filter(w => k.has(pos(w)) && pos(w) !== 'Y' && !(endM && ENDBAD.includes(tokens(w.word).pop()))));
  if (pool.length < 3) pool = RWor(WORDS.filter(w => k.has(w.t[0])));
  const w = pick(pool, w => px + pos(w) + ':' + w.word, w => fboost(pos(w) === f, f) * (1 / Math.sqrt(pool.filter(x => pos(x) === pos(w)).length)));
  const ans = pos(w), key = px + ans;
  const others = shuffle([...k].filter(x => x !== ans && x !== 'Y'));
  return { w, ans, key, endM, ch: shuffle([ans, ...others.slice(0, 2)]) };
}
const markFn = (w, endM) => { const L = w.syl.length - 1; return (i, j) => endM ? (i === L && j === tokens(w.syl[L]).length - 1) : (i === 0 && j === 0); };
MAKE.first = () => {
  const { w, ans, key, endM, ch } = firstTask('first');
  const tk = task('first', endM ? 'Co slyšíš na konci?' : 'Co slyšíš na začátku?', w.word, { ph: endM ? 'last' : 'first' });
  const cols = shuffle(BALC);
  setStage(`${picHTML(w)}<div class="word" id="rev" style="visibility:hidden">${arcHTML(w.syl, 'arcF', markFn(w, endM))}</div><div class="bals">${ch.map((c, i) => `<button class="bal" data-i="${i}" style="--bc:${cols[i]}">${colorize(c)}</button>`).join('')}</div>`);
  const fin = async ok => {
    G.lock = true; const b = $$('.bal', stageEl())[ch.indexOf(ans)];
    if (b) { sfx('pop'); burstAt(b, 8); b.classList.add('ok'); }
    const rev = $('rev'); if (rev) { rev.style.visibility = 'visible'; rev.classList.add('pop'); }
    if (await playH(ans)) await wait(200); if (!live(tk)) return;
    await sayList(w.syl, hiArc('arcF')); if (!live(tk)) return; await say(w.word); if (live(tk)) done(ok);
  };
  bind('.bal', (b, i) => { if (ch[i] === ans) { right(key); fin(G.tries === 0); } else { b.classList.add('bad'); if (wrong(b, key)) fin(false); else oops(() => say(w.word)); } });
};

/* ---------- Kdo vykoukl: kamarádi vykukují s písmenky ---------- */
MAKE.mole = () => {
  const { w, ans, key } = firstTask('mole');
  const tk = task('mole', 'Chyť písmenko, kterým to začíná', w.word, { upper: Math.random() < .5 });
  const others = shuffle([...knownSet()].filter(x => x !== ans && x !== 'Y'));
  const src = S.pets.length ? shuffle(S.pets).slice(0, 6) : [];
  while (src.length < 6) src.push({ id: -src.length - 1, seed: 1000 + src.length * 7919 + S.pos * 31, z: S.pos, name: [] });
  setStage(`${picHTML(w, 'sm')}<div class="word" id="rev" hidden>${arcHTML(w.syl, 'arcM', markFn(w, false))}</div><div class="holes">${src.map((p, i) => `<div class="hole"><button class="mole" data-i="${i}">${petSVG(p)}<span class="sign"></span></button></div>`).join('')}</div>`);
  const ms = $$('.mole', stageEl()); let up = [], stop = false, n = 0;
  const cycle = () => {
    if (stop || !live(tk) || G.lock) return;
    ms.forEach(m => m.classList.remove('up', 'bad'));
    setTimeout(() => {
      if (stop || !live(tk) || G.lock) return;
      const holes = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3), ds = shuffle(others).slice(0, 2), ls = shuffle([ans, ...ds]);
      up = holes.map((h, j) => ({ h, l: ls[j] }));
      up.forEach(u => { if (!u.l) return; const m = ms[u.h]; m.dataset.l = u.l; m.querySelector('.sign').innerHTML = ctok(u.l); m.classList.add('up'); });
      sfx('boing'); n++;
    }, n ? 420 : 60);
  };
  cycle(); const iv = setInterval(cycle, 3400); G.clean.push(() => { stop = true; clearInterval(iv); });
  const fin = async (ok, m) => {
    G.lock = true; stop = true; clearInterval(iv);
    ms.forEach(x => { if (x !== m) x.classList.remove('up'); });
    if (!m) { m = ms[0]; m.dataset.l = ans; m.querySelector('.sign').innerHTML = ctok(ans); }
    m.classList.add('up', 'ok'); m.querySelector('.pet').classList.add('jump'); sfx('squeak', +m.dataset.i * 977 + 5);
    const rev = $('rev'); if (rev) { rev.hidden = false; rev.classList.add('pop'); }
    if (await playH(ans)) await wait(200); if (!live(tk)) return;
    await sayList(w.syl, hiArc('arcM')); if (!live(tk)) return; await say(w.word); if (live(tk)) done(ok);
  };
  ms.forEach(m => m.onclick = () => {
    if (!G || G.lock || !m.classList.contains('up')) return;
    if (m.dataset.l === ans) { right(key); fin(G.tries === 0, m); }
    else { m.classList.add('bad'); m.classList.remove('up'); if (wrong(m.parentNode, key)) fin(false, null); else oops(() => say(w.word)); }
  });
};

/* ---------- Vytleskej ---------- */
MAKE.clap = () => {
  const f = focusL();
  const w = pick(RWor(WORDS), w => 'c:' + w.word, w => fboost(w.t.includes(f), f) * (words().includes(w) ? 1.5 : 1)), key = 'c:' + w.word; let n = 0;
  const tk = task('clap', 'Vytleskej: kolik slabik?', w.word);
  setStage(`${picHTML(w)}<div class="word" id="rev" style="visibility:hidden">${arcHTML(w.syl, 'arcC')}</div><div class="cnt" id="cnt"></div><div class="row" style="align-items:center"><button class="ibtn" id="again" aria-label="Znovu">${ICON.redo}</button><button class="clap" id="clap" aria-label="Tlesknout">👏</button><button class="btn go" id="ok" aria-label="Hotovo">${ICON.ok}</button></div>`);
  const draw = () => { $('cnt').innerHTML = Array.from({ length: n }, (_, i) => `<i${i === n - 1 ? ' class="pop"' : ''}>${i + 1}</i>`).join(''); };
  const fin = async ok => {
    G.lock = true; const rev = $('rev'); if (rev) { rev.style.visibility = 'visible'; rev.classList.add('pop'); } n = 0; draw();
    await sayList(w.syl, i => { hiArc('arcC')(i); if (i >= 0 && live(tk)) { n = i + 1; draw(); sfx('clap'); pokeCls($('clap'), 'pop'); } }, 260);
    if (!live(tk)) return; await say(w.word); if (live(tk)) done(ok);
  };
  $('clap').onclick = () => { if (G.lock || n >= 7) return; stopVoice(); n++; sfx('clap'); draw(); };
  $('again').onclick = () => { if (G.lock) return; n = 0; draw(); say(w.word); };
  $('ok').onclick = () => { if (G.lock || !n) return; if (n === w.syl.length) { right(key); fin(G.tries === 0); } else if (wrong($('cnt'), key)) fin(false); else { n = 0; draw(); say(w.word); } };
};

/* ---------- Bubliny: najdi, co slyšíš ---------- */
MAKE.find = () => {
  const cs = cons(), f = focusL(); let s, ch, key, letters = false;
  if (!cs.length) {                                  /* zatím jen samohlásky */
    letters = true; s = pick(RSor(VOW.map(v => 'h:' + v)).map(x => x.slice(2).toUpperCase()), x => 'h:' + x); key = 'h:' + s; ch = shuffle(VOW).filter(x => x !== s).slice(0, 3).concat([s]);
  } else {
    s = pick(RSor(syls()), x => 's:' + x, x => fboost(tokens(x)[0] === f, f)); key = 's:' + s; const t = tokens(s);
    const set = new Set([s]); const a = VOW.filter(v => v !== t[1]); set.add(t[0] + pickOne(a));
    const o = cs.filter(c => c !== t[0]); if (o.length) set.add(pickOne(o) + t[1]);
    const all = syls(); let g = 0; while (set.size < 4 && set.size < all.length && g++ < 80) set.add(pickOne(all));
    ch = [...set];
  }
  ch = shuffle(ch);
  const tk = task('find', letters ? 'Které písmenko slyšíš?' : 'Kterou slabiku slyšíš?', letters ? null : s, { ph: letters ? 'findh' : 'find', replay: letters ? () => playH(s) : null });
  const spots = shuffle([[22, 30], [74, 26], [30, 76], [78, 72]]);
  setStage(`<div class="pond">${ch.map((c, i) => `<button class="bub" data-i="${i}" style="left:${spots[i][0] + rnd(7) - 3}%;top:${spots[i][1] + rnd(7) - 3}%">${colorize(c)}</button>`).join('')}</div>`);
  const fin = async ok => {
    G.lock = true; const b = $$('.bub', stageEl())[ch.indexOf(s)];
    if (b) { sfx('pop'); burstAt(b, 8); b.classList.add('ok'); }
    await wait(260); if (!live(tk)) return; setStage('');
    if (letters) { const d = document.createElement('div'); d.className = 'bcard pop ok'; d.innerHTML = `<div class="blend">${ctok(s)}</div>`; $('stage').appendChild(d); await playH(s); }
    else await blend(s);
    if (live(tk)) done(ok);
  };
  bind('.bub', (b, i) => { if (ch[i] === s) { right(key); fin(G.tries === 0); } else { b.classList.add('bad'); sfx('drip'); if (wrong(b, key)) fin(false); else oops(() => G.replay()); } });
};

/* ---------- Slož slabiku ---------- */
MAKE.build = () => {
  const f = focusL(); const s = pick(RSor(syls()), x => 'b:' + x, x => fboost(tokens(x)[0] === f, f)), key = 'b:' + s, [c, v] = tokens(s);
  const cr = shuffle([c, ...shuffle(cons().filter(x => x !== c)).slice(0, 2)]), vr = shuffle([v, ...shuffle(VOW.filter(x => x !== v)).slice(0, 2)]);
  const got = [false, false];
  const tk = task('build', 'Slož slabiku, kterou slyšíš', s);
  setStage(`<div class="row"><div class="slot" id="s0"></div><div class="slot" id="s1"></div></div><div class="row">${cr.map((x, i) => `<button class="tile tc" data-i="${i}">${ctok(x)}</button>`).join('')}</div><div class="row">${vr.map((x, i) => `<button class="tile tv" data-i="${i}">${ctok(x)}</button>`).join('')}</div>`);
  const put = (k, x, b) => { if (b) { sfx('tap'); playH(x); } got[k] = true; const sl = $('s' + k); if (!sl) return; sl.innerHTML = ctok(x); sl.classList.add('full', 'pop'); if (b) b.classList.add('used'); };
  const fin = async ok => { G.lock = true; if (!got[0]) put(0, c); if (!got[1]) put(1, v); await wait(380); if (!live(tk)) return; setStage(''); await blend(s); if (live(tk)) done(ok); };
  const check = () => { if (got[0] && got[1]) { right(key); fin(G.tries === 0); } };
  bind('.tc', (b, i) => { if (got[0]) return; if (cr[i] === c) { put(0, c, b); check(); } else if (wrong(b, key)) fin(false); else oops(() => say(s)); });
  bind('.tv', (b, i) => { if (got[1]) return; if (vr[i] === v) { put(1, v, b); check(); } else if (wrong(b, key)) fin(false); else oops(() => say(s)); });
};

/* ---------- Slovní vláček: slož slovo ze slabik ---------- */
MAKE.word = () => {
  const f = focusL(); const pool = words().filter(w => w.syl.length > 1);
  const w = pick(RWor(pool), w => 'w:' + w.word, w => fboost(w.t.includes(f), f)), key = 'w:' + w.word;
  const others = [...new Set(pool.filter(x => x !== w).flatMap(x => x.syl))].filter(x => !w.syl.includes(x));
  const bank = shuffle([...w.syl, ...shuffle(others).slice(0, w.syl.length > 3 ? 1 : 2)]); let p = 0;
  const tk = task('word', 'Slož slovo ze slabik', w.word);
  const long = w.syl.length >= 4;
  setStage(`${picHTML(w, 'sm')}<div class="wtrain${long ? ' long' : ''}" id="wtr" style="${long ? `--tile:clamp(48px,${Math.floor(74 / (w.syl.length + 1))}vw,92px)` : ''}">${w.syl.map((_, i) => `<div class="wslot" id="w${i}" style="--wc:${WCOL[i % WCOL.length][0]}"></div>`).join('')}<div class="mloco">${locoSVG()}</div></div><div class="row">${tiles(bank)}</div>`);
  const put = () => { const sl = $('w' + p); if (sl) { sl.innerHTML = colorize(w.syl[p]); sl.classList.add('full', 'pop'); } p++; };
  const fin = async ok => {
    G.lock = true; while (p < w.syl.length) put(); await wait(250); if (!live(tk)) return;
    await say(w.word); if (!live(tk)) return; const tr = $('wtr'); if (tr) { tr.classList.add('ok'); if (ok) { sfx('whistle'); tr.classList.add('go', 'moving'); await wait(900); } }
    if (live(tk)) done(ok);
  };
  bind('.tile', async (b, i) => {
    if (bank[i] === w.syl[p]) { b.classList.add('used'); const s = w.syl[p]; sfx('tap'); put(); if (p === w.syl.length) { right(key); G.lock = true; await say(s); if (live(tk)) fin(G.tries === 0); } else oops(() => say(s)); }
    else if (wrong(b, key)) fin(false); else oops(() => say(w.word));
  });
};

/* ---------- Přečti: slovo → obrázek ---------- */
function similar(pool, w, n) {
  const same = shuffle(pool.filter(x => x !== w && x.t[0] === w.t[0])), rest = shuffle(pool.filter(x => x !== w && x.t[0] !== w.t[0]));
  const hard = sumR('r:') + sumR('k:') > 8; const out = hard ? same.slice(0, 1) : [];
  return out.concat(rest).concat(same).filter((x, i, a) => a.indexOf(x) === i).slice(0, n);
}
MAKE.read = () => {
  const f = focusL(); const pool = words(); const w = pick(RWor(pool), w => 'r:' + w.word, w => fboost(w.t.includes(f), f)), key = 'r:' + w.word;
  const ch = shuffle([w, ...similar(pool, w, 2)]);
  const tk = task('read', 'Přečti. Co to je?', null);
  setStage(`<div class="word card">${arcHTML(w.syl, 'arcR')}</div><div class="row">${ch.map((x, i) => `<button class="tile p" data-i="${i}" aria-label="obrázek ${i + 1}">${x.pic}</button>`).join('')}</div><p class="hint" id="rh" hidden>Ťukni na slabiku a poslechni si ji.</p>`);
  const fin = async ok => { G.lock = true; const b = $$('.tile', stageEl())[ch.indexOf(w)]; if (b) b.classList.add('ok'); await sayList(w.syl, hiArc('arcR')); if (!live(tk)) return; await say(w.word); if (live(tk)) done(ok); };
  bind('.tile', (b, i) => { if (ch[i] === w) { right(key); fin(G.tries === 0); } else { b.classList.add('dim'); if (wrong(b, key)) fin(false); else { $('rh').hidden = false; $('arcR').classList.add('tap'); } } });
  [...$('arcR').children].forEach((el, i) => el.onclick = () => { if (G.tries > 0 && !G.lock) { hiArc('arcR')(i); say(w.syl[i]); } });
};

/* ---------- Najdi slovo: obrázek → napsané slovo ---------- */
MAKE.pick = () => {
  const f = focusL(); const pool = words(); const w = pick(RWor(pool), w => 'k:' + w.word, w => fboost(w.t.includes(f), f)), key = 'k:' + w.word;
  const ch = shuffle([w, ...similar(pool, w, 2)]);
  const tk = task('pick', 'Které slovo to je?', w.word);
  setStage(`${picHTML(w)}<div class="row" style="flex-direction:column;align-items:center">${ch.map((x, i) => `<button class="tile w" data-i="${i}">${colorize(x.word)}</button>`).join('')}</div>`);
  const fin = async ok => {
    G.lock = true; const bs = $$('.tile', stageEl()), b = bs[ch.indexOf(w)]; bs.forEach(x => { if (x !== b) x.classList.add('dim'); });
    if (b) { b.classList.add('ok'); b.innerHTML = arcHTML(w.syl, 'arcK'); }
    await sayList(w.syl, hiArc('arcK')); if (!live(tk)) return; await say(w.word); if (live(tk)) done(ok);
  };
  bind('.tile', (b, i) => { if (ch[i] === w) { right(key); fin(G.tries === 0); } else { b.classList.add('dim'); if (wrong(b, key)) fin(false); else oops(() => say(w.word)); } });
};

/* ---------- Pexeso: velké a malé písmeno ---------- */
MAKE.pairs = () => {
  const pool = [...knownSet()].filter(x => x !== 'Y'), f = focusL(), L = []; let g = 0;
  if (f && pool.includes(f)) L.push(f);
  while (L.length < 4 && g++ < 80) { const x = pick(pool, x => 'p:' + x); if (!L.includes(x)) L.push(x); }
  const cards = shuffle(L.flatMap(x => [{ l: x, u: true }, { l: x, u: false }])); let open = [], got = 0, miss = 0; const bad = new Set();
  const tk = task('pairs', 'Pexeso: najdi velké a malé', null);
  setStage(`<div class="pex">${cards.map((c, i) => `<button class="pc" data-i="${i}" aria-label="karta ${i + 1}"><span class="f ${isV(c.l) ? 'v' : 'c'}">${c.u ? c.l : low(c.l)}</span></button>`).join('')}</div>`);
  const els = $$('.pc', stageEl());
  els.forEach((b, i) => b.onclick = async () => {
    if (!G || G.lock || open.includes(i) || b.classList.contains('ok')) return; b.classList.add('up'); sfx('flip'); open.push(i); if (open.length < 2) return;
    G.lock = true; const [a, c] = open.map(j => cards[j]);
    if (a.l === c.l) {
      open.forEach(j => { els[j].classList.remove('up'); els[j].classList.add('ok', 'pop'); }); open = []; got++; mark('p:' + a.l, !bad.has(a.l)); sfx('ping', got * 2); burstAt(b, 5);
      if (!(await playH(a.l))) { const w = RW(WORDS).find(w => w.t[0] === a.l); if (w && live(tk)) await say(w.word); }
      if (!live(tk)) return; G.lock = false; if (got === L.length) done(miss <= 3);
    } else {
      miss++; owlDo('huh'); [a.l, c.l].forEach(l => { if (!bad.has(l)) { bad.add(l); mark('p:' + l, false); } });
      await wait(950); if (!live(tk)) return; open.forEach(j => els[j].classList.remove('up')); open = []; G.lock = false;
    }
  });
};

/* ---------- Maluj písmenko ---------- */
MAKE.paint = forced => {
  const f = focusL(), ks = [...knownSet()];
  const L = typeof forced === 'string' ? forced : pick(ks, x => 'a:' + x, x => fboost(x === f, f));
  const exw = RW(WORDS.filter(w => w.t[0] === L)), ex = shuffle(exw.filter(w => w.word.length <= 7))[0] || shuffle(exw)[0];
  const tk = task('paint', 'Vybarvi písmenko', null, { replay: async () => { if (!(await playH(L)) && ex) await say(ex.word); } });
  const glyph = shown(L);
  setStage(`<div class="paintwrap" id="pw"><canvas id="pc1"></canvas><canvas id="pc2"></canvas><div class="bar"><i id="pbar"></i></div><span class="hand" id="phand">👆</span></div>`);
  const pw = $('pw'), c1 = $('pc1'), c2 = $('pc2'); let finished = false;
  const setup = () => {
    if (!live(tk) || !pw.isConnected) return;
    const W = pw.clientWidth, dpr = Math.min(2, window.devicePixelRatio || 1), P = Math.round(W * dpr);
    [c1, c2].forEach(c => { c.width = P; c.height = P; });
    const x1 = c1.getContext('2d'), x2 = c2.getContext('2d'), font = px => `700 ${px}px Andika, sans-serif`;
    x2.font = font(100); const m = x2.measureText(glyph), wd = m.width || 60;
    const fs = Math.min(P * .74 / (wd / 100), P * .82);
    x2.font = font(fs); const m2 = x2.measureText(glyph), asc = m2.actualBoundingBoxAscent || fs * .72, desc = m2.actualBoundingBoxDescent || 0;
    const tx = P / 2, ty = (P * .94 + asc - desc) / 2;
    x1.fillStyle = '#ece6f7'; x1.fillRect(0, 0, P, P);
    x2.fillStyle = '#fff'; x2.fillRect(0, 0, P, P); x2.textAlign = 'center'; x2.textBaseline = 'alphabetic';
    x2.globalCompositeOperation = 'destination-out'; x2.fillText(glyph, tx, ty); x2.globalCompositeOperation = 'source-over';
    x2.lineWidth = Math.max(3, P * .012); x2.strokeStyle = isV(L) ? '#e03131' : '#1c5fd6'; x2.lineJoin = 'round'; x2.strokeText(glyph, tx, ty);
    /* hrubá mřížka: které čtverečky leží uvnitř písmenka */
    const N = 56, mc = document.createElement('canvas'); mc.width = N; mc.height = N; const mx = mc.getContext('2d');
    mx.font = font(fs * N / P); mx.textAlign = 'center'; mx.textBaseline = 'alphabetic'; mx.fillText(glyph, tx * N / P, ty * N / P);
    const data = mx.getImageData(0, 0, N, N).data, inside = new Uint8Array(N * N); let total = 0, hit = 0;
    for (let i = 0; i < N * N; i++) if (data[i * 4 + 3] > 90) { inside[i] = 1; total++; }
    let hue = rnd(360), last = null; const br = P * .085;
    const dab = (x, y) => {
      x1.fillStyle = `hsl(${hue},92%,58%)`; x1.beginPath(); x1.arc(x, y, br, 0, 6.283); x1.fill();
      const gx = x * N / P, gy = y * N / P, gr = br * N / P;
      for (let yy = Math.max(0, Math.floor(gy - gr)); yy <= Math.min(N - 1, Math.ceil(gy + gr)); yy++) for (let xx = Math.max(0, Math.floor(gx - gr)); xx <= Math.min(N - 1, Math.ceil(gx + gr)); xx++) {
        const i = yy * N + xx; if (inside[i] === 1 && (xx - gx) * (xx - gx) + (yy - gy) * (yy - gy) <= gr * gr) { inside[i] = 2; hit++; }
      }
    };
    const at = e => { const r = c2.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * P, (e.clientY - r.top) / r.height * P]; };
    const move = e => {
      if (finished || !last) return; const [x, y] = at(e), d = Math.hypot(x - last[0], y - last[1]), st = Math.max(1, Math.ceil(d / (br * .5)));
      for (let s = 1; s <= st; s++) dab(last[0] + (x - last[0]) * s / st, last[1] + (y - last[1]) * s / st);
      hue = (hue + d * .25) % 360; last = [x, y];
      const pr = total ? hit / total : 1; $('pbar').style.width = Math.min(100, pr / .86 * 100) + '%';
      if (pr >= .86) win();
    };
    c2.onpointerdown = e => { if (finished) return; e.preventDefault(); try { c2.setPointerCapture(e.pointerId); } catch (x) {} const h = $('phand'); if (h) h.remove(); last = at(e); dab(last[0], last[1]); sfx('tap'); move(e); };
    c2.onpointermove = e => { e.preventDefault(); move(e); };
    c2.onpointerup = c2.onpointercancel = () => { last = null; };
    const win = async () => {
      if (finished) return; finished = true; G.lock = true; sfx('magic'); pw.classList.add('ok');
      x1.fillStyle = isV(L) ? '#ff6b6b' : '#4d8dff'; x1.fillRect(0, 0, P, P); mark('a:' + L, true);
      await wait(500); if (!live(tk)) return;
      if (ex) { const d = document.createElement('div'); d.className = 'row pop'; d.style.alignItems = 'center'; d.innerHTML = `${picHTML(ex, 'sm')}<div class="word">${arcHTML(ex.syl, null, (i, j) => i === 0 && j === 0)}</div>`; $('stage').appendChild(d); }
      await playH(L); if (!live(tk)) return; if (ex) await say(ex.word); if (live(tk)) done(true);
    };
    G.win = win;
  };
  const go = () => requestAnimationFrame(setup);
  if (document.fonts && document.fonts.load) document.fonts.load('700 80px Andika', glyph).then(go, go); else go();
};

/* ---------- Nové písmenko: představení a hned vybarvit ---------- */
MAKE.intro = () => {
  const L = zoneLetter(S.pos); if (!L) return MAKE.paint();
  const exs = shuffle(RW(WORDS.filter(w => w.t[0] === L))).slice(0, 3);
  const tk = task('intro', 'Nové písmenko!', null, { ph: 'letter', upper: true, replay: async () => { if (!(await playH(L)) && exs[0]) await say(exs[0].word); } });
  setStage(`<div class="lintro"><div class="lblock pop"><span class="${isV(L) ? 'v' : 'c'}">${L}</span><span class="${isV(L) ? 'v' : 'c'}">${low(L)}</span></div></div><div class="row">${exs.map((w, i) => `<button class="tile p" data-i="${i}">${w.pic}</button>`).join('')}</div><button class="btn go" id="introGo" aria-label="Dál">${ICON.play}</button>`);
  sfx('magic');
  bind('.tile.p', (b, i) => { pokeCls(b, 'pop'); say(exs[i].word); });
  $('introGo').onclick = () => { if (!live(tk)) return; stopVoice(); S.seen['L' + L] = 1; save(); MAKE.paint(L); };
};

/* ---------- Řekni to: dítě čte nahlas, kamarád to zopakuje ---------- */
MAKE.speak = () => {
  const nw = RW(words()), f = focusL(), useW = nw.length >= 2 && (Math.random() < .7 || !RS(syls()).length);
  const w = useW ? pick(nw, w => 'm:' + w.word, w => fboost(w.t.includes(f), f) * (w.syl.length <= 2 ? 1.6 : 1)) : null;
  const s = w ? w.word : pick(RSor(syls()), x => 'm:' + x, x => fboost(tokens(x)[0] === f, f)), key = 'm:' + s;
  const tk = task('speak', 'Přečti to nahlas', null);   /* nic nepředříkávat: nejdřív čte dítě */
  $('sayBtn').hidden = true;
  const pet = S.pets.length ? S.pets[S.pets.length - 1 - rnd(Math.min(3, S.pets.length))] : null;
  setStage(`<div class="word card">${w ? arcHTML(w.syl, 'arcS') : `<span class="arc" id="arcS"><span>${colorize(s)}</span></span>`}</div><div class="speakrow">${pet ? petSVG(pet) : `<div style="width:110px;height:120px">${owlSVG()}</div>`}<button class="micbig" id="micB" aria-label="Mluv">${ICON.mic}</button></div><div class="lvl"><i id="lvl"></i></div>`);
  let fails = 0; const pe = q('.pet');
  const finish = async ok => {
    G.lock = true; if (w) { const d = document.createElement('div'); d.className = 'pop'; d.innerHTML = picHTML(w, 'sm'); $('stage').insertBefore(d, $('stage').firstChild); }
    if (w) await sayList(w.syl, hiArc('arcS')); if (!live(tk)) return; await say(s); if (live(tk)) { mark(key, true); done(ok); }
  };
  $('micB').onclick = async () => {
    if (!live(tk) || G.lock) return; const b = $('micB'); stopVoice();
    const ok = await capture(async take => {
      b.classList.remove('on'); closeMic(); if (!live(tk)) return; const lv = $('lvl'); if (lv) lv.style.width = '0';
      if (!take) { fails++; sfx('no'); if (fails >= 2) finish(false); return; }
      G.lock = true; if (pe) pe.classList.add('talk', 'jump'); await parrot(take, 1.5); if (pe) pe.classList.remove('talk'); if (!live(tk)) return;
      await wait(250); finish(true);
    }, { max: 4.5, idle: 4, level: r => { const lv = $('lvl'); if (lv) lv.style.width = Math.min(100, r * 700) + '%'; } });
    if (!ok) { S.speak = false; save(); if (live(tk)) next(); return; }
    b.classList.add('on'); sfx('beep');
  };
};
