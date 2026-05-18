/**
 * Adds copy buttons beside copyable token values across the docs site.
 * Targets are discovered on load — no per-element markup required.
 */
(() => {
  const COPY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  const CHECK_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  const COPY_SELECTORS = [
    'code.docs__token',
    '.swatch__value',
    '.swatch-row__name',
    '.spacing-row__label',
    '.spacing-row__value',
    '.type-row__label',
    '.type-row__meta',
    '.demo-card__label strong',
  ].join(', ');

  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }

  function getCopyText(element) {
    if (element.dataset.copy) return element.dataset.copy.trim();
    return element.textContent.trim();
  }

  function attachCopyButton(element) {
    if (element.dataset.copyEnhanced === 'true') return;

    const text = getCopyText(element);
    if (!text) return;

    element.dataset.copyEnhanced = 'true';

    const wrap = document.createElement('span');
    wrap.className = 'copy-wrap';

    const parent = element.parentNode;
    parent.insertBefore(wrap, element);
    wrap.appendChild(element);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.setAttribute('aria-label', `Copy ${text}`);
    button.innerHTML = COPY_ICON;

    button.addEventListener('click', async () => {
      const copied = await writeClipboard(text);
      if (!copied) return;

      button.classList.add('copy-btn--copied');
      button.innerHTML = CHECK_ICON;
      button.setAttribute('aria-label', 'Copied');

      window.setTimeout(() => {
        button.classList.remove('copy-btn--copied');
        button.innerHTML = COPY_ICON;
        button.setAttribute('aria-label', `Copy ${text}`);
      }, 1500);
    });

    wrap.appendChild(button);
  }

  function enhanceTableValues() {
    document.querySelectorAll('.docs__table').forEach((table) => {
      const headers = [...table.querySelectorAll('thead th')].map((th) =>
        th.textContent.trim().toLowerCase()
      );
      const valueIndex = headers.indexOf('value');
      if (valueIndex === -1) return;

      table.querySelectorAll('tbody tr').forEach((row) => {
        const valueCell = row.querySelectorAll('td')[valueIndex];
        if (!valueCell || valueCell.querySelector('code.docs__token')) return;
        attachCopyButton(valueCell);
      });
    });
  }

  document.querySelectorAll(COPY_SELECTORS).forEach(attachCopyButton);
  enhanceTableValues();
})();
