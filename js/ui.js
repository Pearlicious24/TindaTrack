/* ---------- Shared UI: navigation, toasts, modals, chart ---------- */

const NAV = [
  { route: 'home', label: 'Home', icon: 'home' },
  { route: 'products', label: 'Products', icon: 'basket' },
  { route: 'inventory', label: 'Inventory', icon: 'clipboard' },
  { route: 'utang', label: 'Utang Ledger', short: 'Utang', icon: 'ledger' },
  { route: 'profile', label: 'Profile', icon: 'user' },
];

function renderNav(active) {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `
    <a href="#/home" class="brand">${logoSVG(118)}<span class="brand-name">${esc(state.profile.storeName)}</span></a>
    <nav class="side-links">
      ${NAV.map((n) => `<a href="#/${n.route}" class="side-link ${n.route === active ? 'active' : ''}" title="${n.label}">
        ${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
    </nav>
    <div class="plan-card">
      <div class="plan-title">${icon('diamond', 'gem')}<span>${esc(state.profile.plan)} plan</span></div>
      <p>Unlock sales analytics and stock forecasting with Premium.</p>
      <button class="btn btn-light btn-sm btn-block" data-action="premium">Upgrade to Premium</button>
    </div>
    <button class="plan-mini" data-action="premium" title="Upgrade to Premium">${icon('diamond', 'gem')}</button>`;

  document.getElementById('bottomNav').innerHTML = NAV.map(
    (n) => `<a href="#/${n.route}" class="bn-link ${n.route === active ? 'active' : ''}">${icon(n.icon)}<span>${n.short || n.label}</span></a>`
  ).join('');
}

/* ---------- Toasts ---------- */
const TOAST_KIND = {
  sale: { icon: 'basket', title: 'Sale recorded' },
  stock: { icon: 'check', title: 'Stock added' },
  payment: { icon: 'cash', title: 'Payment recorded' },
  sms: { icon: 'sms', title: 'SMS sent' },
  error: { icon: 'alert', title: 'Heads up' },
  info: { icon: 'info', title: 'Done' },
};
function toast(kind, message, title) {
  const k = TOAST_KIND[kind] || TOAST_KIND.info;
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.innerHTML = `<span class="toast-ico">${icon(k.icon)}</span>
    <div><strong>${esc(title || k.title)}</strong><p>${esc(message)}</p></div>
    <button class="toast-x" aria-label="Dismiss">${icon('x')}</button>`;
  const root = document.getElementById('toasts');
  root.appendChild(el);
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 250); };
  el.querySelector('.toast-x').onclick = close;
  setTimeout(close, 3200);
  if (kind !== 'error') {
    state.notifications.unshift({ title: title || k.title, message, at: Date.now(), kind });
    state.notifications = state.notifications.slice(0, 20);
    saveState();
    const dot = document.getElementById('notifDot');
    if (dot) dot.hidden = false;
    const bell = document.querySelector('[data-action="notifications"]');
    if (bell) { bell.classList.remove('ring'); void bell.offsetWidth; bell.classList.add('ring'); }
  }
}

/* ---------- Modal ----------
   openModal({ title, body, submitLabel, onSubmit(form) -> false to keep open, danger }) */
function openModal({ title, subtitle = '', body, submitLabel = 'Save', onSubmit, cancelLabel = 'Cancel', danger = false, hideFooter = false, wide = false }) {
  const root = document.getElementById('modalRoot');
  root.innerHTML = `
    <div class="modal-backdrop">
      <form class="modal ${wide ? 'modal-wide' : ''}"role="dialog" aria-modal="true" aria-label="${esc(title)}" novalidate>
        <div class="modal-head">
          <div><h3>${esc(title)}</h3>${subtitle ? `<p class="muted">${esc(subtitle)}</p>` : ''}</div>
          <button type="button" class="icon-btn" data-close aria-label="Close">${icon('x')}</button>
        </div>
        <div class="modal-body">${body}</div>
        ${hideFooter ? '' : `<div class="modal-foot">
          <button type="button" class="btn btn-ghost" data-close>${esc(cancelLabel)}</button>
          <button type="submit" class="btn ${danger ? 'btn-danger' : 'btn-primary'}">${esc(submitLabel)}</button>
        </div>`}
      </form>
    </div>`;
  const backdrop = root.querySelector('.modal-backdrop');
  const form = root.querySelector('form');
  const close = () => {
    document.removeEventListener('keydown', onKey);
    if (!backdrop.isConnected) return;
    backdrop.classList.add('closing');            // fade/scale out, then remove
    setTimeout(() => { if (backdrop.isConnected) backdrop.remove(); }, 180);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) close(); });
  root.querySelectorAll('[data-close]').forEach((b) => (b.onclick = close));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!onSubmit || onSubmit(form) !== false) close();
  });
  const first = form.querySelector('input:not([type=file]), select, textarea');
  if (first) setTimeout(() => first.focus(), 30);
  return { close, form };
}

function fieldError(form, name, msg) {
  const input = form.elements[name];
  const wrap = input.closest('.field');
  wrap.classList.add('has-error');
  let el = wrap.querySelector('.err');
  if (!el) { el = document.createElement('small'); el.className = 'err'; wrap.appendChild(el); }
  el.textContent = msg;
  input.focus();
  return false;
}

/* ---------- PH mobile number input ---------- */
function phoneField(name, label, value = '', hint = '') {
  return `<div class="field">
    <span>${esc(label)}</span>
    <div class="phone-input">${phFlag()}<b>+63</b><input name="${name}" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="912 345 6789" maxlength="12" value="${esc(formatMobile(value))}" /></div>
    ${hint ? `<small class="muted xs">${esc(hint)}</small>` : ''}
  </div>`;
}
/* Auto-format as "9XX XXX XXXX" while typing (accepts pasted 09… or +639…). */
function bindPhoneInput(input) {
  input.addEventListener('input', () => { input.value = formatMobile(input.value); });
}

/* ---------- Stacked bar chart (SVG) ---------- */
/* Round a raw step up to 1, 2, 2.5 or 5 × 10ⁿ so axis labels are clean (₱1k, ₱2k…). */
function niceStep(raw) {
  if (raw <= 0) return 25;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
function shortPeso(v) {
  if (v >= 1000) return '₱' + +(v / 1000).toFixed(1) + 'k';
  return '₱' + Math.round(v);
}

/* buckets: [{ label, full, values: {bev,snk,can,pc}, highlight }]
   Drawn at the container's real pixel size, so nothing is ever stretched. */
function stackedChart(container, buckets, { animate = false } = {}) {
  const W = Math.max(260, Math.round(container.clientWidth || 640));
  const H = Math.max(180, Math.round(container.clientHeight || 280));
  container._buckets = buckets;

  const totals = buckets.map((b) => SERIES.reduce((s, x) => s + (b.values[x.id] || 0), 0));
  const TICKS = 4;
  const step = niceStep(Math.max(...totals, 1) / TICKS);
  const max = step * TICKS;
  const labels = Array.from({ length: TICKS + 1 }, (_, i) => shortPeso(step * i));
  const padL = 12 + Math.max(...labels.map((l) => l.length)) * 6.2, padR = 6, padT = 12, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / buckets.length;
  const bw = Math.max(4, Math.min(44, slot * 0.58));   // never thinner than 4px or wider than 44px
  const r = Math.min(6, bw / 3);                       // rounded top corners
  const GAP = bw > 10 ? 1.5 : 0;                       // thin white line between stacked colors
  const y = (v) => padT + plotH - (v / max) * plotH;

  let grid = '';
  labels.forEach((l, i) => {
    const yy = y(step * i);
    grid += `<line x1="${padL}" x2="${W - padR}" y1="${yy}" y2="${yy}" class="grid ${i === 0 ? 'base' : ''}"/>
      <text x="${padL - 10}" y="${yy + 3.5}" class="axis" text-anchor="end">${l}</text>`;
  });

  // Show at most ~1 label per 34px so they never collide
  const labelEvery = Math.max(1, Math.ceil(buckets.length / Math.floor(plotW / 34)));
  let bars = '', xlabels = '';
  buckets.forEach((b, i) => {
    const x = padL + slot * i + (slot - bw) / 2;
    const segs = SERIES.filter((s) => b.values[s.id] > 0);
    let acc = 0, g = '';
    segs.forEach((s, si) => {
      const v = b.values[s.id];
      const yTop = y(acc + v), yBot = y(acc) - (si > 0 ? GAP : 0);
      const h = Math.max(0, yBot - yTop);
      if (si === segs.length - 1 && h > r) {
        g += `<path d="M${x},${yBot} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + bw - r} Q${x + bw},${yTop} ${x + bw},${yTop + r} V${yBot} Z" fill="${s.color}"/>`;
      } else {
        g += `<rect x="${x}" y="${yTop}" width="${bw}" height="${h}" fill="${s.color}"/>`;
      }
      acc += v;
    });
    bars += `<g class="bar" data-i="${i}" style="--i:${i}">${g}</g>`;
    // Count from the newest bar so "today" always has a label and spacing stays even
    if ((buckets.length - 1 - i) % labelEvery === 0) {
      xlabels += `<text x="${x + bw / 2}" y="${H - 10}" text-anchor="middle" class="axis ${b.highlight ? 'hl' : ''}">${esc(b.label)}</text>`;
    }
  });
  const hits = buckets.map((_, i) => `<rect class="hit" data-i="${i}" x="${padL + slot * i}" y="${padT}" width="${slot}" height="${plotH}" fill="transparent"/>`).join('');

  container.classList.toggle('animate', animate);
  container.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="chart-svg" role="img" aria-label="Sales chart">
    ${grid}<line class="guide" y1="${padT}" y2="${padT + plotH}"/>${bars}${xlabels}${hits}</svg>`;

  // Redraw (without animation) when the chart's width changes
  if (!container._ro && window.ResizeObserver) {
    container._w = W;
    container._ro = new ResizeObserver(() => {
      const w = Math.round(container.clientWidth);
      if (container.isConnected && Math.abs(w - container._w) > 4) { container._w = w; stackedChart(container, container._buckets); }
    });
    container._ro.observe(container);
  }
  container._w = W;

  // Hover / tap: highlight one bar, show a dashed guide and a tooltip
  const svg = container.querySelector('svg');
  const guide = svg.querySelector('.guide');
  const tip = document.getElementById('chartTip');
  const show = (i, e) => {
    const b = buckets[i];
    svg.classList.add('hovering');
    svg.querySelectorAll('.bar').forEach((el) => el.classList.toggle('on', +el.dataset.i === i));
    const cx = padL + slot * i + slot / 2;
    guide.setAttribute('x1', cx); guide.setAttribute('x2', cx); guide.classList.add('on');
    tip.innerHTML = `<strong>${esc(b.full)}</strong><span class="tip-total">${peso(totals[i])}</span>` +
      SERIES.map((s) => `<div class="tip-row"><i style="background:${s.color}"></i>${s.name}<b>${peso(b.values[s.id] || 0, 0)}</b></div>`).join('');
    tip.hidden = false;
    let left = e.clientX + 16, top = e.clientY + 16;
    if (left + 210 > window.innerWidth) left = e.clientX - 216;
    if (top + 150 > window.innerHeight) top = e.clientY - 160;
    tip.style.left = Math.max(8, left) + 'px'; tip.style.top = Math.max(8, top) + 'px';
  };
  const hide = () => {
    svg.classList.remove('hovering'); guide.classList.remove('on'); tip.hidden = true;
    svg.querySelectorAll('.bar.on').forEach((el) => el.classList.remove('on'));
  };
  svg.querySelectorAll('.hit').forEach((h) => {
    h.addEventListener('pointermove', (e) => show(+h.dataset.i, e));
    h.addEventListener('pointerdown', (e) => show(+h.dataset.i, e));
  });
  svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hide(); });
  if (!stackedChart._docHide) {
    stackedChart._docHide = true;
    document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.chart-svg')) document.getElementById('chartTip').hidden = true; });
  }
}
