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
    "shortDescription": "ثلاثة اختيارات للعناية بالشعر: روزماري وكافيين، زيت الزيتون والبانثينول، وخروع مع زيوت مختارة.",
    "city": "حماة",
    "country": ""
  },
  "contact": {
    "whatsappNumber": "963997310856",
    "displayNumber": "0997310856",
    "hoursNote": "نرد على الرسائل خلال ساعات اليوم المعتادة، وغالبًا خلال ساعات قليلة."
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
      "lead": "اختيارك لروتين عناية منتظم",
      "description": "مزيج الروزماري والكافيين، لمن تفضّل أن تجعل العناية بالشعر عادة مدروسة.",
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
      "lead": "نعومة أقرب، وروتين أبسط",
      "description": "مزيج للعناية بملمس الشعر الجاف والمتطاير، يجمع زيت الزيتون والبانثينول.",
      "ingredients": "زيت زيتون وبانثينول",
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
      "lead": "لمسة عناية للأطراف الجافة",
      "description": "زيت الخروع مع مزيج زيوت مختارة بعناية، للعناية بملمس الأطراف ولمعانها.",
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
      "note": "اختيارك لروتين عناية منتظم",
      "price": 2000,
      "image": {
        "base": "rosemary-caffeine",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-rosemary.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "rosemary-caffeine-50",
      "familyId": "rosemary-caffeine",
      "name": "روزماري وكافيين",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "روزماري وكافيين · 50 مل",
      "note": "اختيارك لروتين عناية منتظم",
      "price": 2400,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "rosemary-caffeine",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-rosemary.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "rosemary-caffeine-100",
      "familyId": "rosemary-caffeine",
      "name": "روزماري وكافيين",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "روزماري وكافيين · 100 مل",
      "note": "اختيارك لروتين عناية منتظم",
      "price": 2800,
      "image": {
        "base": "rosemary-caffeine",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-rosemary.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · روزماري وكافيين"
      }
    },
    {
      "id": "olive-panthenol-30",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 30,
      "sizeLabel": "30 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 30 مل",
      "note": "نعومة أقرب، وروتين أبسط",
      "price": 1800,
      "image": {
        "base": "olive-panthenol",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-olive.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "olive-panthenol-50",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 50 مل",
      "note": "نعومة أقرب، وروتين أبسط",
      "price": 2200,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "olive-panthenol",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-olive.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "olive-panthenol-100",
      "familyId": "olive-panthenol",
      "name": "زيت الزيتون والبانثينول",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "زيت الزيتون والبانثينول · 100 مل",
      "note": "نعومة أقرب، وروتين أبسط",
      "price": 2600,
      "image": {
        "base": "olive-panthenol",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-olive.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · زيت الزيتون والبانثينول"
      }
    },
    {
      "id": "castor-blend-30",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 30,
      "sizeLabel": "30 مل",
      "shortLabel": "خروع وزيوت مختارة · 30 مل",
      "note": "لمسة عناية للأطراف الجافة",
      "price": 1800,
      "image": {
        "base": "castor-blend",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-castor.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · خروع وزيوت مختارة"
      }
    },
    {
      "id": "castor-blend-50",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 50,
      "sizeLabel": "50 مل",
      "shortLabel": "خروع وزيوت مختارة · 50 مل",
      "note": "لمسة عناية للأطراف الجافة",
      "price": 2200,
      "badge": "الأنسب للاستعمال اليومي",
      "image": {
        "base": "castor-blend",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-castor.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · خروع وزيوت مختارة"
      }
    },
    {
      "id": "castor-blend-100",
      "familyId": "castor-blend",
      "name": "خروع وزيوت مختارة",
      "sizeMl": 100,
      "sizeLabel": "100 مل",
      "shortLabel": "خروع وزيوت مختارة · 100 مل",
      "note": "لمسة عناية للأطراف الجافة",
      "price": 2600,
      "image": {
        "base": "castor-blend",
        "avif": [],
        "webp": [],
        "widths": [],
        "src": "assets/img/products/rawaa-castor.jpg",
        "width": 1024,
        "height": 1280,
        "alt": "عبوة رواء · خروع وزيوت مختارة"
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
    "note": "التوصيل مجاني لجميع المحافظات ولكل طرق الدفع."
  },
  "trust": {
    "title": "ما لا نقدّمه",
    "items": [
      "لا ادعاء طبي ولا نتيجة مضمونة — المنتج للعناية التجميلية بالشعر.",
      "لا ننشر تقييمات أو شهادات قبل الحصول عليها من زبونات حقيقيات وبإذنهن.",
      "لا نطلب دفعًا مسبقًا إلا بتحويل شام كاش واضح، أو الدفع عند الاستلام.",
      "لا يُفعَّل القياس الإعلاني إلا بعد تهيئته وبموافقتك."
    ]
  },
  "payment": {
    "title": "طريقة الدفع",
    "freeDeliveryNote": "التوصيل مجاني لجميع المحافظات ولكل طرق الدفع.",
    "methods": [
      {
        "id": "shamcash",
        "label": "شام كاش",
        "short": "شام كاش",
        "description": "خصم 10% على قيمة المنتجات + توصيل مجاني.",
        "discountPercent": 10,
        "freeDeliveryIn": [
          "hama",
          "other"
        ],
        "requiresReceipt": true,
        "available": true,
        "confirmNote": "يُرسَل إشعار التحويل على واتساب لتأكيد الدفع قبل تجهيز الطلب.",
        "walletNumber": ""
      },
      {
        "id": "cod",
        "label": "الدفع عند الاستلام",
        "short": "الدفع عند الاستلام",
        "description": "بلا خصم، والتوصيل مجاني.",
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
      "alt": "تصميم الأحجام الثلاثة لسيروم زيوت رواء 30 و50 و100 مل"
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
      "alt": "الأحجام الثلاثة لسيروم رواء 30 و50 و100 مل بجانب بعضها"
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
      "alt": "عبوة سيروم رواء بإضاءة جانبية ناعمة"
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
      "alt": "تفاصيل ملصق عبوة رواء الذي يظهر الاسم والشعار"
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
    "eyebrow": "الصنعة",
    "title": "تركيبة أعدّها صيادلة ومختصون",
    "lead": "سيروم رواء مصنوع على أيدي صيادلة ومختصين. نعمل مع مصنع وصيادلة ومخبر لتطوير منتجات رواء.",
    "points": [
      {
        "title": "صنعة مختصين",
        "body": "سيروم رواء مصنوع على أيدي صيادلة ومختصين."
      },
      {
        "title": "شراكة في التطوير",
        "body": "نعمل مع مصنع وصيادلة ومخبر لتطوير منتجات رواء."
      },
      {
        "title": "اختيار بسيط",
        "body": "اختاري الحجم، وأخبرينا إن أردتِ الاستفسار عن العطر أو الإضافات."
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
      "تأكيد خيارات العطر أو الزيت إن طُلبت",
      "تأكيد السعر النهائي لهذا الطلب",
      "تأكيد موعد تجهيز العبوة ورسوم التوصيل وموعده",
      "تأكيد تفاصيل الدفع"
    ],
    "greeting": "مرحبًا رواء،",
    "intro": "أرغب بالاستفسار عن السيروم وطلب الأحجام التالية:"
  }
});
})();
