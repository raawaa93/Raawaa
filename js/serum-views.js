/* مشاهد توضيحية، لا صورًا حقيقية ولا نتائج استخدام موثّقة. */
(function () {
  'use strict';
  var media = document.querySelector('[data-serum-media]');
  if (!media) return;
  var controls = document.querySelectorAll('[data-serum-controls]');
  var panels = media.querySelectorAll('[data-serum-view]');
  var buttons = document.querySelectorAll('[data-serum-control]');
  if (!controls.length || !panels.length || !buttons.length) return;

  var views = ['bottle', 'sizes', 'ritual'];
  var captions = {
    bottle: 'تصميم عبوة توضيحي.',
    sizes: 'تصوّر توضيحي للأحجام؛ لا يوضّح القياسات الفعلية.',
    ritual: 'مشهد تعبيري؛ لا يعرض نتيجة استخدام المنتج.'
  };
  var caption = document.querySelector('[data-serum-caption]');

  function showView(key) {
    if (views.indexOf(key) === -1) return;
    Array.prototype.forEach.call(panels, function (panel) {
      panel.hidden = panel.getAttribute('data-serum-view') !== key;
    });
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-serum-control') === key));
    });
    if (caption) caption.textContent = captions[key];
  }

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      showView(button.getAttribute('data-serum-control'));
    });
  });

  // بطاقة الملصق (في قسم المكوّنات) تتبع المزيج المختار، لا ملصقًا ثابتًا.
  // تُبحَث في المستند كله لأن موضعها خارج كتلة وسائط الشاشة الأولى.
  var LABELS = {
    'rosemary-caffeine': { file: 'rosemary-caffeine-label.svg', alt: 'تصميم مقترح لملصق مزيج رواء — روزماري وكافيين، وليس ملصقًا نهائيًا للطباعة' },
    'olive-panthenol': { file: 'olive-panthenol-label.svg', alt: 'تصميم مقترح لملصق مزيج رواء — زيت الزيتون والبانثينول، وليس ملصقًا نهائيًا للطباعة' },
    'castor-blend': { file: 'castor-blend-label.svg', alt: 'تصميم مقترح لملصق مزيج رواء — خروع وزيوت مختارة، وليس ملصقًا نهائيًا للطباعة' }
  };

  function syncLabel(familyId) {
    var entry = LABELS[familyId];
    if (!entry) return;
    var src = 'assets/img/products/' + entry.file;
    Array.prototype.forEach.call(document.querySelectorAll('[data-label-src]'), function (node) {
      node.setAttribute('srcset', src);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-label-img]'), function (node) {
      node.setAttribute('src', src);
      node.setAttribute('alt', entry.alt);
    });
  }

  document.addEventListener('rawaa:formula-change', function (event) {
    if (event.detail && event.detail.familyId) syncLabel(event.detail.familyId);
  });

  // اختيار حجم آخر يعيد صورة ذلك الحجم؛ لا يخلط بين المشهد والمنتج المختار.
  document.addEventListener('change', function (event) {
    if (event.target && event.target.matches('input[name="rawaa-size"]')) showView('bottle');
  });
  showView('bottle');
  Array.prototype.forEach.call(controls, function (control) { control.hidden = false; });
})();
