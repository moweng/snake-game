// Simple browser helpers for the snake-game UI.
// This file exposes two functions on `window.Help`:
// - formatDate(date, format)
// - getBrowserInfo()
// The file intentionally avoids module.exports/ESM so it can be dropped directly into a <script>.
(function () {
  // Format a Date. Supports tokens: yyyy, MM, dd, HH, mm, ss
  function formatDate(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
    const d = date instanceof Date ? date : new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    const map = {
      yyyy: d.getFullYear(),
      MM: pad(d.getMonth() + 1),
      dd: pad(d.getDate()),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
    };
    return String(format).replace(/yyyy|MM|dd|HH|mm|ss/g, (token) => map[token]);
  }

  // Return a small browser info object: { name, version, userAgent }
  function getBrowserInfo() {
    if (typeof navigator === 'undefined') {
      return { name: 'unknown', version: '0', userAgent: '' };
    }
    const ua = navigator.userAgent || '';
    let name = 'Unknown';
    let version = '0';
    const rules = [
      { name: 'Edge', regex: /Edg\/([\d.]+)/ },
      { name: 'Chrome', regex: /Chrome\/([\d.]+)/ },
      { name: 'Firefox', regex: /Firefox\/([\d.]+)/ },
      { name: 'Safari', regex: /Version\/([\d.]+).*Safari/ },
      { name: 'Opera', regex: /OPR\/([\d.]+)/ },
      { name: 'IE', regex: /MSIE\s([\d.]+);/ },
      { name: 'IE', regex: /Trident\/.*rv:([\d.]+)/ },
    ];
    for (const r of rules) {
      const m = ua.match(r.regex);
      if (m) {
        name = r.name;
        version = m[1];
        break;
      }
    }
    return { name, version, userAgent: ua };
  }

  // Attach to window.Help (browser) or globalThis.Help as a fallback.
  if (typeof window !== 'undefined') {
    window.Help = window.Help || {};
    window.Help.formatDate = formatDate;
    window.Help.getBrowserInfo = getBrowserInfo;
  } else if (typeof globalThis !== 'undefined') {
    globalThis.Help = globalThis.Help || {};
    globalThis.Help.formatDate = formatDate;
    globalThis.Help.getBrowserInfo = getBrowserInfo;
  }
})();
