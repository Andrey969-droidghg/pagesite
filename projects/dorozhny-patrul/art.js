/* Иллюстрации: знаки, светофоры и сцены. Всё нарисовано кодом, интернет не нужен. */
var DP = window.DP = window.DP || {};
(function () {
  'use strict';
  var SB = '#0B5CAD', SR = '#D2201B', SK = '#14181F', SY = '#FFC400';

  function FIG(x, y, s, c) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (5 * s) + '" fill="' + c + '"/>' +
      '<path d="M' + x + ' ' + (y + 7 * s) + 'V' + (y + 22 * s) + 'M' + x + ' ' + (y + 11 * s) + 'L' + (x - 8 * s) + ' ' + (y + 18 * s) +
      'M' + x + ' ' + (y + 11 * s) + 'L' + (x + 8 * s) + ' ' + (y + 17 * s) + 'M' + x + ' ' + (y + 22 * s) + 'L' + (x - 6 * s) + ' ' + (y + 34 * s) +
      'M' + x + ' ' + (y + 22 * s) + 'L' + (x + 6 * s) + ' ' + (y + 34 * s) + '" stroke="' + c + '" stroke-width="' + (3.2 * s) +
      '" stroke-linecap="round" fill="none"/>';
  }
  function svg(label, inner, vb) {
    return '<svg viewBox="' + (vb || '0 0 100 100') + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  /* ---------- знаки и светофоры (внутренности SVG 100x100) ---------- */
  var IN = {};
  IN.crossing = '<rect x="4" y="4" width="92" height="92" rx="9" fill="' + SB + '"/><rect x="4" y="4" width="92" height="92" rx="9" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M50 16L84 78H16Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>' + FIG(50, 38, 0.9, SK);
  IN.noentry = '<circle cx="50" cy="50" r="44" fill="' + SR + '"/><rect x="18" y="43" width="64" height="14" rx="2" fill="#fff"/>';
  IN.children = '<path d="M50 8L94 86H6Z" fill="' + SR + '" stroke="' + SR + '" stroke-width="4" stroke-linejoin="round"/><path d="M50 24L81 79H19Z" fill="#fff"/>' + FIG(45, 50, 0.65, SK) + FIG(59, 58, 0.45, SK);
  IN.bike = '<circle cx="50" cy="50" r="44" fill="' + SB + '"/><circle cx="50" cy="50" r="41" fill="none" stroke="#fff" stroke-width="2"/><g fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="33" cy="62" r="11"/><circle cx="68" cy="62" r="11"/><path d="M33 62L45 44H60L68 62M45 44L51 62H33M60 44L56 37H64M45 44L43 38H50"/></g>';
  IN.stop = '<polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" fill="' + SR + '" stroke="#fff" stroke-width="3"/><text x="50" y="60" text-anchor="middle" font-family="Unbounded,Arial,sans-serif" font-weight="800" font-size="20" fill="#fff">STOP</text>';
  IN.yield = '<polygon points="13,22 87,22 50,84" fill="#fff" stroke="' + SR + '" stroke-width="9" stroke-linejoin="round"/>';
  IN.speed20 = '<circle cx="50" cy="50" r="44" fill="#fff"/><circle cx="50" cy="50" r="39.5" fill="none" stroke="' + SR + '" stroke-width="9"/><text x="50" y="62" text-anchor="middle" font-family="Unbounded,Arial,sans-serif" font-weight="800" font-size="30" fill="' + SK + '">20</text>';
  IN['ped-path'] = '<circle cx="50" cy="50" r="44" fill="' + SB + '"/><circle cx="50" cy="50" r="41" fill="none" stroke="#fff" stroke-width="2"/>' + FIG(50, 30, 1.05, '#fff');
  IN['no-ped'] = '<circle cx="50" cy="50" r="44" fill="#fff"/><circle cx="50" cy="50" r="39.5" fill="none" stroke="' + SR + '" stroke-width="9"/>' + FIG(50, 30, 1.05, SK) + '<path d="M24 76L76 24" stroke="' + SR + '" stroke-width="8" stroke-linecap="round"/>';
  IN.busstop = '<rect x="4" y="4" width="92" height="92" rx="9" fill="' + SB + '"/><rect x="4" y="4" width="92" height="92" rx="9" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="20" y="28" width="60" height="38" rx="7" fill="#fff"/><rect x="26" y="34" width="12" height="12" rx="2" fill="' + SB + '"/><rect x="42" y="34" width="12" height="12" rx="2" fill="' + SB + '"/><rect x="58" y="34" width="16" height="12" rx="2" fill="' + SB + '"/><circle cx="34" cy="70" r="7" fill="#fff" stroke="' + SB + '" stroke-width="2"/><circle cx="66" cy="70" r="7" fill="#fff" stroke="' + SB + '" stroke-width="2"/>';
  IN.signal = '<path d="M50 8L94 86H6Z" fill="' + SR + '" stroke="' + SR + '" stroke-width="4" stroke-linejoin="round"/><path d="M50 24L81 79H19Z" fill="#fff"/><rect x="42" y="38" width="16" height="34" rx="4" fill="' + SK + '"/><circle cx="50" cy="46" r="4" fill="#E5392F"/><circle cx="50" cy="55" r="4" fill="#FFC400"/><circle cx="50" cy="64" r="4" fill="#2EBE74"/>';
  IN.main = '<polygon points="50,3 97,50 50,97 3,50" fill="#fff"/><polygon points="50,12 88,50 50,88 12,50" fill="' + SY + '" stroke="' + SK + '" stroke-width="2.5" stroke-linejoin="round"/>';
  IN['no-traffic'] = '<circle cx="50" cy="50" r="44" fill="#fff"/><circle cx="50" cy="50" r="39.5" fill="none" stroke="' + SR + '" stroke-width="9"/>';
  IN['ped-red'] = '<rect x="26" y="4" width="48" height="92" rx="10" fill="#10151C"/>' + FIG(50, 14, 0.95, '#FF3B30') + FIG(50, 56, 0.95, '#173326');
  IN['ped-green'] = '<rect x="26" y="4" width="48" height="92" rx="10" fill="#10151C"/>' + FIG(50, 14, 0.95, '#3b2222') + FIG(50, 56, 0.95, '#2EE086');

  var ART = {};
  Object.keys(IN).forEach(function (k) {
    var lab = k.indexOf('ped-r') === 0 || k === 'ped-green' ? 'Пешеходный светофор' : 'Дорожный знак';
    ART[k] = function () { return svg(lab, IN[k]); };
  });
  function place(k, x, y, size) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + (size / 100) + ')">' + IN[k] + '</g>'; }

  /* ---------- детали сцен ---------- */
  function sky(id, c1, c2) {
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs><rect width="400" height="220" fill="url(#' + id + ')"/>';
  }
  function bld(x, w, h, c) { return '<rect x="' + x + '" y="' + (118 - h) + '" width="' + w + '" height="' + h + '" fill="' + c + '"/>'; }
  function tree(x, y, s) {
    return '<rect x="' + (x - 2 * s) + '" y="' + (y - 18 * s) + '" width="' + (4 * s) + '" height="' + (18 * s) + '" fill="#6B4F3A"/><circle cx="' + x + '" cy="' + (y - 26 * s) + '" r="' + (14 * s) + '" fill="#4CAF7A"/>';
  }
  function P(x, y, s, shirt, o) {
    o = o || {};
    var pants = o.pants || '#2B3A55', skin = o.skin || '#F2C6A0', h = s, g = '';
    g += '<rect x="' + (x - 5 * h) + '" y="' + (y - 22 * h) + '" width="' + (4.4 * h) + '" height="' + (22 * h) + '" rx="' + (2 * h) + '" fill="' + pants + '"/>';
    g += '<rect x="' + (x + 0.6 * h) + '" y="' + (y - 22 * h) + '" width="' + (4.4 * h) + '" height="' + (22 * h) + '" rx="' + (2 * h) + '" fill="' + pants + '"/>';
    if (o.bag) g += '<rect x="' + (x + 4 * h) + '" y="' + (y - 40 * h) + '" width="' + (9 * h) + '" height="' + (17 * h) + '" rx="' + (3 * h) + '" fill="' + o.bag + '"/>';
    g += '<rect x="' + (x - 8 * h) + '" y="' + (y - 42 * h) + '" width="' + (16 * h) + '" height="' + (24 * h) + '" rx="' + (6 * h) + '" fill="' + shirt + '"/>';
    g += '<circle cx="' + x + '" cy="' + (y - 50 * h) + '" r="' + (7 * h) + '" fill="' + skin + '"/>';
    if (o.strips) {
      g += '<rect x="' + (x - 8 * h) + '" y="' + (y - 33 * h) + '" width="' + (16 * h) + '" height="' + (3 * h) + '" fill="#F4FF7A"/>';
      g += '<rect x="' + (x - 8 * h) + '" y="' + (y - 26 * h) + '" width="' + (16 * h) + '" height="' + (3 * h) + '" fill="#F4FF7A"/>';
      g += '<rect x="' + (x - 5 * h) + '" y="' + (y - 11 * h) + '" width="' + (4.4 * h) + '" height="' + (2.6 * h) + '" fill="#F4FF7A"/>';
      g += '<rect x="' + (x + 0.6 * h) + '" y="' + (y - 11 * h) + '" width="' + (4.4 * h) + '" height="' + (2.6 * h) + '" fill="#F4FF7A"/>';
    }
    return g;
  }
  function CAR(x, y, s, c, dir) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (dir < 0 ? -s : s) + ' ' + s + ')">' +
      '<rect x="0" y="-26" width="100" height="18" rx="6" fill="' + c + '"/>' +
      '<path d="M18 -26L30 -42H66L80 -26Z" fill="' + c + '"/>' +
      '<path d="M24 -27L33 -38H47V-27ZM51 -27V-38H64L73 -27Z" fill="#CFE3F5"/>' +
      '<circle cx="24" cy="-8" r="8.5" fill="#1B2230"/><circle cx="76" cy="-8" r="8.5" fill="#1B2230"/>' +
      '<circle cx="24" cy="-8" r="3.5" fill="#8B97A8"/><circle cx="76" cy="-8" r="3.5" fill="#8B97A8"/>' +
      '<rect x="94" y="-22" width="6" height="5" rx="2" fill="#FFE27A"/></g>';
  }
  function BIKE(x, y, s, c) {
    var a = function (v) { return Math.round(v * 10) / 10; };
    return '<g fill="none" stroke="' + c + '" stroke-width="' + (3 * s) + '" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="' + x + '" cy="' + a(y - 16 * s) + '" r="' + a(16 * s) + '"/><circle cx="' + a(x + 40 * s) + '" cy="' + a(y - 16 * s) + '" r="' + a(16 * s) + '"/>' +
      '<path d="M' + x + ' ' + a(y - 16 * s) + 'L' + a(x + 16 * s) + ' ' + a(y - 34 * s) + 'H' + a(x + 34 * s) + 'L' + a(x + 40 * s) + ' ' + a(y - 16 * s) +
      'M' + a(x + 16 * s) + ' ' + a(y - 34 * s) + 'L' + a(x + 22 * s) + ' ' + a(y - 16 * s) + 'H' + x +
      'M' + a(x + 34 * s) + ' ' + a(y - 34 * s) + 'L' + a(x + 31 * s) + ' ' + a(y - 42 * s) + 'H' + a(x + 39 * s) +
      'M' + a(x + 16 * s) + ' ' + a(y - 34 * s) + 'L' + a(x + 14 * s) + ' ' + a(y - 40 * s) + 'H' + a(x + 20 * s) + '"/></g>';
  }
  function RIDER(x, y, s, shirt) {
    var a = function (v) { return Math.round(v * 10) / 10; };
    return '<circle cx="' + a(x + 24 * s) + '" cy="' + a(y - 64 * s) + '" r="' + a(6.5 * s) + '" fill="#F2C6A0"/>' +
      '<path d="M' + a(x + 16 * s) + ' ' + a(y - 40 * s) + 'L' + a(x + 24 * s) + ' ' + a(y - 56 * s) + '" stroke="' + shirt + '" stroke-width="' + a(9 * s) + '" stroke-linecap="round"/>' +
      '<path d="M' + a(x + 25 * s) + ' ' + a(y - 54 * s) + 'L' + a(x + 36 * s) + ' ' + a(y - 43 * s) + '" stroke="#F2C6A0" stroke-width="' + a(3.4 * s) + '" stroke-linecap="round"/>' +
      '<path d="M' + a(x + 16 * s) + ' ' + a(y - 38 * s) + 'L' + a(x + 25 * s) + ' ' + a(y - 24 * s) + 'L' + a(x + 22 * s) + ' ' + a(y - 16 * s) + '" fill="none" stroke="#2B3A55" stroke-width="' + a(4.4 * s) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function zebra(x0, n, y, h) {
    var z = '';
    for (var i = 0; i < n; i++) z += '<rect x="' + (x0 + i * 14) + '" y="' + y + '" width="8" height="' + h + '" fill="#F5F7FB"/>';
    return z;
  }
  var ROAD = '<rect y="118" width="400" height="24" fill="#DDE3EC"/><rect y="140" width="400" height="3" fill="#B9C2D0"/><rect y="143" width="400" height="77" fill="#454E5E"/><path d="M0 198H400" stroke="#C9D0DC" stroke-width="3" stroke-dasharray="18 14"/>';

  var SC = {};
  SC.crossing = function () {
    return svg('Школьник переходит дорогу по пешеходному переходу, машина остановилась',
      sky('gc', '#BFDFFF', '#EAF4FF') + bld(0, 60, 50, '#C9D6EA') + bld(60, 50, 72, '#B8C8E2') + bld(110, 70, 40, '#D5DFEF') + bld(300, 50, 60, '#C2D0E6') + bld(350, 50, 44, '#D0DAEC') +
      tree(285, 118, 0.8) + ROAD + zebra(176, 6, 143, 77) + CAR(22, 205, 1.05, '#E8505B', 1) +
      P(214, 192, 1.1, '#2C5BFF', { bag: '#FFC21A' }) + P(335, 136, 1, '#10B981', { bag: '#7C3AED' }) +
      '<rect x="266" y="86" width="4" height="52" fill="#5B6577"/>' + place('crossing', 250, 52, 36), '0 0 400 220');
  };
  SC.traffic = function () {
    return svg('Красный сигнал пешеходного светофора: школьник ждёт, машина проезжает',
      sky('gt', '#CFE6FF', '#F2F8FF') + bld(20, 60, 56, '#C4D2E8') + bld(80, 60, 78, '#B4C5E0') + bld(240, 70, 48, '#D2DCEE') + bld(310, 80, 66, '#BFCDE5') +
      ROAD + '<rect x="66" y="52" width="5" height="88" fill="#5B6577"/>' + place('ped-red', 44, 2, 50) +
      P(108, 138, 1.1, '#FF8A3D', { bag: '#2C5BFF' }) + CAR(350, 207, 1.1, '#FFC21A', -1) +
      '<path d="M358 176H392M366 188H398" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>', '0 0 400 220');
  };
  SC.night = function () {
    var st = '', pts = [[30, 20], [80, 50], [140, 18], [200, 38], [260, 14], [320, 44], [370, 22], [110, 80], [300, 86]];
    pts.forEach(function (p) { st += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#fff" opacity=".8"/>'; });
    return svg('Вечер: пешеход с фликером хорошо виден в свете фар, пешеход без фликера почти не виден',
      sky('gn', '#0A1030', '#1B2A5C') + st + '<circle cx="345" cy="42" r="16" fill="#FFF3C4"/>' +
      '<rect y="150" width="400" height="70" fill="#1B2233"/><rect y="146" width="400" height="6" fill="#2A3347"/><path d="M0 196H400" stroke="#4A5568" stroke-width="3" stroke-dasharray="16 14"/>' +
      '<defs><linearGradient id="gbm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".85"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="124,182 400,128 400,216" fill="url(#gbm)"/>' + CAR(20, 206, 1.05, '#5E8BFF', 1) +
      '<ellipse cx="262" cy="160" rx="22" ry="34" fill="#F4FF7A" opacity=".16"/>' +
      P(262, 190, 1.15, '#26304A', { pants: '#1A2236', strips: true }) +
      '<g opacity=".45">' + P(345, 190, 1.15, '#26304A', { pants: '#1A2236' }) + '</g>' +
      '<text x="262" y="212" text-anchor="middle" font-size="11" font-weight="700" fill="#E8EEFF" font-family="Onest,Arial,sans-serif">С фликером</text>' +
      '<text x="345" y="212" text-anchor="middle" font-size="11" font-weight="700" fill="#AEB9D8" font-family="Onest,Arial,sans-serif">Без фликера</text>', '0 0 400 220');
  };
  SC.bike = function () {
    return svg('Велосипедист едет по велодорожке, школьник переходит дорогу пешком и ведёт велосипед рядом',
      sky('gb', '#D8F0E4', '#F2FAF5') + bld(150, 60, 40, '#C5DDD0') + tree(30, 118, 1) + tree(120, 118, 0.8) +
      '<rect y="118" width="400" height="102" fill="#7FBF93"/><rect y="150" width="230" height="40" fill="#D8DEE8"/><path d="M0 170H230" stroke="#fff" stroke-width="3" stroke-dasharray="14 12"/>' +
      '<rect x="230" y="118" width="170" height="102" fill="#454E5E"/>' + zebra(250, 9, 118, 102) +
      BIKE(52, 186, 1.25, '#2C5BFF') + RIDER(52, 186, 1.25, '#FF8A3D') +
      '<rect x="14" y="88" width="4" height="62" fill="#5B6577"/>' + place('bike', 0, 56, 32) +
      P(300, 205, 1.1, '#10B981', { bag: '#7C3AED' }) + BIKE(312, 205, 1, '#FF8A3D'), '0 0 400 220');
  };
  SC.help = function () {
    var cs = [['101', 'МЧС', '#E0392D'], ['102', 'Милиция', '#2C5BFF'], ['103', 'Скорая', '#0E9F6E']], g = '';
    cs.forEach(function (c, i) {
      var cx = 214 + i * 72;
      g += '<circle cx="' + cx + '" cy="86" r="29" fill="' + c[2] + '"/><text x="' + cx + '" y="94" text-anchor="middle" font-family="Unbounded,Arial,sans-serif" font-weight="800" font-size="19" fill="#fff">' + c[0] + '</text>' +
        '<text x="' + cx + '" y="136" text-anchor="middle" font-family="Onest,Arial,sans-serif" font-weight="700" font-size="13" fill="#14203A">' + c[1] + '</text>';
    });
    return svg('Телефон с номером 112 и номера служб 101, 102 и 103',
      sky('gh', '#E6ECFF', '#F7F9FF') +
      '<g fill="none" stroke="#2C5BFF" stroke-width="3" stroke-linecap="round" opacity=".5"><path d="M88 42a30 30 0 0 1 40 0"/><path d="M78 30a46 46 0 0 1 60 0"/></g>' +
      '<rect x="76" y="52" width="64" height="140" rx="15" fill="#14203A"/><rect x="82" y="62" width="52" height="118" rx="9" fill="#F4F7FF"/>' +
      '<text x="108" y="104" text-anchor="middle" font-family="Unbounded,Arial,sans-serif" font-weight="800" font-size="21" fill="#14203A">112</text>' +
      '<rect x="92" y="140" width="32" height="22" rx="11" fill="#12B981"/><path d="M104 151h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' + g +
      '<rect x="170" y="158" width="206" height="34" rx="17" fill="#2C5BFF"/><text x="273" y="180" text-anchor="middle" font-family="Onest,Arial,sans-serif" font-weight="700" font-size="14" fill="#fff">Единый номер: 112</text>', '0 0 400 220');
  };
  SC.signsRow = function () {
    return svg('Четыре дорожных знака', place('crossing', 10, 14, 88) + place('children', 108, 14, 88) + place('bike', 206, 14, 88) + place('stop', 304, 14, 88), '0 0 400 116');
  };
  SC.play = function () {
    return svg('Видеоплеер',
      '<rect x="8" y="10" width="384" height="200" rx="18" fill="#14203A"/><rect x="26" y="180" width="348" height="6" rx="3" fill="#33426B"/><rect x="26" y="180" width="120" height="6" rx="3" fill="#FFC21A"/>' +
      '<circle cx="200" cy="100" r="38" fill="#FFC21A"/><path d="M190 80L222 100L190 120Z" fill="#14203A"/>', '0 0 400 220');
  };
  SC.medals = function () {
    var m = [['★', '#FFC21A'], ['×5', '#2C5BFF'], ['КП', '#0E9F6E']], g = '';
    m.forEach(function (c, i) {
      var cx = 80 + i * 120;
      g += '<path d="M' + (cx - 16) + ' 20L' + cx + ' 70L' + (cx + 16) + ' 20Z" fill="' + c[1] + '" opacity=".55"/><circle cx="' + cx + '" cy="110" r="42" fill="' + c[1] + '"/><circle cx="' + cx + '" cy="110" r="34" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>' +
        '<text x="' + cx + '" y="120" text-anchor="middle" font-family="Unbounded,Arial,sans-serif" font-weight="800" font-size="26" fill="#fff">' + c[0] + '</text>';
    });
    return svg('Три медали', g, '0 0 400 180');
  };

  ART.scene = function (k) { return SC[k](); };
  DP.PARTS = { FIG: FIG, P: P, CAR: CAR, BIKE: BIKE, RIDER: RIDER, tree: tree, bld: bld, place: place, zebra: zebra };
  DP.ART = ART;
  DP.SIGNIN = IN;
  /* Детали сцен для анимации (используются при создании видео) */
  DP.PARTS = { P: P, CAR: CAR, BIKE: BIKE, RIDER: RIDER, zebra: zebra, ROAD: ROAD, bld: bld, tree: tree, sky: sky, place: place, FIG: FIG, svg: svg, IN: IN };
})();
