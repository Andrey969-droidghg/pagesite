/* Генератор сетки кроссворда: ставит слова так, чтобы они пересекались */
(function (root) {
  function layout(words) {
    var ws = words.slice().sort(function (a, b) { return b.w.length - a.w.length; });
    var cells = {}; // "x,y" -> {ch, dirs}
    var placed = [];
    function key(x, y) { return x + ',' + y; }
    function get(x, y) { return cells[key(x, y)]; }
    function test(w, x, y, dir) {
      var dx = dir === 0 ? 1 : 0, dy = dir === 0 ? 0 : 1;
      if (get(x - dx, y - dy) || get(x + dx * w.length, y + dy * w.length)) return -1;
      var cross = 0;
      for (var i = 0; i < w.length; i++) {
        var cx = x + dx * i, cy = y + dy * i, c = get(cx, cy);
        if (c) {
          if (c.ch !== w[i]) return -1;
          if (c.dirs.indexOf(dir) >= 0) return -1;
          cross++;
        } else {
          if (get(cx + dy, cy + dx) || get(cx - dy, cy - dx)) return -1;
        }
      }
      return cross;
    }
    function put(item, x, y, dir) {
      var dx = dir === 0 ? 1 : 0, dy = dir === 0 ? 0 : 1, w = item.w;
      for (var i = 0; i < w.length; i++) {
        var k = key(x + dx * i, y + dy * i);
        if (!cells[k]) cells[k] = { ch: w[i], dirs: [] };
        cells[k].dirs.push(dir);
      }
      placed.push({ w: w, clue: item.clue, x: x, y: y, dir: dir });
    }
    function bounds() {
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      Object.keys(cells).forEach(function (k) {
        var p = k.split(','), x = +p[0], y = +p[1];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      });
      return { x0: x0, y0: y0, x1: x1, y1: y1 };
    }
    var skipped = [];
    ws.forEach(function (item, idx) {
      if (idx === 0) { put(item, 0, 0, 0); return; }
      var best = null, bestScore = -1e9, R = 16;
      for (var dir = 0; dir < 2; dir++) {
        for (var x = -R; x <= R; x++) {
          for (var y = -R; y <= R; y++) {
            var cr = test(item.w, x, y, dir);
            if (cr < 1) continue;
            // оценка: больше пересечений, компактнее
            var b = bounds();
            var dx = dir === 0 ? item.w.length : 1, dy = dir === 0 ? 1 : item.w.length;
            var nx0 = Math.min(b.x0, x), ny0 = Math.min(b.y0, y);
            var nx1 = Math.max(b.x1, x + dx - 1), ny1 = Math.max(b.y1, y + dy - 1);
            var w = nx1 - nx0 + 1, h = ny1 - ny0 + 1;
            var score = cr * 10 - (w * h) / 4 - Math.abs(w - h) * 1.5;
            if (score > bestScore) { bestScore = score; best = { x: x, y: y, dir: dir }; }
          }
        }
      }
      if (best) put(item, best.x, best.y, best.dir); else skipped.push(item.w);
    });
    var b = bounds();
    placed.forEach(function (p) { p.x -= b.x0; p.y -= b.y0; });
    var W = b.x1 - b.x0 + 1, H = b.y1 - b.y0 + 1;
    // нумерация по строкам
    var starts = {};
    placed.forEach(function (p) { starts[p.x + ',' + p.y] = 1; });
    var order = Object.keys(starts).map(function (k) { var a = k.split(','); return { x: +a[0], y: +a[1], k: k }; });
    order.sort(function (a, b2) { return a.y - b2.y || a.x - b2.x; });
    var num = {};
    order.forEach(function (o, i) { num[o.k] = i + 1; });
    placed.forEach(function (p) { p.n = num[p.x + ',' + p.y]; });
    var grid = [];
    for (var y = 0; y < H; y++) { grid.push([]); for (var x = 0; x < W; x++) grid[y].push(null); }
    placed.forEach(function (p) {
      for (var i = 0; i < p.w.length; i++) {
        var gx = p.x + (p.dir === 0 ? i : 0), gy = p.y + (p.dir === 0 ? 0 : i);
        grid[gy][gx] = p.w[i];
      }
    });
    return { W: W, H: H, grid: grid, words: placed, num: num, skipped: skipped };
  }
  var api = { layout: layout };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CW = api;
})(typeof window !== 'undefined' ? window : this);
