/* Награды: удостоверение, значки, статистика, сброс прогресса */
(function () {
  'use strict';
  var $ = DP.$, el = DP.el, STATIONS = DP.STATIONS;

  function certEl() {
    var S = DP.S;
    var total = STATIONS.reduce(function (a, s) { return a + (S.stars[s.id] || 0); }, 0);
    var date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    return el('div', { class: 'cert' },
      el('span', { class: 'k' }, 'Игровое удостоверение'),
      el('h3', {}, 'Юный инспектор'),
      el('div', { class: 'nm' }, S.name || 'Патрульный 7 класса'),
      el('p', {}, 'Прошёл все пять станций «Дорожного патруля».'),
      el('dl', {},
        el('div', {}, el('dt', {}, 'Звание'), el('dd', {}, DP.RANKS[DP.rankOf(S.xp)].n)),
        el('div', {}, el('dt', {}, 'Опыт'), el('dd', {}, S.xp + ' XP')),
        el('div', {}, el('dt', {}, 'Звёзды'), el('dd', {}, total + ' из ' + (STATIONS.length * 3))),
        el('div', {}, el('dt', {}, 'Дата'), el('dd', {}, date))),
      el('small', {}, 'Учебная игра. Не является официальным документом.'));
  }

  function render() {
    var S = DP.S;
    var doneCount = STATIONS.filter(function (s) { return S.done[s.id]; }).length;
    var all = doneCount === STATIONS.length;
    $('#cert-host').replaceChildren(all ? certEl() : el('div', { class: 'box' },
      el('p', {}, 'Пройдено станций: ' + doneCount + ' из ' + STATIONS.length + '. Остальные ждут в игре.'),
      el('div', { class: 'row', style: 'margin-top:12px' }, el('a', { class: 'btn primary', href: 'game.html' }, 'К станциям'))));
    $('#badge-grid').replaceChildren.apply($('#badge-grid'), DP.BADGES.map(function (b) {
      var got = !!S.badges[b.id];
      return el('div', { class: 'badge' + (got ? ' got' : '') },
        el('div', { class: 'm', 'aria-hidden': 'true' }, b.m),
        el('div', {}, el('b', {}, b.t), el('span', {}, got ? b.d : 'Закрыто. ' + b.d)));
    }));
    var gotN = Object.keys(S.badges).length;
    $('#stats').replaceChildren(
      el('div', { class: 'stat' }, el('b', {}, S.xp), el('span', {}, 'XP всего')),
      el('div', { class: 'stat' }, el('b', {}, gotN + ' из ' + DP.BADGES.length), el('span', {}, 'значков')),
      el('div', { class: 'stat' }, el('b', {}, S.bestStreak), el('span', {}, 'лучшая серия')),
      el('div', { class: 'stat' }, el('b', {}, DP.RANKS[DP.rankOf(S.xp)].n), el('span', {}, 'звание')));
  }

  DP.chrome('awards.html');
  render();

  var btn = $('#reset'), armed = false, tmr = null;
  btn.addEventListener('click', function () {
    if (!armed) {
      armed = true; btn.textContent = 'Нажми ещё раз, чтобы стереть весь прогресс';
      tmr = setTimeout(function () { armed = false; btn.textContent = 'Начать заново'; }, 4000);
    } else {
      clearTimeout(tmr); armed = false; btn.textContent = 'Начать заново';
      DP.reset(); DP.updateHud(); render(); DP.toast('Прогресс стёрт');
    }
  });
})();
