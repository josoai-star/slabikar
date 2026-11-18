/* Slabikář — jízda: kolo úloh, příjezd do stanice, vajíčko, dárek */
'use strict';

/* vagónky s kamarády a nákladem + lokomotiva */
function trainHTML(max, newLast) {
  const items = S.train.slice(-max), off = S.train.length - items.length;
  return items.map((it, i) => {
    const p = it.p ? petById(it.p) : null, cargo = it.p ? (p ? cargoPet(p) : '') : cargoEmoji(it.e);
    return `<div class="wag${newLast && i === items.length - 1 ? ' new' : ''}" data-i="${off + i}"${p ? ` data-pet="${p.id}"` : ''}>${wagonSVG(off + i, cargo)}</div>`;
  }).join('') + locoSVG();
}
const trainFit = () => clamp(Math.ceil(innerWidth / (Math.min(236, Math.max(118, Math.min(innerWidth * .31, innerHeight * .25))) * .6)) + 1, 3, 12);

/* ---------- kolo ---------- */
function startRide(mode, o) {
  o = o || {}; unlock();
  G = { mode, i: 0, n: S.round, res: [], lock: false, lastKey: null, used: new Set(), prev: null, tk: 0, told: new Set(), streak: 0, clean: [], cnt: {}, dead: false };
  if (o.focus !== undefined) G.focus = o.focus;
  const L = zoneLetter(S.pos); G.intro = !!(L && o.focus === undefined && !S.seen['L' + L] && S.known < S.pos);
  show('play'); next();
}
function quitRide() { if (G) { G.dead = true; (G.clean || []).forEach(f => { try { f(); } catch (e) {} }); } stopVoice(); if (cap && cap.job) cap.job.cancel(); G = null; }
function renderTrack() {
  const el = $('ptrack'); if (!el || !G) return;
  const rw = rideReward(), reg = zoneRegion(S.pos + (S.step + 1 >= S.pace ? 1 : 0)).id;
  if (el.dataset.n !== String(G.n)) {
    el.dataset.n = G.n;
    el.innerHTML = Array.from({ length: G.n }, () => '<div class="cell"><i></i></div>').join('') + `<span class="ploco moving">${locoSVG()}</span><span class="pend">${rw === 'egg' ? miniEgg(reg) : miniGift()}</span>`;
  }
  $$('.cell', el).forEach((c, i) => { const r = G.res[i]; c.className = 'cell' + (r === true ? ' st' : r === false ? ' dn' : ''); c.firstChild.innerHTML = r === true ? ICON.star : ''; });
  const lo = el.querySelector('.ploco');
  lo.style.left = G.i >= G.n ? 'calc(100% - 30px)' : `calc(20px + (100% - 74px) * ${(G.i + .5) / G.n})`;
}
function next() {
  if (!G || G.dead) return; renderTrack(); if (G.i >= G.n) return finishRide();
  if (G.intro) { G.intro = false; return MAKE.intro(); }
  const av = avail(); let t = G.mode;
  if (t === 'mix') {
    const once = ['paint', 'pairs', 'clap', 'mole'];
    const ws = av.map(k => { const c = G.cnt[k] || 0; let w = GM[k].w; if (k === G.prev) w *= .04; if (c >= 1 && once.includes(k)) w *= .05; else if (c >= 2) w *= .3; return w; });
    let r = ws.reduce((a, b) => a + b, 0) * Math.random(); t = av[av.length - 1];
    for (let i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { t = av[i]; break; } }
  } else if (!av.includes(t)) t = av.includes('find') ? 'find' : av[0];
  G.prev = t; G.cnt[t] = (G.cnt[t] || 0) + 1;
  MAKE[t]();
}

/* ---------- konec kola: všechno se uloží hned, oslava až potom ---------- */
function makeGift() {
  const freeH = HATS.filter(h => !S.hats.includes(h.id)); const hat = freeH.length && S.pets.length && (S.gifts % 2 === 0 || Math.random() < .25);
  S.gifts++;
  if (hat) { const h = pickOne(freeH); S.hats.push(h.id); return { t: 'hat', id: h.id }; }
  const left = STICK.filter(s => !S.stick.includes(s)), e = pickOne(left.length ? left : STICK); S.stick.push(e); S.train.push({ e }); return { t: 'st', e };
}
function finishRide() {
  const stars = G.res.filter(Boolean).length, n = G.n, mode = G.mode; quitRide();
  const first = S.pets.length === 0, reg0 = zoneRegion(S.pos).id, td = dayStr();
  S.stars += stars; S.rides++; S.hist.unshift({ d: Date.now(), m: mode, n, s: stars }); S.hist = S.hist.slice(0, 40);
  S.dayRides = { d: td, n: (S.dayRides.d === td ? S.dayRides.n : 0) + 1 };
  S.step++; let arrived = false; if (S.step >= S.pace) { S.pos++; S.step = 0; arrived = true; }
  const reward = first || arrived ? 'egg' : 'gift'; let pet = null, gift = null;
  if (reward === 'egg') pet = newPet(S.pos, false); else gift = makeGift();
  const m0 = S.medals; S.medals = MEDALS.filter(m => m <= S.stars).length;
  let night = false; if (!S.egg && S.eggDay !== td) { S.egg = { day: td, seed: (Math.random() * 4294967296) >>> 0 }; S.eggDay = td; night = true; }
  save();
  ceremony({ stars, n, arrived, reward, pet, gift, medal: S.medals > m0 ? MEDALS[S.medals - 1] : 0, night, newReg: arrived && zoneRegion(S.pos).id !== reg0 });
}

/* ---------- oslava ---------- */
let cerTok = 0;
const cerSet = html => { const c = $('cer'); c.innerHTML = html; return c; };
const tapWait = (el, ms) => new Promise(res => { let d = false; const f = () => { if (!d) { d = true; res(); } }; if (el) el.addEventListener('click', f, { once: true }); if (ms) setTimeout(f, ms); });
function endScene(arriving, o) {
  o = o || {}; const reg = zoneRegion(S.pos).id;
  $('endScene').innerHTML = sceneSVG(reg); $('end').style.setProperty('--ground', GROUND[reg]);
  $('endStation').innerHTML = stationSVG(S.pos, o); $('endStation').hidden = !!o.noStation;
  const tr = $('endTrain'); tr.className = 'trainrow' + (arriving ? ' inn moving' : ''); tr.innerHTML = trainHTML(trainFit(), false);
  bindTrain(tr);
}
function endTrainRefresh(isNew) { const tr = $('endTrain'); tr.className = 'trainrow'; tr.innerHTML = trainHTML(trainFit(), isNew); bindTrain(tr); if (isNew) { sfx('thud'); } }

async function ceremony(r) {
  const tok = ++cerTok, ok = () => tok === cerTok;
  show('end');
  const C = $('cer'); C.className = 'cer'; C.innerHTML = '';
  /* první vajíčko se líhne ještě před první stanicí: vláček stojí, stanice se neukazuje */
  endScene(true, { gift: !r.arrived, noStation: !r.arrived && r.reward === 'egg' && false });
  sfx('chug'); await wait(1500); if (!ok()) return; sfx('brake'); await wait(650); if (!ok()) return;
  $('endTrain').classList.remove('moving'); sfx('whistle'); pokeCls($('endTrain').querySelector('.loco'), 'toot', 600);
  const reg = zoneRegion(S.pos), title = r.newReg ? reg.hello : r.arrived ? `Stanice ${zoneLabel(S.pos) === '★' ? '' : zoneLabel(S.pos)}!` : 'Zastávka!';
  cerSet(`<p class="big pop">${title}</p><div class="starsrow">${Array.from({ length: r.n }, () => `<i>${ICON.star}</i>`).join('')}</div>`);
  if (r.newReg) { confetti(50); say(reg.hello); } else sayPh('station');
  await wait(500);
  const st = $$('.starsrow i', C);
  for (let i = 0; i < r.stars; i++) { if (!ok()) return; st[i].classList.add('on'); sfx('ping', i); await wait(150); }
  await wait(r.stars ? 600 : 300); if (!ok()) return;
  if (r.medal) {
    C.className = 'cer dimmed'; cerSet(`<div class="rays2"></div><p class="big pop">Medaile!</p><div class="prize">${medalSVG(r.medal)}</div><p class="big sm">${r.medal} hvězdiček</p>`);
    sfx('fanfare'); confetti(70); sayPh('medal'); await tapWait(C, 3600); if (!ok()) return;
  }
  if (r.reward === 'egg') await eggStep(tok, r.pet, zoneRegion(r.pet.z).id); else await giftStep(tok, r.gift);
  if (!ok()) return;
  if (r.night) { await nightStep(tok); if (!ok()) return; }
  finalStep(tok);
}
/* vajíčko: ťukat, praskne, vyleze kamarád, dítě mu přečte a vybere jméno */
async function eggStep(tok, pet, kind) {
  const ok = () => tok === cerTok, C = $('cer'); C.className = 'cer dimmed';
  cerSet(`<div class="rays2"></div><button class="eggbtn pop" id="eggB" aria-label="Vajíčko">${eggSVG(kind, 'wob')}<span class="taphint">👆</span></button>`);
  sfx('magic'); sayPh(kind === 'gold' ? 'hatch' : 'egg');
  const eb = $('eggB'), egg = eb.querySelector('.egg'); let n = 0, opened;
  const openP = new Promise(res => { opened = res; });
  const hit = () => {
    if (n >= 3 || !ok()) return; n++; stopVoice(); sfx('crack'); egg.classList.remove('wob'); pokeCls(egg, 'hit'); egg.classList.add('s' + n); burstAt(eb, 4);
    const h = eb.querySelector('.taphint'); if (h && n >= 1) h.remove();
    if (n >= 3) setTimeout(opened, 380);
  };
  eb.onclick = hit; const auto = setInterval(() => { if (!ok()) return clearInterval(auto); hit(); }, 5200);
  await openP; clearInterval(auto); if (!ok()) return;
  egg.classList.add('open'); sfx('hatch'); const [cx, cy] = centerOf(eb); confetti(60, cx, cy);
  await wait(420); if (!ok()) return;
  LC = S.case === 'lower'; const ideas = [pet.name].concat(nameIdeas(pet.z).filter(x => x.join('') !== pet.name.join('')).slice(0, 2));
  cerSet(`<div class="rays2"></div><div class="newpet" id="np">${petSVG(pet)}</div><p class="big sm">Jak se bude jmenovat?</p><div class="names">${shuffle(ideas).map(s => `<button class="namecard" data-n="${s.join('-')}">${arcHTML(s)}</button>`).join('')}</div><div class="cerbtns"><button class="btn go" id="nameOk" style="visibility:hidden" aria-label="Hotovo">${ICON.ok}</button></div>`);
  sfx('squeak', pet.seed); await wait(700); if (!ok()) return; sayPh('name');
  let sel = null; const np = $('np');
  const chosen = new Promise(res => {
    $$('.namecard', C).forEach(b => b.onclick = () => {
      if (!ok()) return; $$('.namecard', C).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b.dataset.n.split('-');
      $('nameOk').style.visibility = 'visible'; sfx('tap'); pokeCls(np.firstChild, 'jump', 700); stopVoice(); sayName(sel, hiArc(b.querySelector('.arc')));
    });
    $('nameOk').onclick = () => { if (sel) res(); };
  });
  await chosen; if (!ok()) return;
  pet.name = sel; save(); stopVoice(); sfx('fanfare');
  cerSet(`<div class="rays2"></div><div class="newpet" id="np">${petSVG(pet, 'jump')}</div><p class="word card pop">${arcHTML(pet.name, 'nmA')}</p>`);
  hearts($('np'), 7); await wait(350); if (!ok()) return; await sayName(pet.name, hiArc('nmA')); if (!ok()) return;
  sfx('squeak', pet.seed); pokeCls($('np').firstChild, 'jump', 700); await wait(700); if (!ok()) return;
  C.className = 'cer'; cerSet(''); endTrainRefresh(true); await wait(1300);
}
/* dárek: čepice pro kamaráda, nebo samolepka do vagónku */
async function giftStep(tok, g) {
  const ok = () => tok === cerTok, C = $('cer'); C.className = 'cer dimmed';
  cerSet(`<div class="rays2"></div><button class="eggbtn pop" id="eggB" aria-label="Dárek">${giftSVG('wob')}<span class="taphint">👆</span></button>`);
  sfx('magic'); sayPh('gift');
  const eb = $('eggB'); await tapWait(eb, 7000); if (!ok()) return;
  stopVoice(); eb.querySelector('.gift').classList.remove('wob'); eb.querySelector('.gift').classList.add('open'); sfx('pop'); const [cx, cy] = centerOf(eb); confetti(50, cx, cy);
  await wait(520); if (!ok()) return; sfx('fanfare');
  if (g.t === 'hat') {
    const pets = S.pets.slice(-12).reverse();
    cerSet(`<div class="rays2"></div><div class="prize">${hatIcon(g.id)}</div><p class="big sm">Komu ji dáš?</p><div class="choose">${pets.map(p => `<button data-p="${p.id}" aria-label="${p.name.join('')}">${petSVG(p)}</button>`).join('')}</div>`);
    await wait(500); if (!ok()) return; sayPh('hat');
    const pid = await new Promise(res => $$('.choose button', C).forEach(b => b.onclick = () => res(+b.dataset.p)));
    if (!ok()) return; const p = petById(pid); p.hat = g.id; save(); stopVoice(); sfx('boing');
    cerSet(`<div class="rays2"></div><div class="newpet" id="np">${petSVG(p, 'jump')}</div><p class="word card pop">${arcHTML(p.name)}</p>`);
    hearts($('np'), 6); sfx('squeak', p.seed); await wait(1500); if (!ok()) return;
    C.className = 'cer'; cerSet(''); endTrainRefresh(false); await wait(400);
  } else {
    cerSet(`<div class="rays2"></div><div class="prize">${g.e}</div>`); await tapWait(C, 1900); if (!ok()) return;
    C.className = 'cer'; cerSet(''); endTrainRefresh(true); await wait(1300);
  }
}
async function nightStep(tok) {
  const ok = () => tok === cerTok, C = $('cer'); C.className = 'cer dimmed';
  cerSet(`<div class="rays2"></div><div class="eggbtn pop">${eggSVG('gold', 'wob')}</div><p class="big sm">Zlaté vajíčko!<br>Vylíhne se zítra.</p>`);
  sfx('magic'); sayPh('night'); await tapWait(C, 4200); stopVoice();
}
function finalStep(tok) {
  const C = $('cer'); C.className = 'cer'; const lim = S.limit > 0 && ridesToday() >= S.limit;
  cerSet(lim ? `<div style="width:120px;height:132px">${owlSVG({ cls: 'sleep' })}</div><p class="big sm">Sovička jde spát.<br>Zítra jedeme dál!</p><div class="cerbtns"><button class="btn go" id="homeR">${ICON.home}</button></div>`
    : `<div class="cerbtns"><button class="ibtn" id="homeR" aria-label="Domů">${ICON.home}</button><button class="btn go" id="againR" style="font-size:30px;min-height:84px;padding:14px 36px">${ICON.play} Jedeme dál</button></div>`);
  if (lim) sayPh('sleep');
  $('homeR').onclick = () => { cerTok++; show('home'); };
  if ($('againR')) $('againR').onclick = () => { cerTok++; depart($('endTrain'), () => startRide('mix')); };
}
/* vláček odjede a teprve pak začne kolo */
function depart(tr, then) { unlock(); sfx('whistle'); tr.classList.remove('inn'); tr.classList.add('moving', 'out'); setTimeout(() => sfx('chug'), 250); setTimeout(then, 1050); }

/* zlaté vajíčko z hnízda (líhne se až další den) */
async function hatchNight() {
  if (!eggReady()) return; const tok = ++cerTok;
  const pet = newPet(S.pos, true); S.egg = null; save();
  show('end'); endScene(false, {}); await wait(300); if (tok !== cerTok) return;
  await eggStep(tok, pet, 'gold'); if (tok !== cerTok) return; cerTok++; show('home');
}

/* ťukání na vláček: kamarádi skáčou, lokomotiva houká */
function bindTrain(tr) {
  tr.onclick = e => {
    const w = e.target.closest('.wag'), lo = e.target.closest('.loco');
    if (w) { pokeCls(w, 'jump', 650); const p = w.dataset.pet && petById(+w.dataset.pet); if (p) { sfx('squeak', p.seed); floatTxt(w, low(p.name.join('')).replace(/^./, c => c.toLocaleUpperCase('cs'))); } else sfx('boing'); }
    else if (lo) { if (e.target.closest('[data-toy=owl]')) sfx('hoot'); else { sfx('whistle'); sfx('steam'); } pokeCls(lo, 'toot', 600); }
  };
}
