/* Одиночная игра: карта станций, ход станции, итоги */
(function () {
  'use strict';
  var $ = DP.$, el = DP.el, STATIONS = DP.STATIONS;
  var streak = 0, run = null;
  var TOPIC_NAMES = { t1: 'Пешеход', t2: 'Светофор и знаки', t3: 'Фликеры', t4: 'Велосипед и СПМ', t5: 'Пассажир и помощь' };

  function hearts(n) { var a = []; for (var i = 0; i < 3; i++) a.push(el('span', { class: 'h' + (i < n ? '' : ' off'), 'aria-hidden': 'true' }, '♥')); return a; }
  function starsEl(n) { var a = []; for (var i = 0; i < 3; i++) a.push(el('span', { class: i < n ? 'on' : 'off', 'aria-hidden': 'true' }, '★')); return el('span', { class: 'stars', 'aria-label': 'Звёзд: ' + n + ' из 3' }, a); }

  function applyResult(q, res) {
    var S = DP.S, gain = 0, notes = [];
    if (res.correct) {
      streak++;
      if (streak > S.bestStreak) S.bestStreak = streak;
      if (!S.solved[q.id]) {
        S.solved[q.id] = 1; gain = 10;
        if (res.ms < q.fast) { gain += 5; S.fast = (S.fast || 0) + 1; notes.push('быстрый ответ +5'); }
        if (streak >= 3) { gain += 5; notes.push('серия ×' + streak + ' +5'); }
      } else notes.push('XP за это задание уже получены');
    } else streak = 0;
    S.xp += gain; DP.save();
    return { gain: gain, notes: notes };
  }

  function startStation(st) { run = { st: st, i: 0, lives: 3, ok: 0, gain: 0, wrong: 0 }; renderQ(); }
  function leaveRun() { run = null; renderMap(); }

  function renderQ() {
    var st = run.st, q = st.items[run.i], stage = $('#stage');
    $('#intro').hidden = true;
    var livesEl = el('div', { class: 'lives', 'aria-label': 'Жизни: ' + run.lives }, hearts(run.lives));
    var head = el('div', { class: 'qhead' },
      el('div', { class: 'qmeta' }, el('button', { class: 'back', type: 'button', onclick: leaveRun }, '← К карте'), el('span', { class: 'qtitle' }, st.title)),
      livesEl);
    var seg = el('div', { class: 'seg', 'aria-label': 'Вопрос ' + (run.i + 1) + ' из ' + st.items.length }, st.items.map(function (_, k) { return el('i', { class: k < run.i ? 'done' : (k === run.i ? 'cur' : '') }); }));
    var streakEl = el('div', { class: 'streak' }, streak >= 2 ? 'Серия ×' + streak : '');
    var host = el('div');
    stage.replaceChildren(head, seg, streakEl, host);
    window.scrollTo(0, 0);
    DP.quiz.mount(q, host, function (res) {
      var before = DP.rankOf(DP.S.xp);
      var r = applyResult(q, res);
      if (res.correct) run.ok++; else { run.lives--; run.wrong++; }
      run.gain += r.gain;
      if (DP.rankOf(DP.S.xp) > before) DP.toast('Новое звание: ' + DP.RANKS[DP.rankOf(DP.S.xp)].n);
      DP.checkBadges(); DP.updateHud();
      livesEl.replaceChildren.apply(livesEl, hearts(run.lives));
      livesEl.setAttribute('aria-label', 'Жизни: ' + run.lives);
      streakEl.textContent = streak >= 2 ? 'Серия ×' + streak : '';
      var last = run.i === st.items.length - 1, dead = run.lives <= 0;
      var lines = [];
      if (res.correct && r.gain) lines.push('+' + r.gain + ' XP');
      r.notes.forEach(function (n) { lines.push(n); });
      if (!res.correct) lines.push('минус одна жизнь');
      host.append(DP.quiz.feedback(q, res, lines, (last || dead) ? 'Подвести итоги' : 'Дальше', function () {
        if (last || dead) finishRun(); else { run.i++; renderQ(); }
      }));
    });
  }

  function reviewBox(st) {
    if (!run.wrong) return null;
    return el('div', { class: 'review' },
      el('b', {}, 'Что повторить'),
      el('span', {}, 'Ошибок на станции: ' + run.wrong + '.'),
      el('a', { href: 'learn.html#' + st.topic }, 'Тема «' + TOPIC_NAMES[st.topic] + '» на странице правил →'));
  }

  function finishRun() {
    var S = DP.S, st = run.st, stage = $('#stage'), idx = STATIONS.indexOf(st), dead = run.lives <= 0;
    window.scrollTo(0, 0);
    if (dead) {
      var rv = reviewBox(st);
      var box = el('div', { class: 'result' },
        el('h2', {}, 'Эвакуатор уже едет'),
        el('p', { class: 'lead' }, 'Жизни закончились на задании ' + (run.i + 1) + ' из ' + st.items.length + '. Верные ответы и XP сохранены. Попробуй пройти станцию ещё раз.'));
      if (rv) box.append(rv);
      box.append(el('div', { class: 'row' },
        el('button', { class: 'btn primary', type: 'button', onclick: function () { startStation(st); } }, 'Попробовать снова'),
        el('button', { class: 'btn ghost', type: 'button', onclick: leaveRun }, 'К карте')));
      stage.replaceChildren(box);
      return;
    }
    var stars = run.lives;
    S.done[st.id] = true; S.stars[st.id] = Math.max(S.stars[st.id] || 0, stars); DP.save();
    DP.checkBadges(); DP.updateHud(); DP.burst();
    var next = STATIONS[idx + 1];
    var allDone = STATIONS.every(function (s) { return S.done[s.id]; });
    var btns = el('div', { class: 'row' });
    if (next) btns.append(el('button', { class: 'btn primary', type: 'button', onclick: function () { startStation(next); } }, 'Станция ' + (idx + 2) + ': ' + next.title));
    else btns.append(el('a', { class: 'btn primary', href: 'awards.html' }, 'К наградам'));
    btns.append(el('button', { class: 'btn ghost', type: 'button', onclick: leaveRun }, 'К карте'));
    btns.append(el('button', { class: 'btn ghost', type: 'button', onclick: function () { startStation(st); } }, 'Пройти ещё раз'));
    var res = el('div', { class: 'result' },
      el('h2', {}, 'Станция пройдена'),
      el('div', { class: 'bigstars' }, starsEl(stars)),
      el('div', { class: 'stats' },
        el('div', { class: 'stat' }, el('b', {}, run.ok + ' из ' + st.items.length), el('span', {}, 'верных ответов')),
        el('div', { class: 'stat' }, el('b', {}, '+' + run.gain), el('span', {}, 'XP за этот заход')),
        el('div', { class: 'stat' }, el('b', {}, S.xp), el('span', {}, 'XP всего'))));
    var rv2 = reviewBox(st);
    if (rv2) res.append(rv2);
    res.append(btns);
    if (allDone) res.append(el('div', { class: 'callout mem', style: 'max-width:520px' }, el('b', {}, 'Весь маршрут пройден'), el('span', {}, 'Удостоверение юного инспектора ждёт на странице «Награды».')));
    stage.replaceChildren(res);
  }

  function renderMap() {
    run = null; $('#intro').hidden = false;
    var S = DP.S;
    var ol = el('ol', { class: 'route' });
    STATIONS.forEach(function (st, k) {
      var unlocked = S.unlockAll || k === 0 || S.done[STATIONS[k - 1].id];
      var done = !!S.done[st.id];
      var li = el('li', { class: 'st' + (done ? ' done' : '') + (unlocked ? '' : ' locked') });
      li.append(el('span', { class: 'node', 'aria-hidden': 'true' }, done ? '✓' : String(k + 1)));
      var meta = el('p', { class: 'meta' }, st.items.length + ' заданий');
      if (done) meta.append(starsEl(S.stars[st.id] || 0));
      var body = el('div', { class: 'stbody' }, el('h3', {}, st.title), el('p', { class: 'sub' }, st.sub), el('p', { class: 'sub' }, st.intro), meta);
      var btn = el('button', { class: 'btn ' + (done ? 'ghost' : 'primary'), type: 'button' }, unlocked ? (done ? 'Пройти ещё раз' : 'Выйти на маршрут') : 'Сначала станция ' + k);
      if (unlocked) btn.addEventListener('click', function () { startStation(st); }); else btn.disabled = true;
      var acts = el('div', { class: 'acts' }, btn, el('a', { class: 'btn ghost', href: 'learn.html#' + st.topic }, 'Правила'));
      li.append(el('div', { class: 'stcard' }, body, acts));
      ol.append(li);
    });
    $('#stage').replaceChildren(ol);
  }

  DP.chrome('game.html');
  var nameInp = $('#player-name');
  nameInp.value = DP.S.name || '';
  nameInp.addEventListener('input', function () { DP.S.name = nameInp.value.trim(); DP.save(); });
  renderMap();

  /* game.html#s3 открывает нужную станцию сразу (ссылки со страницы правил) */
  var m = /^#(s[1-5])$/.exec(location.hash || '');
  if (m) {
    var st = STATIONS.filter(function (s) { return s.id === m[1]; })[0];
    if (st) startStation(st);
  }
})();
