/* Prices are read only from the store's canonical config. */
(function () {
  'use strict';
  var config = window.RAWAA_CONFIG;
  if (!config) return;
  document.querySelectorAll('[data-family-price]').forEach(function (node) {
    var family = node.getAttribute('data-family-price');
    var prices = config.products.filter(function (p) { return p.familyId === family; }).map(function (p) { return p.price; });
    if (prices.length) node.textContent = 'من ' + new Intl.NumberFormat('ar-SY').format(Math.min.apply(null, prices)) + ' ' + config.currency.symbol.trim();
  });
}());
