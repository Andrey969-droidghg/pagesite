/* Общее для всех страниц: состояние, тема, шапка, подвал, уведомления */
var DP = window.DP = window.DP || {};
(function () {
  'use strict';

  /* ---- помощники ---- */
  DP.$ = function (s, r) { return (r || document).querySelector(s); };
  DP.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  DP.el = function (tag, attrs) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      var v = attrs[k];
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (Array.isArray(c)) c.forEach(function (x) { e.append(x && x.nodeType ? x : document.createTextNode(x == null ? '' : x)); });
      else if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  };
  DP.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  var el = DP.el, $ = DP.$;

  /* ---- состояние (ключ тот же, что в прошлой версии: прогресс сохраняется) ---- */
  var KEY = 'dorozhny-patrul-v1';
  DP.fresh = function () { return { name: '', xp: 0, done: {}, stars: {}, solved: {}, badges: {}, bestStreak: 0, fast: 0, team: false, unlockAll: false }; };
  DP.S = DP.fresh();
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) { var p = JSON.parse(raw); for (var k in p) DP.S[k] = p[k]; }
  } catch (e) {}
  DP.save = function () { try { localStorage.setItem(KEY, JSON.stringify(DP.S)); } catch (e) {} };
  DP.reset = function () { DP.S = DP.fresh(); DP.save(); };

  /* ---- уведомления и конфетти ---- */
  DP.toast = function (msg) {
    var box = $('#toasts');
    if (!box) return;
    var t = el('div', { class: 'toast' }, msg);
    box.append(t);
    setTimeout(function () { t.remove(); }, 4200);
  };
  DP.burst = function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cols = ['var(--sun)', 'var(--primary)', 'var(--ok)', 'var(--bad)'];
    for (var i = 0; i < 42; i++) {
      var c = el('span', { class: 'confetti' });
      c.style.background = cols[i % 4];
      c.style.setProperty('--dx', (Math.random() * 640 - 320) + 'px');
      c.style.setProperty('--dy', (Math.random() * 420 - 120) + 'px');
      c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      document.body.append(c);
      (function (n) { setTimeout(function () { n.remove(); }, 1500); })(c);
    }
  };

  /* ---- звания, значки, шкала опыта ---- */
  DP.updateHud = function () {
    if (!DP.RANKS || !$('#hud-rank')) return;
    var S = DP.S, i = DP.rankOf(S.xp), r = DP.RANKS[i], nx = DP.RANKS[i + 1];
    $('#hud-rank').textContent = r.n;
    $('#hud-xp').textContent = S.xp + ' XP';
    var pct = nx ? Math.min(100, Math.round((S.xp - r.at) / (nx.at - r.at) * 100)) : 100;
    $('#hud-bar').style.width = pct + '%';
  };
  DP.checkBadges = function () {
    if (!DP.BADGES) return;
    DP.BADGES.forEach(function (b) {
      if (!DP.S.badges[b.id] && b.ok(DP.S)) { DP.S.badges[b.id] = 1; DP.save(); DP.toast('Новый значок: ' + b.t); }
    });
  };

  /* ---- тема: авто / светлая / тёмная ---- */
  function getTheme() { try { return localStorage.getItem('dp-theme') || 'auto'; } catch (e) { return 'auto'; } }
  function applyTheme(t) {
    var r = document.documentElement;
    if (t === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', t);
    try { if (t === 'auto') localStorage.removeItem('dp-theme'); else localStorage.setItem('dp-theme', t); } catch (e) {}
  }
  var ICONS = {
    light: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    auto: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor"/></svg>',
    dark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="currentColor"/></svg>'
  };
  var NAMES = { light: 'Светлая тема', auto: 'Тема как в системе', dark: 'Тёмная тема' };

  /* ---- шапка и подвал ---- */
  var NAV = [['learn.html', 'Правила'], ['game.html', 'Играть'], ['class.html', 'Команды'], ['glossary.html', 'Глоссарий'], ['video.html', 'Видео'], ['awards.html', 'Награды'], ['teacher.html', 'Учителю']];
  DP.chrome = function (active) {
    var top = $('#chrome-top'), bottom = $('#chrome-bottom');
    if (top) {
      var theme = getTheme();
      var seg = el('div', { class: 'theme', role: 'group', 'aria-label': 'Тема оформления' });
      ['light', 'auto', 'dark'].forEach(function (t) {
        var b = el('button', { type: 'button', 'aria-label': NAMES[t], title: NAMES[t], 'aria-pressed': String(t === theme), html: ICONS[t] });
        b.addEventListener('click', function () {
          applyTheme(t);
          DP.$$('button', seg).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
        });
        seg.append(b);
      });
      var nav = el('nav', { class: 'nav', 'aria-label': 'Разделы' }, NAV.map(function (n) {
        var a = el('a', { href: n[0] }, n[1]);
        if (n[0] === active) a.setAttribute('aria-current', 'page');
        return a;
      }));
      top.replaceChildren(el('header', { class: 'top' }, el('div', { class: 'top-in' },
        el('a', { class: 'brand', href: 'index.html' },
          el('span', { class: 'brand-mark', 'aria-hidden': 'true', html: '<svg viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="9" fill="var(--asphalt)"/><rect x="14" y="4" width="4" height="7" rx="1.5" fill="var(--sun)"/><rect x="14" y="13" width="4" height="7" rx="1.5" fill="var(--sun)"/><rect x="14" y="22" width="4" height="6" rx="1.5" fill="var(--sun)"/></svg>' }),
          el('span', { class: 'brand-t' }, 'Дорожный патруль')),
        el('div', { class: 'hud' },
          el('div', { class: 'hudcol' }, el('span', { class: 'rk', id: 'hud-rank' }, 'Пешеход'), el('div', { class: 'xpbar' }, el('i', { id: 'hud-bar' }))),
          el('span', { class: 'xp', id: 'hud-xp' }, '0 XP')),
        seg,
        nav)));
    }
    if (bottom) {
      bottom.replaceChildren(el('footer', { class: 'foot' }, el('div', { class: 'foot-in' },
        el('p', {}, 'Учебная игра для классного часа по ПДД Республики Беларусь, 7 класс. Не является официальным документом.'),
        el('p', {}, 'Перед занятием сверьте нормы с действующей редакцией ПДД на ', el('a', { href: 'https://pravo.by', target: '_blank', rel: 'noopener' }, 'pravo.by'), '.'))));
    }
    DP.hydrate();
    DP.updateHud();
  };

  /* Подставляет иллюстрации: [data-scene] - сцены, [data-sign] - знаки */
  DP.hydrate = function (root) {
    if (!DP.ART) return;
    DP.$$('[data-scene]', root).forEach(function (n) { n.innerHTML = DP.ART.scene(n.getAttribute('data-scene')); });
    DP.$$('[data-sign]', root).forEach(function (n) { var f = DP.ART[n.getAttribute('data-sign')]; if (f) n.innerHTML = f(); });
  };
})();
