/* Применяет сохранённую тему до отрисовки страницы, чтобы не было вспышки */
(function () {
  try {
    var t = localStorage.getItem('dp-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
