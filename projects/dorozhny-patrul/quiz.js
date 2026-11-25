/* Движок заданий: используется в одиночной и командной игре */
var DP = window.DP = window.DP || {};
(function () {
  'use strict';
  var el = DP.el;

  var TIPS = {
    mc: 'Выбери один верный ответ.',
    tf: 'Верно или неверно? Нажми на ответ.',
    match: 'Соедини пары: нажми на карточку слева, затем на подходящую справа. Любая ошибка лишает XP за это задание.',
    order: 'Нажимай шаги по порядку, затем «Проверить». Нажми на выбранный шаг ещё раз, чтобы убрать его.'
  };
  var TAGS = { mc: 'Выбор ответа', tf: 'Верно или неверно', match: 'Соедини пары', order: 'Расставь по порядку' };

  DP.quiz = {
    mount: function (q, host, onDone) {
      var t0 = performance.now(), finished = false;
      function end(correct) {
        if (finished) return;
        finished = true;
        onDone({ correct: correct, ms: performance.now() - t0 });
      }
      var card = el('div', { class: 'qcard' });
      card.append(el('div', { class: 'tip' }, el('span', { class: 'tag' }, TAGS[q.type]), el('span', {}, TIPS[q.type])));
      card.append(el('p', { class: 'qtext' }, q.q));
      if (q.art) card.append(el('div', { class: 'plate', html: DP.ART[q.art]() }));

      if (q.type === 'mc' || q.type === 'tf') {
        var list = q.type === 'tf'
          ? [{ o: 'Верно', ok: q.a === true }, { o: 'Неверно', ok: q.a === false }]
          : DP.shuffle(q.opts.map(function (o, i) { return { o: o, ok: i === q.a }; }));
        var box = el('div', { class: 'opts' + (q.type === 'tf' ? ' two' : '') });
        var btns = list.map(function (it) {
          var b = el('button', { class: 'opt', type: 'button' }, it.o);
          b.addEventListener('click', function () {
            btns.forEach(function (x, k) { x.disabled = true; if (list[k].ok) x.classList.add('ok'); });
            if (!it.ok) b.classList.add('bad');
            end(it.ok);
          });
          return b;
        });
        btns.forEach(function (b) { box.append(b); });
        card.append(box);
      } else if (q.type === 'match') {
        var L = DP.shuffle(q.pairs.map(function (p, i) { return { i: i, p: p }; }));
        var R = DP.shuffle(q.pairs.map(function (p, i) { return { i: i, t: p.r }; }));
        var sel = null, mis = 0, left = q.pairs.length;
        var info = el('p', { class: 'hint' }, 'Ошибок: 0');
        var lb = L.map(function (it, k) {
          var b = it.p.art
            ? el('button', { class: 'mbtn art', type: 'button', 'aria-label': 'Знак ' + (k + 1), html: DP.ART[it.p.art]() })
            : el('button', { class: 'mbtn', type: 'button' }, it.p.l);
          b.addEventListener('click', function () {
            if (b.disabled) return;
            sel = (sel === k ? null : k);
            lb.forEach(function (x, j) { x.classList.toggle('sel', j === sel); });
          });
          return b;
        });
        var rb = R.map(function (it) {
          var b = el('button', { class: 'mbtn', type: 'button' }, it.t);
          b.addEventListener('click', function () {
            if (sel === null || b.disabled) return;
            if (L[sel].i === it.i) {
              lb[sel].classList.remove('sel'); lb[sel].classList.add('ok'); b.classList.add('ok');
              lb[sel].disabled = true; b.disabled = true; sel = null; left--;
              if (!left) end(mis === 0);
            } else {
              mis++; info.textContent = 'Ошибок: ' + mis;
              b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500);
            }
          });
          return b;
        });
        var c1 = el('div', { class: 'mcol' }), c2 = el('div', { class: 'mcol' });
        lb.forEach(function (b) { c1.append(b); }); rb.forEach(function (b) { c2.append(b); });
        card.append(info, el('div', { class: 'mgrid' }, c1, c2));
      } else if (q.type === 'order') {
        var items = DP.shuffle(q.steps.map(function (t, i) { return { i: i, t: t }; }));
        var picks = [];
        var check = el('button', { class: 'btn primary', type: 'button', disabled: 'disabled' }, 'Проверить');
        var reset = el('button', { class: 'btn ghost', type: 'button' }, 'Сбросить');
        var obtns = items.map(function (it, k) {
          var num = el('span', { class: 'num' }, '');
          var b = el('button', { class: 'opt', type: 'button' }, num, el('span', {}, it.t));
          b._num = num;
          b.addEventListener('click', function () {
            var at = picks.indexOf(k);
            if (at > -1) picks.splice(at, 1); else picks.push(k);
            refresh();
          });
          return b;
        });
        var refresh = function () {
          obtns.forEach(function (b, k) { var at = picks.indexOf(k); b._num.textContent = at > -1 ? String(at + 1) : ''; b.classList.toggle('picked', at > -1); });
          if (picks.length === items.length) check.removeAttribute('disabled'); else check.setAttribute('disabled', 'disabled');
        };
        reset.addEventListener('click', function () { picks.length = 0; refresh(); });
        check.addEventListener('click', function () {
          var ok = picks.every(function (k, pos) { return items[k].i === pos; });
          obtns.forEach(function (b, k) { b.disabled = true; b.classList.add(items[k].i === picks.indexOf(k) ? 'ok' : 'bad'); });
          check.disabled = true; reset.disabled = true;
          end(ok);
        });
        var box2 = el('div', { class: 'opts' });
        obtns.forEach(function (b) { box2.append(b); });
        card.append(box2, el('div', { class: 'row' }, check, reset));
      }
      host.replaceChildren(card);
      /* stop() нужен для таймера: закрывает задание как неверное */
      return {
        stop: function () {
          if (finished) return;
          DP.$$('button', card).forEach(function (b) { b.disabled = true; });
          end(false);
        }
      };
    },

    feedback: function (q, res, lines, label, onNext) {
      var fb = el('div', { class: 'fb ' + (res.correct ? 'ok' : 'bad'), role: 'status' });
      fb.append(el('strong', { class: 'fb-t' }, res.correct ? 'Верно!' : 'Не совсем.'));
      if (!res.correct && q.type === 'order') {
        fb.append(el('p', {}, 'Правильный порядок:'), el('ol', {}, q.steps.map(function (s) { return el('li', {}, s); })));
      }
      fb.append(el('p', {}, q.why));
      if (lines && lines.length) fb.append(el('p', { class: 'fb-x' }, lines.join(' · ')));
      var nb = el('button', { class: 'btn primary', type: 'button', onclick: onNext }, label);
      fb.append(nb);
      setTimeout(function () { try { nb.focus(); } catch (e) {} }, 0);
      return fb;
    }
  };
})();
