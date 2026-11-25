/* Движок презентации: слайды, тесты, игры, кроссворд, исполнитель */
(function () {
  'use strict';
  var L = window.LESSON;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function h(tag, props) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.append(c.nodeType ? c : document.createTextNode(c));
  }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rich(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>'); }
  function rt(tag, cls, t, extra) { var e = h(tag, Object.assign({ class: cls, html: rich(t) }, extra || {})); return e; }
  function plain(t) { return String(t).replace(/\*\*|`/g, ''); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduce ? Math.min(ms, 60) : ms); }); }

  /* ---------- сохранение ---------- */
  var KEY = 'algo-' + L.id;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } }

  /* ---------- конфетти ---------- */
  var fx = h('canvas', { id: 'fx', 'aria-hidden': 'true' });
  var parts = [], raf = 0;
  function burst(x, y, n) {
    if (reduce) return;
    var cols = ['#3A5BFF', '#E23D80', '#0E9F85', '#FFB800', '#7A4DFF'];
    for (var i = 0; i < (n || 46); i++) {
      var a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, g: .25, s: 5 + Math.random() * 6, c: cols[i % cols.length], r: Math.random() * 6, life: 70 + Math.random() * 30 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    var dpr = window.devicePixelRatio || 1;
    if (fx.width !== innerWidth * dpr) { fx.width = innerWidth * dpr; fx.height = innerHeight * dpr; }
    var c = fx.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .99; p.life--; p.r += .2;
      c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.globalAlpha = Math.min(1, p.life / 25); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); c.restore();
    });
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) c.clearRect(0, 0, innerWidth, innerHeight);
  }
  function burstAt(el) { var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); }

  /* ---------- состояние ---------- */
  var slides = L.slides, cur = 0, pts = {};
  function maxFor(s) {
    if (s.type === 'quiz') return s.questions.length;
    if (s.type === 'match') return s.pairs.length;
    if (s.type === 'sort') return 2;
    if (s.type === 'debug') return 1;
    if (s.type === 'robot') return s.levels.length;
    if (s.type === 'crossword') { return CW.layout(s.words).words.length; }
    return 0;
  }
  function totals() {
    var g = 0, m = 0;
    slides.forEach(function (s, i) { m += maxFor(s); if (pts[i]) g += Math.min(pts[i], maxFor(s)); });
    return { g: g, m: m };
  }
  function award(i, got) {
    if (got > (pts[i] || 0)) pts[i] = got;
    var t = totals(), st = load(); st.score = t.g; st.max = t.m; save(st);
  }

  /* ---------- рендер слайдов ---------- */
  var R = {};
  function head(s) { return [s.k ? h('p', { class: 'kicker st' }, s.k) : null, rt('h2', 'st', s.title)]; }

  R.title = function (s) {
    return h('section', { class: 'slide s-title' },
      h('div', { class: 'deco' }, h('span', { class: 'd1' }), h('span', { class: 'd2' }), h('span', { class: 'd3' }), h('span', { class: 'd4' }), h('span', { class: 'd5' })),
      h('div', { class: 't-body' },
        h('p', { class: 'kicker st' }, s.kicker),
        h('h1', { class: 'st', style: '--i:1' }, s.title),
        h('p', { class: 'lead st', style: '--i:2' }, s.sub),
        h('ul', { class: 'goals' }, s.goals.map(function (g, i) { return h('li', { style: '--i:' + i, html: rich(g) }); })),
        h('button', { class: 'btn big st', style: '--i:6', onclick: next }, 'Начать урок →')));
  };

  R.info = function (s) {
    var body = [];
    if (s.def) body.push(h('div', { class: 'def st', style: '--i:1' }, h('div', { class: 'term' }, s.def.term), rt('div', 'text', s.def.text)));
    if (s.lead) body.push(rt('p', 'lead st', s.lead, { style: '--i:1' }));
    if (s.bullets) body.push(h('ul', { class: 'bullets' }, s.bullets.map(function (b, i) { return rt('li', 'st', b, { style: '--i:' + (i + 2) }); })));
    if (s.note) body.push(rt('p', 'note st', s.note, { style: '--i:6' }));
    if (s.link) body.push(h('a', { class: 'btn ghost small golink st', style: '--i:7', href: s.link.to }, s.link.label));
    return h('section', { class: 'slide' }, head(s), body);
  };

  R.cards = function (s) {
    return h('section', { class: 'slide' }, head(s),
      s.lead ? rt('p', 'lead st', s.lead, { style: '--i:1' }) : null,
      s.flip ? h('p', { class: 'hint st' }, 'Нажми на карточку, чтобы увидеть пояснение.') : null,
      h('div', { class: 'cards' }, s.cards.map(function (c, i) {
        var card = h('div', { class: 'card st' + (s.flip ? ' flip' : ''), style: '--i:' + (i + 2), tabindex: s.flip ? '0' : null, role: s.flip ? 'button' : null },
          c.shape ? h('div', { class: 'shape k-' + c.shape }, c.sample || '') : (c.n ? h('div', { class: 'badge' }, c.n) : null),
          h('h3', null, c.t),
          s.flip ? [h('p', { class: 'back', html: rich(c.d) }), h('div', { class: 'front-hint' }, 'Нажми →')] : rt('p', '', c.d));
        if (s.flip) {
          var tg = function () { card.classList.toggle('flipped'); };
          card.addEventListener('click', tg);
          card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } });
        }
        return card;
      })),
      s.note ? rt('p', 'note st', s.note, { style: '--i:8' }) : null);
  };

  R.flow = function (s) {
    var nodes = [];
    s.nodes.forEach(function (n, i) {
      if (i) nodes.push(h('div', { class: 'arrow', style: '--i:' + i }));
      nodes.push(h('div', { class: 'node k-' + n.k, style: '--i:' + i }, n.t, n.side ? h('em', { class: 'side' }, n.side) : null));
    });
    var left = h('div', null, h('div', { class: 'flow' }, nodes));
    var right = h('div', null, s.aside ? h('ul', { class: 'bullets' }, s.aside.map(function (b, i) { return rt('li', 'st', b, { style: '--i:' + (i + 3) }); })) : null,
      s.note ? rt('p', 'note st', s.note, { style: '--i:7' }) : null);
    return h('section', { class: 'slide' }, head(s), s.lead ? rt('p', 'lead st', s.lead, { style: '--i:1' }) : null, h('div', { class: 'two' }, left, right));
  };

  R.steps = function (s) {
    return h('section', { class: 'slide' }, head(s), s.lead ? rt('p', 'lead st', s.lead, { style: '--i:1' }) : null,
      h('ol', { class: 'steps' }, s.items.map(function (it, i) { return h('li', { class: 'st', style: '--i:' + (i + 2) }, h('div', null, rt('b', '', it.t), it.d ? rt('span', '', it.d) : null)); })),
      s.note ? rt('p', 'note st', s.note, { style: '--i:9' }) : null);
  };

  R.match = function (s, i) {
    var left = s.pairs.map(function (p, k) { return { k: k, t: p[0] }; });
    var right = shuffle(s.pairs.map(function (p, k) { return { k: k, t: p[1] }; }));
    var sel = null, done = 0, miss = 0;
    var msg = h('p', { class: 'msg', 'aria-live': 'polite' }, 'Выбери понятие слева, затем подходящее описание справа.');
    function mk(o, side) {
      var b = h('button', { class: 'opt st', style: '--i:' + (o.k % 6 + 1), html: rich(o.t) });
      b.dataset.k = o.k; b.dataset.side = side;
      b.addEventListener('click', function () {
        if (side === 'l') {
          if (sel) sel.classList.remove('sel');
          sel = b; b.classList.add('sel');
        } else if (sel) {
          if (+sel.dataset.k === o.k) {
            sel.classList.remove('sel'); sel.classList.add('done'); b.classList.add('done'); sel = null; done++;
            msg.className = 'msg ok'; msg.textContent = 'Верно!';
            if (done === s.pairs.length) {
              var got = Math.max(0, s.pairs.length - miss); award(i, got);
              msg.textContent = 'Все пары найдены. Ошибок: ' + miss + '. Баллы: ' + got + ' из ' + s.pairs.length + '.'; burstAt(b);
            }
          } else {
            miss++; b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 420);
            msg.className = 'msg no'; msg.textContent = 'Не подходит. Попробуй другое описание.';
          }
        } else { msg.className = 'msg'; msg.textContent = 'Сначала выбери понятие слева.'; }
      });
      return b;
    }
    return h('section', { class: 'slide' }, head(s), h('p', { class: 'lead st', style: '--i:1' }, s.lead || 'Найди пары.'),
      h('div', { class: 'game st', style: '--i:2' }, h('div', { class: 'match' }, h('div', { class: 'col' }, left.map(function (o) { return mk(o, 'l'); })), h('div', { class: 'col' }, right.map(function (o) { return mk(o, 'r'); }))), msg));
  };

  R.sort = function (s, i) {
    var order = shuffle(s.items.map(function (t, k) { return k; }));
    var guard = 0; while (order.every(function (v, k) { return v === k; }) && guard++ < 20) order = shuffle(order);
    var attempts = 0, solved = false;
    var list = h('ol', { class: 'sort' });
    var msg = h('p', { class: 'msg', 'aria-live': 'polite' });
    function draw(marks) {
      list.replaceChildren();
      order.forEach(function (v, pos) {
        var li = h('li', { class: marks ? (v === pos ? 'good' : 'bad') : '' },
          h('span', { class: 'n' }, pos + 1), h('span', { html: rich(s.items[v]) }),
          h('span', { class: 'mv' },
            h('button', { 'aria-label': 'Вверх', onclick: function () { mv(pos, -1); } }, '▲'),
            h('button', { 'aria-label': 'Вниз', onclick: function () { mv(pos, 1); } }, '▼')));
        list.append(li);
      });
    }
    function mv(p, d) { if (solved) return; var q = p + d; if (q < 0 || q >= order.length) return; var t = order[p]; order[p] = order[q]; order[q] = t; draw(false); msg.textContent = ''; }
    draw(false);
    var chk = h('button', {
      class: 'btn', onclick: function () {
        if (solved) return;
        attempts++; var ok = order.every(function (v, k) { return v === k; }); draw(true);
        if (ok) { solved = true; award(i, attempts === 1 ? 2 : 1); msg.className = 'msg ok'; msg.textContent = attempts === 1 ? 'Порядок верный с первой попытки. 2 балла!' : 'Порядок верный. 1 балл.'; burstAt(chk); }
        else { msg.className = 'msg no'; msg.textContent = 'Зелёным отмечены шаги на своих местах. Переставь остальные.'; }
      }
    }, 'Проверить порядок');
    return h('section', { class: 'slide' }, head(s), h('p', { class: 'lead st', style: '--i:1' }, s.lead),
      h('div', { class: 'game st', style: '--i:2' }, list, h('div', { class: 'row' }, chk), msg));
  };

  R.quiz = function (s, idx) {
    var qi = 0, ok = 0, locked = false;
    var box = h('div', { class: 'game quiz st', style: '--i:2' });
    function show() {
      box.replaceChildren();
      if (qi >= s.questions.length) {
        award(idx, ok);
        var pct = ok / s.questions.length;
        box.append(h('div', { class: 'score' }, h('div', { class: 'big' }, ok + ' / ' + s.questions.length),
          h('div', null, h('h3', { style: 'margin:0 0 6px' }, pct === 1 ? 'Отлично!' : pct >= .7 ? 'Хороший результат' : 'Стоит повторить'),
            h('p', { style: 'margin:0;color:var(--muted)' }, pct === 1 ? 'Все ответы верные.' : 'Вернись к предыдущим слайдам через меню и попробуй ещё раз.'))),
          h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: function () { qi = 0; ok = 0; show(); } }, 'Пройти заново')));
        if (pct >= .7) setTimeout(function () { burstAt(box); }, 200);
        return;
      }
      var q = s.questions[qi]; locked = false;
      box.append(h('div', { class: 'meta' }, h('span', null, 'Вопрос ' + (qi + 1) + ' из ' + s.questions.length), h('span', null, 'Верно: ' + ok)));
      box.append(rt('p', 'q', q.q));
      if (q.code) box.append(h('div', { class: 'code' }, q.code.map(function (ln, k) { return h('span', { class: 'ln' }, h('i', null, k + 1), ln); })));
      var why = h('div');
      var optsEl = h('div', { class: 'opts' });
      var order = shuffle(q.opts.map(function (t, k) { return k; }));
      order.forEach(function (k, pos) {
        var b = h('button', { class: 'opt' }, h('b', null, 'АБВГ'[pos]), h('span', { html: rich(q.opts[k]) }));
        b.addEventListener('click', function () {
          if (locked) return; locked = true;
          var good = k === q.a;
          if (good) { ok++; b.classList.add('right'); burstAt(b); }
          else {
            b.classList.add('wrong');
            Array.prototype.forEach.call(optsEl.children, function (c, p) { if (order[p] === q.a) c.classList.add('right'); });
          }
          why.replaceChildren(rt('p', 'why', (good ? '**Верно.** ' : '**Неверно.** ') + (q.why || '')),
            h('div', { class: 'row' }, h('button', { class: 'btn', onclick: function () { qi++; show(); } }, qi + 1 < s.questions.length ? 'Дальше →' : 'Результат')));
        });
        optsEl.append(b);
      });
      box.append(optsEl, why);
    }
    show();
    return h('section', { class: 'slide' }, head(s), h('p', { class: 'lead st', style: '--i:1' }, s.lead || 'Выбери один верный ответ.'), box);
  };

  R.crossword = function (s, idx) {
    var lay = CW.layout(s.words), inputs = {}, curWord = null, wasFocused = false;
    var msg = h('p', { class: 'msg', 'aria-live': 'polite' }, 'Нажми на клетку или подсказку и вводи буквы.');
    var cellWords = {};
    lay.words.forEach(function (w) {
      for (var i = 0; i < w.w.length; i++) {
        var x = w.x + (w.dir === 0 ? i : 0), y = w.y + (w.dir === 0 ? 0 : i);
        (cellWords[x + ',' + y] = cellWords[x + ',' + y] || []).push(w);
      }
    });
    function cellOf(w, i) { return (w.x + (w.dir === 0 ? i : 0)) + ',' + (w.y + (w.dir === 0 ? 0 : i)); }
    var clueBtns = [];
    function setWord(w) { curWord = w; clueBtns.forEach(function (c) { c.b.classList.toggle('on', c.w === w); }); }
    var grid = h('div', { class: 'cw', style: 'grid-template-columns:repeat(' + lay.W + ',max-content)' });
    for (var y = 0; y < lay.H; y++) for (var x = 0; x < lay.W; x++) {
      var ch = lay.grid[y][x], key = x + ',' + y;
      if (!ch) { grid.append(h('div', { class: 'c' })); continue; }
      var inp = h('input', { maxlength: '2', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', 'aria-label': 'Клетка ' + (x + 1) + ',' + (y + 1) });
      inp.dataset.key = key; inputs[key] = inp;
      var n = lay.num[key];
      grid.append(h('div', { class: 'c st', style: '--i:' + ((x + y) % 8) }, n ? h('i', null, n) : null, inp));
    }
    Object.keys(inputs).forEach(function (key) {
      var inp = inputs[key], ws = cellWords[key];
      inp.addEventListener('pointerdown', function () { wasFocused = document.activeElement === inp; });
      inp.addEventListener('focus', function () { if (!curWord || ws.indexOf(curWord) < 0) setWord(ws[0]); inp.select(); });
      inp.addEventListener('click', function () { if (wasFocused && ws.length > 1) setWord(ws[0] === curWord ? ws[1] : ws[0]); });
      inp.addEventListener('input', function () {
        var v = inp.value.replace(/[^A-Za-zА-Яа-яЁё]/g, ''); inp.value = v ? v.slice(-1).toUpperCase() : '';
        inp.classList.remove('ok', 'no');
        if (inp.value && curWord) {
          var i = 0; for (; i < curWord.w.length; i++) if (cellOf(curWord, i) === key) break;
          var nk = i + 1 < curWord.w.length ? cellOf(curWord, i + 1) : null; if (nk) inputs[nk].focus();
        }
      });
      inp.addEventListener('keydown', function (e) {
        var p = key.split(',').map(Number), t = null;
        if (e.key === 'Backspace' && !inp.value && curWord) {
          var i = 0; for (; i < curWord.w.length; i++) if (cellOf(curWord, i) === key) break;
          if (i > 0) { e.preventDefault(); var pk = cellOf(curWord, i - 1); inputs[pk].value = ''; inputs[pk].focus(); }
        }
        if (e.key === 'ArrowLeft') t = (p[0] - 1) + ',' + p[1];
        if (e.key === 'ArrowRight') t = (p[0] + 1) + ',' + p[1];
        if (e.key === 'ArrowUp') t = p[0] + ',' + (p[1] - 1);
        if (e.key === 'ArrowDown') t = p[0] + ',' + (p[1] + 1);
        if (t && inputs[t]) { e.preventDefault(); e.stopPropagation(); inputs[t].focus(); } else if (e.key.indexOf('Arrow') === 0) e.stopPropagation();
      });
    });
    function clueList(dir, title) {
      var ws = lay.words.filter(function (w) { return w.dir === dir; }).sort(function (a, b) { return a.n - b.n; });
      return h('div', null, h('h3', null, title), h('ol', null, ws.map(function (w) {
        var b = h('button', { onclick: function () { setWord(w); inputs[cellOf(w, 0)].focus(); } }, h('b', null, w.n), h('span', null, w.clue + ' (' + w.w.length + ' букв)'));
        clueBtns.push({ b: b, w: w }); return h('li', null, b);
      })));
    }
    function check() {
      var good = 0;
      lay.words.forEach(function (w) {
        var okw = true;
        for (var i = 0; i < w.w.length; i++) { var inp = inputs[cellOf(w, i)]; if (inp.value !== w.w[i]) okw = false; }
        if (okw) good++;
      });
      Object.keys(inputs).forEach(function (k) {
        var inp = inputs[k], p = k.split(','), want = lay.grid[+p[1]][+p[0]];
        inp.classList.remove('ok', 'no');
        if (inp.value) inp.classList.add(inp.value === want ? 'ok' : 'no');
      });
      award(idx, good);
      if (good === lay.words.length) { msg.className = 'msg ok'; msg.textContent = 'Кроссворд решён! Слов: ' + good + ' из ' + lay.words.length + '.'; burstAt(grid); }
      else { msg.className = 'msg no'; msg.textContent = 'Верных слов: ' + good + ' из ' + lay.words.length + '. Красные клетки содержат ошибку.'; }
    }
    function reveal() {
      if (!curWord) { msg.className = 'msg'; msg.textContent = 'Выбери слово, чтобы получить подсказку.'; return; }
      for (var i = 0; i < curWord.w.length; i++) { var inp = inputs[cellOf(curWord, i)]; if (inp.value !== curWord.w[i]) { inp.value = curWord.w[i]; inp.classList.remove('no'); inp.classList.add('pop'); inp.focus(); break; } }
    }
    return h('section', { class: 'slide' }, head(s), h('p', { class: 'lead st', style: '--i:1' }, s.lead || 'Разгадай слова главы.'),
      h('div', { class: 'game st', style: '--i:2' },
        h('div', { class: 'cw-wrap' }, h('div', { class: 'cw-scroll' }, grid), h('div', { class: 'clues' }, clueList(0, 'По горизонтали'), clueList(1, 'По вертикали'))),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: check }, 'Проверить'),
          h('button', { class: 'btn ghost', onclick: reveal }, 'Подсказка: одна буква'),
          h('button', { class: 'btn ghost', onclick: function () { Object.keys(inputs).forEach(function (k) { inputs[k].value = ''; inputs[k].classList.remove('ok', 'no'); }); msg.textContent = ''; } }, 'Очистить')), msg));
  };

  R.debug = function (s, idx) {
    var tries = 0, solved = false;
    var msg = h('p', { class: 'msg', 'aria-live': 'polite' });
    var code = h('div', { class: 'code' });
    s.lines.forEach(function (ln, k) {
      var l = h('span', { class: 'ln pick', role: 'button', tabindex: '0' }, h('i', null, k + 1), ln);
      var pick = function () {
        if (solved) return; tries++;
        if (k === s.bad) {
          solved = true; l.classList.add('good'); award(idx, 1);
          msg.className = 'msg ok'; msg.innerHTML = rich('Нашёл! ' + s.why); burstAt(l);
        } else {
          l.classList.add('bad'); setTimeout(function () { l.classList.remove('bad'); }, 600);
          msg.className = 'msg no'; msg.textContent = tries > 2 ? 'Подсказка: ' + s.hint : 'В этой строке ошибки нет. Попробуй другую.';
        }
      };
      l.addEventListener('click', pick);
      l.addEventListener('keydown', function (e) { if (e.key === 'Enter') pick(); });
      code.append(l);
    });
    return h('section', { class: 'slide' }, head(s), rt('p', 'lead st', s.task, { style: '--i:1' }),
      h('div', { class: 'game st', style: '--i:2' }, code, msg));
  };

  R.ide = function (s) {
    var seen = {};
    var ex = h('div', { class: 'explain', 'aria-live': 'polite' }, 'Нажми на любую часть окна среды программирования.');
    var count = h('p', { class: 'hint' }, 'Изучено частей: 0 из 4');
    var P = {}; s.parts.forEach(function (p) { P[p.id] = p; });
    function part(id, cls, inner) {
      var b = h('button', { class: cls }, h('span', { class: 'lbl' }, P[id].lbl), inner);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(b.parentNode.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on', 'seen'); seen[id] = 1;
        ex.replaceChildren(h('b', null, P[id].lbl + '. '), document.createTextNode(P[id].d));
        count.textContent = 'Изучено частей: ' + Object.keys(seen).length + ' из 4';
      });
      return b;
    }
    var mini = h('div', { class: 'mini' }); for (var k = 0; k < 15; k++) mini.append(h('i', { class: k === 11 ? 'r' : (k === 3 ? 's' : '') }));
    return h('section', { class: 'slide' }, head(s), s.lead ? rt('p', 'lead st', s.lead, { style: '--i:1' }) : null, count,
      h('div', { class: 'ide st', style: '--i:2' },
        part('tb', 'tb', h('span', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, h('span', { class: 'k' }, '▶ Запуск'), h('span', { class: 'k g' }, '⏭ Шаг'), h('span', { class: 'k g' }, '■ Стоп'))),
        part('ed', 'ed', h('pre', null, s.code.join('\n'))),
        part('fl', 'fl', mini),
        part('ms', 'ms', h('pre', null, s.msgText))),
      ex);
  };

  /* ----- исполнитель ----- */
  var DIR = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  var NAME = { U: 'вверх', D: 'вниз', L: 'влево', R: 'вправо' };
  var ARR = { U: '↑', D: '↓', L: '←', R: '→', A: 'A' };
  R.robot = function (s, idx) {
    var levels = s.levels, li = 0, runId = 0, running = false;
    var states = levels.map(function (l) { return { main: (l.program || []).slice(), proc: (l.procInit || []).slice(), done: false }; });
    var target = 'main';
    var wrap = h('div', { class: 'game st', style: '--i:2' });
    var tabsEl = h('div', { class: 'tabs' });
    var body = h('div');
    wrap.append(tabsEl, body);
    function doneCount() { return states.filter(function (x) { return x.done; }).length; }
    function drawTabs() {
      tabsEl.replaceChildren();
      if (levels.length < 2) return;
      levels.forEach(function (l, k) {
        tabsEl.append(h('button', { class: 'tab' + (k === li ? ' on' : '') + (states[k].done ? ' done' : ''), onclick: function () { runId++; running = false; li = k; target = 'main'; build(); } }, l.name || ('Уровень ' + (k + 1))));
      });
    }
    function build() {
      drawTabs();
      var lv = levels[li], st = states[li], botPos = lv.start.slice(), got = {};
      var field = h('div', { class: 'field', style: 'grid-template-columns:repeat(' + lv.w + ',var(--cs))' });
      var stars = {};
      for (var y = 0; y < lv.h; y++) for (var x = 0; x < lv.w; x++) {
        var wall = lv.walls.some(function (w) { return w[0] === x && w[1] === y; });
        var isStar = lv.goals.some(function (g) { return g[0] === x && g[1] === y; });
        var isStart = lv.start[0] === x && lv.start[1] === y;
        var cell = h('div', { class: 'cell' + (wall ? ' wall' : '') + (isStart ? ' start' : '') });
        if (isStar) { var sp = h('span', { class: 'star' }, '★'); stars[x + ',' + y] = sp; cell.append(sp); }
        field.append(cell);
      }
      var bot = h('div', { class: 'bot' }, h('b'));
      field.append(bot);
      function place() { bot.style.transform = 'translate(calc(var(--cs) * ' + botPos[0] + '), calc(var(--cs) * ' + botPos[1] + '))'; }
      place();
      var msg = h('p', { class: 'msg', 'aria-live': 'polite' }, 'Составь программу и нажми «Запуск».');
      var mainBox = h('div', { class: 'progbox' + (target === 'main' ? ' act' : '') });
      var procBox = lv.proc ? h('div', { class: 'progbox' + (target === 'A' ? ' act' : '') }) : null;
      function drawProg() {
        function fill(box, list, key, title) {
          box.replaceChildren();
          var hd = h('h4', null, h('span', null, title), h('span', { style: 'display:flex;gap:6px' },
            lv.proc ? h('button', { onclick: function () { target = key; drawProg(); } }, target === key ? 'редактируется' : 'выбрать') : null,
            h('button', { onclick: function () { if (running) return; list.pop(); drawProg(); } }, '⌫'),
            h('button', { onclick: function () { if (running) return; list.length = 0; drawProg(); } }, 'очистить')));
          var chips = h('div', { class: 'chips' });
          if (!list.length) chips.append(h('span', { class: 'empty' }, key === 'main' ? 'Пока пусто. Нажимай кнопки команд.' : 'Здесь записывается вспомогательный алгоритм A.'));
          list.forEach(function (c, k) {
            var ch = h('button', { class: 'ch' + (c === 'A' ? ' call' : ''), title: 'Убрать команду', onclick: function () { if (running) return; list.splice(k, 1); drawProg(); } }, c === 'A' ? 'вызвать A' : ARR[c] + ' ' + NAME[c]);
            ch.dataset.ref = (key === 'main' ? 'm' : 'A') + k; chips.append(ch);
          });
          box.classList.toggle('act', target === key);
          box.append(hd, chips);
        }
        fill(mainBox, st.main, 'main', lv.proc ? 'Основной алгоритм' : 'Программа');
        if (procBox) fill(procBox, st.proc, 'A', 'Вспомогательный алгоритм A');
        cnt.textContent = 'Команд в программе: ' + (st.main.length + st.proc.length);
      }
      var cnt = h('p', { class: 'legend' });
      function addCmd(c) {
        if (running) return;
        var list = target === 'main' ? st.main : st.proc;
        if (c === 'A' && target !== 'main') { msg.className = 'msg no'; msg.textContent = 'Вспомогательный алгоритм нельзя вызвать из самого себя.'; return; }
        if (list.length >= 40) return;
        list.push(c); drawProg();
      }
      function resetField() {
        runId++; running = false; botPos = lv.start.slice(); got = {}; bot.classList.remove('err'); place();
        Object.keys(stars).forEach(function (k) { stars[k].classList.remove('got'); });
        Array.prototype.forEach.call(document.querySelectorAll('.chips .ch.run'), function (c) { c.classList.remove('run'); });
      }
      function pad() {
        var p = h('div', { class: 'pad' });
        ['U', 'L', 'D', 'R'].forEach(function (c) { p.append(h('button', { class: c.toLowerCase(), 'aria-label': NAME[c], title: NAME[c], onclick: function () { addCmd(c); } }, ARR[c])); });
        return p;
      }
      async function run() {
        resetField(); var my = ++runId; running = true;
        var steps = [];
        st.main.forEach(function (c, mi) { if (c === 'A') st.proc.forEach(function (p, pj) { steps.push({ c: p, ref: 'A' + pj, call: 'm' + mi }); }); else steps.push({ c: c, ref: 'm' + mi }); });
        if (!steps.length) { msg.className = 'msg no'; msg.textContent = 'Программа пуста. Добавь команды.'; running = false; return; }
        msg.className = 'msg'; msg.textContent = 'Выполняется…';
        for (var n = 0; n < steps.length; n++) {
          var stp = steps[n];
          Array.prototype.forEach.call(document.querySelectorAll('.chips .ch.run'), function (c) { c.classList.remove('run'); });
          Array.prototype.forEach.call(document.querySelectorAll('.chips .ch'), function (c) { if (c.dataset.ref === stp.ref || c.dataset.ref === stp.call) c.classList.add('run'); });
          await sleep(lv.speed || 420); if (my !== runId) return;
          var d = DIR[stp.c], nx = botPos[0] + d[0], ny = botPos[1] + d[1];
          var blocked = nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h || lv.walls.some(function (w) { return w[0] === nx && w[1] === ny; });
          if (blocked) {
            bot.classList.add('err'); running = false;
            msg.className = 'msg no'; msg.textContent = 'Отказ: исполнитель не может выполнить команду «' + NAME[stp.c] + '» (шаг ' + (n + 1) + '), на пути препятствие или край поля.'; return;
          }
          botPos = [nx, ny]; place();
          var key = nx + ',' + ny; if (stars[key] && !got[key]) { got[key] = 1; stars[key].classList.add('got'); }
        }
        await sleep(300); if (my !== runId) return;
        running = false;
        Array.prototype.forEach.call(document.querySelectorAll('.chips .ch.run'), function (c) { c.classList.remove('run'); });
        var all = lv.goals.every(function (g) { return got[g[0] + ',' + g[1]]; });
        if (all) {
          var total = st.main.length + st.proc.length;
          msg.className = 'msg ok';
          msg.textContent = 'Цель достигнута! Все звёзды собраны. Команд в программе: ' + total + (lv.best && total <= lv.best ? '. Это один из самых коротких алгоритмов.' : (lv.best ? '. Можно ли записать короче? Лучший результат: ' + lv.best + '.' : '.'));
          if (!st.done) { st.done = true; award(idx, doneCount()); drawTabs(); }
          burstAt(bot);
        } else {
          msg.className = 'msg no'; msg.textContent = 'Программа выполнена, но собраны не все звёзды (' + Object.keys(got).length + ' из ' + lv.goals.length + '). Измени алгоритм.';
        }
      }
      var cmdRow = h('div', { class: 'row', style: 'margin-top:0' }, lv.proc ? h('button', { class: 'cmd call', onclick: function () { addCmd('A'); } }, 'вызвать A') : null);
      var ctrl = h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: run }, '▶ Запуск'),
        h('button', { class: 'btn ghost', onclick: function () { resetField(); msg.className = 'msg'; msg.textContent = 'Исполнитель вернулся в начальное положение.'; } }, '↺ В начало'),
        lv.program || lv.procInit ? h('button', { class: 'btn ghost', onclick: function () { st.main = (lv.program || []).slice(); st.proc = (lv.procInit || []).slice(); resetField(); drawProg(); msg.textContent = ''; } }, 'Исходная программа') : null);
      var task = rt('p', 'lead', lv.task, { style: 'margin-bottom:12px' });
      body.replaceChildren(task, h('div', { class: 'robot-wrap' },
        h('div', null, h('div', { class: 'field-scroll' }, field), h('p', { class: 'legend' }, '★ — цель. Штриховая клетка — старт. Тёмные клетки — препятствия.')),
        h('div', null, pad(), cmdRow, mainBox, procBox, cnt, ctrl, msg)));
      drawProg();
    }
    build();
    return h('section', { class: 'slide' }, head(s), s.lead ? rt('p', 'lead st', s.lead, { style: '--i:1' }) : null, wrap);
  };

  R.end = function (s) {
    var t = totals(), st = load(); st.done = true; st.score = t.g; st.max = t.m; save(st);
    return h('section', { class: 'slide' },
      h('p', { class: 'kicker st' }, 'Итоги занятия'), rt('h2', 'st', s.title || 'Что мы узнали'),
      h('div', { class: 'score st', style: '--i:1' }, h('div', { class: 'big' }, t.g + ' / ' + t.m), h('p', { style: 'margin:0;color:var(--muted);max-width:40ch' }, 'баллов за тесты, игры и кроссворд на этом занятии')),
      h('div', { class: 'end-grid' },
        h('div', { class: 'card st', style: '--i:2' }, h('h3', null, 'Запомни'), h('ul', null, s.recap.map(function (r) { return rt('li', '', r); }))),
        h('div', { class: 'card st', style: '--i:3' }, h('h3', null, 'Домашнее задание'), h('ul', null, s.homework.map(function (r) { return rt('li', '', r); })))),
      h('div', { class: 'row st', style: '--i:4' },
        s.next ? h('a', { class: 'btn', href: s.next.href }, s.next.label + ' →') : null,
        h('a', { class: 'btn ghost', href: 'methodics.html#' + L.id }, 'Видеоуроки по теме'),
        h('a', { class: 'btn ghost', href: 'index.html' }, 'На главную')));
  };

  /* ---------- каркас ---------- */
  var BADGE = { quiz: 'Тест', match: 'Игра', sort: 'Игра', crossword: 'Кроссворд', debug: 'Найди ошибку', robot: 'Исполнитель', ide: 'Исследуй' };
  document.body.dataset.acc = L.acc || 'blue';
  var app = $('#app');
  var stage = h('main', { id: 'stage', tabindex: '-1' });
  var barFill = h('i');
  var crumb = h('div', { class: 'crumb' }, L.crumb);
  var counter = h('span', { class: 'count' });
  var prevB = h('button', { class: 'btn ghost', onclick: prev, 'aria-label': 'Назад' }, '← Назад');
  var nextB = h('button', { class: 'btn', onclick: next, 'aria-label': 'Вперёд' }, 'Дальше →');
  var menu = h('div', { id: 'menu', hidden: true, onclick: function (e) { if (e.target === menu) toggleMenu(false); } });
  function toggleMenu(v) { menu.hidden = v === undefined ? !menu.hidden : !v; if (!menu.hidden) { var c = $('a.cur', menu); if (c) c.scrollIntoView({ block: 'center' }); } }
  function buildMenu() {
    var ol = h('ol');
    slides.forEach(function (s, i) {
      ol.append(h('li', null, h('a', { href: '#s' + (i + 1), class: i === cur ? 'cur' : '', onclick: function (e) { e.preventDefault(); go(i); toggleMenu(false); } },
        h('b', null, i + 1), h('span', null, s.m || plain(s.title)), BADGE[s.type] ? h('em', null, BADGE[s.type]) : null)));
    });
    var panel = h('div', { class: 'panel' }, h('h3', null, L.crumb), ol, h('div', { class: 'sep' }),
      h('ol', null, h('li', null, h('a', { href: 'methodics.html#' + L.id }, h('b', null, '▶'), h('span', null, 'Видеоуроки по теме'))), h('li', null, h('a', { href: 'index.html' }, h('b', null, '⌂'), h('span', null, 'Главная страница курса')))),
      h('div', { style: 'margin-top:14px' }, h('button', { class: 'btn ghost small', onclick: function () { toggleMenu(false); } }, 'Закрыть')));
    menu.replaceChildren(panel);
  }
  function isDark() {
    var t = document.documentElement.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  var themeB = h('button', { class: 'icon-btn', 'aria-label': 'Сменить тему', title: 'Светлая / тёмная тема', onclick: function () { document.documentElement.dataset.theme = isDark() ? 'light' : 'dark'; } }, '◐');
  var menuB = h('button', { class: 'icon-btn', 'aria-label': 'Список слайдов', title: 'Список слайдов', onclick: function () { buildMenu(); toggleMenu(true); } }, '☰');
  app.append(
    h('header', { class: 'top' }, h('a', { class: 'chip', href: 'index.html' }, '⌂ Главная'), crumb, themeB, menuB),
    h('div', { class: 'bar' }, barFill), stage,
    h('footer', { class: 'nav' }, prevB, counter, nextB), menu, fx);

  var lastDir = 'next';
  function go(i, dir) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    var s = slides[i];
    lastDir = dir || (i >= cur ? 'next' : 'prev'); cur = i;
    var el = R[s.type](s, i);
    el.classList.add('enter-' + lastDir);
    stage.replaceChildren(el); stage.scrollTop = 0;
    barFill.style.width = ((i + 1) / slides.length * 100) + '%';
    counter.textContent = (i + 1) + ' / ' + slides.length;
    prevB.disabled = i === 0; nextB.style.visibility = i === slides.length - 1 ? 'hidden' : 'visible';
    try { history.replaceState(null, '', '#s' + (i + 1)); } catch (e) { }
    document.title = L.docTitle + ' · ' + (i + 1) + '/' + slides.length;
  }
  function next() { if (cur < slides.length - 1) go(cur + 1, 'next'); }
  function prev() { if (cur > 0) go(cur - 1, 'prev'); }
  document.addEventListener('keydown', function (e) {
    var tg = e.target && e.target.tagName;
    if (tg === 'INPUT' || tg === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
    if (e.key === 'Escape') toggleMenu(false);
  });
  var tx = null, ty = 0;
  stage.addEventListener('touchstart', function (e) { var t = e.touches[0]; tx = t.clientX; ty = t.clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (tx == null) return; var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty; tx = null;
    var tg = e.target.closest && e.target.closest('.field-scroll,.cw-scroll,input,.code');
    if (tg) return;
    if (Math.abs(dx) > 80 && Math.abs(dy) < 50) { if (dx < 0) next(); else prev(); }
  }, { passive: true });
  window.addEventListener('hashchange', function () { var m = /^#s(\d+)$/.exec(location.hash); if (m && +m[1] - 1 !== cur) go(+m[1] - 1); });
  var start = 0, m0 = /^#s(\d+)$/.exec(location.hash); if (m0) start = +m0[1] - 1;
  buildMenu(); go(start, 'next');
})();
