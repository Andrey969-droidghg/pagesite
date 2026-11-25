/* Учителю: переключатель «открыть все станции» */
(function () {
  'use strict';
  var btn = DP.$('#unlock-all');
  function label() { btn.textContent = DP.S.unlockAll ? 'Закрыть станции по порядку' : 'Открыть все станции'; }
  DP.chrome('teacher.html');
  label();
  btn.addEventListener('click', function () {
    DP.S.unlockAll = !DP.S.unlockAll; DP.save(); label();
    DP.toast(DP.S.unlockAll ? 'Все станции открыты' : 'Станции открываются по порядку');
  });
})();
