/* Slabikář — efekty: hvězdičky, konfety, srdíčka */
'use strict';

const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
function particle(cls, x, y, dx, dy, o) {
  o = o || {}; const e = document.createElement(o.tag || 'span'); e.className = 'pt ' + cls;
  if (o.html) e.innerHTML = o.html; if (o.bg) e.style.background = o.bg;
  e.style.left = x + 'px'; e.style.top = y + 'px';
  e.style.setProperty('--dx', dx + 'px'); e.style.setProperty('--dy', dy + 'px');
  e.style.setProperty('--r', (o.r == null ? rnd(360) - 180 : o.r) + 'deg'); e.style.setProperty('--s', o.s == null ? .4 : o.s);
  const d = o.d || .9; e.style.setProperty('--d', d + 's'); if (o.delay) e.style.animationDelay = o.delay + 's';
  $('fx').appendChild(e); setTimeout(() => e.remove(), (d + (o.delay || 0)) * 1000 + 80);
}
/* hvězdičky do kruhu */
function burst(x, y, n) {
  n = n || 10;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + Math.random() * .4, r = 70 + rnd(70); particle('star', x, y, Math.cos(a) * r, Math.sin(a) * r, { html: ICON.star }); }
}
const burstAt = (el, n) => { if (!el) return; const [x, y] = centerOf(el); burst(x, y, n); };
const CONF = ['#ff5d8f', '#ffc93c', '#3d8bff', '#2fbf71', '#8b6cff', '#ff8a3c', '#14b8a6'];
function confetti(n, x, y) {
  n = n || 60; const W = innerWidth, H = innerHeight;
  for (let i = 0; i < n; i++) {
    if (x == null) particle('conf', rnd(W), -20, rnd(160) - 80, H * (.6 + Math.random() * .5), { bg: pickOne(CONF), d: 1.6 + Math.random() * 1.4, delay: Math.random() * .6, s: 1, r: rnd(900) - 450 });
    else { const a = Math.random() * 6.283, r = 90 + rnd(Math.min(W, H) * .45); particle('conf', x, y, Math.cos(a) * r, Math.sin(a) * r + 90, { bg: pickOne(CONF), d: 1 + Math.random() * .8, s: .8, r: rnd(900) - 450 }); }
  }
}
function hearts(el, n) { const [x, y] = centerOf(el); for (let i = 0; i < (n || 5); i++) particle('heart', x + rnd(80) - 40, y + rnd(30) - 30, rnd(60) - 30, -90 - rnd(70), { html: ICON.heart, d: 1.1, delay: i * .08, s: .7, r: rnd(40) - 20 }); }
function floatTxt(el, txt) { const [x, y] = centerOf(el); particle('txt', x, y - 30, 0, -70, { html: txt, d: 1.1, s: 1.2, r: 0 }); }
/* hvězdička přeletí z místa na místo (třeba do počítadla) */
function flyStar(from, to, done) {
  if (!from || !to) { done && done(); return; }
  const [x0, y0] = centerOf(from), [x1, y1] = centerOf(to);
  const e = document.createElement('span'); e.className = 'fly'; e.innerHTML = ICON.star; e.style.transform = `translate(${x0}px,${y0}px) scale(1.4)`;
  $('fx').appendChild(e); void e.offsetWidth; e.style.transform = `translate(${x1}px,${y1}px) scale(.7)`;
  setTimeout(() => { e.remove(); done && done(); }, 720);
}
function pokeCls(el, cls, ms) { if (!el) return; el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); }
