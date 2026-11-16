/* Slabikář — kreslení: sova, vláček, kamarádi, vajíčka, čepice, krajiny. Všechno je SVG psané ručně. */
'use strict';

let UID = 0;
const uid = () => 'u' + (++UID);
const f1 = n => Math.round(n * 10) / 10;
const INK = '#2b2540';

/* ---------- ikony ---------- */
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" fill="currentColor"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M6 10v9h4.5v-5h3v5H18v-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 8 12l6.5 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  say: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9h4l5-4v14l-5-4h-4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.2-5.1M5 4.5V8h3.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8 6.2 20.1l1.4-6.4L2.7 9.3l6.5-.7z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5z" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"/><path d="M9 4v13.5M15 6.5V20" stroke="currentColor" stroke-width="2.3"/></svg>',
  games: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="8.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.7" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.7" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/></svg>',
  hat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17 12 4l6 13z" fill="currentColor"/><rect x="3" y="16.5" width="18" height="4" rx="2" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.6c0 5.8-8.5 11.3-8.5 11.3z" fill="currentColor"/></svg>',
  train: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="9" width="12" height="8" rx="2.5" fill="currentColor"/><rect x="13" y="5" width="8" height="12" rx="2" fill="currentColor"/><rect x="5" y="4" width="3.4" height="6" rx="1" fill="currentColor"/><circle cx="7" cy="18.5" r="2.4" fill="currentColor" stroke="#fff" stroke-width="1"/><circle cx="17" cy="18.5" r="2.4" fill="currentColor" stroke="#fff" stroke-width="1"/></svg>'
};

/* ---------- sova ---------- */
function owlSVG(o) {
  o = o || {};
  const cap = o.cap ? `<g class="ow-cap"><path d="M19 27Q50 -4 81 27V31H19Z" fill="#2f6fe0"/><rect x="16" y="26" width="68" height="8" rx="4" fill="#1d4fb0"/><path d="M60 30Q86 28 93 40L62 36Z" fill="#17306b"/><circle cx="50" cy="16" r="5.5" fill="#ffc93c"/></g>` : '';
  return `<svg class="owl${o.cls ? ' ' + o.cls : ''}" viewBox="0 0 100 112" aria-hidden="true"${o.id ? ` id="${o.id}"` : ''}>
<g class="ow-all"><path d="M20 32 27 6 43 23ZM80 32 73 6 57 23Z" fill="#7a4f2f"/>
<ellipse class="ow-wl" cx="14" cy="68" rx="10" ry="24" fill="#7a4f2f"/><ellipse class="ow-wr" cx="86" cy="68" rx="10" ry="24" fill="#7a4f2f"/>
<ellipse cx="50" cy="63" rx="38" ry="43" fill="#a8743f"/>
<ellipse cx="50" cy="77" rx="25" ry="27" fill="#f6e2bd"/>
<path d="M38 71q4 4 8 0M54 71q4 4 8 0M46 83q4 4 8 0M38 92q4 4 8 0M54 92q4 4 8 0" stroke="#dcbc8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<g class="ow-eyes"><circle cx="33" cy="46" r="16.5" fill="#fff"/><circle cx="67" cy="46" r="16.5" fill="#fff"/>
<circle class="ow-pu" cx="35" cy="48" r="8.5" fill="${INK}"/><circle class="ow-pu" cx="65" cy="48" r="8.5" fill="${INK}"/>
<circle cx="38" cy="45" r="3" fill="#fff"/><circle cx="68" cy="45" r="3" fill="#fff"/></g>
<g class="ow-shut"><circle cx="33" cy="46" r="16.5" fill="#fff"/><circle cx="67" cy="46" r="16.5" fill="#fff"/><path class="ow-arc" d="M24 49q9-10 18 0M58 49q9-10 18 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<path class="ow-beak" d="M44 58H56L50 69Z" fill="#f4a300"/>
<path d="M36 107l4-6 4 6M56 107l4-6 4 6" stroke="#f4a300" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${cap}</g></svg>`;
}

/* ---------- vláček (dřevěná hračka, jede doprava) ---------- */
function wheel(cx, cy, r) {
  return `<g class="wh"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${f1(r * .66)}" fill="#ffc93c"/><path d="M${cx - r * .6} ${cy}H${cx + r * .6}M${cx} ${cy - r * .6}V${cy + r * .6}" stroke="${INK}" stroke-width="${f1(r * .16)}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${f1(r * .22)}" fill="${INK}"/></g>`;
}
function locoSVG() {
  const c = uid();
  return `<svg class="loco" viewBox="0 -44 204 190" aria-hidden="true"><defs><clipPath id="${c}"><rect x="30" y="42" width="40" height="36" rx="8"/></clipPath></defs>
<g class="puffs"><circle class="puff p1" cx="157" cy="12" r="9" fill="#fff"/><circle class="puff p2" cx="157" cy="12" r="9" fill="#fff"/><circle class="puff p3" cx="157" cy="12" r="9" fill="#fff"/></g>
<g class="lo-body"><rect x="2" y="104" width="16" height="7" rx="3" fill="#8a93a0"/>
<rect x="148" y="30" width="18" height="32" rx="3" fill="${INK}"/><rect x="142" y="22" width="30" height="12" rx="6" fill="${INK}"/>
<path d="M110 58a13 13 0 0 1 26 0Z" fill="#ffc93c"/>
<rect x="74" y="56" width="104" height="52" rx="24" fill="#e8453c"/><rect x="88" y="63" width="70" height="7" rx="3.5" fill="#ff9488" opacity=".9"/>
<rect x="102" y="56" width="7" height="52" fill="#ffc93c"/><rect x="142" y="56" width="7" height="52" fill="#ffc93c"/>
<rect x="16" y="30" width="66" height="78" rx="9" fill="#2f6fe0"/><rect x="16" y="92" width="66" height="16" fill="#1d4fb0"/>
<rect x="30" y="42" width="40" height="36" rx="8" fill="#d7f0ff"/>
<g clip-path="url(#${c})"><g class="cab-owl" transform="translate(31 43) scale(.38)" data-toy="owl">${owlSVG({ cap: 1 }).replace(/<svg[^>]*>|<\/svg>/g, '')}</g></g>
<rect x="30" y="42" width="40" height="36" rx="8" fill="none" stroke="#17306b" stroke-width="4"/>
<rect x="8" y="20" width="82" height="15" rx="7.5" fill="#1d4fb0"/>
<rect x="10" y="100" width="180" height="15" rx="6" fill="#b8312a"/>
<path d="M176 100l24 15h-24Z" fill="${INK}"/>
<circle cx="181" cy="72" r="8" fill="#fff3b0" stroke="${INK}" stroke-width="3"/></g>
${wheel(46, 118, 22)}${wheel(108, 124, 16)}${wheel(152, 124, 16)}
<rect class="rod" x="104" y="121" width="52" height="6" rx="3" fill="#c9ced6" stroke="${INK}" stroke-width="1.5"/></svg>`;
}
const WCOL = [['#ff6b5b', '#c43d32'], ['#3d8bff', '#1f5fd1'], ['#2fbf71', '#1b8750'], ['#ffb020', '#c97f00'], ['#ff7ab6', '#c9488a'], ['#14b8a6', '#0f8a80'], ['#8b6cff', '#6143c9']];
/* vagónek: uvnitř sedí kamarád nebo veze náklad */
function wagonSVG(i, cargo) {
  const [m, d] = WCOL[i % WCOL.length];
  return `<svg class="wagon" viewBox="0 -44 124 190" aria-hidden="true"><g class="cargo">${cargo || ''}</g>
<rect x="6" y="76" width="112" height="40" rx="9" fill="${m}"/><rect x="6" y="100" width="112" height="16" rx="6" fill="${d}"/>
<rect x="2" y="70" width="120" height="12" rx="6" fill="${d}"/><rect x="14" y="86" width="96" height="6" rx="3" fill="#fff" opacity=".28"/>
<rect x="-2" y="104" width="10" height="7" rx="3" fill="#8a93a0"/><rect x="116" y="104" width="10" height="7" rx="3" fill="#8a93a0"/>
${wheel(32, 124, 16)}${wheel(92, 124, 16)}</svg>`;
}
const cargoPet = p => `<svg x="20" y="-6" width="84" height="84" viewBox="0 0 120 120" class="petin">${petInner(p)}</svg>`;
const cargoEmoji = e => `<text x="62" y="68" font-size="56" text-anchor="middle" class="emo">${e}</text>`;

/* ---------- kamarádi z vajíček ---------- */
const PAL = {
  red: ['#ff6b5b', '#c43d32', '#ffc2ba'], orange: ['#ff9f43', '#c96a12', '#ffd9ae'], yellow: ['#ffd23f', '#c99700', '#fff0b3'],
  lime: ['#9bd94f', '#5c9a1c', '#dcf5b8'], green: ['#34c27a', '#1b8750', '#b9efd3'], teal: ['#1fc4b6', '#0f8a80', '#b5efe9'],
  sky: ['#4cc3ff', '#1b84c4', '#c4ebff'], blue: ['#5b86ff', '#2f55c9', '#c9d7ff'], violet: ['#9a7bff', '#6143c9', '#ddd2ff'],
  pink: ['#ff82bd', '#c9488a', '#ffd0e6'], magenta: ['#e86bd3', '#a8359a', '#f8cdf0'], brown: ['#c08a5a', '#86572f', '#ecd3bb'], grey: ['#9fb0c8', '#62738c', '#dde5f0']
};
const RPAL = { louka: ['lime', 'yellow', 'pink', 'orange'], les: ['green', 'brown', 'orange', 'red'], farma: ['yellow', 'orange', 'red', 'brown'], hory: ['sky', 'blue', 'grey', 'violet'], more: ['teal', 'sky', 'blue', 'pink'], vesmir: ['violet', 'magenta', 'lime', 'teal'] };
const BODIES = [
  { d: 'M60 24C88 24 104 46 104 70C104 96 86 110 60 110C34 110 16 96 16 70C16 46 32 24 60 24Z', top: 24, ey: 60, bw: 44, hw: 30, feet: 1 },
  { d: 'M60 12C84 12 94 40 94 70C94 98 80 110 60 110C40 110 26 98 26 70C26 40 36 12 60 12Z', top: 12, ey: 50, bw: 34, hw: 22, feet: 1 },
  { d: 'M60 40C94 40 112 56 112 80C112 102 92 110 60 110C28 110 8 102 8 80C8 56 26 40 60 40Z', top: 40, ey: 70, bw: 52, hw: 34, feet: 1 },
  { d: 'M36 22H84Q104 22 104 42V90Q104 110 84 110H36Q16 110 16 90V42Q16 22 36 22Z', top: 22, ey: 56, bw: 44, hw: 34, feet: 1 },
  { d: 'M60 18C76 18 84 32 86 48C100 58 108 76 106 92C104 106 84 110 60 110C36 110 16 106 14 92C12 76 20 58 34 48C36 32 44 18 60 18Z', top: 18, ey: 44, bw: 25, hw: 18, feet: 1 },
  { d: 'M60 16C86 16 100 36 100 62V106Q92 96 84 106Q76 114 68 106Q60 96 52 106Q44 114 36 106Q28 96 20 106V62C20 36 34 16 60 16Z', top: 16, ey: 54, bw: 40, hw: 26, feet: 0 },
  { d: 'M60 22C80 22 96 34 100 58C104 84 92 110 60 110C28 110 16 84 20 58C24 34 40 22 60 22Z', top: 22, ey: 58, bw: 38, hw: 26, feet: 1 }
];
const TOPS = [
  () => '',
  (B, m, d, l) => [-1, 1].map(s => { const x = 60 + s * B.hw * .72, y = B.top + 12; return `<path d="M${f1(x - 11)} ${y + 8}L${f1(x + s * 2)} ${y - 20}L${f1(x + 11)} ${y + 8}Z" fill="${m}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><path d="M${f1(x - 5)} ${y + 5}L${f1(x + s * 1.5)} ${y - 10}L${f1(x + 5)} ${y + 5}Z" fill="${l}"/>`; }).join(''),
  (B, m, d, l) => [-1, 1].map(s => { const x = 60 + s * B.hw * .82, y = B.top + 9; return `<circle cx="${f1(x)}" cy="${y}" r="11" fill="${m}" stroke="${d}" stroke-width="3"/><circle cx="${f1(x)}" cy="${y}" r="5.5" fill="${l}"/>`; }).join(''),
  (B, m, d, l) => [-1, 1].map(s => { const x = 60 + s * 13, y = B.top - 6; return `<g transform="rotate(${s * 12} ${x} ${y + 20})"><ellipse cx="${x}" cy="${y}" rx="8" ry="22" fill="${m}" stroke="${d}" stroke-width="3"/><ellipse cx="${x}" cy="${y + 2}" rx="3.5" ry="14" fill="${l}"/></g>`; }).join(''),
  (B, m, d) => [-1, 1].map(s => { const x = 60 + s * B.hw * .6, y = B.top + 8; return `<path d="M${f1(x - 6)} ${y}Q${f1(x + s * 2)} ${y - 22} ${f1(x + s * 12)} ${y - 22}Q${f1(x + s * 6)} ${y - 10} ${f1(x + 7)} ${y}Z" fill="#fff8e1" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>`; }).join(''),
  (B, m, d) => `<path d="M52 ${B.top + 6}L60 ${B.top - 24}L68 ${B.top + 6}Z" fill="#ffd23f" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/><path d="M55.5 ${B.top - 6}l8 -3M57.5 ${B.top - 14}l5 -2" stroke="#c99700" stroke-width="2"/>`,
  (B, m, d, l) => [-1, 1].map(s => { const x = 60 + s * 9, y = B.top + 5; return `<path d="M${x} ${y}Q${x + s * 4} ${y - 16} ${x + s * 12} ${y - 22}" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/><circle class="tw" cx="${x + s * 12}" cy="${y - 24}" r="5.5" fill="${l}" stroke="${d}" stroke-width="2.5"/>`; }).join(''),
  (B, m, d) => `<path d="M48 ${B.top + 8}L44 ${B.top - 10}L54 ${B.top + 1}L60 ${B.top - 16}L66 ${B.top + 1}L76 ${B.top - 10}L72 ${B.top + 8}Z" fill="${d}" stroke="${d}" stroke-width="2" stroke-linejoin="round"/>`,
  (B) => `<path d="M60 ${B.top + 4}V${B.top - 10}" stroke="#2f8f3e" stroke-width="3.5" stroke-linecap="round"/><path d="M60 ${B.top - 9}Q46 ${B.top - 24} 42 ${B.top - 8}Q52 ${B.top - 4} 60 ${B.top - 9}ZM60 ${B.top - 9}Q74 ${B.top - 24} 78 ${B.top - 8}Q68 ${B.top - 4} 60 ${B.top - 9}Z" fill="#5ccf5a" stroke="#2f8f3e" stroke-width="2.5" stroke-linejoin="round"/>`,
  (B, m, d) => [-2, -1, 0, 1, 2].map(i => { const x = 60 + i * B.hw * .36, y = B.top + 4 + Math.abs(i) * 4; return `<path d="M${f1(x - 6)} ${y + 4}L${f1(x)} ${y - 11}L${f1(x + 6)} ${y + 4}Z" fill="${d}" stroke="${d}" stroke-width="1.5" stroke-linejoin="round"/>`; }).join('')
];
const HATSVG = {
  party: `<path d="M-15 5L0 -31L15 5Z" fill="#ff5d8f" stroke="#c12f62" stroke-width="2.5" stroke-linejoin="round"/><path d="M-9 -9l14 -5M-12 -1l22 -8" stroke="#ffe066" stroke-width="3.5" stroke-linecap="round"/><circle cx="0" cy="-32" r="5.5" fill="#ffe066" stroke="#c99700" stroke-width="2"/>`,
  crown: `<path d="M-19 5V-15L-9 -5L0 -20L9 -5L19 -15V5Z" fill="#ffc93c" stroke="#b97400" stroke-width="2.5" stroke-linejoin="round"/><circle cx="0" cy="-3" r="3.2" fill="#e8453c"/><circle cx="-11" cy="-2" r="2.4" fill="#3d8bff"/><circle cx="11" cy="-2" r="2.4" fill="#2fbf71"/>`,
  tophat: `<rect x="-15" y="-32" width="30" height="34" rx="3" fill="${INK}"/><rect x="-15" y="-10" width="30" height="7" fill="#e8453c"/><rect x="-24" y="-1" width="48" height="8" rx="4" fill="${INK}"/>`,
  cap: `<path d="M-18 5A18 17 0 0 1 18 5Z" fill="#2f6fe0" stroke="#17306b" stroke-width="2.5"/><path d="M8 0Q32 -2 35 9L8 6Z" fill="#17306b"/><circle cx="0" cy="-12" r="3" fill="#ffc93c"/>`,
  bow: `<path d="M0 -4L-20 -16V8ZM0 -4L20 -16V8Z" fill="#ff5d8f" stroke="#c12f62" stroke-width="2.5" stroke-linejoin="round"/><circle cx="0" cy="-4" r="6" fill="#ff8fb3" stroke="#c12f62" stroke-width="2.5"/>`,
  flower: `<g transform="translate(13 -6)">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(Math.cos(a * Math.PI / 180) * 8)}" cy="${f1(Math.sin(a * Math.PI / 180) * 8)}" r="6.5" fill="#ff8fd0" stroke="#c9488a" stroke-width="1.5"/>`).join('')}<circle r="5.5" fill="#ffd23f" stroke="#c99700" stroke-width="1.5"/></g>`,
  pirate: `<path d="M-26 4Q-22 -24 0 -26Q22 -24 26 4Q0 -8 -26 4Z" fill="${INK}" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><circle cx="0" cy="-12" r="6" fill="#fff"/><circle cx="-2.2" cy="-13" r="1.5" fill="${INK}"/><circle cx="2.2" cy="-13" r="1.5" fill="${INK}"/><path d="M-8 -4l16 -3M-8 -7l16 3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  chef: `<circle cx="-11" cy="-18" r="10" fill="#fff" stroke="#b8c2d0" stroke-width="2"/><circle cx="11" cy="-18" r="10" fill="#fff" stroke="#b8c2d0" stroke-width="2"/><circle cx="0" cy="-24" r="11" fill="#fff" stroke="#b8c2d0" stroke-width="2"/><rect x="-15" y="-14" width="30" height="18" rx="3" fill="#fff" stroke="#b8c2d0" stroke-width="2"/>`,
  wizard: `<path d="M-17 4L5 -40L18 4Z" fill="#6b4be0" stroke="#3f2a9c" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="0" cy="4" rx="26" ry="6" fill="#6b4be0" stroke="#3f2a9c" stroke-width="2.5"/><path d="M0 -14l1.8 3.6 4 .5-3 2.8.8 4L0 -1.2-3.6 .7l.8-4-3-2.8 4-.5z" fill="#ffe066"/><circle cx="6" cy="-24" r="2" fill="#ffe066"/>`,
  prop: `<path d="M-17 5A17 16 0 0 1 17 5Z" fill="#e8453c" stroke="#8f211b" stroke-width="2.5"/><path d="M0 -11A17 16 0 0 1 17 5H0Z" fill="#3d8bff"/><path d="M0 -11V-20" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><g class="spin"><ellipse cx="-10" cy="-21" rx="10" ry="3.6" fill="#ffc93c" stroke="#b97400" stroke-width="1.5"/><ellipse cx="10" cy="-21" rx="10" ry="3.6" fill="#2fbf71" stroke="#1b8750" stroke-width="1.5"/></g><circle cx="0" cy="-21" r="2.6" fill="${INK}"/>`,
  cowboy: `<path d="M-30 2Q-16 12 0 4Q16 12 30 2Q24 -6 14 -2L10 -22Q0 -30 -10 -22L-14 -2Q-24 -6 -30 2Z" fill="#b9814f" stroke="#70451f" stroke-width="2.5" stroke-linejoin="round"/><path d="M-13 -6Q0 -1 13 -6" stroke="#70451f" stroke-width="3.5" fill="none"/>`,
  beanie: `<path d="M-18 2A18 20 0 0 1 18 2Z" fill="#e8453c" stroke="#8f211b" stroke-width="2.5"/><rect x="-20" y="-3" width="40" height="9" rx="4.5" fill="#fff" stroke="#b8c2d0" stroke-width="2"/><circle cx="0" cy="-20" r="6.5" fill="#fff" stroke="#b8c2d0" stroke-width="2"/>`
};
const hatIcon = id => `<svg class="haticon" viewBox="-36 -46 72 60" aria-hidden="true">${HATSVG[id] || ''}</svg>`;

/* vnitřek kamaráda (bez obalu), vzhled určuje jen jeho seed */
function petInner(p) {
  const r = mulberry(p.seed >>> 0), reg = zoneRegion(p.z || 0).id, rp = RPAL[reg], keys = Object.keys(PAL);
  const cn = r() < .72 ? rp[Math.floor(r() * rp.length)] : keys[Math.floor(r() * keys.length)];
  let [m, d, l] = PAL[cn];
  const B = BODIES[Math.floor(r() * BODIES.length)];
  const e0 = r(), sp = reg === 'vesmir';
  const nE = e0 < (sp ? .3 : .09) ? 3 : e0 < (sp ? .52 : .24) ? 1 : 2;
  const er = nE === 1 ? 15 + r() * 4 : nE === 3 ? 8 + r() * 2 : 9.5 + r() * 4;
  const ew = nE === 2 ? Math.min(B.bw * .5, er + 4 + r() * 5) : 18;
  const topK = Math.floor(r() * TOPS.length), mouthK = Math.floor(r() * 6);
  const arms = r() < .62, raised = r() < .35, belly = r() < .55, spots = r() < .34, cheeks = r() < .72, lash = r() < .22, look = (r() - .5) * 3.4;
  let fill = m, defs = '';
  if (p.rare) { const g = uid(); defs = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6b8"/><stop offset=".5" stop-color="#ffc93c"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient></defs>`; fill = `url(#${g})`; m = '#ffc93c'; d = '#b06f00'; l = '#fff6c9'; }
  const ey = B.ey;
  const eye = (cx, cy, rr) => `<g class="eye"><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr)}" fill="#fff" stroke="${d}" stroke-width="2.2"/><circle cx="${f1(cx + look)}" cy="${f1(cy + 1)}" r="${f1(rr * .54)}" fill="${INK}"/><circle cx="${f1(cx + look + rr * .22)}" cy="${f1(cy - rr * .22)}" r="${f1(rr * .2)}" fill="#fff"/>${lash ? `<path d="M${f1(cx - rr * .7)} ${f1(cy - rr * .9)}l-3 -4M${f1(cx)} ${f1(cy - rr * 1.1)}v-5M${f1(cx + rr * .7)} ${f1(cy - rr * .9)}l3 -4" stroke="${d}" stroke-width="2" stroke-linecap="round"/>` : ''}</g>`;
  const eyes = nE === 1 ? eye(60, ey, er) : nE === 3 ? eye(60 - 18, ey + 2, er) + eye(60, ey - 7, er) + eye(60 + 18, ey + 2, er) : eye(60 - ew, ey, er) + eye(60 + ew, ey, er);
  const my = Math.min(98, ey + er + (nE === 3 ? 12 : 8));
  const mouth = [
    `<path d="M51 ${f1(my)}Q60 ${f1(my + 10)} 69 ${f1(my)}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    `<path class="mo" d="M49 ${f1(my - 1)}Q60 ${f1(my + 16)} 71 ${f1(my - 1)}Z" fill="#7a1f2b" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="60" cy="${f1(my + 6)}" rx="5" ry="2.8" fill="#ff8fa3"/>`,
    `<path d="M50 ${f1(my)}Q60 ${f1(my + 9)} 70 ${f1(my)}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/><rect x="56.5" y="${f1(my + 2.6)}" width="7" height="7" rx="1.6" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`,
    `<path d="M49 ${f1(my)}Q60 ${f1(my + 8)} 71 ${f1(my)}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M53 ${f1(my + 2)}l3 6 3 -4.5M61 ${f1(my + 3.5)}l3 4.5 3 -6" fill="#fff" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`,
    `<ellipse class="mo" cx="60" cy="${f1(my + 3)}" rx="5" ry="6" fill="#7a1f2b" stroke="${INK}" stroke-width="2.4"/>`,
    `<path d="M51 ${f1(my)}q4.5 6 9 0q4.5 6 9 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  ][mouthK];
  const ay = Math.min(92, ey + 24), ax = B.bw + 1;
  const armS = arms ? [-1, 1].map(s => `<ellipse class="arm${raised && s > 0 ? ' wave' : ''}" cx="${60 + s * ax}" cy="${ay}" rx="6.5" ry="11" fill="${m}" stroke="${d}" stroke-width="3" transform="rotate(${s * (raised ? -140 : -28)} ${60 + s * (ax - 4)} ${ay - 6})"/>`).join('') : '';
  const feet = B.feet ? `<ellipse cx="44" cy="110" rx="11" ry="6" fill="${d}"/><ellipse cx="76" cy="110" rx="11" ry="6" fill="${d}"/>` : '';
  const bcy = Math.min(92, (my + 110) / 2 + 2);
  const bellyS = belly ? `<ellipse cx="60" cy="${f1(bcy + 4)}" rx="${f1(B.bw * .5)}" ry="${f1(Math.max(8, 108 - bcy - 6))}" fill="${l}" opacity=".7"/>` : '';
  const spotS = spots ? `<g fill="${d}" opacity=".22"><circle cx="${60 - B.bw * .62}" cy="${ey + 22}" r="5"/><circle cx="${60 + B.bw * .66}" cy="${ey + 14}" r="4"/><circle cx="${60 + B.bw * .5}" cy="${ey + 30}" r="6"/><circle cx="${60 - B.bw * .4}" cy="${ey + 36}" r="3.5"/></g>` : '';
  const chS = cheeks ? `<ellipse cx="${f1(60 - ew - er * .6 - 3)}" cy="${f1(ey + er + 3)}" rx="5" ry="3.4" fill="#ff7a9c" opacity=".5"/><ellipse cx="${f1(60 + ew + er * .6 + 3)}" cy="${f1(ey + er + 3)}" rx="5" ry="3.4" fill="#ff7a9c" opacity=".5"/>` : '';
  const hat = p.hat && HATSVG[p.hat] ? `<g class="hat" transform="translate(60 ${B.top + 3}) scale(${f1(clamp(B.hw / 26, .8, 1.15))})">${HATSVG[p.hat]}</g>` : '';
  const spark = p.rare ? `<g fill="#ffe066" stroke="#b06f00" stroke-width="1">${[[14, 26, 1], [106, 34, .8], [100, 96, .7]].map(([x, y, s], i) => `<path class="tw t${i}" transform="translate(${x} ${y}) scale(${s})" d="M0 -8l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>`).join('')}</g>` : '';
  return `${defs}<g class="pb">${p.hat ? '' : TOPS[topK](B, m, d, l)}${armS}${feet}<path d="${B.d}" fill="${fill}" stroke="${d}" stroke-width="3.2" stroke-linejoin="round"/>${bellyS}${spotS}${chS}<g class="eyes" style="animation-delay:-${f1(r() * 4)}s">${eyes}</g>${mouth}${hat}</g>${spark}`;
}
function petSVG(p, cls) { return `<svg class="pet${cls ? ' ' + cls : ''}" viewBox="0 0 120 120" data-pet="${p.id}" aria-hidden="true">${petInner(p)}</svg>`; }
/* obrys ještě nenalezeného kamaráda */
const petGhost = () => `<svg class="pet ghost" viewBox="0 0 120 120" aria-hidden="true"><path d="${BODIES[0].d}" fill="currentColor"/><text x="60" y="82" text-anchor="middle" font-size="46" font-weight="800" fill="#fff" opacity=".8">?</text></svg>`;

/* ---------- vajíčko ---------- */
const EGGC = { louka: ['#d9f59a', '#ff8fd0', '#5c9a1c'], les: ['#a6e3b4', '#c08a5a', '#1b8750'], farma: ['#ffe58f', '#ff6b5b', '#c97f00'], hory: ['#d6ebff', '#5b86ff', '#2f55c9'], more: ['#a8efe6', '#3d8bff', '#0f8a80'], vesmir: ['#d3c4ff', '#ffe066', '#6143c9'], gold: ['#ffd23f', '#fff6c9', '#b06f00'] };
function eggSVG(kind, cls) {
  const [a, b, d] = EGGC[kind] || EGGC.louka; const g = uid();
  const top = 'M14 86C14 52 32 8 60 8C88 8 106 52 106 86L96 78L84 89L72 77L60 89L48 77L36 89L24 78Z';
  const bot = 'M14 86L24 78L36 89L48 77L60 89L72 77L84 89L96 78L106 86C106 116 86 134 60 134C34 134 14 116 14 86Z';
  const deco = `<g fill="${b}"><circle cx="40" cy="50" r="6"/><circle cx="74" cy="38" r="5"/><circle cx="82" cy="64" r="6.5"/><circle cx="52" cy="26" r="4"/><circle cx="34" cy="106" r="6"/><circle cx="62" cy="116" r="5"/><circle cx="86" cy="104" r="6"/></g>`;
  return `<svg class="egg${cls ? ' ' + cls : ''}${kind === 'gold' ? ' gold' : ''}" viewBox="-10 -10 140 160" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<g class="eg-all"><g class="eg-bot"><path d="${bot}" fill="${a}"/></g><g class="eg-top"><path d="${top}" fill="${a}"/></g>
<g class="eg-skin">${deco}<path d="M60 8C88 8 106 52 106 86C106 116 86 134 60 134C34 134 14 116 14 86C14 52 32 8 60 8Z" fill="url(#${g})"/></g>
<path class="eg-line" d="M60 8C88 8 106 52 106 86C106 116 86 134 60 134C34 134 14 116 14 86C14 52 32 8 60 8Z" fill="none" stroke="${d}" stroke-width="4"/>
<g fill="none" stroke="${d}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path class="ck c1" d="M56 30l8 12-10 8 9 9"/><path class="ck c2" d="M24 78l12 11 12-12 12 12 12-12 12 12 12-11"/><path class="ck c3" d="M40 100l8 10-6 10M78 44l-7 10 9 8"/></g></g>
${kind === 'gold' ? `<g fill="#fff6b8" stroke="#b06f00" stroke-width="1">${[[8, 30, 1.2], [116, 50, 1], [10, 110, .9], [112, 118, 1.1]].map(([x, y, s], i) => `<path class="tw t${i}" transform="translate(${x} ${y}) scale(${s})" d="M0 -8l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>`).join('')}</g>` : ''}</svg>`;
}
function giftSVG(cls) {
  return `<svg class="gift${cls ? ' ' + cls : ''}" viewBox="-10 -30 140 160" aria-hidden="true"><g class="gf-all"><rect x="14" y="52" width="92" height="72" rx="8" fill="#ff5d8f"/><rect x="14" y="52" width="92" height="14" fill="#d93c70"/><rect x="50" y="52" width="20" height="72" fill="#ffe066"/>
<g class="gf-lid"><rect x="6" y="30" width="108" height="28" rx="8" fill="#ff7aa5" stroke="#c12f62" stroke-width="3"/><rect x="50" y="30" width="20" height="28" fill="#ffe066"/>
<path d="M60 30Q38 -2 26 14Q22 28 60 30ZM60 30Q82 -2 94 14Q98 28 60 30Z" fill="#ffe066" stroke="#c99700" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="28" r="7" fill="#ffd23f" stroke="#c99700" stroke-width="3"/></g>
<rect x="14" y="52" width="92" height="72" rx="8" fill="none" stroke="#c12f62" stroke-width="3"/></g></svg>`;
}
const miniEgg = k => `<svg class="mini" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c4 0 7 6.5 7 11.2 0 4.3-3 7.3-7 7.3s-7-3-7-7.3C5 9 8 2.5 12 2.5z" fill="${(EGGC[k] || EGGC.louka)[0]}" stroke="${INK}" stroke-width="1.8"/><circle cx="9.5" cy="10" r="1.6" fill="${(EGGC[k] || EGGC.louka)[1]}"/><circle cx="14.5" cy="14.5" r="1.9" fill="${(EGGC[k] || EGGC.louka)[1]}"/></svg>`;
const miniGift = () => `<svg class="mini" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" fill="#ff5d8f" stroke="${INK}" stroke-width="1.8"/><rect x="3" y="6.5" width="18" height="5" rx="2" fill="#ff8fb3" stroke="${INK}" stroke-width="1.8"/><path d="M12 6.5V21M12 6.5c-2-4-6-3-4.5-.5M12 6.5c2-4 6-3 4.5-.5" stroke="${INK}" stroke-width="1.8" fill="#ffe066"/></svg>`;
const medalSVG = (n, cls) => `<svg class="medal${cls ? ' ' + cls : ''}" viewBox="0 0 80 100" aria-hidden="true"><path d="M22 2h14l8 34H30zM58 2H44l-8 34h14z" fill="#3d8bff" stroke="#1f5fd1" stroke-width="2.5" stroke-linejoin="round"/><circle cx="40" cy="64" r="30" fill="#ffc93c" stroke="#b06f00" stroke-width="3.5"/><circle cx="40" cy="64" r="22" fill="#ffe066" stroke="#e0a100" stroke-width="2"/><text x="40" y="${n >= 1000 ? 71 : 73}" text-anchor="middle" font-size="${n >= 1000 ? 17 : n >= 100 ? 21 : 25}" font-weight="800" fill="#8a5600">${n}</text></svg>`;

/* ---------- stanice ---------- */
function stationSVG(z, o) {
  o = o || {}; const lab = zoneLabel(z), L = zoneLetter(z);
  const col = z === 0 || lab === 'Y' ? '#e03131' : lab === '★' ? '#e0a100' : '#1c5fd6';
  const txt = z === 0 ? `<text x="110" y="52" text-anchor="middle" font-size="22" font-weight="700" fill="#e03131" class="sgn">A E I O U</text>` : `<text x="110" y="58" text-anchor="middle" font-size="${L === 'CH' ? 32 : 40}" font-weight="700" fill="${col}" class="sgn">${lab}</text>`;
  return `<svg class="station" viewBox="0 0 220 210" aria-hidden="true">
<rect x="0" y="186" width="220" height="24" rx="6" fill="#c9b08a"/><rect x="0" y="186" width="220" height="8" rx="4" fill="#e5d2b0"/>
<rect x="28" y="96" width="164" height="92" rx="6" fill="#fff3d6" stroke="#c4914f" stroke-width="4"/>
<path d="M12 100L110 62L208 100Z" fill="#e8453c" stroke="#8f211b" stroke-width="4" stroke-linejoin="round"/>
<rect x="60" y="16" width="100" height="56" rx="10" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M84 72v10M136 72v10" stroke="${INK}" stroke-width="5"/>${txt}
<rect x="92" y="132" width="36" height="56" rx="6" fill="#3d8bff" stroke="#1f5fd1" stroke-width="4"/><circle cx="120" cy="162" r="3" fill="#ffe066"/>
<rect x="42" y="116" width="34" height="34" rx="6" fill="#bfe8ff" stroke="#c4914f" stroke-width="4"/><path d="M59 116v34M42 133h34" stroke="#c4914f" stroke-width="3"/>
<rect x="144" y="116" width="34" height="34" rx="6" fill="#bfe8ff" stroke="#c4914f" stroke-width="4"/><path d="M161 116v34M144 133h34" stroke="#c4914f" stroke-width="3"/></svg>`;
}

/* ---------- krajiny ---------- */
const SKY = { day: ['#56b8f5', '#c9edff'], dawn: ['#8ecbf7', '#ffe3c2'], dusk: ['#6a63c2', '#ffb27a'], night: ['#0f1640', '#34428c'] };
const cloud = (x, y, s, c) => `<g class="cloud ${c || ''}" data-toy="cloud"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="46" ry="22" fill="#fff"/><circle cx="-22" cy="-12" r="20" fill="#fff"/><circle cx="8" cy="-20" r="26" fill="#fff"/><circle cx="34" cy="-6" r="17" fill="#fff"/></g></g>`;
const treeR = (x, y, s, c1, c2) => `<g class="tree" data-toy="tree" transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-34" width="14" height="38" rx="4" fill="#9a6a3e"/><g class="tr-top"><circle cx="0" cy="-66" r="40" fill="${c1}"/><circle cx="-14" cy="-78" r="14" fill="${c2}" opacity=".6"/><circle cx="16" cy="-58" r="4.5" fill="#ff5d5d"/><circle cx="-18" cy="-52" r="4.5" fill="#ff5d5d"/><circle cx="4" cy="-86" r="4.5" fill="#ff5d5d"/></g></g>`;
const pine = (x, y, s, c1, c2) => `<g class="tree" data-toy="tree" transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-16" width="12" height="20" rx="3" fill="#8a5a34"/><g class="tr-top"><path d="M0 -112L30 -62H-30Z" fill="${c2}"/><path d="M0 -88L38 -34H-38Z" fill="${c1}"/><path d="M0 -62L46 -10H-46Z" fill="${c2}"/></g></g>`;
const flower = (x, y, c) => `<g class="flw" transform="translate(${x} ${y})"><path d="M0 0V-18" stroke="#2f8f3e" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-22" r="7" fill="${c}"/><circle cx="0" cy="-22" r="3" fill="#ffe066"/></g>`;
const mush = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-14" width="12" height="16" rx="5" fill="#fff3d6"/><path d="M-20 -12A20 18 0 0 1 20 -12Z" fill="#e8453c"/><circle cx="-8" cy="-20" r="3.5" fill="#fff"/><circle cx="6" cy="-24" r="3" fill="#fff"/><circle cx="10" cy="-16" r="2.4" fill="#fff"/></g>`;
const starDots = n => { const r = mulberry(77); let s = ''; for (let i = 0; i < n; i++) s += `<circle class="tw t${i % 4}" cx="${f1(r() * 1200)}" cy="${f1(r() * 470)}" r="${f1(1 + r() * 2.2)}" fill="#fff"/>`; return s; };

function sceneSVG(regId, t) {
  t = regId === 'vesmir' ? 'night' : (t || tod());
  const g = uid(), [s1, s2] = regId === 'vesmir' ? ['#120a33', '#3b2a78'] : SKY[t], night = t === 'night';
  const dim = night && regId !== 'vesmir' ? `<rect width="1200" height="800" fill="#0f1640" opacity=".34"/>` : t === 'dusk' ? `<rect width="1200" height="800" fill="#ff8a4a" opacity=".12"/>` : '';
  const sun = night
    ? `<g class="moon" data-toy="sun"><circle cx="730" cy="150" r="46" fill="#fdf6c8"/><circle cx="714" cy="138" r="9" fill="#eadf9c"/><circle cx="744" cy="166" r="6" fill="#eadf9c"/><circle cx="748" cy="134" r="4" fill="#eadf9c"/></g>${starDots(46)}`
    : `<g class="sun" data-toy="sun" transform="translate(730 ${t === 'day' ? 150 : 250})"><g class="rays">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<rect x="-5" y="-86" width="10" height="26" rx="5" fill="#ffd23f" transform="rotate(${a})"/>`).join('')}</g><circle r="50" fill="#ffd23f"/><circle r="50" fill="#fff" opacity=".18"/><g class="sunface"><circle cx="-16" cy="-6" r="5" fill="#b06f00"/><circle cx="16" cy="-6" r="5" fill="#b06f00"/><path d="M-16 12Q0 26 16 12" stroke="#b06f00" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`;
  const clouds = regId === 'vesmir' ? '' : cloud(0, 120, 1.25, 'c1') + cloud(0, 250, .9, 'c2') + cloud(0, 60, .75, 'c3');
  let land = '';
  if (regId === 'louka') {
    land = `<path d="M0 520Q180 420 380 500T760 470T1200 510V800H0Z" fill="#a5e38c"/>
<path d="M0 580Q220 500 470 566T900 540T1200 570V800H0Z" fill="#7fd36c"/>
${treeR(470, 530, 1.05, '#4fb44c', '#8fe07a')}${treeR(165, 560, .8, '#5cc257', '#9be88a')}${treeR(985, 548, .9, '#4fb44c', '#8fe07a')}
<path d="M0 640Q300 596 600 628T1200 620V800H0Z" fill="#5fc257"/>
${[[430, 690, '#ff8fd0'], [520, 720, '#fff'], [610, 684, '#ffd23f'], [705, 716, '#ff7a6b'], [790, 690, '#c9a0ff'], [330, 720, '#ffd23f'], [880, 722, '#ff8fd0'], [230, 692, '#fff'], [1010, 696, '#ffd23f'], [100, 724, '#ff7a6b'], [1120, 720, '#fff']].map(a => flower(...a)).join('')}
<g class="bfly b1"><path d="M0 0q-14-16-18 0q4 14 18 0q14-16 18 0q-4 14-18 0" fill="#ff8fd0" stroke="#c9488a" stroke-width="2"/></g><g class="bfly b2"><path d="M0 0q-14-16-18 0q4 14 18 0q14-16 18 0q-4 14-18 0" fill="#ffd23f" stroke="#c99700" stroke-width="2"/></g>`;
  } else if (regId === 'les') {
    land = `<path d="M0 500Q200 420 420 480T820 450T1200 490V800H0Z" fill="#6cc38a"/>
${[[60, 500, 1.1], [190, 486, 1.4], [330, 500, 1.1], [865, 478, 1.3], [1000, 492, 1.15], [1130, 500, 1.4]].map(a => pine(a[0], a[1], a[2], '#2f9a5c', '#23804a')).join('')}
<path d="M0 570Q240 500 500 556T920 530T1200 560V800H0Z" fill="#4fae6e"/>
${[[420, 566, 1.55], [560, 560, 1.2], [690, 568, 1.7], [790, 560, 1.15], [250, 580, 1.25], [1060, 572, 1.3]].map(a => pine(a[0], a[1], a[2], '#2a8c53', '#1c6e40')).join('')}
<path d="M0 640Q300 600 600 630T1200 622V800H0Z" fill="#3f9a5c"/>
${mush(470, 700, 1.3)}${mush(735, 716, 1)}${mush(600, 690, .8)}${mush(300, 716, 1.1)}${mush(920, 700, 1.2)}`;
  } else if (regId === 'farma') {
    land = `<path d="M0 510Q200 440 420 492T820 470T1200 500V800H0Z" fill="#f2df7e"/>
<g stroke="#dcc45a" stroke-width="5" fill="none" opacity=".8"><path d="M0 540Q300 470 620 520T1200 520"/><path d="M0 566Q300 500 620 548T1200 548"/></g>
<path d="M0 588Q240 530 500 578T920 560T1200 580V800H0Z" fill="#b9de6a"/>
<g transform="translate(500 588)"><rect x="-70" y="-92" width="140" height="94" fill="#e8453c" stroke="#8f211b" stroke-width="4"/><path d="M-84 -90L0 -150L84 -90Z" fill="#b8312a" stroke="#8f211b" stroke-width="4" stroke-linejoin="round"/><rect x="-24" y="-56" width="48" height="58" rx="4" fill="#fff3d6" stroke="#8f211b" stroke-width="4"/><path d="M-24 -56L24 2M24 -56L-24 2" stroke="#8f211b" stroke-width="3"/><circle cx="0" cy="-108" r="12" fill="#fff3d6" stroke="#8f211b" stroke-width="3"/></g>
<g transform="translate(700 590)"><ellipse cx="0" cy="-22" rx="40" ry="26" fill="#f4c95a" stroke="#c99700" stroke-width="3"/><path d="M-24 -30q24 -12 48 0M-30 -16q30 -10 60 0" stroke="#c99700" stroke-width="2.5" fill="none"/></g>
${treeR(860, 582, .85, '#5cc257', '#9be88a')}${treeR(210, 590, .9, '#5cc257', '#9be88a')}
<path d="M0 640Q300 604 600 632T1200 622V800H0Z" fill="#8fcf52"/>
<g stroke="#b9814f" stroke-width="7" stroke-linecap="round">${[330, 400, 470, 540, 610, 680, 750, 820].map(x => `<path d="M${x} 700V664"/>`).join('')}<path d="M316 678H834M316 692H834" stroke-width="5"/></g>
${[[390, 704], [585, 708], [770, 704], [150, 716], [1010, 712]].map(([x, y]) => `<g class="flw" transform="translate(${x} ${y})"><path d="M0 0V-40" stroke="#2f8f3e" stroke-width="4"/><circle cx="0" cy="-48" r="15" fill="#ffd23f"/><circle cx="0" cy="-48" r="7" fill="#7a4f2f"/></g>`).join('')}`;
  } else if (regId === 'hory') {
    land = `<path d="M120 560L330 250L470 440L560 330L760 560Z" fill="#8fa9d6"/><path d="M330 250L282 322L318 310L340 336L366 304L388 322Z" fill="#fff"/><path d="M560 330L528 372L556 364L572 384L600 372Z" fill="#fff"/>
<path d="M520 580L760 210L900 400L1000 300L1200 580Z" fill="#7b97c9"/><path d="M760 210L712 284L748 270L770 300L798 268L820 292Z" fill="#fff"/><path d="M1000 300L970 340L996 332L1014 352L1040 340Z" fill="#fff"/>
<path d="M-100 580L80 330L260 580Z" fill="#7b97c9"/><path d="M80 330L50 372L76 366L92 384L112 374Z" fill="#fff"/>
<path d="M0 560Q240 500 500 548T920 530T1200 552V800H0Z" fill="#9fd9a8"/>
${[[420, 560, 1.1], [660, 556, 1.3], [820, 566, 1], [200, 566, 1.2], [1040, 562, 1.25]].map(a => pine(a[0], a[1], a[2], '#3c9a6e', '#2a7f58')).join('')}
<g transform="translate(540 600)"><rect x="-42" y="-48" width="84" height="50" fill="#b9814f" stroke="#70451f" stroke-width="4"/><path d="M-54 -46L0 -90L54 -46Z" fill="#fff" stroke="#70451f" stroke-width="4" stroke-linejoin="round"/><rect x="-12" y="-28" width="24" height="30" rx="3" fill="#70451f"/><rect x="18" y="-34" width="16" height="16" rx="2" fill="#ffe066"/></g>
<path d="M0 640Q300 602 600 630T1200 622V800H0Z" fill="#e8f4ff"/><path d="M0 690Q300 664 600 684T1200 676V800H0Z" fill="#d3e8fb"/>`;
  } else if (regId === 'more') {
    land = `<rect y="470" width="1200" height="200" fill="#38a8e8"/><rect y="470" width="1200" height="10" fill="#8fd6ff"/>
<g class="waves" stroke="#8fd6ff" stroke-width="5" fill="none" stroke-linecap="round">${[[380, 510], [560, 540], [720, 506], [860, 550], [220, 546], [1010, 512], [470, 580], [660, 590]].map(([x, y]) => `<path d="M${x} ${y}q14 -12 28 0t28 0"/>`).join('')}</g>
<g class="boat" transform="translate(600 520)"><path d="M-46 0H46L32 22H-32Z" fill="#e8453c" stroke="#8f211b" stroke-width="4" stroke-linejoin="round"/><path d="M0 0V-78" stroke="#70451f" stroke-width="5"/><path d="M4 -76L44 -12H4Z" fill="#fff" stroke="#b8c2d0" stroke-width="3" stroke-linejoin="round"/><path d="M-4 -66L-34 -12H-4Z" fill="#ffe066" stroke="#c99700" stroke-width="3" stroke-linejoin="round"/></g>
<g transform="translate(860 600)"><path d="M-22 0L-14 -150H14L22 0Z" fill="#fff" stroke="#b8c2d0" stroke-width="4" stroke-linejoin="round"/><path d="M-20 -40H20L18 -80H-18Z" fill="#e8453c"/><path d="M-15 -120H15L14 -150H-14Z" fill="#e8453c"/><rect x="-20" y="-178" width="40" height="30" rx="4" fill="#ffe066" stroke="${INK}" stroke-width="4"/><path d="M-26 -178L0 -204L26 -178Z" fill="#e8453c" stroke="#8f211b" stroke-width="4" stroke-linejoin="round"/></g>
<path d="M0 630Q300 590 600 618T1200 606V800H0Z" fill="#ffe2a0"/>
<g class="tree" data-toy="tree" transform="translate(420 660)"><path d="M0 0Q-10 -70 12 -130" stroke="#9a6a3e" stroke-width="16" fill="none" stroke-linecap="round"/><g class="tr-top">${[[-70, -110], [-50, -170], [20, -190], [80, -150], [86, -100]].map(([x, y]) => `<path d="M12 -130Q${(12 + x) / 2} ${y - 30} ${x} ${y}Q${(12 + x) / 2 + 10} ${y + 6} 12 -130Z" fill="#3fb45a" stroke="#23804a" stroke-width="3" stroke-linejoin="round"/>`).join('')}<circle cx="6" cy="-122" r="9" fill="#9a6a3e"/><circle cx="22" cy="-118" r="9" fill="#8a5a34"/></g></g>
<path d="M0 690Q300 664 600 684T1200 676V800H0Z" fill="#f6d488"/>
<g transform="translate(700 716)"><path d="M0 -20l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z" fill="#ff8a65" stroke="#c4503a" stroke-width="2.5" stroke-linejoin="round"/></g><g transform="translate(300 720)"><path d="M-14 0A14 13 0 0 1 14 0Z" fill="#ffc2d9" stroke="#c9488a" stroke-width="2.5"/><path d="M-8 0V-9M0 0V-13M8 0V-9" stroke="#c9488a" stroke-width="2"/></g>`;
  } else {
    land = `${starDots(70)}<g transform="translate(470 190)"><circle r="54" fill="#ffb86b"/><ellipse rx="92" ry="18" fill="none" stroke="#ffe3b8" stroke-width="9" transform="rotate(-18)"/><path d="M-54 0A54 54 0 0 1 54 0" fill="#ffb86b"/><circle cx="-16" cy="-18" r="9" fill="#f29a45"/></g>
<g transform="translate(980 300)"><circle r="34" fill="#7fe0d6"/><circle cx="-10" cy="-8" r="9" fill="#58c4ba"/><circle cx="12" cy="10" r="6" fill="#58c4ba"/></g>
<g class="boat" transform="translate(640 380) rotate(24)"><path d="M0 -70Q26 -36 22 20H-22Q-26 -36 0 -70Z" fill="#fff" stroke="#b8c2d0" stroke-width="4" stroke-linejoin="round"/><path d="M0 -70Q14 -52 18 -34H-18Q-14 -52 0 -70Z" fill="#e8453c"/><circle cx="0" cy="-12" r="10" fill="#8fd6ff" stroke="${INK}" stroke-width="4"/><path d="M-22 4L-40 30L-22 22ZM22 4L40 30L22 22Z" fill="#e8453c" stroke="#8f211b" stroke-width="3" stroke-linejoin="round"/><path class="flame" d="M-10 22Q0 58 10 22Z" fill="#ffd23f" stroke="#ff8a3c" stroke-width="3"/></g>
<path d="M0 560Q240 500 500 548T920 528T1200 552V800H0Z" fill="#8a78d6"/>
<g fill="#7565c0"><ellipse cx="250" cy="580" rx="46" ry="12"/><ellipse cx="820" cy="566" rx="36" ry="10"/><ellipse cx="560" cy="590" rx="26" ry="8"/></g>
<path d="M0 640Q300 600 600 630T1200 620V800H0Z" fill="#a595ea"/>
<g fill="#8a78d6"><ellipse cx="420" cy="704" rx="42" ry="11"/><ellipse cx="760" cy="720" rx="30" ry="9"/><ellipse cx="160" cy="716" rx="34" ry="10"/><ellipse cx="1040" cy="706" rx="40" ry="11"/></g>`;
  }
  return `<svg class="scene r-${regId} t-${t}" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset=".72" stop-color="${s2}"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#${g})"/>${sun}${clouds}<g class="land">${land}</g>${dim}</svg>`;
}
/* barva země pod kolejemi (ať navazuje na krajinu) */
const GROUND = { louka: '#5fc257', les: '#3f9a5c', farma: '#8fcf52', hory: '#d3e8fb', more: '#f6d488', vesmir: '#a595ea' };
