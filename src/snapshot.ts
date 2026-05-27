export function snapshotScript(): string {
  return `(() => {
  const normalize = (value, max = 200) => String(value || '').replace(/\\s+/g, ' ').trim().slice(0, max);
  const isVisible = (el) => {
    if (!(el instanceof Element)) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      rect.width > 0 &&
      rect.height > 0
    );
  };
  const isEnabled = (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
  const cssPath = (el) => {
    if (!(el instanceof Element)) return '';
    const parts = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && parts.length < 8) {
      let selector = el.tagName.toLowerCase();
      if (el.id) {
        selector += '#' + CSS.escape(el.id);
        parts.unshift(selector);
        break;
      }
      let nth = 1;
      let sib = el;
      while ((sib = sib.previousElementSibling)) {
        if (sib.tagName === el.tagName) nth++;
      }
      selector += ':nth-of-type(' + nth + ')';
      parts.unshift(selector);
      el = el.parentElement;
    }
    return parts.join(' > ');
  };
  const roleOf = (el) => normalize(el.getAttribute('role') || el.tagName.toLowerCase(), 80);
  const textOf = (el) => normalize(el.innerText || el.textContent || '', 200);
  const nameOf = (el) => normalize(
    el.getAttribute('aria-label') ||
    el.getAttribute('placeholder') ||
    el.getAttribute('title') ||
    el.innerText ||
    el.value ||
    '',
    120
  );
  const groupOf = (el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'a') return 'links';
    if (tag === 'button') return 'buttons';
    if (tag === 'input') return 'inputs';
    if (tag === 'textarea') return 'textareas';
    if (tag === 'select') return 'selects';
    if (tag === 'area') return 'areas';
    const role = normalize(el.getAttribute('role'), 40);
    if (role) return 'customs';
    return 'customs';
  };

  const actionableSeen = new Set();
  const out = [];
  const actionableNodes = Array.from(document.querySelectorAll('a,button,input,textarea,select,area,summary,[role],[tabindex]'));
  for (const el of actionableNodes) {
    if (!isVisible(el)) continue;
    if (!isEnabled(el)) continue;
    const selector = cssPath(el);
    if (!selector || actionableSeen.has(selector)) continue;
    actionableSeen.add(selector);
    out.push({
      selector,
      group: groupOf(el),
      role: roleOf(el),
      name: nameOf(el),
      text: textOf(el),
      tagName: el.tagName.toLowerCase(),
      href: normalize(el.getAttribute('href') || '', 200),
      value: normalize(el.value || '', 200),
      placeholder: normalize(el.getAttribute('placeholder') || '', 120),
      textLength: textOf(el).length
    });
  }

  const textCandidates = Array.from(document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,article,section,div,span,li,blockquote,pre,code'));
  const textRows = [];
  for (const el of textCandidates) {
    if (!isVisible(el)) continue;
    const selector = cssPath(el);
    if (!selector) continue;
    const text = textOf(el);
    if (text.length < 6) continue;
    if (el.querySelector('a,button,input,textarea,select,area,[role],[tabindex]')) continue;
    textRows.push({
      selector,
      group: 'texts',
      role: '',
      name: '',
      text,
      tagName: el.tagName.toLowerCase(),
      href: '',
      value: '',
      placeholder: '',
      textLength: text.length
    });
  }

  textRows.sort((a, b) => a.selector.length - b.selector.length);
  const dedupedTexts = [];
  for (const row of textRows) {
    let nested = false;
    for (const kept of dedupedTexts) {
      if (!row.selector.startsWith(kept.selector)) continue;
      try {
        const parentEl = document.querySelector(kept.selector);
        const childEl = document.querySelector(row.selector);
        if (parentEl && childEl && parentEl !== childEl && parentEl.contains(childEl)) {
          nested = true;
          break;
        }
      } catch (err) {
      }
    }
    if (!nested) dedupedTexts.push(row);
  }

  return out.concat(dedupedTexts);
})()`
}
