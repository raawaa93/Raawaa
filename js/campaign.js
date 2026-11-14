/* صفحة هبوط للحملات: المحتوى من قائمة زوايا موثوقة والأسعار من config.js فقط. */
(function () {
  'use strict';

  var config = window.RAWAA_CONFIG;
  if (!config) return;

  var angles = {
    benefit: {
      kicker: 'رواء · ثلاثة مزيجات للعناية بالشعر',
      title: 'اختاري مزيجك. عناية أبسط.',
      lead: 'ثلاثة مزيجات من الزيوت للعناية بمظهر الشعر الباهت والمتطاير، مع لمعة لطيفة. لكل مزيج أحجام 30 و50 و100 مل.'
    },
    order_steps: {
      kicker: 'رواء · كل خطوة واضحة',
      title: 'اختاري المزيج والحجم، راجعي الإجمالي، ثم أرسلي استفسارك',
      lead: 'الأسعار بالليرة السورية ومعتمدة. خصم 10% على إجمالي الطلب المؤهل عند الدفع عبر شام كاش فقط، والتوصيل مجاني لجميع المحافظات.'
    },
    reference_prices: {
      kicker: 'رواء · ثلاثة مزيجات وتسعة خيارات بالحجم',
      title: 'قارني المزيجات والأحجام قبل أن تختاري',
      lead: 'الأسعار المعتمدة بالليرة السورية لكل مزيج وحجم. خصم 10% على إجمالي الطلب المؤهل عند الدفع عبر شام كاش فقط، والتوصيل مجاني لجميع المحافظات.'
    },
    size_guide: {
      kicker: 'رواء · اختاري على مهل',
      title: 'اختاري المزيج والحجم اللذين يناسبانك',
      lead: 'قارني المزيجات والأحجام والأسعار المعتمدة بالليرة السورية. خصم 10% على إجمالي الطلب المؤهل عند الدفع عبر شام كاش فقط، والتوصيل مجاني لجميع المحافظات.'
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
    var visual = document.createElement('figure');
    visual.className = 'campaign-product-visual';
    var image = document.createElement('img');
    image.src = product.image && product.image.src ? product.image.src : '';
    image.alt = product.image && product.image.alt ? product.image.alt : (product.name || 'مزيج رواء');
    image.loading = 'lazy';
    image.decoding = 'async';
    var caption = document.createElement('figcaption');
    caption.textContent = 'تصوّر تصميمي للعبوة؛ ليس صورة للمنتج الفعلي.';
    visual.append(image, caption);
    var content = document.createElement('div');
    content.className = 'campaign-product-copy';
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
    unit.textContent = formatMoney(product.price / product.sizeMl) + ' لكل مل تقريبًا · السعر الأساسي';
    var link = document.createElement('a');
    link.href = productUrl(source, product.familyId);
    link.textContent = 'راجعي هذا المزيج والحجم';
    content.append(title, price, meta, unit, link);
    card.append(visual, content);
    return card;
  }

  /**
   * الخلطات الحالية تحتوي زيوتًا وعطرًا؛ يمكن طلب تعديلها، ويُؤكد التوفّر والسعر قبل الاعتماد.
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
    if (addon) addon.textContent = 'تحتوي المزيجات الحالية على زيوت وعطر. أي تعديل إضافي يُؤكّد توفره وسعره قبل الاعتماد.';
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
    var message = config.order.greeting + ' أرغب بالاستفسار عن المزيجات والأحجام والتوفّر.';
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
        var discount = method.discountPercent ? ' · خصم ' + method.discountPercent + '% على إجمالي الطلب المؤهل' : ' · لا يشمل خصم شام كاش';
        var deliveryText = fee === 0 ? 'توصيل مجاني' : 'توصيل ' + formatMoney(fee);
        item.textContent = method.label + ' — ' + zone.label + ': ' + deliveryText + discount + '.';
        list.append(item);
      });
    });
    delivery.replaceChildren(heading, list);
  }
})();
