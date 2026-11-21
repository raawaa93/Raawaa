/* RAWAA | رواء — إعدادات عامة للنشر. المصدر الكامل: js/config.js في المستودع. */
(function () {
  'use strict';
  function deepFreeze(value) {
    Object.getOwnPropertyNames(value).forEach(function (key) {
      var prop = value[key];
      if (prop && typeof prop === 'object' && !Object.isFrozen(prop)) deepFreeze(prop);
    });
    return Object.freeze(value);
  }
  window.RAWAA_CONFIG = deepFreeze({
  "brand": {
    "latinName": "RAWAA",
    "arabicName": "رواء",
    "tagline": "لمعان يُرى، ونعومة تُلمَس",
    "shortDescription": "ثلاثة مزيجات للعناية بالشعر: روزماري وكافيين، زيت الزيتون والبانثينول، وخروع مع زيوت مختارة.",
    "city": "حماة",
    "country": ""
  },
  "contact": {
    "whatsappNumber": "963997310856",
    "displayNumber": "0997310856",
    "hoursNote": "للاستفسارات ومتابعة الطلب، تواصلي معنا عبر واتساب."
  },
  "currency": {
    "code": "SYP",
    "symbol": "ل.س ",
    "arabicLabel": "ليرة سورية",
    "position": "prefix"
  },
  "formulas": [
    {
      "id": "rosemary-caffeine",
      "emblem": "assets/img/products/rosemary-caffeine-emblem.svg",
      "name": "روزماري وكافيين",
      "lead": "روزماري وكافيين في مزيج واحد.",
      "description": "الروزماري والكافيين في تركيبة واحدة. اطلعي على تفاصيل المزيج والأحجام المتاحة قبل الاختيار.",
      "ingredients": "روزماري وكافيين",
      "usage": "اتبعي إرشادات العبوة لتحديد موضع الاستخدام والكمية والتكرار، وجرّبي كمية صغيرة أولًا.",
      "usageApprovalRequired": true,
      "prices": [
        2000,
        2400,
        2800
      ],
      "image": "rawaa-rosemary.jpg"
    },
    {
      "id": "olive-panthenol",
      "emblem": "assets/img/products/olive-panthenol-emblem.svg",
      "name": "زيت الزيتون والبانثينول",
      "lead": "زيت الزيتون والبانثينول معًا.",
      "description": "مزيج يضم زيت الزيتون والبانثينول. قارني الأحجام والأسعار قبل اختيارك.",
      "ingredients": "زيت الزيتون والبانثينول",
      "usage": "دفّئي كمية صغيرة بين الكفين، ووزّعيها من منتصف الشعر إلى الأطراف على شعر رطب أو جاف. ابدئي بالقليل وزيدي بحسب الحاجة.",
      "usageApprovalRequired": false,
      "prices": [
        1800,
        2200,
        2600
      ],
      "image": "rawaa-olive.jpg"
    },
    {
      "id": "castor-blend",
      "emblem": "assets/img/products/castor-blend-emblem.svg",
      "name": "خروع وزيوت مختارة",
      "lead": "خروع وزيوت مختارة في مزيج واحد.",
      "description": "زيت الخروع مع زيوت مختارة. تعرّفي على المكونات المميّزة وطريقة الاستخدام المعتمدة.",
      "ingredients": "زيت خروع مع زيوت مختارة بعناية",
      "usage": "ابدئي بكمية قليلة جدًا على الأطراف ووزّعيها برفق. زيدي تدريجيًا بحسب احتياج شعرك، وتجنّبي الإفراط في الكمية.",
      "usageApprovalRequired": false,
      "prices": [
        1800,
        2200,
        2600
      ],
      "image": "rawaa-castor.jpg"
    }
  ],
  "products": [
    {
      "id": "rosemary-caffeine-30",
      "familyId": "rosemary-caffeine",
      "name": "روزماري وكافيين",
      "sizeMl": 30,
      "sizeLabel": "30 مل",
      "shortLabel": "روزماري وكافيين · 30 مل",
      "note": "حجم صغير للتعرّف على المزيج",
      "price": 2000,
      "image": {
        "base": "rosemary-caffeine",
        "avif": ["rawaa-rosemary-480.avif", "rawaa-rosemary-720.avif", "rawaa-rosemary-900.avif"],
        "webp": ["rawaa-rosemary-480.webp", "rawaa-rosemary-720.webp", "rawaa-rosemary-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-rosemary-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "rosemary-caffeine-50",
      "familyId": "rosemary-caffeine",
      "name": "روزماري وكافيين",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "روزماري وكافيين · 50 مل",
      "note": "الأنسب للاستعمال اليومي",
      "price": 2400,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "rosemary-caffeine",
        "avif": ["rawaa-rosemary-480.avif", "rawaa-rosemary-720.avif", "rawaa-rosemary-900.avif"],
        "webp": ["rawaa-rosemary-480.webp", "rawaa-rosemary-720.webp", "rawaa-rosemary-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-rosemary-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "rosemary-caffeine-100",
      "familyId": "rosemary-caffeine",
      "name": "روزماري وكافيين",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "روزماري وكافيين · 100 مل",
      "note": "الحجم الأكبر",
      "price": 2800,
      "image": {
        "base": "rosemary-caffeine",
        "avif": ["rawaa-rosemary-480.avif", "rawaa-rosemary-720.avif", "rawaa-rosemary-900.avif"],
        "webp": ["rawaa-rosemary-480.webp", "rawaa-rosemary-720.webp", "rawaa-rosemary-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-rosemary-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "olive-panthenol-30",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 30,
      "sizeLabel": "30 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 30 مل",
      "note": "حجم صغير للتعرّف على المزيج",
      "price": 1800,
      "image": {
        "base": "olive-panthenol",
        "avif": ["rawaa-olive-480.avif", "rawaa-olive-720.avif", "rawaa-olive-900.avif"],
        "webp": ["rawaa-olive-480.webp", "rawaa-olive-720.webp", "rawaa-olive-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-olive-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "olive-panthenol-50",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 50 مل",
      "note": "الأنسب للاستعمال اليومي",
      "price": 2200,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "olive-panthenol",
        "avif": ["rawaa-olive-480.avif", "rawaa-olive-720.avif", "rawaa-olive-900.avif"],
        "webp": ["rawaa-olive-480.webp", "rawaa-olive-720.webp", "rawaa-olive-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-olive-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "olive-panthenol-100",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 100 مل",
      "note": "الحجم الأكبر",
      "price": 2600,
      "image": {
        "base": "olive-panthenol",
        "avif": ["rawaa-olive-480.avif", "rawaa-olive-720.avif", "rawaa-olive-900.avif"],
        "webp": ["rawaa-olive-480.webp", "rawaa-olive-720.webp", "rawaa-olive-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-olive-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "castor-blend-30",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 30,
      "sizeLabel": "30 مل",
      "shortLabel": "خروع وزيوت مختارة · 30 مل",
      "note": "حجم صغير للتعرّف على المزيج",
      "price": 1800,
      "image": {
        "base": "castor-blend",
        "avif": ["rawaa-castor-480.avif", "rawaa-castor-720.avif", "rawaa-castor-900.avif"],
        "webp": ["rawaa-castor-480.webp", "rawaa-castor-720.webp", "rawaa-castor-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-castor-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · خروع وزيوت مختارة"
      }
    },
    {
      "id": "castor-blend-50",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "خروع وزيوت مختارة · 50 مل",
      "note": "الأنسب للاستعمال اليومي",
      "price": 2200,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "castor-blend",
        "avif": ["rawaa-castor-480.avif", "rawaa-castor-720.avif", "rawaa-castor-900.avif"],
        "webp": ["rawaa-castor-480.webp", "rawaa-castor-720.webp", "rawaa-castor-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-castor-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · خروع وزيوت مختارة"
      }
    },
    {
      "id": "castor-blend-100",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "خروع وزيوت مختارة · 100 مل",
      "note": "الحجم الأكبر",
      "price": 2600,
      "image": {
        "base": "castor-blend",
        "avif": ["rawaa-castor-480.avif", "rawaa-castor-720.avif", "rawaa-castor-900.avif"],
        "webp": ["rawaa-castor-480.webp", "rawaa-castor-720.webp", "rawaa-castor-900.webp"],
        "widths": [480, 720, 900],
        "src": "assets/img/products/rawaa-castor-480.jpg",
        "width": 480,
        "height": 480,
        "alt": "تصوّر تصميمي لعبوة رواء · خروع وزيوت مختارة"
      }
    }
  ],
  "delivery": {
    "defaultZone": "hama",
    "policy": {
      "alwaysFree": true
    },
    "zones": [
      {
        "id": "hama",
        "label": "حماة",
        "fee": 0,
        "freeWithShamCash": true
      },
      {
        "id": "other",
        "label": "باقي المحافظات",
        "fee": 0,
        "freeWithShamCash": true
      }
    ],
    "governorates": [
      "دمشق",
      "ريف دمشق",
      "حلب",
      "حمص",
      "اللاذقية",
      "طرطوس",
      "إدلب",
      "دير الزور",
      "الرقة",
      "الحسكة",
      "السويداء",
      "درعا",
      "القنيطرة",
      "حماة"
    ],
    "note": "التوصيل مجاني إلى جميع المحافظات السورية ولكل طرق الدفع."
  },
  "trust": {
    "title": "ما لا نقدّمه",
    "items": [
      "رواء للعناية التجميلية بمظهر الشعر، وليست علاجًا طبيًا. يختلف الإحساس والمظهر بحسب طبيعة الشعر وطريقة الاستخدام.",
      "لا ننشر تقييمًا أو شهادة إلا بعد التحقق من صحتها والحصول على إذن صاحبتها.",
      "يُنسّق الدفع بعد مراجعة تفاصيل الطلب: عبر شام كاش أو عند الاستلام.",
      "أي قياس تسويقي اختياري لا يُفعّل قبل تهيئته والحصول على موافقتك."
    ]
  },
  "payment": {
    "title": "طريقة الدفع",
    "freeDeliveryNote": "التوصيل مجاني إلى جميع المحافظات السورية ولكل طرق الدفع.",
    "methods": [
      {
        "id": "shamcash",
        "label": "شام كاش",
        "short": "شام كاش",
        "description": "خصم 10% على إجمالي الطلب المؤهل عند الدفع عبر شام كاش فقط. التوصيل مجاني إلى جميع المحافظات.",
        "discountPercent": 10,
        "freeDeliveryIn": [
          "hama",
          "other"
        ],
        "requiresReceipt": true,
        "available": true,
        "confirmNote": "أرسلي إشعار التحويل عبر واتساب؛ نتحقق منه قبل تجهيز الطلب.",
        "walletNumber": ""
      },
      {
        "id": "cod",
        "label": "الدفع عند الاستلام",
        "short": "الدفع عند الاستلام",
        "description": "لا يشمل خصم شام كاش، والتوصيل مجاني إلى جميع المحافظات.",
        "discountPercent": 0,
        "freeDeliveryIn": [
          "hama",
          "other"
        ],
        "requiresReceipt": false,
        "available": true,
        "confirmNote": "يُدفع المبلغ كاملًا عند استلام الطلب."
      }
    ]
  },
  "imagery": {
    "hero": {
      "base": "trio",
      "avif": [
        "trio-v6-480.avif",
        "trio-v6-720.avif",
        "trio-v6-1080.avif",
        "trio-v6-1195.avif"
      ],
      "webp": [
        "trio-v6-480.webp",
        "trio-v6-720.webp",
        "trio-v6-1080.webp",
        "trio-v6-1195.webp"
      ],
      "widths": [
        480,
        720,
        1080,
        1195
      ],
      "src": "assets/img/products/trio-v6-1080.jpg",
      "width": 1080,
      "height": 810,
      "alt": "تصوّر تصميمي لثلاث عبوات رواء بأحجام 30 و50 و100 مل، وليس صورة المنتج الفعلي"
    },
    "trio": {
      "base": "trio",
      "avif": [
        "trio-v6-480.avif",
        "trio-v6-720.avif",
        "trio-v6-1080.avif",
        "trio-v6-1195.avif"
      ],
      "webp": [
        "trio-v6-480.webp",
        "trio-v6-720.webp",
        "trio-v6-1080.webp",
        "trio-v6-1195.webp"
      ],
      "widths": [
        480,
        720,
        1080,
        1195
      ],
      "src": "assets/img/products/trio-v6-1080.jpg",
      "width": 1080,
      "height": 810,
      "alt": "تصوّر تصميمي لأحجام رواء الثلاثة 30 و50 و100 مل بجانب بعضها"
    },
    "editorial": {
      "base": "editorial",
      "avif": [
        "editorial-v5-480.avif",
        "editorial-v5-720.avif",
        "editorial-v5-900.avif"
      ],
      "webp": [
        "editorial-v5-480.webp",
        "editorial-v5-720.webp",
        "editorial-v5-900.webp"
      ],
      "widths": [
        480,
        720,
        900
      ],
      "src": "assets/img/products/editorial-v5-720.jpg",
      "width": 720,
      "height": 1029,
      "alt": "تصوّر تصميمي لعبوة سيروم رواء بإضاءة جانبية ناعمة"
    },
    "detail": {
      "base": "detail-label",
      "avif": [
        "detail-label-v5-480.avif",
        "detail-label-v5-720.avif",
        "detail-label-v5-900.avif"
      ],
      "webp": [
        "detail-label-v5-480.webp",
        "detail-label-v5-720.webp",
        "detail-label-v5-900.webp"
      ],
      "widths": [
        480,
        720,
        900
      ],
      "src": "assets/img/products/detail-label-v5-720.jpg",
      "width": 720,
      "height": 720,
      "alt": "تصميم مقترح لملصق رواء يظهر الاسم والشعار، وليس ملصقًا نهائيًا للطباعة"
    }
  },
  "marketing": {
    "facebookPixelId": "",
    "channel": "facebook"
  },
  "showPricePerUnit": false,
  "offers": {
    "slots": []
  },
  "cart": {
    "maxQuantityPerItem": 10,
    "minQuantityPerItem": 1
  },
  "routines": {
    "title": "ثلاث لحظات للعناية بأطراف شعرك",
    "note": "ابدئي بكمية صغيرة على الأطراف؛ تختلف الكمية المناسبة حسب طبيعة الشعر. راجعي تعليمات العبوة.",
    "items": [
      {
        "when": "بعد الغسل",
        "title": "على شعر رطب قليلًا",
        "body": "وزّعي كمية صغيرة على الأطراف قبل التمشيط."
      },
      {
        "when": "قبل الخروج",
        "title": "لمسة على الأطراف",
        "body": "ابدئي بكمية صغيرة على الشعر الجاف، من منتصف الطول إلى الأطراف."
      },
      {
        "when": "عند الحاجة",
        "title": "ابدئي بالقليل",
        "body": "زيدي تدريجيًا حسب طبيعة شعرك، واتّبعي تعليمات العبوة."
      }
    ]
  },
  "formula": {
    "active": "Panthenol",
    "percentagesVerified": false,
    "status": "awaiting-corrected-formula"
  },
  "craft": {
    "eyebrow": "الشفافية",
    "title": "معلومات واضحة عن المنتج",
    "lead": "نعرض المعلومات المتاحة في كتالوج رواء، ونوضح ما لم يُعتمد بعد بدل افتراضه.",
    "points": [
      {
        "title": "مكونات معلنة",
        "body": "المكونات المذكورة وصف مختصر وليست قائمة INCI كاملة."
      },
      {
        "title": "معلومات التصنيع",
        "body": "لا ننسب التطوير أو التصنيع إلى جهة أو مؤهل مهني دون مستند معتمد."
      },
      {
        "title": "اختيار واضح",
        "body": "راجعي المزيج والحجم واسألي عن التوفّر والتفاصيل."
      }
    ],
    "signature": "العناية تبدأ بالوضوح."
  },
  "customization": {
    "scentPrice": 0,
    "scentOptions": [],
    "oilAdditions": []
  },
  "order": {
    "confirmationPoints": [
      "تأكيد توفّر الأحجام المطلوبة",
      "تأكيد تفاصيل الاختيار والكمية المطلوبة",
      "تأكيد السعر النهائي لهذا الطلب",
      "تأكيد موعد تجهيز العبوة والتوصيل",
      "تأكيد تفاصيل الدفع"
    ],
    "greeting": "مرحبًا رواء،",
    "intro": "أرغب بالاستفسار عن المزيجات والأحجام التالية:"
  }
});
})();
