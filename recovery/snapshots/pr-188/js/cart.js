/**
 * RAWAA | رواء — منطق الواجهة والسلة وطلب واتساب.
 * السلة في ذاكرة الجلسة؛ فتح الطلب ينقل اختيارات الزائرة إلى واتساب فقط عند اختيارها.
 */
(function () {
  'use strict';

  var CONFIG = window.RAWAA_CONFIG;
  var MAX_QTY = (CONFIG && CONFIG.cart && CONFIG.cart.maxQuantityPerItem) || 10;
  var MIN_QTY = (CONFIG && CONFIG.cart && CONFIG.cart.minQuantityPerItem) || 1;

  /** حالة السلة: { productId: quantity } — في الذاكرة وذاكرة جلسة التبويب عند توفرها. */
  var cart = Object.create(null);

  var el = {};
  var lastFocused = null;

  /** طريقة الدفع المختارة — أول طريقة متاحة من الإعدادات. */
  var availableMethods = (CONFIG && CONFIG.payment && CONFIG.payment.methods || []).filter(function (m) {
    return m.available !== false;
  });
  var selectedMethodId = availableMethods.length ? availableMethods[0].id : null;

  /** منطقة التوصيل المختارة — الافتراضي من الإعدادات. */
  var zones = (CONFIG && CONFIG.delivery && CONFIG.delivery.zones) || [];
  var selectedZoneId = (CONFIG && CONFIG.delivery && CONFIG.delivery.defaultZone) || (zones[0] && zones[0].id) || null;

  function activeZone() {
    return zones.filter(function (z) { return z.id === selectedZoneId; })[0] || zones[0] || null;
  }

  /**
   * الحساب كله من js/pricing-policy.js — لا تكرار هنا.
   * سبب وجود الملف: نفس المعادلة كانت مكتوبة في أربعة ملفات فتعارضت.
   */
  function policy() {
    return (typeof window !== 'undefined' && window.RawaaPricingPolicy) ? window.RawaaPricingPolicy : null;
  }

  /*
   * لا نسخة احتياطية محلية للسياسة.
   *
   * كان هنا سابقًا `return Number(zone.fee) || 0` — أي أن الملف يُعيد تطبيق
   * السياسة بنفسه إن غاب js/pricing-policy.js. هذا بالضبط مصدر التعارض: رقم
   * صحيح في ملف، ورقم قديم في آخر. الآن إن غاب المصدر نفشل بصوت مسموع بدل أن
   * نحسب بقاعدة ثانية. البديل الآمن المعلن صريح: بلا وحدة سياسة ⇒ بلا رسوم
   * وبلا خصم، وهو الاتجاه الذي لا يبالغ في تحصيل مبلغ من الزبونة.
   */
  function requirePolicy() {
    var api = policy();
    if (api) return api;
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('RAWAA: js/pricing-policy.js غير محمّل — التوصيل والخصم معطّلان حتى يُحمَّل.');
    }
    return null;
  }

  function isFreeDelivery(method, zone) {
    var api = requirePolicy();
    if (!api) return true;
    return api.isFreeDelivery(method, zone, CONFIG.delivery);
  }

  function deliveryFeeFor(method, zone) {
    var api = requirePolicy();
    if (!api) return 0;
    return api.deliveryFeeFor(method, zone, CONFIG.delivery);
  }

  /* ------------------------------ أدوات مساعدة ------------------------------ */

  function money(value) {
    var isInt = Math.abs(value - Math.round(value)) < 0.005;
    var formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: 2
    }).format(value);
    return CONFIG.currency.position === 'suffix' ? formatted + ' ' + CONFIG.currency.symbol.trim() : CONFIG.currency.symbol + formatted;
  }

  /** تحويل إلى سنتات لتجنّب أخطاء الفواصل العشرية في الجمع. */
  function toCents(value) { return Math.round(value * 100); }

  /* ------------------------------- العروض -------------------------------
     كل ما يخصّ العروض يُقرأ من CONFIG.offers عبر js/offers.js.
     لا رقم تسويقي مكتوب هنا. إن غاب الملف أو كانت الخانات فارغة،
     تعود كل الأسعار إلى سعر المنتج كما هو — لا خصم ولا خطأ. */

  var offersState = null;

  function offersEngine() {
    return (typeof window !== 'undefined' && window.RawaaOffers) ? window.RawaaOffers : null;
  }

  /** الخانات الصالحة اليوم + أسباب استبعاد الباقي (تُهمَل بصمت في الواجهة). */
  function liveOffers() {
    if (offersState) return offersState;
    var engine = offersEngine();
    if (!engine) {
      offersState = { date: '', slots: [], skipped: [] };
      return offersState;
    }
    var prices = {};
    CONFIG.products.forEach(function (p) { prices[p.id] = toCents(p.price); });
    offersState = engine.evaluate(CONFIG.offers, prices, engine.todayISO());
    return offersState;
  }

  /** سعر منتج واحد بعد عرضه الخاص إن وُجد. */
  function unitOffer(product) {
    var base = toCents(product.price);
    var engine = offersEngine();
    if (!engine) return { slot: null, listCents: base, cents: base, cutCents: 0 };
    var slot = engine.pick(liveOffers().slots, product.id);
    return engine.unitPrice(slot, base);
  }

  /** العرض غير المقيَّد بحجم — يُطبَّق على قيمة المنتجات كلها. */
  function orderOffer() {
    var engine = offersEngine();
    if (!engine) return null;
    return engine.pick(liveOffers().slots, null);
  }

  function offerBadge(slot) {
    var engine = offersEngine();
    return engine ? engine.badge(slot, CONFIG.currency.symbol) : '';
  }

  /** عروض العبوة (عبوة/عبوتان/ثلاث) المتاحة لهذا الحجم اليوم. */
  function bundleOffers(product, unitCents) {
    var engine = offersEngine();
    if (!engine) return [];
    return engine.bundlesFor(liveOffers().slots, product.id, toCents(product.price), CONFIG.offers);
  }

  /** أفضل تركيبة عبوات لكمية معيّنة بسعر الوحدة بعد عرض الحجم. */
  function planFor(product, qty, unitCents) {
    var engine = offersEngine();
    if (!engine) return { totalCents: unitCents * qty, listCents: unitCents * qty, cutCents: 0, singles: qty, sets: [] };
    return engine.bestPlan(qty, unitCents, bundleOffers(product, unitCents));
  }

  function bundleText(slot) {
    var engine = offersEngine();
    return engine ? engine.bundleText(slot, CONFIG.currency.symbol) : '';
  }

  function getProduct(id) {
    return CONFIG.products.filter(function (p) { return p.id === id; })[0] || null;
  }

  /** يضيف الحملة ونسخة المحتوى إلى رسالة واتساب إن وُجدتا؛ لا يثبت إرسالًا أو بيعًا. */
  function withSourceTag(text) {
    var note = typeof window.rawaaSourceNote === 'function' ? window.rawaaSourceNote() : '';
    if (!note) return text;
    return text + '\n\n' + note;
  }

  function waLink(text) {
    return 'https://wa.me/' + CONFIG.contact.whatsappNumber +
      (text ? '?text=' + encodeURIComponent(withSourceTag(text)) : '');
  }

  function announce(message) {
    if (!el.toastRegion) return;
    var toast = document.createElement('p');
    toast.className = 'toast';
    toast.textContent = message;
    el.toastRegion.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 3200);
  }


  /** يبني عنصر <picture> من إعدادات الصورة (AVIF ← WebP ← JPEG). */

  /* ------------------------------ بناء بطاقات المنتجات ------------------------------ */


  /* ------------------------ اختيار الحجم -----------------------------
     ثلاث عائلات مستقلة، والحجم خيار داخل كل عائلة، لا بديل عن اختيار المنتج.
     الاختيار يُخزَّن في selectedSize، وزر الإضافة يستخدمه. */

  var selectedSize = null;
  var selectedFamily = 'olive-panthenol';
  function familyProducts() {
    return CONFIG.products.filter(function (p) { return p.familyId === selectedFamily; });
  }
  function syncFormula() {
    var formula = CONFIG.formulas.filter(function (f) { return f.id === selectedFamily; })[0];
    if (!formula) return;
    var emblem = document.querySelector('[data-formula-emblem]');
    if (emblem) emblem.src = formula.emblem;
    var fields = { '[data-formula-title]': formula.name, '[data-formula-lead]': formula.description,
      '[data-formula-ingredients]': formula.ingredients, '[data-formula-usage]': formula.usage };
    Object.keys(fields).forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) { node.textContent = fields[selector]; });
    });
    document.querySelectorAll('[data-formula-select]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-formula-select') === selectedFamily));
    });
    // يُخبر وحدات العرض (بطاقة الملصق) بالمزيج الحالي دون اقتران مباشر بين الملفّين.
    document.dispatchEvent(new CustomEvent('rawaa:formula-change', { detail: { familyId: selectedFamily } }));
  }
  function renderFormulaPicker() {
    var requested = new URLSearchParams(window.location.search).get('product');
    var restored = selectedSize && getProduct(selectedSize);
    if (CONFIG.formulas.some(function (f) { return f.id === requested; })) {
      selectedFamily = requested;
      selectedSize = familyProducts()[1].id;
    } else if (restored && restored.familyId) selectedFamily = restored.familyId;
    var host = document.querySelector('[data-formula-options]');
    if (!host) return;
    host.textContent = '';
    CONFIG.formulas.forEach(function (formula) {
      var button = document.createElement('button');
      button.type = 'button'; button.className = 'btn btn-outline';
      button.textContent = formula.name; button.setAttribute('data-formula-select', formula.id);
      button.addEventListener('click', function () {
        var previous = selectedProduct(); var size = previous && previous.sizeMl;
        selectedFamily = formula.id;
        selectedSize = (familyProducts().filter(function (p) { return p.sizeMl === size; })[0] || familyProducts()[1]).id;
        renderSizePicker(); syncFormula(); saveChoices();
      });
      host.appendChild(button);
    });
    syncFormula();
  }

  function selectedProduct() {
    var choices = familyProducts();
    var id = selectedSize || (choices[1] && choices[1].id);
    return getProduct(id) || CONFIG.products[0];
  }

  /** رابط السؤال يتبع الاختيار دون فتح واتساب أو إرسال رسالة. */
  function updateSelectedInquiry(product) {
    var links = document.querySelectorAll('[data-wa-selected]');
    if (!links.length || !product) return;
    var deliveryNote = CONFIG.delivery && CONFIG.delivery.policy &&
      CONFIG.delivery.policy.alwaysFree === true
      ? ' والتوصيل مجاني لجميع المحافظات ولكل طرق الدفع.'
      : ' قبل احتساب رسوم التوصيل.';
    var lines = [
      'مرحبًا رواء، أود الاستفسار عن ' + product.name + ' بحجم ' + product.sizeLabel + '.',
      'سعر العبوة المعتمد: ' + money(unitOffer(product).cents / 100 + scentFee()) +
        (unitOffer(product).cutCents > 0 ? ' بعد عرض «' + unitOffer(product).slot.label + '» (' + money(product.price) + ' قبل العرض)' : '') +
        ' قبل الخصم.' + deliveryNote
    ];
    var cfg = CONFIG.customization || {};
    var scent = (cfg.scentOptions || []).filter(function (o) { return o.id === custom.scent; })[0];
    var oil = (cfg.oilAdditions || []).filter(function (o) { return o.id === custom.oil; })[0];
    if (scent) lines.push('العطر الذي أستفسر عنه: ' + scent.label + '.');
    if (oil) lines.push('إضافة الزيت المطلوب الاستفسار عنها: ' + oil.label + '.');
    lines.push('هل يمكن تأكيد التوفّر والسعر النهائي وموعد تجهيز العبوة والتوصيل؟');
    var href = waLink(lines.join('\n'));
    Array.prototype.forEach.call(links, function (link) { link.setAttribute('href', href); });
  }

  /** تُفتح الإجابة عند الوصول إليها بالاختصار، والرابط يعمل أيضًا دون نص برمجي. */
  function initProductShortcuts() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-expand-target]'), function (link) {
      link.addEventListener('click', function () {
        var id = (link.getAttribute('href') || '').replace(/^#/, '');
        var target = document.getElementById(id);
        if (target && target.tagName === 'DETAILS') target.open = true;
      });
    });
  }

  function renderSizePicker() {
    var host = document.querySelector('[data-size-options]');
    if (!host || !CONFIG.products.length) return;
    host.textContent = '';

    familyProducts().forEach(function (product, index) {
      var isDefault = index === 1 || familyProducts().length === 1;
      if (selectedSize === null && isDefault) selectedSize = product.id;

      var label = document.createElement('label');
      label.className = 'size-option' + (product.badge ? ' size-option--featured' : '');
      label.setAttribute('data-size-for', product.id);

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'rawaa-size';
      radio.value = product.id;
      radio.className = 'size-option-input';
      radio.checked = product.id === selectedSize;
      radio.addEventListener('change', function () {
        if (radio.checked) selectSize(product.id);
      });

      var body = document.createElement('span');
      body.className = 'size-option-body';

      var size = document.createElement('span');
      size.className = 'size-option-size';
      size.textContent = product.sizeLabel;

      var unit = unitOffer(product);
      var price = document.createElement('span');
      price.className = 'size-option-price';
      if (unit.cutCents > 0) {
        var was = document.createElement('s');
        was.className = 'size-option-was';
        was.textContent = money(product.price);
        var now = document.createElement('bdi');
        now.className = 'size-option-now';
        now.textContent = money(unit.cents / 100);
        price.appendChild(was);
        price.appendChild(document.createTextNode(' '));
        price.appendChild(now);
      } else {
        price.textContent = money(product.price);
      }

      body.appendChild(size);
      body.appendChild(price);

      if (unit.cutCents > 0) {
        var offerFlag = document.createElement('span');
        offerFlag.className = 'size-option-flag size-option-flag--offer';
        offerFlag.setAttribute('data-offer-flag', unit.slot.id || unit.slot.label);
        offerFlag.textContent = offerBadge(unit.slot) + ' · ' + unit.slot.label;
        body.appendChild(offerFlag);
      }

      // عرض العبوة: يظهر نصه على بطاقة الحجم كي تعرف الزبونة أن الكمية تغيّر السعر.
      var bundlesHere = bundleOffers(product, unit.cents);
      if (bundlesHere.length) {
        var bundleFlag = document.createElement('span');
        bundleFlag.className = 'size-option-flag size-option-flag--bundle';
        bundleFlag.setAttribute('data-bundle-flag', product.id);
        bundleFlag.textContent = bundleText(bundlesHere[0]);
        body.appendChild(bundleFlag);
      }

      if (product.badge) {
        var flag = document.createElement('span');
        flag.className = 'size-option-flag';
        flag.setAttribute('data-size-badge', product.id);
        flag.textContent = product.badge;
        body.appendChild(flag);
      }

      label.appendChild(radio);
      label.appendChild(body);
      host.appendChild(label);
    });

    syncSizeUI();
  }

  function selectSize(id) {
    if (!getProduct(id)) return;
    selectedSize = id;
    selectedFamily = getProduct(id).familyId;
    syncFormula();
    saveChoices();
    syncSizeUI();
  }

  function syncSizeUI() {
    if (!selectedSize) return;
    var product = selectedProduct();
    if (!product) return;

    Array.prototype.forEach.call(document.querySelectorAll('.size-option'), function (node) {
      var on = node.getAttribute('data-size-for') === selectedSize;
      node.classList.toggle('is-selected', on);
      var input = node.querySelector('input');
      if (input) input.checked = on;
    });

    var unit = unitOffer(product);
    var effectivePrice = unit.cents / 100;
    var priceNode = document.querySelector('[data-price-live]');
    if (priceNode) {
      if (unit.cutCents > 0) {
        priceNode.setAttribute('aria-label', 'سعر ' + product.sizeLabel + ': ' + money(effectivePrice) +
          ' بعد عرض «' + unit.slot.label + '» بدل ' + money(product.price) + '.');
      } else {
        priceNode.removeAttribute('aria-label');
      }
      priceNode.innerHTML = unit.cutCents > 0
        ? '<s>' + money(product.price) + '</s> <bdi>' + money(effectivePrice) + '</bdi> <span>' + product.sizeLabel + '</span>'
        : '<bdi>' + money(product.price) + '</bdi> <span>' + product.sizeLabel + '</span>';
    }

    var unitNode = document.querySelector('[data-unit-live]');
    if (unitNode && product.sizeMl && product.price) {
      // The label says pre-discount; effectivePrice may already include an active offer.
      var per = product.price / product.sizeMl;
      var unitDeliveryNote = CONFIG.delivery && CONFIG.delivery.policy && CONFIG.delivery.policy.alwaysFree === true
        ? ' تقريبًا لكل مل، قبل خصم الدفع؛ والتوصيل مجاني.'
        : ' تقريبًا لكل مل، قبل خصم الدفع والتوصيل.';
      unitNode.innerHTML = '<bdi>' + CONFIG.currency.symbol + (per >= 0.1 ? per.toFixed(2) : per.toFixed(3)) + '</bdi>' + unitDeliveryNote;
    }

    // صورة البطاقة تتبع الحجم المختار — ترى الزائنة العبوة التي تختارها فعلًا
    var img = document.querySelector('[data-size-img]');
    var srcAvif = document.querySelector('[data-size-avif]');
    var srcWebp = document.querySelector('[data-size-webp]');
    var base = product.image && product.image.base;
    if (img && base) {
      var widths = (product.image.widths || [480, 720, 900]);
      var setOf = function (ext) {
        var files = product.image[ext] || [];
        return widths.map(function (w, i) {
          return 'assets/img/products/' + files[i] + ' ' + w + 'w';
        }).join(', ');
      };
      if (srcAvif) srcAvif.setAttribute('srcset', setOf('avif'));
      if (srcWebp) srcWebp.setAttribute('srcset', setOf('webp'));
      img.setAttribute('src', product.image.src);
      img.setAttribute('alt', product.image.alt || ('تصوّر تصميمي لعبوة سيروم رواء ' + product.sizeLabel));
    }

    // زر الإضافة يتبع الحجم المختار — الـ id لا يُكتب في HTML
    Array.prototype.forEach.call(document.querySelectorAll('[data-add-current]'), function (btn) {
      btn.setAttribute('data-add-to-cart', selectedSize);
      if (btn.hasAttribute('data-requires-js')) btn.disabled = false;
    });
    updateSelectedInquiry(product);
    refreshOrderEstimate();
  }


  /* ---------------------------- التخصيص ------------------------------
     العطر والزيوت المضافة — تُحفظ في الذاكرة وتُرسل في رسالة واتساب.
     هذا هو التخصيص الذي نملكه فعلًا: القاعدة ثابتة، والاختيار حسّي. */
  var custom = { scent: '', oil: '', request: '' };

  function scentFee() {
    return custom.scent && custom.scent !== 'unscented' ? (CONFIG.customization.scentPrice || 0) : 0;
  }

  function setCustomRequest(value) {
    custom.request = typeof value === 'string' ? value.replace(/\u0000/g, '').slice(0, 500) : '';
    saveChoices();
    renderCustomSummary();
  }

  function setCustom(field, value) {
    if (field !== 'scent' && field !== 'oil') return;
    var cfg = CONFIG.customization || {};
    var options = field === 'scent' ? (cfg.scentOptions || []) : (cfg.oilAdditions || []);
    if (value && !options.some(function (o) { return o.id === value; })) return;
    custom[field] = value || '';
    saveChoices();
    syncCustomChips();
    renderCustomSummary();
    updateSelectedInquiry(selectedProduct());
    refreshOrderEstimate();
    if (el.items) renderCart();
  }

  function syncCustomChips() {
    ['scent', 'oil'].forEach(function (field) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-custom-' + field + ']'), function (chip) {
        var selected = chip.getAttribute('data-custom-' + field) === custom[field];
        chip.classList.toggle('is-selected', selected);
        chip.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    });
  }

  function renderCustomSummary() {
    var requestInput = document.querySelector('[data-custom-request]');
    if (requestInput && document.activeElement !== requestInput && requestInput.value !== custom.request) {
      requestInput.value = custom.request || '';
    }
    var requestSummary = document.querySelector('[data-custom-request-summary]');
    if (requestSummary) {
      requestSummary.textContent = custom.request
        ? 'ملاحظة التخصيص: ' + custom.request + ' — بانتظار تأكيد التوفّر والسعر.'
        : '';
    }
    var host = document.querySelector('[data-custom-summary]');
    if (!host) return;
    var parts = [];
    var cfg = CONFIG.customization || {};
    var chosenScent = null;
    if (custom.scent) {
      chosenScent = (cfg.scentOptions || []).filter(function (o) { return o.id === custom.scent; })[0];
      if (chosenScent) parts.push('العطر: ' + chosenScent.label);
    }
    if (custom.oil) {
      var ol = (cfg.oilAdditions || []).filter(function (o) { return o.id === custom.oil; })[0];
      if (ol) parts.push('إضافة: ' + ol.label + (ol.note ? ' — ' + ol.note : ''));
    }
    var note = chosenScent && chosenScent.note ? chosenScent.note : '';
    host.textContent = parts.length
      ? parts.join(' · ') + (note ? ' · ' + note : '')
      : 'العطر والإضافة اختياريان — نؤكد الخيارات المتاحة في واتساب.';
  }

  /* ------------------------------ السلة ------------------------------ */

  function cartEntries() {
    return Object.keys(cart)
      .map(function (id) {
        var product = getProduct(id);
        return product ? { product: product, qty: cart[id] } : null;
      })
      .filter(Boolean);
  }

  function getMethod(id) {
    return availableMethods.filter(function (m) { return m.id === id; })[0] || availableMethods[0] || null;
  }

  function activeMethod() { return getMethod(selectedMethodId); }

  /**
   * حساب مشترك للسلة وتقدير العبوة الواحدة؛ الأرقام كلها بالسنتات.
   * `discountBaseCents` يساوي إجمالي الطلب المؤهل بعد العروض، بما فيه الإضافات المسعّرة؛
   * لا يدخل التوصيل في أساس الخصم.
   * النص المعلن في CONFIG.payment يحدد خصمًا على إجمالي الطلب المؤهل.
   */
  function calculateAmounts(subtotalCents, discountBaseCents, count, method, zone) {
    var api = requirePolicy();
    var discountCents = api ? api.discountCentsFor(method, discountBaseCents) : 0;
    var deliveryCents = (method && count > 0) ? toCents(deliveryFeeFor(method, zone)) : 0;
    return {
      subtotalCents: subtotalCents,
      discountCents: discountCents,
      deliveryCents: deliveryCents,
      totalCents: subtotalCents - discountCents + deliveryCents
    };
  }

  /**
   * محرّك الحساب: قيمة المنتجات ← الخصم ← رسوم التوصيل ← الإجمالي التقديري.
   * كل الأرقام بالسنتات لتفادي أخطاء الفواصل العشرية.
   * الخصم والرسوم تأتيان من CONFIG.payment — لا قيمة مكتوبة يدويًا هنا.
   */
  function pricing() {
    var entries = cartEntries();
    var listCents = 0;      // قيمة المنتجات بأسعارها المعلنة
    var productCents = 0;   // بعد عروض الأحجام
    var scentTotalCents = 0;
    var offerCents = 0;
    var appliedOffers = [];
    var count = 0;
    var scentUnitCents = toCents(scentFee());

    entries.forEach(function (entry) {
      var unit = unitOffer(entry.product);
      // عرض العبوة يعمل على كمية الحجم نفسه: 2 أو 3 بسعر واحد، والباقي بسعره.
      var plan = planFor(entry.product, entry.qty, unit.cents);
      listCents += toCents(entry.product.price) * entry.qty;
      productCents += plan.totalCents;
      scentTotalCents += scentUnitCents * entry.qty;
      var cut = unit.cutCents * entry.qty + plan.cutCents;
      if (cut > 0) {
        offerCents += cut;
        if (unit.cutCents > 0) appliedOffers.push({ slot: unit.slot, cents: unit.cutCents * entry.qty });
        plan.sets.forEach(function (set) {
          // وفّر فرق سعر المجموعة عن سعر وحداتها المفردة، مضروبًا بعدد المجموعات.
          var perSet = Math.round(Number(set.slot.qty) * unit.cents) - toCents(set.slot.value);
          appliedOffers.push({ slot: set.slot, cents: perSet * set.count, count: set.count });
        });
      }
      count += entry.qty;
    });

    // العرض العام يُطبَّق على قيمة المنتجات وحدها — لا على إضافة العطر ولا التوصيل.
    var generalSlot = orderOffer();
    if (generalSlot && productCents > 0) {
      var generalCut = offersEngine().orderCut(generalSlot, productCents);
      if (generalCut > 0) {
        productCents -= generalCut;
        offerCents += generalCut;
        appliedOffers.push({ slot: generalSlot, cents: generalCut });
      }
    }

    var method = activeMethod();
    var zone = activeZone();
    // العرض أولًا، ثم خصم شام كاش على إجمالي المنتجات والتخصيصات المسعّرة.
    var eligibleTotalCents = productCents + scentTotalCents;
    var amounts = calculateAmounts(eligibleTotalCents, eligibleTotalCents, count, method, zone);

    return {
      entries: entries,
      count: count,
      // قيمة الطلب المعروضة = أسعار المنتجات المعلنة + التخصيصات المسعّرة،
      // كي تُقرأ المعادلة في السلة كما هي: القيمة − العرض − الخصم + التوصيل = المجموع.
      listCents: listCents + scentTotalCents,
      offerCents: offerCents,
      appliedOffers: appliedOffers,
      subtotalCents: amounts.subtotalCents,
      discountCents: amounts.discountCents,
      deliveryCents: amounts.deliveryCents,
      totalCents: amounts.totalCents,
      method: method,
      zone: zone,
      freeDelivery: isFreeDelivery(method, zone)
    };
  }

  /** واجهة مبسّطة بالقيم العشرية — تُستخدم في العرض والاختبارات. */
  function totals() {
    var p = pricing();
    return {
      cents: p.totalCents,
      amount: p.totalCents / 100,
      count: p.count,
      entries: p.entries,
      method: p.method,
      zone: p.zone,
      freeDelivery: p.freeDelivery,
      subtotal: p.listCents / 100,
      net: p.subtotalCents / 100,
      offer: p.offerCents / 100,
      appliedOffers: p.appliedOffers,
      discount: p.discountCents / 100,
      delivery: p.deliveryCents / 100
    };
  }

  /** حاسبة منتج واحد؛ خياراتها هي خيارات السلة نفسها وليست طلبًا مؤكدًا. */
  function initOrderEstimate() {
    var box = document.querySelector('[data-order-estimate]');
    if (!box || !zones.length || !availableMethods.length || !selectedProduct() || !activeZone() || !activeMethod()) return;
    if (box.getAttribute('data-ready') === 'true') { refreshOrderEstimate(); return; }
    var zoneSelect = box.querySelector('[data-estimate-zone]');
    var methodSelect = box.querySelector('[data-estimate-method]');
    var controls = box.querySelector('[data-estimate-interface]');
    var fallback = box.querySelector('[data-estimate-fallback]');
    if (!zoneSelect || !methodSelect || !controls || !fallback) return;
    zones.forEach(function (zone) {
      var opt = document.createElement('option');
      opt.value = zone.id;
      opt.textContent = zone.label;
      zoneSelect.appendChild(opt);
    });
    availableMethods.forEach(function (method) {
      var opt = document.createElement('option');
      opt.value = method.id;
      opt.textContent = method.short || method.label;
      methodSelect.appendChild(opt);
    });
    zoneSelect.addEventListener('change', function () { setZone(zoneSelect.value, true); });
    methodSelect.addEventListener('change', function () { setMethod(methodSelect.value, true); });
    box.setAttribute('data-ready', 'true');
    refreshOrderEstimate();
    fallback.hidden = true;
    controls.hidden = false;
  }

  function refreshOrderEstimate() {
    var box = document.querySelector('[data-order-estimate]');
    if (!box || box.getAttribute('data-ready') !== 'true') return;
    var product = selectedProduct();
    var zone = activeZone();
    var method = activeMethod();
    if (!product || !zone || !method) return;
    var estimateTotalCents = unitOffer(product).cents + toCents(scentFee());
    var amounts = calculateAmounts(estimateTotalCents, estimateTotalCents, 1, method, zone);
    box.querySelector('[data-estimate-zone]').value = zone.id;
    box.querySelector('[data-estimate-method]').value = method.id;
    box.querySelector('[data-estimate-context]').textContent = product.sizeLabel + ' · ' + zone.label + ' · ' + (method.short || method.label);
    box.querySelector('[data-estimate-total]').textContent = money(amounts.totalCents / 100);
    box.querySelector('[data-estimate-subtotal]').textContent = money(amounts.subtotalCents / 100);
    box.querySelector('[data-estimate-discount]').textContent = amounts.discountCents > 0 ? '− ' + money(amounts.discountCents / 100) : 'لا يوجد';
    box.querySelector('[data-estimate-delivery]').textContent = amounts.deliveryCents > 0 ? money(amounts.deliveryCents / 100) : 'مجاني';
    var oilNote = box.querySelector('[data-estimate-oil-note]');
    if (oilNote) oilNote.hidden = !custom.oil;
  }

  function clampQty(qty) {
    return Math.max(MIN_QTY, Math.min(MAX_QTY, Math.floor(qty) || MIN_QTY));
  }

  function renderCart() {
    var summary = totals();
    var focus = document.activeElement;
    var focusKey = null;
    var focusValue = null;
    if (el.dialog && el.dialog.open && focus && el.dialog.contains(focus)) {
      ['data-zone-select', 'data-pay-select', 'data-qty-increase', 'data-qty-decrease', 'data-remove-item']
        .some(function (key) {
          if (!focus.hasAttribute(key)) return false;
          focusKey = key;
          focusValue = focus.getAttribute(key);
          return true;
        });
    }

    // الشارة
    if (el.count) {
      if (summary.count > 0) {
        el.count.hidden = false;
        el.count.textContent = String(summary.count);
      } else {
        el.count.hidden = true;
        el.count.textContent = '0';
      }
      var countButton = el.count.closest('[data-cart-open]');
      if (countButton) countButton.setAttribute('aria-label', summary.count > 0
        ? 'فتح سلة المشتريات، ' + summary.count + ' في السلة'
        : 'فتح سلة المشتريات، السلة فارغة');
    }

    // عناصر السلة
    el.items.textContent = '';
    summary.entries.forEach(function (entry) {
      el.items.appendChild(buildCartItem(entry.product, entry.qty));
    });

    var isEmpty = summary.count === 0;
    el.empty.hidden = !isEmpty;
    el.foot.hidden = isEmpty;
    if (el.orderOptions) el.orderOptions.hidden = isEmpty;

    if (!isEmpty) {
      renderZones();
      renderPaymentMethods();
      renderSummary(summary);
    }
    renderCartCustomSummary(isEmpty);

    // زر «مشاركة السلة»
    if (el.shareBtn) {
      var shareUrl = summary.count > 0 ? cartShareLink() : '';
      el.shareBtn.hidden = !shareUrl;
      if (shareUrl) el.shareBtn.setAttribute('data-share-url', shareUrl);
    }

    // شريط السلة اللاصق على الهاتف — يُحسب أولًا، لأن شريط الشراء المبكّر
    // يعتمد عليه في تحديد موضعه (كانا يتراكبان على الشاشات الصغيرة).
    if (el.stickyBar) {
      if (!isEmpty && !(el.dialog && el.dialog.open)) {
        el.stickyBar.hidden = false;
        document.body.classList.add('has-sticky-bar');
        if (el.stickyCount) el.stickyCount.textContent = String(summary.count);
        if (el.stickyTotal) el.stickyTotal.textContent = money(summary.amount);
      } else {
        el.stickyBar.hidden = true;
        document.body.classList.remove('has-sticky-bar');
      }
    }

    // شريط الشراء المبكّر (قبل وجود أي منتج)
    updateShopBar(isEmpty);

    // إعادة بناء رابط واتساب وزر النسخ
    if (el.fallbackLink && !isEmpty) {
      el.fallbackLink.setAttribute('href', waLink(buildOrderMessage()));
    }
    if (el.copyText) el.copyText.value = isEmpty ? '' : withSourceTag(buildOrderMessage());
    if (el.copyStatus) el.copyStatus.textContent = '';
    if (isEmpty && el.copyManual) el.copyManual.hidden = true;
    refreshOrderEstimate();
    fitCartFooter();

    // إعادة بناء خيارات السلة لا يجب أن تُخرج مستخدمة لوحة المفاتيح من الحوار.
    if (focusKey && el.dialog && el.dialog.open) {
      var findFocus = function (key) {
        return Array.prototype.filter.call(el.dialog.querySelectorAll('[' + key + ']'), function (node) {
          return node.getAttribute(key) === focusValue && !node.disabled;
        })[0];
      };
      var replacement = findFocus(focusKey);
      if (!replacement && focusKey === 'data-qty-increase') replacement = findFocus('data-qty-decrease');
      if (!replacement && focusKey === 'data-qty-decrease') replacement = findFocus('data-qty-increase');
      if (!replacement && focusKey === 'data-remove-item') replacement = el.closeBtn;
      if (replacement) {
        try { replacement.focus({ preventScroll: true }); } catch { replacement.focus(); }
      }
    }
  }

  /** اختيارات العطر والإضافة استفسار للطلب كله، لا حجز أو ضمان توفر. */
  function renderCartCustomSummary(isEmpty) {
    if (!el.cartCustomSummary) return;
    var cfg = CONFIG.customization || {};
    var scent = (cfg.scentOptions || []).filter(function (o) { return o.id === custom.scent; })[0];
    var oil = (cfg.oilAdditions || []).filter(function (o) { return o.id === custom.oil; })[0];
    var parts = [];
    if (scent) parts.push('العطر: ' + scent.label);
    if (oil) parts.push('إضافة زيت: ' + oil.label + ' (السعر غير مشمول في الإجمالي، ونؤكده عبر واتساب قبل الاعتماد)');
    el.cartCustomSummary.hidden = isEmpty || !parts.length;
    el.cartCustomSummary.textContent = parts.length
      ? 'للاستفسار عن الطلب ككل: ' + parts.join(' · ') + '؛ نؤكد التوفّر في واتساب.'
      : '';
  }

  /** صفوف الملخّص: قيمة المنتجات، الخصم، التوصيل، الإجمالي التقديري. */
  function renderSummary(summary) {
    var method = summary.method;

    if (el.subtotal) el.subtotal.textContent = money(summary.subtotal);
    if (el.subtotalRow) el.subtotalRow.hidden = false;

    // صف العرض: يظهر فقط حين يعمل عرض فعلي، ويشرح الفرق بين السعر المعلن والمدفوع.
    if (el.offerRow) {
      if (summary.offer > 0 && summary.appliedOffers.length) {
        el.offerRow.hidden = false;
        if (el.offerValue) el.offerValue.textContent = '− ' + money(summary.offer);
        if (el.offerLabel) {
          var labels = [];
          summary.appliedOffers.forEach(function (o) {
            if (labels.indexOf(o.slot.label) === -1) labels.push(o.slot.label);
          });
          el.offerLabel.textContent = 'عرض: ' + labels.join(' · ');
        }
      } else {
        el.offerRow.hidden = true;
      }
    }

    if (el.discountRow) {
      if (summary.discount > 0) {
        el.discountRow.hidden = false;
        if (el.discountValue) {
          el.discountValue.textContent = '− ' + money(summary.discount);
        }
        if (el.discountLabel && method) {
          el.discountLabel.textContent = 'خصم ' + method.short + ' (' + (method.discountPercent || 0) + '%)';
        }
      } else {
        el.discountRow.hidden = true;
      }
    }

    if (el.zoneLabel && summary.zone) {
      el.zoneLabel.textContent = 'منطقة التوصيل: ' + summary.zone.label;
    }

    if (el.deliveryRow) {
      if (summary.freeDelivery) {
        el.deliveryRow.hidden = false;
        if (el.deliveryValue) el.deliveryValue.textContent = 'مجاني';
      } else if (summary.delivery > 0) {
        el.deliveryRow.hidden = false;
        if (el.deliveryValue) el.deliveryValue.textContent = money(summary.delivery);
      } else {
        el.deliveryRow.hidden = true;
      }
    }

    if (el.total) el.total.textContent = money(summary.amount);
    if (el.cartContext) {
      el.cartContext.textContent = [summary.zone && summary.zone.label, method && (method.short || method.label)]
        .filter(Boolean).join(' · ');
    }

    // ملاحظة هامش داخلية: تعمل فقط عند توفر تقديرات التكلفة (تشغيل من المصدر).
    // نسخة النشر تُنظَّف من `costing`، فلا تُحسب ملاحظة بهامش مفترض صفر.
    if (el.marginNote && CONFIG.costing && summary.count > 0 && summary.zone && summary.method) {
      var c = CONFIG.costing;
      // التكلفة ثابتة لكل عبوة بغضّ النظر عن الحجم (من المالك) — نأخذ الحد الأعلى
      var costOfUnit = function () {
        return c ? (c.unitCostMax || c.unitCostMin || 0) : 0;
      };
      // التوصيل مجاني على الزبونة، لكنه ليس مجانيًا على المالك:
      // costing.shippingCostPerOrder هو ما يدفعه هو عن الطلب.
      var shippingCost = Number(c.shippingCostPerOrder) || 0;
      var worst = null;
      summary.entries.forEach(function (e) {
        var net = unitOffer(e.product).cents / 100 * (1 - (summary.method.discountPercent || 0) / 100);
        var profit = net - summary.delivery - costOfUnit() - shippingCost;
        if (profit <= 0 && (!worst || profit < worst.profit)) {
          worst = { size: e.product.sizeLabel, profit: profit };
        }
      });
      if (worst) {
        el.marginNote.hidden = false;
        el.marginNote.textContent =
          'ملاحظة: الحجم ' + worst.size + ' في هذه المنطقة لا يغطي تكلفته مع هذه الطريقة. ' +
          'يمكن اختيار «الدفع عند الاستلام»، أو طلب حجم أكبر، أو إضافة حجم آخر — ' +
          'وسنؤكد لك السعر النهائي في المحادثة.';
      } else {
        el.marginNote.hidden = true;
      }
    } else if (el.marginNote) {
      el.marginNote.hidden = true;
    }

    if (el.totalNote) {
      el.totalNote.textContent = method
        ? 'الإجمالي التقديري بطريقة «' + method.label + '». الأسعار تُؤكَّد في المحادثة قبل الشحن.'
        : 'الأسعار تُؤكَّد في المحادثة قبل الشحن.';
    }
  }





  /** هل السلة فارغة الآن؟ */
  function cartIsEmpty() {
    return !cart || Object.keys(cart).length === 0;
  }

  /**
   * شريط الشراء المبكّر — يظهر حين: (١) الشاشة هاتف، (٢) السلة فارغة،
   * (٣) تجاوزت الزائرة قسم الأحجام. الغرض: مسار شراء دائم الظهور بلا تمرير طويل.
   * يُخفى فور وجود أي منتج في السلة (يحلّ محلّه الشريط اللاصق الكامل).
   */
  function updateShopBar(isEmpty) {
    var bar = document.querySelector('[data-shop-bar]');
    if (!bar) return;
    var productsSection = document.getElementById('products');
    if (!productsSection) { bar.hidden = true; return; }

    var isPhone = window.matchMedia('(max-width: 899px)').matches;
    var passed = productsSection.getBoundingClientRect().bottom < 0;
    var show = isPhone && isEmpty && passed;

    bar.hidden = !show;
    document.body.classList.toggle('has-shop-bar', show);
    // الحالة تُعاد لكل شاشة عرض: تغيير الحجم بين هاتف وسطح مكتب كان يترك
    // حالة قديمة على <body> فتبقى مساحة محجوزة أسفل الصفحة بلا سبب.
    document.body.classList.toggle('has-sticky-bar', !isEmpty);
  }

  /**
   * حاسبة التوصيل — تعرض الإجمالي النهائي لحجم 50 مل بحسب المحافظة وطريقة الدفع.
   * تستخدم نفس دوال التسعير المستخدمة في السلة، فلا يمكن أن يختلف الرقمان.
   */
  function renderCalculator() {
    var box = document.querySelector('[data-calc]');
    if (!box) return;

    var govSel = box.querySelector('[data-calc-gov]');
    var paySel = box.querySelector('[data-calc-pay]');
    var outSub = box.querySelector('[data-calc-sub]');
    var outDisc = box.querySelector('[data-calc-disc]');
    var outDeliv = box.querySelector('[data-calc-deliv]');
    var outTotal = box.querySelector('[data-calc-total]');
    var outNote = box.querySelector('[data-calc-note]');
    if (!govSel || !paySel) return;

    var sample = CONFIG.products[1] || CONFIG.products[0];
    if (!sample) return;

    // املأ المحافظات من الإعدادات
    if (govSel.options.length <= 2 && CONFIG.delivery && CONFIG.delivery.governorates) {
      govSel.innerHTML = '';
      CONFIG.delivery.governorates.forEach(function (name) {
        var opt = document.createElement('option');
        var isHama = name === 'حماة';
        opt.value = isHama ? 'hama' : 'other';
        opt.textContent = name;
        if (isHama) opt.selected = true;
        govSel.appendChild(opt);
      });
    }

    function update() {
      var zoneId = govSel.value;
      var methodId = paySel.value;
      var method = CONFIG.payment.methods.filter(function (m) { return m.id === methodId; })[0];
      var zone = CONFIG.delivery.zones.filter(function (z) { return z.id === zoneId; })[0];
      if (!method || !zone) return;

      var sampleUnit = unitOffer(sample);
      var sampleTotalCents = sampleUnit.cents + toCents(scentFee());
      var amounts = calculateAmounts(sampleTotalCents, sampleTotalCents, 1, method, zone);

      outSub.textContent = money(sampleUnit.cents / 100) + (sampleUnit.cutCents > 0 ? ' (بدل ' + money(sample.price) + ')' : '');
      outDisc.textContent = amounts.discountCents > 0
        ? '− ' + money(amounts.discountCents / 100) + ' (' + method.discountPercent + '%)'
        : 'لا يوجد';
      outDeliv.textContent = amounts.deliveryCents > 0 ? money(amounts.deliveryCents / 100) : 'مجاني';
      outTotal.textContent = money(amounts.totalCents / 100);

      // النسبة من الإعدادات لا مكتوبة هنا: كان النص يقول «10%» حرفيًا بينما
      // الرقم الفعلي في js/config.js. تغييره هناك كان سيترك النص يكذب.
      var note = '';
      var percent = Number(method.discountPercent) || 0;
      if (percent > 