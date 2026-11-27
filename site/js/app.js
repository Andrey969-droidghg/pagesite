/* Сайт учителя информатики — одностраничное приложение без зависимостей */
(() => {
  "use strict";
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Иконки ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M8 7h8M8 11h6"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="M7 4.5v15l13-7.5Z" fill="currentColor"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M11 18h2"/>',
    phoneD: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    file: '<path d="M6 3h8l5 5v13H6Z"/><path d="M14 3v5h5"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    road: '<path d="M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v3"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3Z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14 -1.5 7 5-3 5 3-1.5-7"/>',
    gamepad: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4M16 11h.01M18 14h.01"/>',
    flow: '<rect x="3" y="3" width="7" height="6" rx="2"/><rect x="14" y="15" width="7" height="6" rx="2"/><path d="M6.5 9v4a2 2 0 0 0 2 2H14"/>',
    presentation: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>'
  };
  const ic = (n, s = 22, sw = 1.9) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  const COL = {
    lav: ["--lav", "--lav-soft"], mint: ["--mint", "--mint-soft"], peach: ["--peach", "--peach-soft"],
    sky: ["--sky", "--sky-soft"], rose: ["--rose", "--rose-soft"], butter: ["--butter", "--butter-soft"]
  };
  const col = k => `style="--c:var(${COL[k][0]});--c-soft:var(${COL[k][1]})"`;

  /* ---------- Данные ---------- */
  const PROJECTS = {
    algo: {
      id: "algo", cls: 6, color: "mint", icon: "flow",
      title: "Алгоритмы и исполнители",
      short: "Интерактивный курс по алгоритмам: от понятия алгоритма до вспомогательных алгоритмов, с исполнителем, тренажёрами и итоговым повторением.",
      long: "Интерактивные занятия 25–32 по теме «Алгоритмы и исполнители»: наглядные схемы, компьютерный исполнитель, готовые программы, вспомогательные алгоритмы, проверочные задания и учебно-методический блок для учителя. Всё работает прямо в браузере, без установки.",
      base: "projects/algoritmy-i-ispolniteli/", entry: "index.html",
      tags: ["6 класс", "Алгоритмы", "Исполнители", "Интерактив"],
      facts: [["7", "занятий и итог"], ["7", "презентаций PowerPoint"], ["0", "установок"], ["📱", "работает на телефоне"]],
      pages: [
        ["Главная", "index.html"], ["Занятие 25 · Понятие алгоритма", "l25.html"], ["Занятия 26–27 · Способы записи", "l26.html"],
        ["Занятие 28 · Компьютерный исполнитель", "l28.html"], ["Занятия 29–30 · Готовые программы", "l29.html"],
        ["Занятия 31–32 · Вспомогательные", "l31.html"], ["Итоговое повторение", "final.html"], ["Методический блок", "methodics.html"]
      ],
      features: [
        ["flow", "Наглядные схемы", "Алгоритм превращается в блок-схему, которую можно запускать и смотреть шаг за шагом."],
        ["cpu", "Компьютерный исполнитель", "Ученик пишет команды и сразу видит, как исполнитель выполняет их на поле."],
        ["check", "Проверка знаний", "Задания с мгновенной проверкой и итоговое повторение главы."]
      ],
      downloads: [["Презентация: главная", "powerpoint/index.pptx"], ["Занятие 25", "powerpoint/l25.pptx"], ["Занятия 26–27", "powerpoint/l26.pptx"], ["Занятие 28", "powerpoint/l28.pptx"], ["Занятия 29–30", "powerpoint/l29.pptx"], ["Занятия 31–32", "powerpoint/l31.pptx"], ["Итоговое повторение", "powerpoint/final.pptx"]]
    },
    patrul: {
      id: "patrul", cls: 7, color: "peach", icon: "road",
      title: "Дорожный патруль",
      short: "Классный час по ПДД Республики Беларусь: пять станций с заданиями, командная игра для проектора, видео, глоссарий знаков и удостоверение юного инспектора.",
      long: "Игровой классный час на 45 минут: правила по пяти темам с картинками, одиночная игра «Станции», командная игра с таймером для проектора, глоссарий знаков с поиском, пять анимированных роликов с вопросами, награды и готовый сценарий для учителя.",
      base: "projects/dorozhny-patrul/", entry: "index.html",
      tags: ["7 класс", "ПДД", "Игра", "Классный час"],
      facts: [["5", "станций"], ["28", "заданий"], ["5", "анимированных видео"], ["45", "минут по сценарию"]],
      pages: [
        ["Главная", "index.html"], ["Правила по темам", "learn.html"], ["Игра «Станции»", "game.html"], ["Командная игра", "class.html"],
        ["Знаки и термины", "glossary.html"], ["Видео", "video.html"], ["Награды", "awards.html"], ["Учителю", "teacher.html"]
      ],
      features: [
        ["gamepad", "Две игры", "Одиночное прохождение станций и командная игра с таймером и выбором темы."],
        ["video", "Видео и глоссарий", "Пять коротких роликов с вопросами и поиск по знакам и терминам."],
        ["award", "Награды", "За успехи ученик получает значки и удостоверение юного инспектора."]
      ],
      downloads: []
    }
  };

  const CLASSES = {
    5: { color: "sky", blurb: "Первое знакомство с компьютером: безопасная работа, файлы, текст и картинки.", topics: ["Компьютер и техника безопасности", "Файлы и папки", "Работа с текстом", "Графический редактор", "Информация вокруг нас"] },
    6: { color: "mint", blurb: "Учимся мыслить алгоритмами и управлять исполнителями.", topics: ["Алгоритмы и исполнители", "Способы записи алгоритмов", "Компьютерный исполнитель", "Готовые программы и вспомогательные алгоритмы", "Итоговое повторение"], project: "algo" },
    7: { color: "peach", blurb: "Сети, безопасность и первые шаги в программировании. Плюс классный час по ПДД.", topics: ["Информация и её представление", "Компьютерные сети и интернет", "Информационная безопасность", "Электронные таблицы", "Основы программирования"], project: "patrul" },
    8: { color: "lav", blurb: "Системы счисления, логика и основы алгоритмизации.", topics: ["Системы счисления", "Основы логики", "Алгоритмы и программирование", "Работа с данными"] },
    9: { color: "rose", blurb: "Программирование, базы данных и подготовка к экзамену.", topics: ["Программирование на Python", "Массивы и строки", "Базы данных", "Подготовка к экзамену"] },
    10: { color: "butter", blurb: "Углублённое программирование, моделирование и сети.", topics: ["Алгоритмы и структуры данных", "Моделирование", "Компьютерные сети", "Веб-технологии"] },
    11: { color: "sky", blurb: "Итоговое повторение, олимпиадные задачи и подготовка к ЦТ.", topics: ["Повторение курса", "Олимпиадные задачи", "Разбор вариантов ЦТ", "Проектная работа"] }
  };

  const QUOTES = [
    ["Педагогика", "Учитель живёт до тех пор, пока он учится. Как только он перестаёт учиться, в нём умирает учитель.", "К. Д. Ушинский", "lav"],
    ["Педагогика", "Плохой учитель преподносит истину, хороший учит её находить.", "А. Дистервег", "lav"],
    ["Педагогика", "Учение — свет, а неучение — тьма.", "Народная мудрость", "lav"],
    ["Математика", "Математику уже затем учить следует, что она ум в порядок приводит.", "М. В. Ломоносов", "mint"],
    ["Математика", "Книга природы написана на языке математики.", "Галилео Галилей", "mint"],
    ["Математика", "Нет ни одной области математики, как бы абстрактна она ни была, которая когда-нибудь не окажется применимой к явлениям действительного мира.", "Н. И. Лобачевский", "mint"],
    ["Информатика", "Программы должны быть написаны так, чтобы их читали люди, и лишь попутно — чтобы их выполняли машины.", "Х. Абельсон и Дж. Сассман", "sky"],
    ["Информатика", "Информатика не более наука о компьютерах, чем астрономия — наука о телескопах.", "Приписывается Э. Дейкстре", "sky"],
    ["Информатика", "Лучший способ предсказать будущее — изобрести его.", "Алан Кей", "sky"]
  ];

  const FAQ = [
    ["Сайт", "Где найти материалы к уроку?", "Откройте раздел <b>«Классы»</b> в меню и выберите свой класс. Там собраны темы, проекты и материалы. Для 6 и 7 классов уже есть готовые интерактивные проекты."],
    ["Сайт", "Как открыть проекты на сайте?", "Выберите <b>«Классы → 6»</b> для проекта «Алгоритмы и исполнители» или <b>«Классы → 7»</b> для «Дорожного патруля» и нажмите «Открыть проект». Запустить его можно прямо на странице или на весь экран."],
    ["Сайт", "Нужен ли интернет, чтобы пользоваться материалами?", "Нет. Проекты работают без интернета, он нужен только для шрифтов, видео по внешним ссылкам и перехода по ссылкам на сторонние ресурсы."],
    ["Сайт", "Можно ли пользоваться сайтом с телефона?", "Да. Сайт и оба проекта адаптированы под телефон и планшет. На странице проекта можно переключить вид: компьютер, планшет или телефон."],
    ["Сайт", "Как сообщить об ошибке на сайте?", "Напишите через форму справа и укажите страницу, где заметили проблему, и что именно не работает."],
    ["Сайт", "Можно ли использовать материалы сайта в своих работах?", "Да, для учёбы и подготовки уроков можно. Если делитесь материалами с другими, указывайте ссылку на этот сайт."],

    ["6 класс", "Что такое алгоритм?", "<b>Алгоритм</b> — это последовательность команд, понятная исполнителю, выполнение которой приводит к достижению поставленной цели. Примеры: приготовление чая, переход дороги, рецепт блюда, маршрут от дома до школы."],
    ["6 класс", "Что такое исполнитель?", "<b>Исполнитель</b> — объект (человек, животное, робот, компьютер), который умеет выполнять определённый набор команд. Он не думает за автора алгоритма и делает ровно то, что записано."],
    ["6 класс", "Что такое система команд исполнителя (СКИ)?", "Это все команды, которые исполнитель умеет выполнять. Алгоритм для исполнителя можно составить только из команд его СКИ, например «вверх», «вниз», «влево», «вправо»."],
    ["6 класс", "Какие бывают способы записи алгоритмов?", "Три способа: <b>словесный</b> (словами по шагам), <b>графический</b> (блок-схема) и <b>на языке программирования</b> (программа, понятная компьютеру)."],
    ["6 класс", "Из каких фигур состоит блок-схема?", "<b>Овал</b> — начало и конец, <b>прямоугольник</b> — действие, <b>параллелограмм</b> — ввод и вывод данных, <b>ромб</b> — условие, на которое отвечают «да» или «нет». Стрелки показывают порядок выполнения."],
    ["6 класс", "Что такое линейный алгоритм?", "Алгоритм, в котором команды выполняются одна за другой сверху вниз, каждая ровно один раз. Пример: «Приготовить бутерброд». Если в алгоритме есть условие (ромб), это уже ветвление."],
    ["6 класс", "Что такое компьютерный исполнитель?", "Исполнитель, которым управляют с помощью программы на компьютере. У него есть система команд, поле с препятствиями и целями и начальное положение. Результат программы сразу виден на экране."],
    ["6 класс", "Как изучить и изменить готовую программу?", "Прочитайте программу команда за командой, предположите результат, запустите её, сравните с предположением и при необходимости измените команды. Поиск и исправление ошибок называют отладкой."],
    ["6 класс", "Что такое вспомогательный алгоритм и зачем он нужен?", "Это алгоритм со своим именем, который можно вызвать из другого (основного) алгоритма. Он делает запись короче, алгоритм понятнее, а ошибку достаточно исправить в одном месте. Его можно использовать повторно в других задачах."],

    ["7 класс", "По какой стороне идти, если нет тротуара?", "По краю проезжей части <b>навстречу движению транспорта</b>. Так вы видите приближающиеся машины и успеете отойти, а водитель лучше видит вас."],
    ["7 класс", "Как правильно перейти нерегулируемый пешеходный переход?", "Остановитесь у края проезжей части, оглядитесь (сначала налево, потом направо), убедитесь, что водители заметили вас и остановились, и переходите шагом, не задерживаясь на дороге."],
    ["7 класс", "Что делать, если горит красный, а машин нет?", "Ждать зелёного. Красный сигнал запрещает переход, даже если дорога пуста: машина может появиться из-за поворота быстрее, чем вы думаете. Если зелёный мигает, лучше дождаться следующего."],
    ["7 класс", "Что такое фликер и когда его нужно носить?", "Это световозвращающий элемент. В тёмное время суток при движении по краю проезжей части или обочине, а также при переходе дороги вне перехода пешеход обозначает себя фликером. Крепите его там, куда попадёт свет фар: на рукаве, сумке или одежде."],
    ["7 класс", "С какого возраста можно ехать на велосипеде по проезжей части?", "С <b>14 лет</b>, по крайней правой полосе. Пока вам меньше, езжайте по пешеходным и велосипедным дорожкам. Шлем ПДД не требуют, но он защищает голову при падении."],
    ["7 класс", "Как пересечь дорогу на велосипеде или самокате?", "Спешиться и перейти как пешеход, ведя транспорт рядом. Эту норму уточнили с 1 сентября 2025 года. На тротуаре пешеходы имеют приоритет: снижайте скорость и держите дистанцию."],
    ["7 класс", "Нужно ли пристёгиваться на заднем сиденье?", "Да. Ремень безопасности снижает риск тяжёлых травм для всех пассажиров, в том числе на заднем сиденье. Выходить из машины безопаснее на сторону тротуара или обочины."],
    ["7 класс", "Какие номера экстренных служб нужно знать?", "<b>101</b> — спасатели (МЧС), <b>102</b> — милиция, <b>103</b> — скорая помощь, <b>112</b> — единый номер экстренных служб, он подходит для любой ситуации."],
    ["7 класс", "Что делать, если вы увидели аварию?", "Сначала убедитесь, что вам самим ничего не угрожает. Затем позвоните по 112 (или 103, 102), назовите адрес и расскажите, что случилось. Не бросайте трубку и отвечайте на вопросы диспетчера."],
    ["7 класс", "Из каких станций состоит «Дорожный патруль»?", "Из пяти станций (28 заданий): «Пешеход», «Светофор и знаки», «Заметный в темноте», «Велосипед и СПМ», «Пассажир и помощь». Есть также командная игра для проектора, глоссарий знаков и видео."]
  ];

  const LIBRARY = [
    ["Презентации", 6, "Занятие 25. Понятие алгоритма", "powerpoint/l25.pptx"], ["Презентации", 6, "Занятия 26–27. Способы записи", "powerpoint/l26.pptx"],
    ["Презентации", 6, "Занятие 28. Компьютерный исполнитель", "powerpoint/l28.pptx"], ["Презентации", 6, "Занятия 29–30. Готовые программы", "powerpoint/l29.pptx"],
    ["Презентации", 6, "Занятия 31–32. Вспомогательные алгоритмы", "powerpoint/l31.pptx"], ["Презентации", 6, "Итоговое повторение главы", "powerpoint/final.pptx"],
    ["Тесты", 7, "Тест по ПДД «Станции»", "#/project/patrul"], ["Практикум", 5, "Практикум: файлы и папки", null],
    ["Шпаргалки", 8, "Таблица степеней двойки", null], ["Шпаргалки", 9, "Python: основные конструкции", null],
    ["Тесты", 11, "Тренировочный вариант ЦТ", null], ["Практикум", 10, "Задачи на алгоритмы", null]
  ];

  const NEWS = [
    ["25", "нояб", "Новый проект для 6 класса", "Добавлен интерактивный курс «Алгоритмы и исполнители»: занятия, исполнитель и презентации.", "mint", "6 класс"],
    ["20", "нояб", "Классный час «Дорожный патруль»", "Для 7 класса готова игра по ПДД с пятью станциями и командным режимом.", "peach", "7 класс"],
    ["15", "нояб", "Открыт раздел «Вопрос-ответ»", "Задайте вопрос по предмету или сайту, я отвечу в течение двух рабочих дней.", "lav", "Сайт"]
  ];

  const PREP = [
    ["Системы счисления", ["Перевод между 2, 8, 10, 16", "Арифметика в двоичной системе"]],
    ["Информация и кодирование", ["Единицы измерения информации", "Кодирование текста и графики"]],
    ["Логика", ["Таблицы истинности", "Логические выражения"]],
    ["Алгоритмы и программирование", ["Линейные и ветвящиеся алгоритмы", "Циклы и массивы", "Трассировка программы"]],
    ["Электронные таблицы и базы данных", ["Формулы и функции", "Запросы к базе данных"]],
    ["Сети и безопасность", ["Адресация в сети", "Основы информационной безопасности"]]
  ];

  const ROUTES_NAV = [
    ["/", "Главная", "home"], ["/about", "Обо мне", "user"], ["/olympiads", "Олимпиады", "trophy"], ["/prep", "ЦТ/ЦЭ", "target"],
    ["/library", "Копилка", "folder"], ["/links", "Ссылки", "link"], ["/gallery", "Галерея", "image"], ["/faq", "Вопрос-ответ", "help"]
  ];

  /* ---------- Каркас: шапка и подвал ---------- */
  function buildChrome() {
    $("#header").innerHTML = `
    <div class="header-in">
      <a class="logo" href="#/" aria-label="На главную"><span class="logo-mark">${esc(S.initials)}</span><span>${esc(S.short)}<small>${esc(S.role)}</small></span></a>
      <nav class="nav" id="nav" aria-label="Основное меню">
        <a href="#/" data-r="/">Главная</a>
        <a href="#/about" data-r="/about">Обо мне</a>
        <div class="nav-dd" id="dd">
          <button type="button" aria-expanded="false" aria-haspopup="true">Классы <span class="chev">${ic("chev", 16, 2.4)}</span></button>
          <div class="dd-panel">
            <div class="dd-title">Выберите класс</div>
            <div class="dd-grid">${Object.keys(CLASSES).map(n => `<a href="#/class/${n}" ${col(CLASSES[n].color)}>${n}${CLASSES[n].project ? '<i class="dot"></i>' : ""}</a>`).join("")}</div>
            <div class="dd-note"><i class="dot"></i>есть интерактивный проект</div>
          </div>
        </div>
        <a href="#/olympiads" data-r="/olympiads">Олимпиады</a>
        <a href="#/prep" data-r="/prep">ЦТ/ЦЭ</a>
        <a href="#/library" data-r="/library">Копилка</a>
        <a href="#/links" data-r="/links">Ссылки</a>
        <a href="#/gallery" data-r="/gallery">Галерея</a>
      </nav>
      <button class="hbtn sb" type="button" data-act="search" aria-label="Поиск по сайту (Ctrl+K)">${ic("search", 20)}</button>
      <a class="btn primary sm cta-h" href="#/faq" data-r="/faq">${ic("help", 17)} Вопрос-ответ</a>
      <button class="hbtn burger" type="button" data-act="burger" aria-label="Открыть меню">${ic("menu", 24)}</button>
    </div>`;

    $("#footer").innerHTML = `
    <div class="wrap">
      <div class="f-grid">
        <div>
          <a class="logo" href="#/"><span class="logo-mark">${esc(S.initials)}</span><span>${esc(S.short)}<small>${esc(S.role)}</small></span></a>
          <p>Школьный сайт по информатике: материалы, интерактивные проекты и ответы на вопросы.</p>
        </div>
        <div><h5>Классы</h5><ul>${Object.keys(CLASSES).map(n => `<li><a href="#/class/${n}">${n} класс</a></li>`).join("")}</ul></div>
        <div><h5>Разделы</h5><ul>${ROUTES_NAV.slice(1).map(r => `<li><a href="#${r[0]}">${r[1]}</a></li>`).join("")}</ul></div>
        <div><h5>Контакты</h5><ul>
          <li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
          <li><a href="tel:${esc(S.phone.replace(/[^+\d]/g, ""))}">${esc(S.phone)}</a></li>
          <li>${esc(S.school)}, ${esc(S.city)}</li></ul></div>
      </div>
      <div class="f-bottom"><span>© ${S.year} ${esc(S.name)}. Все права защищены.</span><span>Сделано с заботой о ваших оценках ✨</span></div>
    </div>`;
  }

  /* ---------- Вспомогательные компоненты ---------- */
  const avatar = () => `
    <div class="frame">
      <div class="ph" aria-hidden="true"><svg viewBox="0 0 300 330" fill="none">
        <circle cx="150" cy="110" r="62" fill="#fff" opacity=".9"/><path d="M28 330c0-72 52-112 122-112s122 40 122 112Z" fill="#fff" opacity=".9"/>
        <text x="150" y="128" text-anchor="middle" font-family="Unbounded, sans-serif" font-weight="700" font-size="46" fill="#7f6df2">${esc(S.initials)}</text></svg></div>
      <img src="${esc(S.photo)}" alt="Фото: ${esc(S.name)}" onerror="this.remove()">
    </div>`;

  const projCard = (p, i = 0) => `
    <article class="card proj reveal" style="--d:${i}" ${col(p.color)}>
      <div class="shot" data-fit data-w="1280"><iframe src="${p.base}${p.entry}" title="Превью: ${esc(p.title)}" tabindex="-1" aria-hidden="true"></iframe></div>
      <div class="body">
        <div class="tags">${p.tags.map((t, j) => `<span class="chip" ${j === 0 ? "" : col("lav")}>${esc(t)}</span>`).join("")}</div>
        <h3>${esc(p.title)}</h3><p>${esc(p.short)}</p>
        <div class="row"><a class="btn primary sm" href="#/project/${p.id}">Открыть проект ${ic("arrow", 16)}</a><a class="btn ghost sm" href="${p.base}${p.entry}" target="_blank" rel="noopener">${ic("ext", 16)} На весь экран</a></div>
      </div>
    </article>`;

  /* ---------- Страницы ---------- */
  const V = {};

  V.home = () => {
    const faqN = FAQ.length;
    return `
    <div class="wrap">
      <section class="hero">
        <div>
          <span class="pill-badge reveal"><b>${ic("spark", 14, 2.4)}</b> Школьный сайт по информатике</span>
          <h1 class="reveal" style="--d:1">${esc(S.name.split(" ")[0])}<br><em>${esc(S.name.split(" ").slice(1).join(" "))}</em></h1>
          <p class="lead reveal" style="--d:2">${esc(S.role)} высшей квалификационной категории. Здесь собраны материалы по информатике для 5–11 классов, интерактивные проекты и ответы на вопросы.</p>
          <div class="row reveal" style="--d:3">
            <a class="btn primary lg" href="#/class/6">Выбрать класс ${ic("arrow", 18)}</a>
            <a class="btn ghost lg" href="#/faq">${ic("help", 18)} Задать вопрос</a>
          </div>
        </div>
        <div class="portrait reveal" style="--d:2">
          ${avatar()}
          <div class="float f1"><span class="ic">${ic("flow", 20)}</span><div>Алгоритмы<small>6 класс · проект</small></div></div>
          <div class="float f2"><span class="ic">${ic("road", 20)}</span><div>Дорожный патруль<small>7 класс · игра</small></div></div>
          <div class="float f3"><span class="ic">${ic("code", 20)}</span><div>Информатика<small>5–11 классы</small></div></div>
        </div>
      </section>

      <div class="stats">
        <div class="stat reveal" ${col("lav")}><b data-count="7">0</b><span>классов с материалами</span></div>
        <div class="stat reveal" style="--d:1" ${col("mint")}><b data-count="2">0</b><span>интерактивных проекта</span></div>
        <div class="stat reveal" style="--d:2" ${col("peach")}><b data-count="28" data-plus="1">0</b><span>заданий в играх</span></div>
        <div class="stat reveal" style="--d:3" ${col("sky")}><b data-count="${faqN}">0</b><span>ответов на частые вопросы</span></div>
      </div>

      <section class="sec">
        <div class="sec-head"><div><span class="eyebrow">Классы</span><h2>Выберите свой класс</h2></div><p>Для 6 и 7 классов уже готовы интерактивные проекты, они отмечены на карточках.</p></div>
        <div class="bento">
          ${Object.entries(CLASSES).map(([n, c], i) => `
          <a class="tile t-${n} reveal" style="--d:${i % 4}" href="#/class/${n}">
            ${c.project ? `<span class="chip badge">${ic("spark", 14, 2.2)} проект</span>` : ""}
            <span class="num">${n}</span><h3>${n} класс</h3><p>${esc(c.blurb)}</p>
            <span class="go">Открыть ${ic("arrow", 16)}</span>
          </a>`).join("")}
        </div>
      </section>

      <section class="sec">
        <div class="sec-head"><div><span class="eyebrow">Мои проекты</span><h2>Попробуйте прямо сейчас</h2></div><p>Оба проекта открываются на сайте. Запустите, не выходя со страницы.</p></div>
        <div class="proj-grid">${projCard(PROJECTS.algo, 0)}${projCard(PROJECTS.patrul, 1)}</div>
      </section>

      <section class="sec">
        <div class="sec-head"><div><span class="eyebrow">Объявления</span><h2>Что нового</h2></div></div>
        <div class="news">${NEWS.map((n, i) => `
          <a class="news-i reveal" style="--d:${i}" href="#/${i === 0 ? "project/algo" : i === 1 ? "project/patrul" : "faq"}" ${col(n[4])}>
            <time><span>${n[0]}<small>${n[1]}</small></span></time>
            <div><h4>${esc(n[2])}</h4><p>${esc(n[3])}</p></div><span class="chip">${esc(n[5])}</span></a>`).join("")}</div>
      </section>

      <section class="sec">
        <div class="sec-head"><div><span class="eyebrow">Быстрый доступ</span><h2>Разделы сайта</h2></div></div>
        <div class="quick">
          ${[["trophy", "Олимпиады", "Этапы и советы", "/olympiads", "butter"], ["target", "ЦТ/ЦЭ", "Чек-лист тем", "/prep", "rose"], ["folder", "Копилка", "Презентации и тесты", "/library", "sky"], ["link", "Ссылки", "Полезные ресурсы", "/links", "mint"],
             ["image", "Галерея", "Фото с уроков", "/gallery", "peach"], ["user", "Обо мне", "Кто ведёт уроки", "/about", "lav"], ["help", "Вопрос-ответ", "Ответы и форма", "/faq", "rose"], ["search", "Поиск", "Ctrl + K", "search", "sky"]]
            .map((q, i) => `<a class="q reveal" style="--d:${i % 4}" ${col(q[4])} href="${q[3] === "search" ? "#" : "#" + q[3]}" ${q[3] === "search" ? 'data-act="search"' : ""}><span class="ic">${ic(q[0], 22)}</span><div><b>${q[1]}</b><span>${q[2]}</span></div></a>`).join("")}
        </div>
      </section>

      <section class="sec">
        <figure class="card quote day reveal" ${col(QUOTES[new Date().getDate() % QUOTES.length][3])}>
          <span class="chip">Мысль дня</span><blockquote>${esc(QUOTES[new Date().getDate() % QUOTES.length][1])}</blockquote><figcaption>${esc(QUOTES[new Date().getDate() % QUOTES.length][2])} · <a href="#/about" style="text-decoration:underline">ещё цитаты</a></figcaption>
        </figure>
      </section>

      <section class="sec">
        <div class="cta reveal">
          <div><h2>Остались вопросы?</h2><p>Посмотрите ответы на частые вопросы или напишите мне напрямую. Я отвечу в течение двух рабочих дней.</p></div>
          <div class="row"><a class="btn primary lg" href="#/faq">${ic("help", 18)} Вопрос-ответ</a><a class="btn ghost lg" href="mailto:${esc(S.email)}">${ic("mail", 18)} Написать письмо</a></div>
        </div>
      </section>
    </div>`;
  };

  V.about = () => `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Обо мне</span></div>
      <div class="page-head"><span class="eyebrow">Обо мне</span><h1>${esc(S.name)}</h1></div>
      <div class="about-grid">
        <div class="portrait reveal" style="width:min(380px,100%)">${avatar()}</div>
        <div class="card panel reveal about-card"><p>Учитель информатики высшей квалификационной категории Государственного учреждения образования «Средняя школа №54 г. Гомеля»</p></div>
      </div>
      <section class="sec">
        <div class="sec-head"><div><span class="eyebrow">Цитаты</span><h2>Слова, которые вдохновляют учиться</h2></div><p>О знаниях, математике и информатике.</p></div>
        <div class="grid3">${QUOTES.map((q, i) => `
          <figure class="card quote reveal" style="--d:${i % 3}" ${col(q[3])}>
            <span class="chip">${q[0]}</span><blockquote>${esc(q[1])}</blockquote><figcaption>${esc(q[2])}</figcaption>
          </figure>`).join("")}</div>
      </section>
    </div>`;

  V.class = n => {
    const c = CLASSES[n]; if (!c) return V.notfound();
    const p = c.project && PROJECTS[c.project];
    return `
    <div class="wrap" ${col(c.color)}>
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Классы</span><span class="sep">/</span><span>${n} класс</span></div>
      <div class="class-hero reveal"><div class="big">${n}</div><div><span class="eyebrow" style="color:var(--c)">Информатика</span><h1 style="margin-top:8px">${n} класс</h1><p>${esc(c.blurb)}</p></div></div>
      <div class="class-switch">${Object.keys(CLASSES).map(k => `<a href="#/class/${k}" ${k == n ? 'aria-current="page"' : ""}>${k} класс</a>`).join("")}</div>
      ${p ? `
      <div class="feature-card reveal" ${col(p.color)}>
        <div class="txt"><span class="chip">${ic("spark", 14, 2.2)} Интерактивный проект</span><h2>${esc(p.title)}</h2><p>${esc(p.short)}</p>
          <div class="row"><a class="btn primary" href="#/project/${p.id}">Открыть проект ${ic("arrow", 18)}</a><a class="btn ghost" href="${p.base}${p.entry}" target="_blank" rel="noopener">${ic("ext", 18)} На весь экран</a></div></div>
        <div class="art" data-fit><iframe src="${p.base}${p.entry}" title="Превью: ${esc(p.title)}" tabindex="-1" aria-hidden="true"></iframe></div>
      </div>` : ""}
      <div class="cols">
        <div class="card panel reveal"><h3>${ic("list", 22)} Темы курса</h3><ol class="topics" style="padding:0">${c.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ol></div>
        <div class="card panel reveal" style="--d:1"><h3>${ic("folder", 22)} Материалы</h3>
          <div class="mat">
            ${p ? `<a href="#/project/${p.id}" style="border-style:solid;color:var(--ink)">${ic(p.icon, 20)} ${esc(p.title)}<span class="soon" style="background:var(--c-soft);color:var(--c)">готово</span></a>` : ""}
            ${["Презентации к урокам", "Практические работы", "Тесты и проверочные"].map(t => `<div>${ic("file", 20)} ${t}<span class="soon">скоро</span></div>`).join("")}
          </div>
          <a class="btn soft" style="margin-top:16px;width:100%" href="#/faq">${ic("help", 18)} Есть вопрос по классу?</a>
        </div>
      </div>
    </div>`;
  };

  V.project = id => {
    const p = PROJECTS[id]; if (!p) return V.notfound();
    return `
    <div class="wrap" ${col(p.color)}>
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><a href="#/class/${p.cls}">${p.cls} класс</a><span class="sep">/</span><span>${esc(p.title)}</span></div>
      <div class="proj-top page-head">
        <div><div style="display:flex;gap:8px;flex-wrap:wrap">${p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div><h1>${esc(p.title)}</h1><p class="lead">${esc(p.long)}</p></div>
        <div class="facts">${p.facts.map(f => `<div class="fact"><b>${f[0]}</b><span>${f[1]}</span></div>`).join("")}</div>
      </div>

      <div class="browser reveal" id="browser">
        <div class="b-bar"><div class="dots"><i></i><i></i><i></i></div><div class="b-url" id="b-url">${p.base}${p.entry}</div>
          <div class="seg" role="group" aria-label="Размер экрана">
            <button type="button" data-dev="desktop" aria-pressed="true" aria-label="Компьютер">${ic("desktop", 17)}</button>
            <button type="button" data-dev="tablet" aria-pressed="false" aria-label="Планшет">${ic("tablet", 17)}</button>
            <button type="button" data-dev="phone" aria-pressed="false" aria-label="Телефон">${ic("phoneD", 17)}</button></div>
          <button class="hbtn" type="button" data-act="reload" aria-label="Обновить">${ic("reload", 18)}</button>
          <a class="hbtn" id="b-open" href="${p.base}${p.entry}" target="_blank" rel="noopener" aria-label="Открыть на весь экран">${ic("ext", 18)}</a></div>
        <div class="b-tabs" role="tablist">${p.pages.map((pg, i) => `<button type="button" role="tab" data-page="${pg[1]}" aria-selected="${i === 0}">${esc(pg[0])}</button>`).join("")}</div>
        <div class="b-stage" data-dev="desktop"><div class="frame-box">
          <div class="launch" id="launch"><button class="play" type="button" data-act="launch" aria-label="Запустить проект">${ic("play", 32)}</button><h3>${esc(p.title)}</h3><p>Нажмите, чтобы запустить проект прямо на странице</p></div>
          <iframe id="pframe" title="${esc(p.title)}" data-base="${p.base}" allow="fullscreen" allowfullscreen></iframe></div></div>
      </div>

      <section class="sec"><div class="sec-head"><div><span class="eyebrow">Возможности</span><h2>Что внутри</h2></div></div>
        <div class="feat">${p.features.map((f, i) => `<div class="reveal" style="--d:${i}"><span class="ic">${ic(f[0], 22)}</span><h4>${esc(f[1])}</h4><p>${esc(f[2])}</p></div>`).join("")}</div></section>

      ${p.downloads.length ? `<section class="sec"><div class="sec-head"><div><span class="eyebrow">Материалы</span><h2>Презентации PowerPoint</h2></div><p>Скачайте файлы и откройте в PowerPoint. Ссылки внутри презентаций работают в режиме показа.</p></div>
        <div class="dl">${p.downloads.map(d => `<a class="btn ghost" href="${p.base}${d[1]}" download>${ic("download", 17)} ${esc(d[0])}</a>`).join("")}</div></section>` : ""}

      <section class="sec"><div class="cta reveal"><div><h2>Нашли ошибку или есть идея?</h2><p>Напишите мне через форму обратной связи, я исправлю и добавлю.</p></div><div class="row"><a class="btn primary lg" href="#/faq">${ic("help", 18)} Вопрос-ответ</a><a class="btn ghost lg" href="#/class/${p.cls}">${p.cls} класс</a></div></div></section>
    </div>`;
  };

  V.olympiads = () => `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Олимпиады</span></div>
      <div class="page-head"><span class="eyebrow">Олимпиады</span><h1>Путь к победе</h1><p class="lead">Олимпиада по информатике проходит в несколько этапов. Вот что нужно знать, чтобы пройти их уверенно.</p></div>
      <div class="steps">${[["Школьный", "Первый шаг. Проходит в школе, подойдёт всем желающим.", "mint"], ["Районный", "Лучшие участники школьного этапа решают задачи сложнее.", "sky"], ["Областной", "Серьёзная проверка алгоритмического мышления.", "lav"], ["Республиканский", "Заключительный этап для сильнейших.", "peach"]]
        .map((s, i) => `<div class="step reveal" style="--d:${i}" ${col(s[2])}><div class="n">0${i + 1}</div><h4>${s[0]} этап</h4><p>${s[1]}</p></div>`).join("")}</div>
      <div class="cols">
        <div class="card panel reveal"><h3>${ic("spark", 22)} Примеры задач с разбором</h3>
          <div class="qa">
            <details name="o"><summary>Сколько единиц в двоичной записи числа 37?<span class="pm">${ic("plus", 16, 2.4)}</span></summary><div class="ans">Разложим: 37 = 32 + 4 + 1, то есть <b>100101</b>₂. Единиц три. <b>Ответ: 3.</b></div></details>
            <details name="o"><summary>Переведите 1011₂ в десятичную систему<span class="pm">${ic("plus", 16, 2.4)}</span></summary><div class="ans">1·8 + 0·4 + 1·2 + 1·1 = <b>11</b>.</div></details>
            <details name="o"><summary>Сколько байт в 2 Кбайт?<span class="pm">${ic("plus", 16, 2.4)}</span></summary><div class="ans">1 Кбайт = 1024 байта, значит 2 Кбайт = <b>2048 байт</b>.</div></details>
          </div></div>
        <div class="card panel reveal" style="--d:1"><h3>${ic("target", 22)} Советы</h3>
          <ul class="topics" style="counter-reset:t">${["Решайте по одной задаче в день", "Разбирайте решения после тура", "Тренируйте системы счисления", "Учитесь писать чистый код"].map(t => `<li>${t}</li>`).join("")}</ul>
          <a class="btn soft" style="margin-top:16px;width:100%" href="#/prep">К подготовке ЦТ/ЦЭ ${ic("arrow", 16)}</a></div>
      </div>
    </div>`;

  V.prep = () => {
    const done = store.get("prep", {});
    const total = PREP.reduce((a, g) => a + g[1].length, 0);
    const cnt = Object.values(done).filter(Boolean).length;
    return `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>ЦТ/ЦЭ</span></div>
      <div class="page-head"><span class="eyebrow">Подготовка</span><h1>ЦТ и ЦЭ по информатике</h1><p class="lead">Отмечайте повторённые темы. Прогресс сохраняется в вашем браузере.</p></div>
      <div class="card panel reveal" style="margin-top:16px">
        <div class="prog"><b id="prep-n">${Math.round(cnt / total * 100)}%</b><div class="bar"><i id="prep-bar" style="width:${cnt / total * 100}%"></i></div><span style="color:var(--muted);font-size:.88rem" id="prep-c">${cnt} из ${total}</span></div>
        ${PREP.map((g, gi) => `<h4 style="font:600 .74rem var(--f-body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:20px 0 10px">${esc(g[0])}</h4><div class="checklist">${g[1].map((t, ti) => { const k = gi + "-" + ti; return `<label class="check"><input type="checkbox" data-k="${k}" ${done[k] ? "checked" : ""}><span class="box">${ic("check", 15, 3)}</span><span>${esc(t)}</span></label>`; }).join("")}</div>`).join("")}
        <button class="btn ghost sm" style="margin-top:20px" type="button" data-act="prep-reset">Сбросить прогресс</button>
      </div>
    </div>`;
  };

  V.library = () => `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Копилка</span></div>
      <div class="page-head"><span class="eyebrow">Методическая копилка</span><h1>Материалы для уроков</h1><p class="lead">Презентации, тесты, шпаргалки и практикумы. Часть материалов появится позже.</p></div>
      <div class="fchips" id="lib-chips" style="margin-top:20px">${["Все", "Презентации", "Тесты", "Шпаргалки", "Практикум"].map((t, i) => `<button type="button" data-f="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
      <div class="grid3" id="lib-grid">${LIBRARY.map((m, i) => {
        const c = ["mint", "peach", "lav", "sky", "rose", "butter"][i % 6]; const ready = m[3];
        const href = !ready ? null : ready.startsWith("#") ? ready : PROJECTS.algo.base + ready;
        return `<div class="card res reveal" data-t="${m[0]}" style="--d:${i % 3}" ${col(c)}><span class="ic">${ic(m[0] === "Презентации" ? "presentation" : m[0] === "Тесты" ? "check" : m[0] === "Шпаргалки" ? "file" : "code", 22)}</span><span class="chip" style="align-self:flex-start">${m[0]}</span><h4>${esc(m[2])}</h4>
          <div class="meta"><span>${m[1]} класс</span>${href ? `<a class="btn soft sm" href="${href}" ${href.startsWith("#") ? "" : "download"}>${href.startsWith("#") ? "Открыть" : "Скачать"}</a>` : `<span class="chip" style="background:var(--bg);color:var(--muted)">скоро</span>`}</div></div>`;
      }).join("")}</div>
    </div>`;

  V.links = () => `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Ссылки</span></div>
      <div class="page-head"><span class="eyebrow">Полезные ссылки</span><h1>Где ещё учиться</h1><p class="lead">Проверенные ресурсы для школьников и учителей информатики.</p></div>
      <div class="grid3" style="margin-top:24px">${[
        ["Национальный образовательный портал", "Учебные материалы и новости образования Беларуси.", "https://adu.by", "mint", "book"],
        ["Электронные учебники", "Учебные пособия в электронном виде.", "https://e-padruchnik.adu.by", "sky", "book"],
        ["РИКЦ", "Информация о централизованном тестировании.", "https://rikc.by", "rose", "target"],
        ["Scratch", "Визуальное программирование для начинающих.", "https://scratch.mit.edu", "peach", "code"],
        ["Code.org", "Бесплатные уроки программирования.", "https://code.org", "lav", "code"],
        ["Python.org", "Официальный сайт языка Python и документация.", "https://www.python.org", "butter", "code"]
      ].map((l, i) => `<a class="card res reveal" style="--d:${i % 3}" ${col(l[3])} href="${l[2]}" target="_blank" rel="noopener"><span class="ic">${ic(l[4], 22)}</span><h4>${l[0]}</h4><p>${l[1]}</p><div class="meta"><span>${l[2].replace("https://", "")}</span>${ic("ext", 16)}</div></a>`).join("")}</div>
    </div>`;

  V.gallery = () => {
    const tiles = S.gallery.length ? S.gallery.map(g => ({ src: g.src, t: g.title })) : ["Кабинет информатики", "Олимпиада", "Проектная неделя", "Классный час", "Практическая работа", "Награждение"].map(t => ({ t }));
    const cs = ["lav", "mint", "peach", "sky", "rose", "butter"], hs = [220, 280, 200, 260, 240, 300];
    return `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Галерея</span></div>
      <div class="page-head"><span class="eyebrow">Галерея</span><h1>Фото с уроков и событий</h1><p class="lead">${S.gallery.length ? "Моменты из школьной жизни." : "Здесь появятся фотографии. Добавьте файлы в assets/gallery и перечислите их в js/config.js."}</p></div>
      <div class="gallery" style="margin-top:24px">${tiles.map((t, i) => t.src
        ? `<figure class="ph-tile reveal" style="margin:0 0 16px;padding:0" ${col(cs[i % 6])}><img src="${esc(t.src)}" alt="${esc(t.t || "")}" loading="lazy" style="width:100%"></figure>`
        : `<div class="ph-tile reveal" style="height:${hs[i % 6]}px;--d:${i % 3}" ${col(cs[i % 6])}><div>${ic("image", 40, 1.5)}<b>${t.t}</b><span>фото скоро</span></div></div>`).join("")}</div>
    </div>`;
  };

  V.faq = () => {
    const cats = ["Все", ...new Set(FAQ.map(f => f[0]))];
    return `
    <div class="wrap">
      <div class="crumbs"><a href="#/">Главная</a><span class="sep">/</span><span>Вопрос-ответ</span></div>
      <div class="page-head"><span class="eyebrow">Обратная связь</span><h1>Вопрос-ответ</h1><p class="lead">Найдите ответ в списке или задайте свой вопрос. Отвечаю в течение двух рабочих дней.</p></div>
      <div class="faq-layout">
        <div>
          <div class="search"><span class="sr"><label for="faq-q">Поиск по вопросам</label></span>${ic("search", 20)}<input id="faq-q" type="search" placeholder="Поиск по вопросам…" autocomplete="off"></div>
          <div class="fchips" id="faq-chips">${cats.map((c, i) => `<button type="button" data-c="${c}" aria-pressed="${i === 0}">${c}</button>`).join("")}</div>
          <div class="qa" id="faq-list">${FAQ.map(f => `<details name="faq" data-c="${f[0]}"><summary><span class="chip tag" ${col("lav")}>${f[0]}</span><span>${esc(f[1])}</span><span class="pm">${ic("plus", 16, 2.4)}</span></summary><div class="ans">${f[2]}</div></details>`).join("")}</div>
          <p style="color:var(--muted);font-size:.82rem;margin-top:14px">Нормы ПДД уточняйте в действующей редакции на pravo.by.</p>
          <div class="empty" id="faq-empty" hidden>Ничего не нашлось. Задайте вопрос через форму, и я отвечу.</div>
        </div>
        <aside class="card ask reveal">
          <h3>Задать вопрос</h3><p>Не нашли ответ? Напишите, и я отвечу.</p>
          <form id="ask" novalidate>
            <div class="field"><label for="a-name">Имя</label><input id="a-name" name="name" autocomplete="name" placeholder="Как вас зовут?" maxlength="60"><span class="err"></span></div>
            <div class="field"><label for="a-cls">Класс</label><select id="a-cls" name="cls"><option>Не указан</option>${[5, 6, 7, 8, 9, 10, 11].map(n => `<option>${n} класс</option>`).join("")}<option>Родитель</option><option>Коллега</option></select></div>
            <div class="field"><label for="a-q">Ваш вопрос</label><textarea id="a-q" name="q" maxlength="500" placeholder="Напишите вопрос…"></textarea><div class="counter"><span id="a-n">0</span> / 500</div><span class="err"></span></div>
            <button class="btn primary" style="width:100%" type="submit">${ic("mail", 18)} Отправить вопрос</button>
          </form>
          <div class="mine" id="mine"></div>
          <div class="contacts"><a href="mailto:${esc(S.email)}"><span class="ic">${ic("mail", 18)}</span>${esc(S.email)}</a><a href="tel:${esc(S.phone.replace(/[^+\d]/g, ""))}"><span class="ic">${ic("phone", 18)}</span>${esc(S.phone)}</a></div>
        </aside>
      </div>
    </div>`;
  };

  V.notfound = () => `<div class="wrap"><div class="page-head" style="text-align:center;padding:80px 0"><span class="eyebrow">Ошибка 404</span><h1>Страница не найдена</h1><p class="lead" style="margin:0 auto 24px">Похоже, такой страницы нет. Вернёмся на главную?</p><a class="btn primary lg" href="#/">На главную</a></div></div>`;

  /* ---------- Поведение страниц ---------- */
  const AFTER = {};

  AFTER.project = () => {
    const fr = $("#pframe"), base = fr.dataset.base, stage = $(".b-stage"), url = $("#b-url"), open = $("#b-open"), launch = $("#launch");
    let current = $(".b-tabs button").dataset.page;
    const load = page => { current = page; fr.src = base + page; url.textContent = base + page; open.href = base + page; launch.classList.add("hide"); };
    $$(".b-tabs button").forEach(b => b.addEventListener("click", () => {
      $$(".b-tabs button").forEach(x => x.setAttribute("aria-selected", x === b)); load(b.dataset.page);
    }));
    $$(".seg button").forEach(b => b.addEventListener("click", () => {
      $$(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); stage.dataset.dev = b.dataset.dev;
    }));
    $('[data-act="launch"]').addEventListener("click", () => load(current));
    $('[data-act="reload"]').addEventListener("click", () => { if (fr.src) fr.src = fr.src; else load(current); });
  };

  AFTER.prep = () => {
    const done = store.get("prep", {}), boxes = $$("[data-k]");
    const upd = () => {
      const n = boxes.filter(b => b.checked).length, t = boxes.length;
      $("#prep-n").textContent = Math.round(n / t * 100) + "%"; $("#prep-bar").style.width = n / t * 100 + "%"; $("#prep-c").textContent = `${n} из ${t}`;
    };
    boxes.forEach(b => b.addEventListener("change", () => { done[b.dataset.k] = b.checked; store.set("prep", done); upd(); if ($$("[data-k]:checked").length === boxes.length) toast("Все темы повторены, так держать! 🎉"); }));
    $('[data-act="prep-reset"]').addEventListener("click", () => { boxes.forEach(b => { b.checked = false; }); store.set("prep", {}); upd(); });
  };

  AFTER.library = () => {
    $$("#lib-chips button").forEach(b => b.addEventListener("click", () => {
      $$("#lib-chips button").forEach(x => x.setAttribute("aria-pressed", x === b));
      $$("#lib-grid [data-t]").forEach(c => { c.hidden = b.dataset.f !== "Все" && c.dataset.t !== b.dataset.f; });
    }));
  };

  AFTER.faq = () => {
    let cat = "Все"; const q = $("#faq-q");
    const apply = () => {
      const term = q.value.trim().toLowerCase(); let shown = 0;
      $$("#faq-list details").forEach(d => {
        const ok = (cat === "Все" || d.dataset.c === cat) && (!term || d.textContent.toLowerCase().includes(term));
        d.hidden = !ok; if (ok) shown++;
      });
      $("#faq-empty").hidden = shown > 0;
    };
    q.addEventListener("input", apply);
    $$("#faq-chips button").forEach(b => b.addEventListener("click", () => { cat = b.dataset.c; $$("#faq-chips button").forEach(x => x.setAttribute("aria-pressed", x === b)); apply(); }));

    const form = $("#ask"), ta = form.q, cnt = $("#a-n");
    ta.addEventListener("input", () => cnt.textContent = ta.value.length);
    const renderMine = () => {
      const m = store.get("faq_mine", []);
      $("#mine").innerHTML = m.length ? `<h4>Ваши вопросы</h4>${m.slice(0, 3).map(x => `<div class="mine-i"><span>${esc(x.q)}</span><span class="st">${ic("check", 14, 2.6)} ${esc(x.status)} · ${esc(x.date)}</span></div>`).join("")}` : "";
    };
    renderMine();
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const f = n => form[n].closest(".field");
      let ok = true;
      [["name", form.name.value.trim().length >= 2, "Введите имя"], ["q", ta.value.trim().length >= 10, "Вопрос слишком короткий (от 10 символов)"]].forEach(([n, v, msg]) => {
        f(n).classList.toggle("bad", !v); f(n).querySelector(".err").textContent = v ? "" : msg; if (!v) ok = false;
      });
      if (!ok) return;
      const item = { name: form.name.value.trim(), cls: form.cls.value, q: ta.value.trim(), date: new Date().toLocaleDateString("ru-RU"), status: S.formEndpoint ? "отправлено" : "сохранено" };
      if (S.formEndpoint) {
        try { await fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(item) }); }
        catch { toast("Не удалось отправить. Проверьте интернет и попробуйте ещё раз."); return; }
      }
      const m = store.get("faq_mine", []); m.unshift(item); store.set("faq_mine", m.slice(0, 20));
      form.reset(); cnt.textContent = "0"; renderMine(); toast("Спасибо! Вопрос отправлен ✨");
    });
  };

  /* ---------- Общие эффекты ---------- */
  function fit() {
    $$("[data-fit]").forEach(box => {
      const f = $("iframe", box); if (!f) return;
      const s = box.clientWidth / 1280; if (!s) return;
      f.style.transform = `scale(${s})`; f.style.height = box.clientHeight / s + "px";
    });
  }
  function reveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: .08 });
    els.forEach(e => io.observe(e));
    $$("[data-count]").forEach(b => {
      const to = +b.dataset.count, plus = b.dataset.plus ? "+" : "";
      const o = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return; o.disconnect();
        const t0 = performance.now(); (function step(t) { const k = Math.min(1, (t - t0) / 1100); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (k === 1 ? plus : ""); if (k < 1) requestAnimationFrame(step); })(t0);
      }); o.observe(b);
    });
  }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3200); }

  /* ---------- Роутер ---------- */
  function resolve(path) {
    let m;
    if (path === "/" || path === "") return { v: V.home, a: "home", t: "Главная", r: "/" };
    if (path === "/about") return { v: V.about, t: "Обо мне", r: "/about" };
    if ((m = path.match(/^\/class\/(\d+)$/))) return { v: () => V.class(m[1]), t: `${m[1]} класс`, r: "/class" };
    if ((m = path.match(/^\/project\/(\w+)$/))) return { v: () => V.project(m[1]), a: "project", t: PROJECTS[m[1]]?.title || "Проект", r: "/class" };
    const map = { "/olympiads": ["olympiads", "Олимпиады"], "/prep": ["prep", "ЦТ/ЦЭ"], "/library": ["library", "Копилка"], "/links": ["links", "Ссылки"], "/gallery": ["gallery", "Галерея"], "/faq": ["faq", "Вопрос-ответ"] };
    if (map[path]) return { v: V[map[path][0]], a: map[path][0], t: map[path][1], r: path };
    return { v: V.notfound, t: "Страница не найдена", r: "" };
  }
  function render() {
    const path = decodeURIComponent(location.hash.replace(/^#/, "")) || "/";
    const r = resolve(path);
    const draw = () => {
      $("#app").innerHTML = r.v();
      document.title = (r.t === "Главная" ? "" : r.t + " · ") + `${S.name}, ${S.role.toLowerCase()}`;
      $$("#nav [data-r], .cta-h").forEach(a => a.dataset.r === r.r ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
      $("#dd").classList.toggle("active", r.r === "/class");
      document.body.classList.remove("nav-open"); $("#dd").classList.remove("open");
      window.scrollTo(0, 0);
      reveal(); fit(); AFTER[r.a]?.();
    };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(draw); else draw();
  }

  /* ---------- Палитра поиска ---------- */
  function palette() {
    const dlg = $("#palette"), inp = $("#pal-q"), list = $("#pal-list");
    const items = [
      ...ROUTES_NAV.map(r => ({ t: r[1], h: "#" + r[0], i: r[2], k: "Раздел" })),
      ...Object.keys(CLASSES).map(n => ({ t: `${n} класс`, h: `#/class/${n}`, i: "book", k: "Класс" })),
      ...Object.values(PROJECTS).map(p => ({ t: p.title, h: `#/project/${p.id}`, i: p.icon, k: `Проект · ${p.cls} класс` })),
      ...FAQ.map(f => ({ t: f[1], h: "#/faq", i: "help", k: "Вопрос" }))
    ];
    let sel = 0, shown = [];
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      shown = items.filter(x => !q || x.t.toLowerCase().includes(q) || x.k.toLowerCase().includes(q)).slice(0, 9);
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = shown.length ? shown.map((x, i) => `<li><a href="${x.h}" class="${i === sel ? "sel" : ""}"><span class="ic">${ic(x.i, 17)}</span>${esc(x.t)}<small>${esc(x.k)}</small></a></li>`).join("") : `<li style="padding:20px;text-align:center;color:var(--muted)">Ничего не найдено</li>`;
    };
    inp.addEventListener("input", () => { sel = 0; draw(); });
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); draw(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
      else if (e.key === "Enter" && shown[sel]) { location.hash = shown[sel].h; dlg.close(); }
    });
    list.addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    return () => { inp.value = ""; sel = 0; draw(); dlg.showModal(); inp.focus(); };
  }

  /* ---------- Старт ---------- */
  document.documentElement.classList.add("js");
  buildChrome();
  const openPalette = palette();
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-act]"); if (!a) return;
    if (a.dataset.act === "search") { e.preventDefault(); openPalette(); }
    if (a.dataset.act === "burger") document.body.classList.toggle("nav-open");
  });
  $("#dd > button").addEventListener("click", e => { const d = $("#dd"); d.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", d.classList.contains("open")); });
  document.addEventListener("click", e => { if (!e.target.closest("#dd")) $("#dd").classList.remove("open"); });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
    if (e.key === "Escape") { document.body.classList.remove("nav-open"); $("#dd").classList.remove("open"); }
  });
  const top = $("#totop");
  addEventListener("scroll", () => top.classList.toggle("show", scrollY > 600), { passive: true });
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("resize", fit);
  addEventListener("hashchange", render);
  addEventListener("load", fit);
  render();
})();
