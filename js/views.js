/* Slabikář — obrazovky: domov, mapa, kamarádi, hry, rodiče, studio */
'use strict';

const VIEWS = ['home', 'play', 'end', 'map', 'pets', 'games', 'parent', 'studio'];
let curView = '';
function show(v) {
  if (v !== 'play' && G) quitRide();
  if (v !== 'end') cerTok++;
  if (v !== 'play') LC = false;
  if (!['studio', 'play', 'parent'].includes(v)) closeMic();
  if (v !== curView) stopVoice();
  VIEWS.forEach(x => { const el = $(x); el.hidden = x !== v; if (x === v) { el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); } });
  curView = v; closeModal();
  if (v === 'home') renderHome();
  if (v === 'map') renderMap();
  if (v === 'pets') renderPets();
  if (v === 'games') renderGames();
  if (v === 'parent') renderParent();
  if (v === 'studio') renderStudio();
  if (v === 'play') { const r = zoneRegion(S.pos).id; $('playScene').innerHTML = sceneSVG(r, 'day'); }
}

/* ---------- domov ---------- */
function renderHome() {
  const reg = zoneRegion(S.pos).id;
  $('homeScene').innerHTML = sceneSVG(reg);
  $('home').style.setProperty('--ground', GROUND[reg]);
  $('starN').textContent = S.stars;
  $('homeStation').innerHTML = stationSVG(S.pos);
  const tr = $('homeTrain'); tr.className = 'trainrow'; tr.innerHTML = trainHTML(trainFit(), false); bindTrain(tr);
  /* kolik jízd zbývá do další stanice */
  const pace = S.pace | 0, rw = rideReward(), nreg = zoneRegion(S.pos + 1).id;
  let strip = '';
  if (S.pets.length === 0) strip = `<span class="nd now">${miniEgg(reg)}</span>`;
  else {
    for (let i = 0; i < pace; i++) {
      const done = i < S.step, now = i === S.step, last = i === pace - 1;
      strip += `${i ? '<span class="ln"></span>' : ''}<span class="nd${done ? ' done' : ''}${now ? ' now' : ''}">${done ? ICON.ok : last ? miniEgg(nreg) : miniGift()}</span>`;
    }
    const nl = zoneLabel(S.pos + 1);
    strip += `<span class="ln"></span><span class="stn">${S.pos + 1 === 0 ? 'A' : nl === '★' ? '<span style="color:#e0a100">★</span>' : `<span class="${isV(nl) ? 'v' : 'c'}">${nl}</span>`}</span>`;
  }
  $('nextStrip').innerHTML = strip; void rw;
  /* hnízdo se zlatým vajíčkem */
  const nest = $('nest');
  if (S.egg) {
    const ready = eggReady();
    nest.hidden = false; nest.className = 'nest' + (ready ? ' ready' : '');
    nest.innerHTML = `${eggSVG('gold')}<svg class="tw-nest" viewBox="0 0 120 50" aria-hidden="true"><ellipse cx="60" cy="22" rx="56" ry="20" fill="#9a6a3e"/><path d="M8 18q26 16 52 2q26 16 52-2M10 28q24 14 50 0q26 14 50 0" stroke="#70451f" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="14" rx="44" ry="9" fill="#70451f"/></svg>${ready ? '<span class="hand">👆</span>' : '<span class="zz">z z</span>'}`;
  } else nest.hidden = true;
  /* tlačítko jízdy, nebo spící sovička po denním limitu */
  const lim = S.limit > 0 && ridesToday() >= S.limit, go = $('goBtn');
  go.className = 'gobtn' + (lim ? ' sleep' : ''); go.innerHTML = lim ? `<span style="width:70%;height:76%;display:block">${owlSVG({ cls: 'sleep' })}</span>` : ICON.play;
  go.setAttribute('aria-label', lim ? 'Sovička spí' : 'Jedeme');
  const lp = S.pets[S.pets.length - 1];
  $('dockPets').innerHTML = `${lp ? petSVG(lp) : ICON.heart}<span>Kamarádi</span>${S.pets.length ? `<span class="cnt">${S.pets.length}</span>` : ''}`;
  renderVoice();
}
function goRide() {
  unlock();
  if (S.limit > 0 && ridesToday() >= S.limit) { sfx('hoot'); sayPh('sleep'); return; }
  const btn = $('goBtn'); if (btn.dataset.busy) return; btn.dataset.busy = '1'; setTimeout(() => delete btn.dataset.busy, 1500);
  sfx('tap'); if (!S.seen.hello) { S.seen.hello = 1; save(); }
  depart($('homeTrain'), () => startRide('mix'));
}

/* ---------- mapa trati ---------- */
const REGBG = { louka: '#a5e38c', les: '#6cc38a', farma: '#f2df7e', hory: '#cfe6ff', more: '#8fd6ff', vesmir: '#3b2a78' };
const REGEMO = { louka: '🌼🐝🦋', les: '🌲🍄🦔', farma: '🐄🐔🌻', hory: '🏔️🐐❄️', more: '🌊🐬⛵', vesmir: '🪐🚀⭐' };
function renderMap() {
  const N = Math.max(ZN, S.pos + 4), H = 120, top = 90, W = 400, total = top + N * H + 70;
  const pt = z => [W / 2 + Math.sin(z * .95) * 118, total - 70 - z * H];
  let bands = '', path = '', nodes = '';
  for (let r = 0; r * 4 < N; r++) {
    const reg = REGIONS[r % REGIONS.length], y1 = total - 70 - (r * 4 + 3.5) * H, y2 = r === 0 ? total : total - 70 - (r * 4 - .5) * H;
    bands += `<rect x="0" y="${f1(y1)}" width="${W}" height="${f1(y2 - y1)}" fill="${REGBG[reg.id]}"/>`;
    const em = [...REGEMO[reg.id].matchAll(/\p{Extended_Pictographic}️?/gu)].map(m => m[0]);
    em.slice(0, 2).forEach((e, i) => { const zz = r * 4 + i * 1.3 + .5, [x] = pt(zz); bands += `<text x="${x > W / 2 ? 46 : W - 46}" y="${f1(total - 70 - zz * H)}" font-size="40" text-anchor="middle" class="emo" opacity=".85">${e}</text>`; });
    const lx = pt(r * 4 + 3.3)[0] > W / 2 ? 96 : W - 96;
    bands += `<text class="rname" x="${f1(lx)}" y="${f1(y1 + 44)}" text-anchor="middle" font-size="30" font-weight="800" fill="${reg.id === 'vesmir' ? '#fff' : INK}" opacity=".55">${reg.n}</text>`;
  }
  for (let z = 0; z < N; z++) { const [x, y] = pt(z); if (!z) path = `M${f1(x)} ${f1(total)}L${f1(x)} ${f1(y)}`; else { const [px, py] = pt(z - 1); path += `C${f1(px)} ${f1(py - H * .5)} ${f1(x)} ${f1(y + H * .5)} ${f1(x)} ${f1(y)}`; } }
  for (let z = 0; z < N; z++) {
    const [x, y] = pt(z), lab = zoneLabel(z), got = z <= S.pos, now = z === S.pos;
    const col = !got ? '#9aa0b4' : z === 0 || lab === 'Y' ? '#e03131' : lab === '★' ? '#e0a100' : '#1c5fd6';
    const pets = S.pets.filter(p => p.z === z).slice(0, 2);
    nodes += `<g class="mnode" data-z="${z}" transform="translate(${f1(x)} ${f1(y)})">
<circle r="38" fill="${got ? '#fff' : '#e9e6f0'}" stroke="${now ? '#2fb35a' : INK}" stroke-width="${now ? 7 : 4}"/>
<text y="${z === 0 ? 8 : 13}" text-anchor="middle" font-size="${z === 0 ? 22 : lab === 'CH' ? 30 : 38}" font-weight="700" fill="${col}">${z === 0 ? 'AEIOU' : lab}</text>
${got ? '' : `<g transform="translate(22 -30) scale(.9)" color="#6d6780"><circle r="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/><svg x="-10" y="-10" width="20" height="20" viewBox="0 0 24 24">${ICON.lock.replace(/<\/?svg[^>]*>/g, '')}</svg></g>`}
${pets.map((p, i) => `<svg x="${(x > W / 2 ? -1 : 1) * (52 + i * 44) - 22}" y="-26" width="46" height="46" viewBox="0 0 120 120">${petInner(p)}</svg>`).join('')}
${now ? `<g transform="translate(-52 -136)"><g class="mtrain"><svg width="104" height="97" viewBox="0 -44 204 190">${locoSVG().replace(/<\/?svg[^>]*>/g, '')}</svg></g></g>` : ''}</g>`;
  }
  $('mapBox').innerHTML = `<svg viewBox="0 0 ${W} ${total}" aria-label="Mapa trati">${bands}<path d="${path}" fill="none" stroke="#9a6a3e" stroke-width="22" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#f5d9a6" stroke-width="10" stroke-dasharray="4 14" stroke-linecap="round"/>${nodes}</svg>`;
  $$('.mnode', $('mapBox')).forEach(n => n.onclick = () => {
    const z = +n.dataset.z;
    if (z > S.pos) { sfx('no'); pokeCls(n.querySelector('circle'), 'shake'); return; }
    const L = zoneLetter(z); sfx('tap');
    if (L) playH(L); else if (z === 0) playH('A');
    setTimeout(() => startRide('mix', { focus: L || null }), 500);
  });
  requestAnimationFrame(() => { const sc = $('mapScroll'), svg = sc.querySelector('svg'); if (!svg) return; const k = svg.getBoundingClientRect().height / total; sc.scrollTop = Math.max(0, (total - 70 - S.pos * H) * k - sc.clientHeight * .6); });
}

/* ---------- kamarádi a sbírka ---------- */
function renderPets() {
  LC = S.case === 'lower';
  const ghosts = Math.max(3, 12 - S.pets.length);
  $('petGrid').innerHTML = S.pets.slice().reverse().map(p => `<button class="petcard${p.rare ? ' rare' : ''}" data-p="${p.id}">${petSVG(p)}<b>${colorize(p.name.join(''))}</b></button>`).join('') +
    Array.from({ length: ghosts }, () => `<div class="petcard gh">${petGhost()}<b>&nbsp;</b></div>`).join('');
  $('petInfo').textContent = S.pets.length ? `Kamarádů: ${S.pets.length}. Další se vylíhne ve stanici.` : 'Dojeď první jízdu a vylíhne se kamarád.';
  $$('.petcard[data-p]', $('petGrid')).forEach(b => b.onclick = () => openPet(+b.dataset.p));
  $('medalRow').innerHTML = MEDALS.map((m, i) => medalSVG(m, i < S.medals ? '' : 'off')).join('');
  $('medalInfo').textContent = S.medals < MEDALS.length ? `Hvězdiček: ${S.stars}. Další medaile za ${MEDALS[S.medals]}.` : `Hvězdiček: ${S.stars}. Všechny medaile!`;
  $('stickRow').innerHTML = S.stick.length ? S.stick.map(e => `<span>${e}</span>`).join('') : '<span class="empty">Samolepky jsou v dárcích.</span>';
  $('hatRow').innerHTML = HATS.map(h => `<span class="hb${S.hats.includes(h.id) ? '' : ' off'}" title="${h.n}">${hatIcon(h.id)}</span>`).join('');
}
function closeModal() { const m = $('modal'); if (m) m.remove(); }
function openPet(id) {
  const p = petById(id); if (!p) return; closeModal(); LC = S.case === 'lower';
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  const draw = () => {
    m.innerHTML = `<div class="mcard"><button class="ibtn sm cls" id="mX" aria-label="Zavřít">${ICON.x}</button>
<div class="bigpet" id="bp">${petSVG(p)}</div><button class="word card" id="mName" style="border:0;cursor:pointer">${arcHTML(p.name, 'pnA')}</button>
<p class="small">Vylíhl se ve stanici ${zoneLabel(p.z) === '★' ? '★' : zoneLabel(p.z)} (${zoneRegion(p.z).n.toLowerCase()}).</p>
${S.hats.length ? `<div class="hatsrow"><button class="hb${p.hat ? '' : ' sel'}" data-h="" aria-label="bez čepice">${ICON.x}</button>${S.hats.map(h => `<button class="hb${p.hat === h ? ' sel' : ''}" data-h="${h}">${hatIcon(h)}</button>`).join('')}</div>` : '<p class="small">Čepice jsou v dárcích.</p>'}</div>`;
    $('mX').onclick = closeModal;
    $('bp').onclick = () => { const s = $('bp').firstChild; pokeCls(s, 'jump', 650); sfx('squeak', p.seed); hearts($('bp'), 4); };
    $('mName').onclick = () => sayName(p.name, hiArc('pnA'));
    $$('.hb', m).forEach(b => b.onclick = () => { p.hat = b.dataset.h; save(); sfx('boing'); draw(); renderPets(); pokeCls($('bp').firstChild, 'jump', 650); });
  };
  m.onclick = e => { if (e.target === m) closeModal(); };
  document.body.appendChild(m); draw(); sfx('squeak', p.seed);
  setTimeout(() => sayName(p.name, hiArc('pnA')), 250);
}

/* ---------- hry ---------- */
function renderGames() {
  const av = avail();
  $('gameGrid').innerHTML = `<button class="gcard mix" data-m="mix"><b>Mix všeho</b><small>Jako jízda vláčkem</small></button>` +
    Object.keys(GM).map(k => `<button class="gcard${av.includes(k) ? '' : ' off'}" data-m="${k}" style="--gc:${GM[k].c}"><span class="ex${GM[k].e ? ' e' : ''}">${GM[k].ex}</span><b>${GM[k].n}</b><small>${av.includes(k) ? GM[k].d : k === 'speak' ? 'Až rodič povolí mikrofon' : 'Až budeš znát víc písmenek'}</small></button>`).join('');
  $$('.gcard', $('gameGrid')).forEach(b => b.onclick = () => { const m = b.dataset.m; if (m !== 'mix' && !avail().includes(m)) { sfx('no'); shake(b); return; } sfx('tap'); startRide(m); });
}

/* ---------- vstup pro rodiče ---------- */
function parentGate() {
  closeModal(); const a = 6 + rnd(9), b = 3 + rnd(7), r = a + b;
  const opts = shuffle([r, r + 1 + rnd(3), r - 1 - rnd(3), r + 10]);
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="mcard"><button class="ibtn sm cls" id="mX" aria-label="Zavřít">${ICON.x}</button><p class="gate">Pro rodiče<br><span class="small">Kolik je ${a} + ${b}?</span></p><div class="row">${opts.map(o => `<button class="btn" data-o="${o}">${o}</button>`).join('')}</div></div>`;
  document.body.appendChild(m);
  m.onclick = e => { if (e.target === m) closeModal(); };
  $('mX').onclick = closeModal;
  $$('[data-o]', m).forEach(x => x.onclick = () => { if (+x.dataset.o === r) { closeModal(); show('parent'); } else { sfx('no'); shake(x); setTimeout(closeModal, 500); } });
}

/* ---------- rodiče ---------- */
const LBL = { f: 'první hláska', e: 'poslední hláska', c: 'tleskání', s: 'slyšet slabiku', h: 'slyšet písmenko', b: 'složit slabiku', w: 'složit slovo', r: 'přečíst slovo', k: 'najít slovo', p: 'pexeso', a: 'malování', m: 'číst nahlas' };
const MODEN = m => m === 'mix' ? 'Jízda' : (GM[m] ? GM[m].n : m);
const fmt = d => new Date(d).toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });
function segBtns(id, opts, cur, set) {
  $(id).innerHTML = opts.map(o => `<button class="btn sm${cur === o[0] ? ' on' : ''}" data-v="${o[0]}">${o[1]}</button>`).join('');
  $$('.btn', $(id)).forEach(b => b.onclick = () => { const v = b.dataset.v; set(isNaN(+v) || v === '' ? v : +v); save(); renderParent(); });
}
function renderVoice() {
  const vs = $('vstat'); if (!vs) return;
  vs.textContent = voice ? `Teď mluví: ${voice.name}.` : hasTTS ? 'Český hlas se nenašel. Hra zkusí mluvit i tak a ukáže text.' : 'Prohlížeč neumí mluvit. Čti nahlas ty, text se ukáže.';
  const sel = $('vsel'); sel.innerHTML = csV.map(v => `<option${voice && v.name === voice.name ? ' selected' : ''}>${esc(v.name)}</option>`).join(''); sel.hidden = csV.length < 2; $('vselL').hidden = csV.length < 2;
}
function renderParent() {
  const kn = knownN();
  $('chips').innerHTML = `<button class="chip${kn === 0 ? ' here' : ''}" data-i="0"><span class="v">AEIOU</span></button>` + ORDER.map((t, i) => `<button class="chip${i >= kn ? ' off' : ''}${i + 1 === kn ? ' here' : ''}" data-i="${i + 1}" aria-label="Zná až po ${t}">${ctok(t)}</button>`).join('');
  $('kinfo').textContent = `Slov ve hře: ${words().length} z ${WORDS.length}. Slabik: ${syls().length}. Vláček je ve stanici ${zoneLabel(S.pos)}.`;
  $$('.chip', $('chips')).forEach(b => b.onclick = () => { const i = +b.dataset.i; S.known = i; S.pos = i; S.step = 0; for (let j = 0; j < i; j++) S.seen['L' + ORDER[j]] = 1; save(); renderParent(); });
  $('rate').value = S.rate; $('rateV').textContent = S.rate.toFixed(2) + '×';
  $('showtxt').checked = S.text; $('recPlay').checked = S.recPlay; $('sfxOn').checked = S.sfx; $('speakOn').checked = S.speak !== false;
  segBtns('vmSeg', [['own', 'Jen můj hlas'], ['mix', 'Můj hlas + předčítání'], ['tts', 'Jen předčítání']], vmode(), v => { S.vmode = v; S.own = v !== 'tts'; });
  $('recOnly').checked = !!S.recOnly; $('recOnlyF').hidden = vmode() === 'tts';
  $('vmInfo').textContent = { own: 'Mluví jen tvůj hlas, předčítání nikdy nenaskočí. Co nahrané není, hra neřekne, proto nahraj ve studiu záložku „Teď potřeba“.', mix: 'Co máš nahrané, říká tvým hlasem, zbytek dořekne předčítání.', tts: 'Všechno říká předčítání prohlížeče.' }[vmode()];
  const miss = studioItems('n').filter(x => !hasK(x.k)).length;
  $('needInfo').innerHTML = miss ? `Pro písmenka, která teď hra používá, chybí <b>${miss}</b> nahrávek.` : 'Všechno, co hra teď používá, máš nahrané. ✓';
  segBtns('caseSeg', [['upper', 'VELKÁ'], ['lower', 'malá'], ['mix', 'obojí']], S.case, v => S.case = v);
  segBtns('seg', [[6, '6 úkolů'], [8, '8 úkolů'], [10, '10 úkolů']], S.round, v => S.round = v);
  segBtns('paceSeg', [[2, '2 jízdy'], [3, '3 jízdy'], [4, '4 jízdy'], [5, '5 jízd']], S.pace, v => S.pace = v);
  segBtns('limSeg', [[0, 'bez limitu'], [2, '2 denně'], [3, '3 denně'], [4, '4 denně']], S.limit, v => S.limit = v);
  $('limInfo').textContent = S.limit ? `Dnes odjeto ${ridesToday()} z ${S.limit}.` : `Dnes odjeto ${ridesToday()}.`;
  const wk = weakList(12);
  $('weak').innerHTML = wk.length ? wk.map(e => { const k = e[0].split(':'); return `<li><b>${colorize(k[1])}</b><span>${LBL[k[0]] || ''}</span><span class="small">✓ ${e[1].r}  ✗ ${e[1].w}</span></li>`; }).join('') : '<li class="empty">Zatím žádné chyby.</li>';
  $('hist').innerHTML = S.hist.length ? S.hist.slice(0, 10).map(h => `<li><span>${fmt(h.d)}</span><span>${MODEN(h.m)}</span><span class="small">${h.s} z ${h.n} ★</span></li>`).join('') : '<li class="empty">Zatím nic.</li>';
  const tot = S.hist.length; $('sumInfo').textContent = `Jízd celkem: ${S.rides}. Hvězdiček: ${S.stars}. Kamarádů: ${S.pets.length}.${tot ? '' : ''}`;
  renderRec(); renderVoice();
}
async function renderRec() { const n = await countRec(); $('recCount').textContent = n == null ? 'Ukládání nahrávek tady nejde.' : `Nahráno: ${n}.`; }
function bindParent() {
  $('rate').oninput = e => { S.rate = +e.target.value; $('rateV').textContent = S.rate.toFixed(2) + '×'; save(); };
  $('showtxt').onchange = e => { S.text = e.target.checked; save(); };
  $('recOnly').onchange = e => { S.recOnly = e.target.checked; save(); };
  $('recPlay').onchange = e => { S.recPlay = e.target.checked; save(); };
  $('sfxOn').onchange = e => { S.sfx = e.target.checked; save(); };
  $('speakOn').onchange = e => { S.speak = e.target.checked; save(); };
  $('vsel').onchange = e => { S.voice = e.target.value; save(); loadV(); tts('Ahoj, jdeme číst.'); };
  $('vtest').onclick = () => { unlock(); say('Ahoj, jdeme číst. Ma, me, mi, mo, mu.'); };
  $('micTest').onclick = async () => { unlock(); try { await openMic(); $('micInfo').textContent = 'Mikrofon funguje. Hra „Řekni to“ je zapnutá. Dokud je hra otevřená, už se ptát nebude.'; } catch (e) { $('micInfo').textContent = 'Mikrofon nejde. Povol ho v nastavení prohlížeče.'; } };
  $('studioBtn').onclick = () => { if (vmode() === 'tts') { S.vmode = 'own'; S.own = true; save(); } stTab = 'n'; show('studio'); };
  $('recClear').onclick = async () => { if (!confirm('Opravdu smazat všechny nahrávky?')) return; await clearRec(); renderRec(); };
  $('packOut').onclick = async () => {
    $('packInfo').textContent = 'Balím…'; const { blob, n } = await exportPack();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hlas.json'; document.body.appendChild(a); a.click(); a.remove();
    $('packInfo').textContent = `Uloženo ${n} nahrávek do souboru hlas.json.`;
  };
  $('packIn').onclick = () => $('packFile').click();
  $('packFile').onchange = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    try { const n = await importPack(await f.text(), 'rec'); if (vmode() === 'tts') { S.vmode = 'own'; S.own = true; } save(); $('packInfo').textContent = `Načteno ${n} nahrávek.`; renderParent(); }
    catch (x) { $('packInfo').textContent = 'Tohle není soubor s hlasem.'; }
  };
  $('resetBtn').onclick = () => { $('resetAsk').hidden = false; };
  $('resetNo').onclick = () => { $('resetAsk').hidden = true; };
  $('resetYes').onclick = () => {
    const keep = { known: 0, rate: S.rate, round: S.round, text: S.text, voice: S.voice, own: S.own, vmode: S.vmode, case: S.case, pace: S.pace, limit: S.limit, sfx: S.sfx, mic: S.mic, recPlay: S.recPlay, packSig: S.packSig };
    S = Object.assign(JSON.parse(JSON.stringify(DEF)), keep); save(); $('resetAsk').hidden = true; renderParent();
  };
}

/* ---------- nahrávací studio ---------- */
let stTab = 'n';
const ordIdx = t => { const i = ORDER.indexOf(t); return i < 0 ? -1 : i; };
const needIdx = toks => Math.max(-1, ...toks.map(ordIdx));
function studioItems(tab) {
  const kn = knownN();
  if (tab === 'n') {                                   /* přesně to, co hra teď může říct (+ jedno další písmenko) */
    const k2 = Math.min(ORDER.length, kn + 1), ks = new Set([...VOW, ...ORDER.slice(0, k2)]), out = [], seen = new Set();
    const add = (grp, x) => { if (seen.has(low(x.k))) return; seen.add(low(x.k)); out.push(Object.assign({ grp, need: true }, x)); };
    [...VOW, ...ORDER.slice(0, k2)].forEach(L => add('Hlásky', { k: 'h:' + L }));
    ORDER.slice(0, k2).filter(t => t !== 'Y').forEach(c => VOW.forEach(v => add('Slabiky', { k: c + v })));
    const ws = WORDS.filter(w => w.t.every(t => ks.has(t))).sort((a, b) => needIdx(a.t) - needIdx(b.t));
    ws.forEach(w => add('Slova', { k: w.word, pic: w.pic }));
    ws.forEach(w => { if (w.syl.length > 1) w.syl.forEach(x => add('Slabiky ze slov', { k: x })); });
    S.pets.forEach(p => add('Jména kamarádů (vcelku)', { k: p.name.join('') }));
    NAMES.filter(n => tokens(n.join('')).map(base).every(t => ks.has(t))).forEach(n => add('Jména kamarádů (vcelku)', { k: n.join('') }));
    studioItems('p').forEach(x => add(x.grp, x));
    return out;
  }
  if (tab === 'h') return [...VOW, ...ORDER].map(L => ({ k: 'h:' + L, h: `${ctok(L)} <small class="small">řekni ${hintH(L)}</small>`, show: shown(L), sub: 'řekni ' + hintH(L), need: ordIdx(L) < kn }));
  if (tab === 's') {
    const basic = ORDER.filter(t => t !== 'Y').flatMap(c => VOW.map(v => c + v));
    const extra = [...new Set(WORDS.slice().sort((a, b) => needIdx(a.t) - needIdx(b.t)).flatMap(w => w.syl))].filter(s => !basic.includes(s));
    return basic.map(s => ({ k: s, need: ordIdx(tokens(s)[0]) < kn, grp: 'Slabiky' })).concat(extra.map(s => ({ k: s, need: needIdx(tokens(s).map(base)) < kn, grp: 'Slabiky ze slov' })));
  }
  if (tab === 'w') return WORDS.slice().sort((a, b) => needIdx(a.t) - needIdx(b.t)).map(w => ({ k: w.word, pic: w.pic, need: needIdx(w.t) < kn }));
  const out = [], seen = new Set();
  PHSEC.forEach(([g, ids]) => ids.forEach(id => { const t = PH[id]; if (!seen.has(t)) { seen.add(t); out.push({ k: t, phrase: 1, need: true, grp: 'Věty: ' + g }); } }));
  Object.values(PH).concat(REGIONS.map(r => r.hello)).forEach(t => { if (!seen.has(t)) { seen.add(t); out.push({ k: t, phrase: 1, need: true, grp: 'Věty: ostatní' }); } });
  return out;
}
const hintH = L => isV(L) ? `krátké „${low(L)}“` : CONT.includes(L) ? `„${L === 'CH' ? 'chhh' : low(L).repeat(3)}“` : `jen krátce „${low(L)}“, bez é`;
async function renderStudio() {
  const items = studioItems(stTab), ks = new Set(await allKeys());
  $('stTabs').innerHTML = [['n', 'Teď potřeba'], ['h', 'Hlásky'], ['s', 'Slabiky'], ['w', 'Slova'], ['p', 'Věty sovičky']].map(t => `<button class="btn sm${stTab === t[0] ? ' on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('');
  $$('#stTabs .btn').forEach(b => b.onclick = () => { stTab = b.dataset.t; renderStudio(); });
  const has = x => ks.has(low(x.k)), done = items.filter(has).length, needL = items.filter(x => x.need && !has(x));
  $('stInfo').innerHTML = `Hotovo ${done} z ${items.length}.${needL.length ? ` Hned potřeba: <b>${needL.length}</b>.` : ''}<div class="prog"><i style="width:${items.length ? done / items.length * 100 : 0}%"></i></div>`;
  $('stSeq').textContent = needL.length ? `Nahrát potřebné (${needL.length})` : `Nahrát chybějící (${items.length - done})`;
  $('stSeq').onclick = () => seqRec((needL.length ? needL : items.filter(x => !has(x))));
  let grp = '';
  $('stList').innerHTML = items.map(x => {
    const g = x.grp && x.grp !== grp ? `<li class="grp">${(grp = x.grp)}</li>` : '';
    const lab = x.phrase ? esc(x.k) : x.k.startsWith('h:') ? `${ctok(x.k.slice(2))} <small class="small">řekni ${hintH(x.k.slice(2))}</small>` : (x.pic ? `<span class="emo">${x.pic}</span> ` : '') + colorize(x.k);
    return `${g}<li><b style="${x.phrase ? 'font-size:17px' : ''}">${lab}${x.need && !has(x) ? ' <small class="small">• teď</small>' : ''}</b><button class="btn sm sr" data-x="${esc(x.k)}">Nahrát</button><button class="btn sm sp" data-x="${esc(x.k)}" aria-label="Přehrát">▶</button><span>${has(x) ? '✓' : ''}</span></li>`;
  }).join('');
  $$('.sr', $('stList')).forEach(b => b.onclick = async () => {
    unlock(); const busy = !!(cap && cap.job);
    const ok = await recordTo(b.dataset.x, b, bl => { if (bl) { playBlob(bl); renderStudio(); } else { b.textContent = 'Nic jsem neslyšel'; setTimeout(renderStudio, 1400); } });
    if (!ok) { $('stWarn').hidden = false; } else if (!busy) b.textContent = 'Mluv…';
  });
  $$('.sp', $('stList')).forEach(b => b.onclick = async () => { unlock(); const k = low(b.dataset.x), r = await getRec(k); if (r) playBlob(r, k); else if (!k.startsWith('h:')) tts(b.dataset.x); });
}
/* nahrávání jedno po druhém: ukáže, nahraje, přehraje, další */
async function seqRec(items) {
  if (!items.length) return; unlock();
  try { await openMic(); } catch (e) { $('stWarn').hidden = false; return; }
  const ov = document.createElement('div'); ov.className = 'seq'; document.body.appendChild(ov);
  ov.innerHTML = `<p class="small" id="sqN"></p><div class="what" id="sqW"></div><p class="small" id="sqH"></p><div class="lvl" style="width:220px"><i id="sqL"></i></div><p class="stat" id="sqS"></p><div class="cerbtns"><button class="btn sm" id="sqBack">↺ Znovu předchozí</button><button class="btn sm" id="sqSkip">Přeskočit</button><button class="btn sm pri" id="sqEnd">Konec</button></div><p class="small">Mluv zřetelně, 10–15 cm od mikrofonu. Nahrávka skončí sama.</p>`;
  let i = 0, stop = false, cut = null, fails = 0;
  const abort = how => { if (cap && cap.job) cap.job.cancel(); if (cut) cut(how); };
  $('sqEnd').onclick = () => { stop = true; abort('end'); };
  $('sqSkip').onclick = () => abort('skip');
  $('sqBack').onclick = () => abort('back');
  while (i < items.length && !stop) {
    const x = items[i]; LC = false;
    $('sqN').textContent = `${i + 1} z ${items.length}`;
    $('sqW').className = 'what' + (x.phrase ? ' ph' : ''); $('sqW').innerHTML = x.phrase ? esc(x.k) : x.k.startsWith('h:') ? ctok(x.k.slice(2)) : colorize(x.k);
    $('sqH').textContent = x.k.startsWith('h:') ? 'Řekni ' + hintH(x.k.slice(2)) : x.phrase ? (x.grp || '') + ' · řekni po svém, text je jen nápověda' : x.pic ? x.pic : '';
    $('sqS').textContent = 'Připrav se…'; await wait(700); if (stop) break;
    $('sqS').innerHTML = '<span class="dot"></span>Mluv!';
    const res = await new Promise(r => { cut = r; capture(t => r(t), { max: 6, idle: 6, level: v => { const l = $('sqL'); if (l) l.style.width = Math.min(100, v * 700) + '%'; } }).then(ok => { if (!ok) r('fail'); }); });
    cut = null; const l = $('sqL'); if (l) l.style.width = '0';
    if (stop || res === 'end') break;
    if (res === 'fail') { $('sqS').textContent = 'Mikrofon nejde.'; await wait(1500); break; }
    if (res === 'skip') { i++; fails = 0; continue; }
    if (res === 'back') { i = Math.max(0, i - 1); continue; }
    if (!res) { fails++; $('sqS').textContent = 'Nic jsem neslyšel, ještě jednou.'; await wait(900); if (fails >= 3) { i++; fails = 0; } continue; }
    fails = 0; const b = toWav(res.f, res.sr); await putRec(low(x.k), b);
    $('sqS').textContent = 'Uloženo ✓'; await playBlob(b, low(x.k)); await wait(650); i++;
  }
  ov.remove(); renderStudio();
}

/* nahrávání přímo ve hře (rodič zapne v nastavení) */
function bindPlayRec() {
  $('recBtn').onclick = async () => {
    if (!G || !G.text) return; const text = G.text, msg = h => { const m = $('recMsg'); m.hidden = false; m.innerHTML = h; };
    const busy = !!(cap && cap.job);
    const ok = await recordTo(text, $('recBtn'), b => { if (b) { msg(`Uloženo: „${esc(low(text))}“`); playBlob(b); setTimeout(() => $('recMsg').hidden = true, 2500); } else msg('Nic jsem neslyšel. Zkus to blíž k mikrofonu.'); });
    if (!ok) msg('Tady mikrofon nejde.'); else if (!busy) msg(`Mluv: „${esc(low(text))}“`);
  };
}
