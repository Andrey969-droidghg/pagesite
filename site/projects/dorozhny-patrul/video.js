/* Видео: карточки по темам, вопросы после просмотра, свои файлы и ссылки */
(function () {
  'use strict';
  var $ = DP.$, el = DP.el;
  var LKEY = 'dp-video-links';

  var TOPICS = [
    { id: 't1', scene: 'crossing', title: 'Тема 1. Пешеход', q: [
      'Какие опасные ситуации на переходе вы заметили в ролике?',
      'Что сделал бы ты на месте героя перед тем, как выйти на дорогу?',
      'Почему нельзя выбегать из-за стоящего транспорта?'],
      s: [['ПДД для школьников: как правильно переходить дорогу Беларусь', 'Переход дороги'], ['безопасный путь в школу для детей ПДД Беларусь', 'Путь в школу']] },
    { id: 't2', scene: 'traffic', title: 'Тема 2. Светофор и знаки', q: [
      'Какие сигналы светофора встретились в ролике и что они значат?',
      'Какой знак был главным в ситуации и почему?',
      'Как вести себя, если сигнал мигает?'],
      s: [['пешеходный светофор правила для детей', 'Светофор'], ['дорожные знаки для школьников обучающее видео', 'Дорожные знаки']] },
    { id: 't3', real: [{ t: 'Смотреть на сайте БЕЛТА', u: 'https://www.belta.by/video/getRecord/3489/' }, { t: 'Тот же ролик на YouTube', u: 'https://www.youtube.com/watch?v=vd1rTNeLhCk' }], realTitle: '«Каждый знает пешеход — фликер точно жизнь спасет!» (БЕЛТА, 2018). Сотрудники ГАИ Советского района Минска учат школьников пользоваться фликерами на уроке в гимназии № 8.', scene: 'night', title: 'Тема 3. Фликеры', q: [
      'Почему пешеход без фликера не виден водителю?',
      'Где бы ты закрепил фликер на своей одежде?',
      'Как убедить друга носить фликер каждый вечер?'],
      s: [['фликеры для школьников ГАИ Беларусь', 'Фликеры'], ['Время стать заметным ГАИ Беларусь', 'Акция «Время стать заметным!»']] },
    { id: 't4', scene: 'bike', title: 'Тема 4. Велосипед и СПМ', q: [
      'Что нарушил герой ролика и чем это опасно?',
      'С какого возраста можно ехать по проезжей части и как переходить дорогу?',
      'Что нужно проверить перед поездкой на велосипеде или самокате?'],
      s: [['правила для велосипедистов Беларусь школьники', 'Велосипед'], ['электросамокат правила для детей Беларусь ПДД', 'Электросамокат']] },
    { id: 't5', scene: 'help', title: 'Тема 5. Пассажир и помощь', q: [
      'Что сказал диспетчеру человек в ролике и что бы ты добавил?',
      'Почему важно сначала убедиться в своей безопасности?',
      'Как правильно выйти из автомобиля у края дороги?'],
      s: [['как вызвать скорую по номеру 112 детям', 'Вызов помощи'], ['ремень безопасности пассажир ПДД для детей', 'Ремни безопасности']] }
  ];

  function links() { try { return JSON.parse(localStorage.getItem(LKEY) || '{}'); } catch (e) { return {}; } }
  function saveLinks(o) { try { localStorage.setItem(LKEY, JSON.stringify(o)); } catch (e) {} }
  function okUrl(u) { try { var x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:'; } catch (e) { return false; } }

  function card(t) {
    var show = el('div', { class: 'vshow', 'aria-label': 'Место для видео' });
    show.innerHTML = DP.ART.scene(t.scene);
    var note = el('p', { class: 'vnote' }, 'Файл videos/' + t.id + '.mp4 не найден. Положите его в папку videos рядом с этой страницей.');
    var real = t.real ? el('div', {}, el('b', {}, 'Настоящее видео из Беларуси'), el('p', { class: 'vnote' }, t.realTitle), el('div', { class: 'vlinks', style: 'margin-top:8px' }, t.real.map(function (r) { return el('a', { class: 'btn primary', target: '_blank', rel: 'noopener', href: r.u }, r.t); }))) : null;
    var v = document.createElement('video');
    v.controls = true; v.preload = 'metadata'; v.setAttribute('playsinline', '');
    v.addEventListener('loadedmetadata', function () { show.replaceChildren(v); note.textContent = 'Анимированный ролик с субтитрами, без озвучки: комментируйте его сами. Свой ролик можно положить в videos/' + t.id + '.mp4 под тем же именем.'; });
    v.src = 'videos/' + t.id + '.mp4';

    var saved = links()[t.id] || '';
    var open = el('a', { class: 'btn primary', target: '_blank', rel: 'noopener' }, 'Открыть сохранённый ролик');
    open.hidden = !okUrl(saved); if (!open.hidden) open.href = saved;
    var inp = el('input', { id: 'vurl-' + t.id, type: 'text', placeholder: 'Вставьте ссылку на ролик', value: saved, autocomplete: 'off' });
    var msg = el('p', { class: 'vnote', role: 'status' }, '');
    var save = el('button', { class: 'btn ghost', type: 'button', onclick: function () {
      var u = inp.value.trim(), all = links();
      if (!u) { delete all[t.id]; saveLinks(all); open.hidden = true; msg.textContent = 'Ссылка удалена.'; return; }
      if (!okUrl(u)) { msg.textContent = 'Нужна ссылка, которая начинается с http:// или https://'; return; }
      all[t.id] = u; saveLinks(all); open.href = u; open.hidden = false; msg.textContent = 'Ссылка сохранена в этом браузере.';
    } }, 'Сохранить ссылку');

    var searches = el('div', { class: 'vlinks' }, t.s.map(function (s) {
      return el('a', { class: 'btn ghost', target: '_blank', rel: 'noopener', href: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(s[0]) }, 'Найти: ' + s[1]);
    }));

    return el('article', { class: 'vcard', id: t.id },
      show,
      el('div', { class: 'vbody' },
        el('h3', {}, t.title),
        real,
        el('div', {}, el('b', {}, 'После просмотра обсудите'), el('ol', {}, t.q.map(function (x) { return el('li', {}, x); }))),
        searches,
        el('div', {}, el('label', { class: 'sr', for: 'vurl-' + t.id }, 'Ссылка на ролик'), inp),
        el('div', { class: 'row' }, save, open),
        msg, note,
        el('a', { href: 'learn.html#' + t.id }, 'Прочитать тему →')));
  }

  DP.chrome('video.html');
  $('#vgrid').replaceChildren.apply($('#vgrid'), TOPICS.map(card));
})();
