/* Shaklee Diary - tema ungu + pink, latar bunga, buang Produk, hati merah */
(function () {
  const $ = id => document.getElementById(id);

  /* 1. Buang Produk */
  const pp = $('pg-produk'); if (pp) pp.remove();
  document.querySelectorAll('nav div').forEach(n => {
    if ((n.getAttribute('onclick') || '').indexOf("'produk'") > -1) n.remove();
  });

  /* 2. Latar bunga ungu + pink + daun */
  const bunga = (x, y, s, c1, c2) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    [0, 72, 144, 216, 288].map(a => '<ellipse cy="-10" rx="6" ry="10" fill="' + c1 + '" transform="rotate(' + a + ')"/>').join('') +
    '<circle r="4.5" fill="' + c2 + '"/></g>';
  const daun = (x, y, s, r, c) => '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + s + ')">' +
    '<path d="M0 0C12-24 36-30 58-24C48 0 24 14 0 0Z" fill="' + c + '"/>' +
    '<path d="M0 0Q30-10 54-22" stroke="#fff" stroke-opacity=".5" fill="none"/></g>';
  const PK = '#ff7eb6', UN = '#a066e0', PT = '#ffe08a';
  const isi =
    daun(30, 40, 1, -30, '#7bc47f') + daun(250, 120, .9, 150, '#a5d6a7') + daun(120, 190, 1, 60, '#66bb6a') +
    daun(270, 260, .8, -120, '#7bc47f') + daun(60, 270, .9, -60, '#a5d6a7') + daun(190, 20, .8, 30, '#66bb6a') +
    bunga(60, 80, 1.1, PK, PT) + bunga(230, 200, 1, PK, PT) + bunga(150, 270, .8, PK, PT) + bunga(265, 55, .8, PK, PT) +
    bunga(205, 85, 1.1, UN, PT) + bunga(75, 215, 1, UN, PT) + bunga(18, 150, .8, UN, PT) + bunga(285, 150, .8, UN, PT) + bunga(140, 35, .7, UN, PT);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><g opacity=".38">' + isi + '</g></svg>';
  const tile = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';

  /* 3. Tema ungu + pink */
  const st = document.createElement('style');
  st.textContent =
    ':root{--p:#9b4dca;--p2:#ff7eb6;--bg:#fbf0ff;--soft:#f3e0fb;--tx:#3d1f4d}' +
    'html,body{background-color:#fbf0ff!important;background-image:' + tile + '!important;background-size:300px!important;background-attachment:fixed!important}' +
    'header{background:linear-gradient(135deg,#8e44ad,#ff5fa2)!important;box-shadow:0 4px 14px rgba(142,68,173,.35)!important}' +
    '.card{background-color:rgba(255,255,255,.9)!important;border-color:#ead0f5!important;box-shadow:0 4px 14px rgba(155,77,202,.15)!important}' +
    'input,select,textarea{border-color:#dcc0ee!important;background:#fcf8ff!important}' +
    '.item{background:#fcf7ff!important}' +
    '.btn.g{background:#d9a8f0!important}' +
    '.btn.b{background:#ff5fa2!important}' +
    '.bar i{background:linear-gradient(90deg,#9b4dca,#ff7eb6)!important}' +
    '.small{color:#7a5a8c!important}' +
    'nav{box-shadow:0 -4px 14px rgba(155,77,202,.2)!important}' +
    'nav div{color:#b58bd0!important}nav div.on{color:#9b4dca!important}' +
    '.toast{background:#9b4dca!important}';
  document.head.appendChild(st);
  const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute('content', '#9b4dca');

  /* Skrin log masuk (jika sync.js dipasang) */
  let ov = $('sy-e');
  if (ov) { while (ov.parentElement && ov.parentElement !== document.body) ov = ov.parentElement; ov.style.background = 'linear-gradient(160deg,#f6e6ff,#ffe3f1)'; }

  /* 4. Hati merah */
  const HATI = /[\u{1F496}\u{1F495}]/gu, MERAH = '\u2764\uFE0F';
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nod = []; while (w.nextNode()) nod.push(w.currentNode);
  nod.forEach(n => { if (HATI.test(n.nodeValue)) { HATI.lastIndex = 0; n.nodeValue = n.nodeValue.replace(HATI, MERAH); } HATI.lastIndex = 0; });
  const fix = () => { const m = $('u-msg'); if (m) m.textContent = m.textContent.replace(HATI, MERAH); };
  if (typeof window.toast === 'function') { const t0 = window.toast; window.toast = m => t0(String(m).replace(HATI, MERAH)); }
  if (typeof window.paparU === 'function') { const u0 = window.paparU; window.paparU = function () { const r = u0.apply(this, arguments); fix(); return r; }; }
  fix();
})();
