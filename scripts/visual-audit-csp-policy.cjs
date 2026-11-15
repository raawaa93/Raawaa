'use strict';

/**
 * WebKit 27.2 (Playwright 1.64+) reports a false CSP style-src-attr
 * violation for the browser's own <select> shadow-tree styling.
 *
 * Keep the exception deliberately narrow: WebKit only, inline style-src-attr,
 * empty source file, line 1, event target SELECT, and no author style attribute.
 * Any other CSP event remains a real audit failure.
 */
function isKnownWebKitSelectCspFalsePositive(engineName, violation) {
  return engineName === 'webkit' &&
    violation?.violatedDirective === 'style-src-attr' &&
    violation?.blockedURI === 'inline' &&
    violation?.sourceFile === '' &&
    violation?.lineNumber === 1 &&
    violation?.targetTagName === 'SELECT' &&
    violation?.targetHasStyle === false;
}

module.exports = { isKnownWebKitSelectCspFalsePositive };
