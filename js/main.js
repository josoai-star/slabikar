/* Slabikář — start: ikony, tlačítka, hračky v krajině, offline */
'use strict';
(function main() {
  $('starPill').innerHTML = ICON.star + '<span id="starN">0</span>';
  $('parentBtn').innerHTML = ICON.gear;
  $('homeBtn').innerHTML = ICON.home;
  $('studioBack').innerHTML = ICON.back;
  $$('[data-home]').forEach(b => { b.innerHTML = ICON.home; b.onclick = () => { sfx('tap'); show('home'); }; });
  $('sayBtn').innerHTML = ICON.say;
  $('recBtn').innerHTML = ICON.mic;
  $('owlBtn').innerHTML = owlSVG({ id: 'owl' });
  $('dockMap').innerHTML = ICON.map + '<span>Mapa</span>';
  $('dockGames').innerHTML = ICON.games + '<span>Hry</span>';

  $('goBtn').onclick = goRide;
  $('dockMap').onclick = () => { sfx('tap'); show('map'); };
  $('dockPets').onclick = () => { sfx('tap'); show('pets'); };
  $('dockGames').onclick = () => { sfx('tap'); show('games'); };
  $('parentBtn').onclick = () => { sfx('tap'); parentGate(); };
  $('studioBack').onclick = () => { if (cap && cap.job) cap.job.cancel(); show('parent'); };
  $('homeBtn').onclick = () => { sfx('tap'); show('home'); };
  $('sayBtn').onclick = () => { if (G && G.replay && !G.lock) G.replay(); };
  $('owlBtn').onclick = () => { if (!G || G.lock) return; owlDo('hop'); sfx('hoot'); const o = $('owl'); o.classList.add('talk'); Promise.resolve(G.help && G.help()).then(() => o.classList.remove('talk')); };
  $('nest').onclick = () => { unlock(); if (eggReady()) hatchNight(); else { sfx('hoot'); sayPh('night'); pokeCls($('nest').querySelector('.egg'), 'hit', 400); } };
  bindParent(); bindPlayRec();

  /* sluníčko, mraky a stromy v krajině se dají šťouchnout */
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-toy]'); if (!t || t.closest('.loco')) return;
    const k = t.dataset.toy; unlock();
    if (k === 'sun') { pokeCls(t, 'poke', 1100); sfx('magic'); }
    else if (k === 'cloud') { pokeCls(t, 'poke', 800); sfx('drip'); setTimeout(() => sfx('drip'), 160); }
    else if (k === 'tree') { pokeCls(t, 'poke', 700); sfx('whoosh'); }
  });
  /* dlouhé podržení nic nedělá (žádné menu), dvojí ťuknutí nezvětšuje */
  document.addEventListener('contextmenu', e => { if (!e.target.closest('input,select,textarea')) e.preventDefault(); });
  document.addEventListener('dblclick', e => e.preventDefault());
  let lastW = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - lastW) < 40) return; lastW = innerWidth; if (curView === 'home') renderHome(); });

  if (hasTTS) { loadV(); try { speechSynthesis.onvoiceschanged = loadV; } catch (e) {} setTimeout(loadV, 800); }
  show('home');
  loadSitePack();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (curView === 'home') renderHome(); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
