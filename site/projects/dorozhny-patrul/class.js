/* Командная игра: настройка, ход по очереди, таймер, итоговая таблица */
(function () {
  'use strict';
  var $ = DP.$, el = DP.el, STATIONS = DP.STATIONS;
  var T = null, timerId = null;
  var cfg = { count: 3, rounds: 12, topic: 'all', secs: 0, names: ['Светофоры', 'Зебры', 'Фликеры', 'Знаки'] };

  function pool() {
    if (cfg.topic === 'all') return DP.ALL;
    var st = STATIONS.filter(function (s) { return s.id === cfg.topic; })[0];
    return st ? st.items : DP.ALL;
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function chipGroup(label, values, current, onPick, fmt) {
    var g = el('div', { class: 'chips', role: 'group', 'aria-label': label });
    values.forEach(function (v) {
      g.append(el('button', { type: 'button', class: 'chip' + (v === current ? ' on' : ''), 'aria-pressed': String(v === current), onclick: function () { onPick(v); } }, fmt ? fmt(v) : String(v)));
    });
    return g;
  }

  function renderSetup() {
    stopTimer(); T = null;
    $('#intro').hidden = false;
    var host = $('#class-host');
    var maxQ = pool().length;
    if (cfg.rounds > maxQ) cfg.rounds = maxQ;
    var rounds = [6, 12, 18].filter(function (n) { return n <= maxQ; });
    if (rounds.indexOf(cfg.rounds) < 0) rounds.push(cfg.rounds);
    rounds.sort(function (a, b) { return a - b; });

    var topics = ['all'].concat(STATIONS.map(function (s) { return s.id; }));
    var inputs = el('div', { class: 'form' });
    for (var i = 0; i < cfg.count; i++) {
      (function (i) {
        var inp = el('input', { id: 'team-' + i, type: 'text', maxlength: '22', value: cfg.names[i], autocomplete: 'off' });
        inp.addEventListener('input', function () { cfg.names[i] = inp.value; });
        inputs.append(el('div', {}, el('label', { for: 'team-' + i }, 'Команда ' + (i + 1)), inp));
      })(i);
    }
    host.replaceChildren(el('div', { class: 'form' },
      el('div', {}, el('label', {}, 'Сколько команд'), chipGroup('Количество команд', [2, 3, 4], cfg.count, function (v) { cfg.count = v; renderSetup(); })),
      inputs,
      el('div', {}, el('label', {}, 'Тема вопросов'), chipGroup('Тема', topics, cfg.topic, function (v) { cfg.topic = v; renderSetup(); },
        function (v) { return v === 'all' ? 'Все темы' : STATIONS.filter(function (s) { return s.id === v; })[0].title; })),
      el('div', {}, el('label', {}, 'Сколько вопросов (доступно ' + maxQ + ')'), chipGroup('Количество вопросов', rounds, cfg.rounds, function (v) { cfg.rounds = v; renderSetup(); })),
      el('div', {}, el('label', {}, 'Время на ответ'), chipGroup('Таймер', [0, 20, 40, 60], cfg.secs, function (v) { cfg.secs = v; renderSetup(); }, function (v) { return v ? v + ' с' : 'Без таймера'; })),
      el('button', { class: 'btn primary lg', type: 'button', onclick: start }, 'Начать игру')));
  }

  function start() {
    var teams = [];
    for (var j = 0; j < cfg.count; j++) teams.push((cfg.names[j] || '').trim() || ('Команда ' + (j + 1)));
    T = { teams: teams.map(function (n) { return { n: n, s: 0 }; }), q: DP.shuffle(pool()).slice(0, cfg.rounds), i: 0 };
    $('#intro').hidden = true;
    renderQ();
  }

  function board() {
    var tm = T.i % T.teams.length;
    return el('div', { class: 'board' }, T.teams.map(function (t, k) {
      return el('div', { class: 'team' + (k === tm && T.i < T.q.length ? ' turn' : '') }, el('span', {}, t.n), el('b', {}, t.s));
    }));
  }

  function renderQ() {
    stopTimer();
    var host = $('#class-host'), q = T.q[T.i], tm = T.i % T.teams.length;
    var bd = board();
    var timerEl = el('span', { class: 'tag', style: 'margin-left:8px' }, cfg.secs ? cfg.secs + ' с' : '');
    var turn = el('p', { class: 'turnline' }, 'Вопрос ' + (T.i + 1) + ' из ' + T.q.length + '. Отвечает: ' + T.teams[tm].n, cfg.secs ? timerEl : null);
    var qh = el('div'), timedOut = false;
    host.replaceChildren(bd, turn, el('div', { class: 'big' }, qh));
    window.scrollTo(0, 0);
    var ctl = DP.quiz.mount(q, qh, function (res) {
      stopTimer();
      if (res.correct) T.teams[tm].s += 10;
      var nb = board(); bd.replaceWith(nb); bd = nb;
      var last = T.i === T.q.length - 1;
      var lines = res.correct ? ['+10 очков команде'] : (timedOut ? ['время вышло'] : []);
      qh.append(DP.quiz.feedback(q, res, lines, last ? 'Итоги' : 'Дальше', function () {
        if (last) renderEnd(); else { T.i++; renderQ(); }
      }));
    });
    if (cfg.secs) {
      var left = cfg.secs;
      timerId = setInterval(function () {
        left--;
        timerEl.textContent = left + ' с';
        if (left <= 0) { stopTimer(); timedOut = true; ctl.stop(); }
      }, 1000);
    }
  }

  function renderEnd() {
    stopTimer();
    var host = $('#class-host');
    var sorted = T.teams.slice().sort(function (a, b) { return b.s - a.s; });
    DP.S.team = true; DP.save(); DP.checkBadges(); DP.burst();
    var top = sorted[0].s;
    var winners = sorted.filter(function (t) { return t.s === top; }).map(function (t) { return t.n; });
    host.replaceChildren(el('div', { class: 'result' },
      el('h2', {}, winners.length > 1 ? 'Ничья' : 'Победила команда'),
      el('p', { class: 'lead' }, winners.join(' и ') + ': ' + top + ' очков.'),
      el('div', { class: 'podium' }, sorted.map(function (t) { return el('div', {}, el('span', {}, t.n), el('span', {}, t.s + ' очков')); })),
      el('div', { class: 'row' },
        el('button', { class: 'btn primary', type: 'button', onclick: renderSetup }, 'Сыграть ещё'),
        el('a', { class: 'btn ghost', href: 'learn.html' }, 'Повторить правила'),
        el('a', { class: 'btn ghost', href: 'teacher.html' }, 'К сценарию'))));
  }

  DP.chrome('class.html');
  renderSetup();
})();
