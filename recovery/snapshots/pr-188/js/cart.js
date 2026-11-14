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
    var requested = new