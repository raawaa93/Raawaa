/* مشاهد توضيحية، لا صورًا حقيقية ولا نتائج استخدام موثّقة. */
(function () {
  'use strict';
  var media = document.querySelector('[data-serum-media]');
  if (!media) return;
  var controls = document.querySelectorAll('[data-serum-controls]');
  var caption = media.querySelector('[data-serum-caption]');
  var panels = media.querySelectorAll('[data-serum-view]');
  var buttons = document.querySelectorAll('[data-serum-control]');
  if (!controls.length || !caption || !panels.length || !buttons.length) return;

  var descriptions = {
    bottle: 'تصميم عبوة سيروم رواء 50 مل — تصميم مقترح للعبوة، لا صورة لمنتج نهائي مطبوع.',
    sizes: 'تصميم مقترح للأحجام الثلاثة؛ لا يوضّح القياسات الفعلية.',
    ritual: 'مشهد تعبيري مولّد؛ لا يعرض المنتج أو نتيجة استخدامه.'
  };

  function showView(key) {
    if (!Object.prototype.hasOwnProperty.call(descriptions, key)) return;
    Array.prototype.forEach.call(panels, function (panel) {
      panel.hidden = panel.getAttribute('data-serum-view') !== key;
    });
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-serum-control') === key));
    });
    caption.textContent = descriptions[key];
  }

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      showView(button.getAttribute('data-serum-control'));
    });
  });

  // بطاقة الملصق (في قسم المكوّنات) تتبع المزيج المختار، لا ملصقًا ثابتًا.
  // تُبحَث في المستند كله لأن موضعها خارج كتلة وسائط الشاشة الأولى.
  var LABELS = {
    'rosemary-caffeine': { file: 'rosemary-caffeine-label.svg', alt: 'ملصق رواء — روزماري وكافيين' },
    'olive-panthenol': { file: 'olive-panthenol-label.svg', alt: 'ملصق رواء — زيت الزيتون والبانثينول' },
    'castor-blend': { file: 'castor-blend-label.svg', alt: 'ملصق رواء — خروع وزيوت مختارة' }
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
  Array.prototype.forEach.call(controls, function (control) { control.hidden = false; });
})();
