/* صفحة هبوط للحملات: المحتوى من قائمة زوايا موثوقة والأسعار من config.js فقط. */
(function () {
  'use strict';

  var config = window.RAWAA_CONFIG;
  if (!config) return;

  var angles = {
    benefit: {
      kicker: 'رواء · لمسة أخيرة في روتينك',
      title: 'لمسة تشطيب لمظهر أنعم ولمعان لطيف',
      lead: 'لأيام الشعر الباهت أو المتطاير، خطوة بسيطة تكمّل إطلالتك. يختلف الإحساس والمظهر بحسب طبيعة الشعر والكمية.'
    },
    order_steps: {
      kicker: 'رواء · كل خطوة واضحة',
      title: 'اختاري الحجم، راجعي التفاصيل، ثم أرسلي استفسارك',
      lead: 'شاهدي الأسعار المرجعية والتقدير حسب المنطقة وطريقة الدفع. لا دفع في الموقع، ولا يُرسل واتساب الرسالة تلقائيًا.'
    },
    reference_prices: {
      kicker: 'رواء · ثلاثة أحجام بسعر واضح',
      title: 'قارني الأحجام قبل أن تختاري',
      lead: 'الأسعار المرجعية ظاهرة لكل حجم، بلا عطر ولا توصيل. يؤكد المالك التوفر والسعر النهائي والتفاصيل في المحادثة.'
    },
    size_guide: {
      kicker: 'رواء · ثلاثة أحجام واضحة',
      title: 'اختاري الحجم الذي يناسبك بهدوء',
      lead: 'قارني كمية كل حجم وسعره المرجعي؛ الأسعار للمنتج قبل العطر والتوصيل، ويُؤكّد التوفر والتفاصيل في المحادثة.'
    }
  };

  function cleanTag(value, limit) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return '';
    return value.slice(0, limit);
  }

  var query = new URLSearchParams(window.location.search);
  var source = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
    var safe = cleanTag(query.get(key), key === 'utm_campaign' ? 120 : 80);
    if (safe) source[key] = safe;
  });
  var angle = angles[source.utm_content] || angles.benefit;
  document.querySelector('[data-campaign-kicker]').textContent = angle.kicker;
  document.querySelector('[data-campaign-title]').textContent = angle.title;
  document.querySelector('[data-campaign-lead]').textContent = angle.lead;
  document.documentElement.setAttribute('data-campaign-angle', source.utm_content || 'default');

  function formatMoney(value) {
    var amount = Number(value);
    // فاصل الآلاف ضروري بالليرة السورية: 2400 لا 2400 بلا فاصل تُقرأ خطأً.
    var isInt = Math.abs(amount - Math.round(amount)) < 0.005;
    return config.currency.symbol + amount.toLocaleString('en-US', {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * بطاقة الحملة تعرض المنتج **والحجم** معًا (2026-11-08): الكتالوج ثلاثة
   * منتجات × ثلاثة أحجام، فعنوان «30 مل» وحده يتكرّر ثلاث مرات بلا تمييز،
   * والرابط يجب أن يفتح المزيج الصحيح لا المزيج الافتراضي.
   */
  function productCard(product) {
    var card = document.createElement('article');
    card.className = 'campaign-product-card';
    card.setAttribute('data-product-id', product.id);
    card.setAttribute('data-family-id', product.familyId || '');
    var formula = (config.formulas || []).filter(function (f) { return f.id === product.familyId; })[0];
    var title = document.createElement('h3');
    title.textContent = product.name ? product.name + ' · ' + product.sizeLabel : product.sizeLabel;
    var price = document.createElement('p');
    price.className = 'campaign-product-price';
    price.dir = 'auto';
    price.textContent = formatMoney(product.price);
    var meta = document.createElement('p');
    meta.className = 'campaign-product-meta';
    meta.textContent = (formula && formula.lead) || product.note || '';
    var unit = document.createElement('p');
    unit.className = 'campaign-product-unit';
    unit.textContent = formatMoney(product.price / product.sizeMl) + ' لكل مل تقريبًا · قبل الخصم والتوصيل';
    var link = document.createElement('a');
    link.href = productUrl(source, product.familyId);
    link.textContent = 'راجعي هذا المزيج والحجم';
    card.append(title, price, meta, unit, link);
    return card;
  }

  /**
   * لا خيار عطر ولا رسم عطر: المنتجات خلطات مستقلة جاهزة (2026-11-08).
   * إن عاد الخيار للإعدادات لاحقًا يظهر تلقائيًا؛ وإن غاب تُعلن الصفحة ذلك
   * صراحةً بدل ترك خانة قديمة برقم مختلق.
   */
  var scentPrice = config.customization && Number(config.customization.scentPrice);
  var addon = document.querySelector('[data-campaign-addon]');
  var faqScent = document.querySelector('[data-campaign-scent-price]');
  if (Number.isFinite(scentPrice) && scentPrice > 0) {
    var scentPriceText = formatMoney(scentPrice);
    if (addon) addon.textContent = 'إضافة العطر ' + scentPriceText + ' لكل عبوة.';
    if (faqScent) faqScent.textContent = scentPriceText;
  } else {
    if (addon) addon.textContent = 'منتجات جاهزة بلا إضافات عطر أو زيوت، فلا تُضاف رسوم إضافية.';
    if (faqScent) faqScent.textContent = 'لا تُضاف';
  }

  function productUrl(tags, familyId) {
    var url = new URL('/serum', window.location.origin);
    Object.keys(tags).forEach(function (key) {
      url.searchParams.set(key, tags[key]);
    });
    // المزيج المطلوب يُحدَّد في الرابط، كي لا تفتح كل البطاقات المزيج الافتراضي.
    if (familyId) url.searchParams.set('product', familyId);
    url.hash = 'products';
    return url.pathname + url.search + url.hash;
  }

  var grid = document.querySelector('[data-campaign-products]');
  if (grid && Array.isArray(config.products)) {
    grid.replaceChildren();
    config.products.forEach(function (product) { grid.append(productCard(product)); });
  }

  document.querySelectorAll('a[href="/serum#products"]').forEach(function (link) {
    link.href = productUrl(source);
  });

  var whatsappLink = document.querySelector('[data-campaign-whatsapp]');
  if (whatsappLink && /^\d{8,15}$/.test(config.contact.whatsappNumber)) {
    var message = config.order.greeting + ' أريد الاستفسار عن السيروم والتوفر والتوصيل.';
    var attribution = [];
    if (source.utm_campaign) attribution.push('المصدر: ' + source.utm_campaign);
    if (source.utm_content && angles[source.utm_content]) attribution.push('نسخة المحتوى: ' + source.utm_content);
    if (attribution.length) message += ' (' + attribution.join(' · ') + ')';
    whatsappLink.href = 'https://wa.me/' + config.contact.whatsappNumber + '?text=' + encodeURIComponent(message);
    whatsappLink.setAttribute('data-wa-direct', '');
    whatsappLink.setAttribute('rel', 'noopener');
  }

  var delivery = document.querySelector('[data-campaign-delivery]');
  if (delivery && config.delivery && Array.isArray(config.delivery.zones) && Array.isArray(config.payment.methods)) {
    var heading = document.createElement('h3');
    heading.textContent = 'خيارات الدفع والتوصيل';
    var list = document.createElement('ul');
    config.payment.methods.forEach(function (method) {
      config.delivery.zones.forEach(function (zone) {
        var item = document.createElement('li');
        var policy = window.RawaaPricingPolicy;
        var fee = policy ? policy.deliveryFeeFor(method, zone, config.delivery) : 0;
        var discount = method.discountPercent ? ' · خصم ' + method.discountPercent + '% على المنتجات' : ' · بلا خصم';
        var deliveryText = fee === 0 ? 'توصيل مجاني' : 'توصيل ' + formatMoney(fee);
        item.textContent = method.label + ' — ' + zone.label + ': ' + deliveryText + discount + '.';
        list.append(item);
      });
    });
    delivery.replaceChildren(heading, list);
  }
})();
