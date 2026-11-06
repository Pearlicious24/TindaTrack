/* ---------- Router + global wiring ---------- */

let currentRoute = null;
let welcomeSeen = false; // resets every time the page is loaded
let cleanupScreen = null;

function route() {
  const name = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
  const screen = document.getElementById('screen');
  const app = document.getElementById('app');
  document.getElementById('modalRoot').innerHTML = '';
  if (cleanupScreen) { cleanupScreen(); cleanupScreen = null; }

  // Guards
  // The Welcome screen shows on every fresh load of the site (not saved between visits).
  if (!welcomeSeen && name !== 'welcome') return void (location.hash = '#/welcome');
  if (welcomeSeen && name === 'welcome') return void (location.hash = state.user ? '#/home' : '#/login');
  if (!state.user && name !== 'login' && name !== 'welcome') return void (location.hash = '#/login');
  if (state.user && name === 'login') return void (location.hash = '#/home');

  if (name === 'welcome' || name === 'login') {
    app.hidden = true;
    screen.hidden = false;
    document.title = 'TindaTrack — ' + t(name === 'welcome' ? 'Welcome' : 'Log in');
    cleanupScreen = name === 'welcome' ? renderOnboarding(screen) : (renderLogin(screen), null);
    currentRoute = name;
    return;
  }

  const page = PAGES[name] || PAGES.home;
  const key = PAGES[name] ? name : 'home';
  screen.hidden = true;
  screen.innerHTML = '';
  app.hidden = false;
  const entering = currentRoute !== key;
  if (entering) {
    ui.query = '';
    document.getElementById('searchInput').value = '';
    ui.chartAnim = true;
  }
  currentRoute = key;
  document.title = `TindaTrack — ${t(page.title)}`;
  document.getElementById('searchInput').placeholder = page.search;
  renderNav(key);
  rerender(entering);
  document.getElementById('page').scrollTop = 0;
  window.scrollTo(0, 0);
}

let enterTimer;
function rerender(enter = false) {
  const page = PAGES[currentRoute];
  if (!page) return;
  const root = document.getElementById('page');
  if (enter) { root.classList.remove('enter'); void root.offsetWidth; root.classList.add('enter'); }
  root.innerHTML = page.render();
  // Stagger index for list/grid items (used by the fade-up animation)
  root.querySelectorAll('.product-grid, .cat-grid, .cust-list, .dash-side, .low-list, .three-col, .two-col')
    .forEach((list) => [...list.children].forEach((el, i) => el.style.setProperty('--n', Math.min(i, 12))));
  page.bind(root);
  if (enter) {
    countUp(root);
    clearTimeout(enterTimer);
    enterTimer = setTimeout(() => root.classList.remove('enter'), 1000);
  }
  document.getElementById('notifDot').hidden = !state.notifications.some((n) => !n.read);
}

/* Numbers roll up from 0 when a page opens (₱1,860.00, 3, 45/50…). */
function countUp(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll('.stat-num, .big-num').forEach((el) => {
    const text = el.textContent.trim();
    const m = text.match(/^(₱?)([d,]+(?:.d+)?)(.*)$/);
    if (!m) return;
    const [, pre, num, rest] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const dec = (num.split('.')[1] || '').length;
    if (!(target > 0)) return;
    const t0 = performance.now(), dur = 900;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * e).toLocaleString('en-PH', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + rest;
      if (k < 1 && el.isConnected) requestAnimationFrame(tick); else el.textContent = text;
    };
    requestAnimationFrame(tick);
  });
}

/* Material-style ripple on buttons */
document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.btn, .chip, .seg button, .sell-btn, .icon-btn, .premium-pill');
  if (!btn || btn.disabled) return;
  const r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  btn.appendChild(s);
  setTimeout(() => s.remove(), 600);
});

/* Search: Home & Profile jump to Products results; other pages filter in place. */
function onSearch(e) {
  ui.query = e.target.value.trim();
  if (currentRoute === 'home' || currentRoute === 'profile') {
    if (!ui.query) return;
    const q = ui.query;
    location.hash = '#/products';
    setTimeout(() => {
      const input = document.getElementById('searchInput');
      input.value = q; ui.query = q; rerender(); input.focus();
    }, 0);
    return;
  }
  rerender();
}

function premiumModal() {
  const current = state.profile.plan;
  const plan = (name, price, tagline, features, highlight) => `
    <div class="plan-opt ${highlight ? 'plan-opt-hl' : ''}">
      <div class="card-row"><h3>${name} Plan</h3>${current === name ? badge('Current plan', 'green') : highlight ? badge('Recommended', 'orange') : ''}</div>
      <p class="muted xs">${tagline}</p>
      <div class="price-box"><span class="big-num">₱${price}</span><span class="muted">/ month</span></div>
      <ul class="pro-list">${features.map(([ic, t, d]) => `<li>${icon(ic)}<div><strong>${t}</strong><span class="muted xs">${d}</span></div></li>`).join('')}</ul>
    </div>`;
  openModal({
    title: 'Subscription Plans',
    subtitle: 'Choose the plan that fits your tindahan.',
    hideFooter: true,
    wide: true,
    body: `
      <div class="plan-grid">
        ${plan('Standard', 199, 'For sari-sari stores getting organized.', [
          ['box', 'Core inventory management', 'Track products and stock levels.'],
          ['basket', 'Sales logging', 'Record every sale in one tap.'],
          ['sms', 'Digital credit ledger', 'Utang tracking with SMS reminders.'],
          ['clock', 'Profit reports', 'Daily and weekly profit summaries.'],
        ])}
        ${plan('Premium', 299, 'Everything in Standard, plus:', [
          ['clipboard', 'Expanded storage', 'Room for larger product inventories, suitable for minimarts.'],
          ['chart', 'Visual sales analytics', 'A dashboard that shows how your sales are trending.'],
          ['alert', 'Intelligent stock forecasting', 'Know what to restock before it runs out.'],
        ], true)}
      </div>
      ${current === 'Premium' ? '' : '<button type="button" class="btn btn-primary btn-block btn-lg mt-16" id="proCta">Upgrade to Premium — ₱299/month</button>'}`,
  });
  const cta = document.getElementById('proCta');
  if (cta) cta.onclick = () => {
    document.getElementById('modalRoot').innerHTML = '';
    toast('info', 'Payments are not connected in this demo yet.', 'Coming soon');
  };
}

function notificationsModal() {
  const items = state.notifications;
  openModal({
    title: 'Notifications',
    hideFooter: true,
    body: items.length
      ? `<ul class="notif-list">${items.map((n) => `<li><strong>${esc(n.title)}</strong><span class="muted xs">${esc(n.message)}</span><time class="muted xs">${new Date(n.at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}</time></li>`).join('')}</ul>
         <button type="button" class="btn btn-ghost btn-sm btn-block mt-12" id="clearNotifs">Clear all</button>`
      : `<div class="empty">${icon('bell')}<p>No notifications yet.</p></div>`,
  });
  items.forEach((n) => (n.read = true));
  saveState();
  document.getElementById('notifDot').hidden = true;
  const clear = document.getElementById('clearNotifs');
  if (clear) clear.onclick = () => { state.notifications = []; saveState(); document.getElementById('modalRoot').innerHTML = ''; };
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'premium') premiumModal();
  if (el.dataset.action === 'notifications') notificationsModal();
});

// Clear a field's error as soon as the user edits it
document.addEventListener('input', (e) => {
  const f = e.target.closest && e.target.closest('.field.has-error');
  if (f) f.classList.remove('has-error');
});

loadState();
hydrateIcons();
document.getElementById('searchInput').addEventListener('input', onSearch);
initI18n();
window.addEventListener('hashchange', route);
loadPhotos().then(route); // photos are read from IndexedDB before the first page draws
