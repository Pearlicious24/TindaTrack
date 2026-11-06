/* Inline SVG icon set (stroke icons, 24x24 grid). */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
  basket: '<path d="M5 10h14l-1.5 9.5a1.5 1.5 0 0 1-1.5 1.3H8a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="m9 10 3-6 3 6"/><path d="M3 10h18"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h3"/>',
  ledger: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4Z"/><path d="M10 21h4"/>',
  diamond: '<path d="M6 3h12l4 6-10 12L2 9Z" fill="currentColor" stroke="none"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>',
  sms: '<path d="M4 5h16v11H9l-5 4Z"/>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  alert: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17v.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  store: '<path d="M4 9h16v11H4Z"/><path d="M3 9 5 4h14l2 5"/><path d="M10 20v-5h4v5"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>',
};

function icon(name, cls = '') {
  const body = ICONS[name] || '';
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* Replace <span data-icon="..."> placeholders inside a root element. */
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
    el.removeAttribute('data-icon');
  });
}

/* Brand logo: assets/logo.png if present, otherwise the drawn SVG badge. */
function logoSVG(size = 120) {
  return `<span class="logo-wrap" style="width:${size}px"><img class="logo" src="images/tindatrack_logo.png" alt="TindaTrack logo" width="192" height="96" /></span>`;
}
function drawnLogo(size) {
  return `<svg class="logo" width="${size}" viewBox="0 0 160 100" role="img" aria-label="TindaTrack logo">
    <ellipse cx="80" cy="56" rx="76" ry="40" fill="#fff6e6" stroke="#ff6a00" stroke-width="5"/>
    <ellipse cx="80" cy="56" rx="68" ry="33" fill="none" stroke="#f2c38f" stroke-width="1.5"/>
    <g transform="translate(56 8)">
      <path d="M2 18 L8 4 H40 L46 18 Z" fill="#c0392b"/>
      <path d="M8 4 L12 18 M16 4 L18 18 M24 4 V18 M32 4 L30 18 M40 4 L36 18" stroke="#fff" stroke-width="2"/>
      <rect x="6" y="18" width="36" height="16" fill="#8b5a2b"/>
      <rect x="10" y="21" width="12" height="9" fill="#f5c542"/>
      <rect x="26" y="21" width="12" height="13" fill="#5c3a1a"/>
      <rect x="14" y="0" width="20" height="5" rx="1" fill="#f5c542"/>
    </g>
    <text x="80" y="71" text-anchor="middle" textLength="118" lengthAdjust="spacingAndGlyphs" font-family="Roboto Slab, serif" font-weight="800" font-size="21" fill="#1f7a3a" stroke="#0f4d23" stroke-width=".5" font-style="italic">TINDA TRACK</text>
  </svg>`;
}

/* Philippine flag (emoji flags don't render on Windows). */
function phFlag() {
  return `<svg class="flag" width="22" height="14" viewBox="0 0 30 15" aria-hidden="true">
    <rect width="30" height="7.5" fill="#0038a8"/><rect y="7.5" width="30" height="7.5" fill="#ce1126"/>
    <path d="M0 0 L13 7.5 L0 15 Z" fill="#fff"/><circle cx="4.5" cy="7.5" r="1.8" fill="#fcd116"/></svg>`;
}
