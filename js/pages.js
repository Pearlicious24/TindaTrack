/* ---------- Page renderers ----------
   Each page: { title, search placeholder, render() -> html, bind(root) } */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

const ui = { range: '14D', productCat: 'all', utangFilter: 'all', query: '', chartAnim: true, lastSold: null };

/* Little "+₱12" that floats up from a button */
function floatText(el, text) {
  const r = el.getBoundingClientRect();
  const f = document.createElement('span');
  f.className = 'float-num'; f.textContent = text;
  f.style.left = r.left + r.width / 2 - 18 + 'px'; f.style.top = r.top - 6 + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 950);
}

function badge(text, kind) { return `<span class="badge badge-${kind}">${esc(text)}</span>`; }
function changePill(pct) {
  const up = pct >= 0;
  return `<span class="pill ${up ? 'pill-up' : 'pill-down'}">${up ? '+' : ''}${pct.toFixed(1)}%</span>`;
}
function stockBadge(p) {
  if (p.stock === 0) return badge('Out of stock', 'red');
  if (p.stock <= state.settings.lowStock) return badge(`Only ${p.stock} left`, 'orange');
  return badge(`${p.stock} in stock`, 'green');
}
/* The owner's photo when there is one, otherwise the product's drawing. */
function productPicture(p) {
  const photo = PHOTOS.get(p.id);
  return photo ? `<img class="photo" src="${photo}" alt="${esc(p.name)}" />` : artSVG(p.art || defaultArtFor(p.cat));
}
function productThumb(p, cls = '') {
  const cat = getCategory(p.cat);
  return `<div class="thumb tint-${cat ? cat.tint : 'sky'} ${cls} ${PHOTOS.has(p.id) ? 'is-photo' : ''}">${productPicture(p)}</div>`;
}

/* ---------- Chart data ---------- */
function sumRows(keys) {
  const out = { bev: 0, snk: 0, can: 0, pc: 0 };
  keys.forEach((k) => { const r = state.history[k]; if (r) SERIES.forEach((s) => (out[s.id] += r[s.id] || 0)); });
  return out;
}
function daysBack(n, offset = 0) {
  const today = startOfDay();
  const arr = [];
  for (let i = n - 1 + offset; i >= offset; i--) arr.push(new Date(today.getTime() - i * DAY));
  return arr;
}
function buildBuckets(range) {
  const today = startOfDay();
  const tk = dayKey(today);
  if (range === '1D') {
    const rand = mulberry32(today.getDate() * 97);
    const hours = [];
    for (let h = 6; h <= 21; h++) hours.push(h);
    const weights = hours.map((h) => (h >= 10 && h <= 12 ? 1.6 : h >= 16 && h <= 19 ? 2 : 0.8) * (0.6 + rand()));
    const wSum = weights.reduce((a, b) => a + b, 0);
    const row = state.history[tk] || {};
    const now = new Date().getHours();
    return {
      buckets: hours.map((h, i) => {
        const values = {};
        SERIES.forEach((s) => (values[s.id] = Math.round(((row[s.id] || 0) * weights[i]) / wSum)));
        const label = h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`;
        return { label, full: `Today, ${label.replace('a', ' AM').replace('p', ' PM')}`, values, highlight: h === now };
      }),
      keys: [tk], prevKeys: [dayKey(today.getTime() - DAY)], label: `Today, ${fmtDay(today)}`,
    };
  }
  if (range === '7D' || range === '14D' || range === '1M') {
    const n = range === '7D' ? 7 : range === '14D' ? 14 : 30;
    const days = daysBack(n);
    return {
      buckets: days.map((d, i) => ({ label: String(d.getDate()), full: `${fmtDay(d)}, ${d.getFullYear()}`, values: sumRows([dayKey(d)]), highlight: i === n - 1 })),
      keys: days.map(dayKey), prevKeys: daysBack(n, n).map(dayKey),
      label: `${fmtDay(days[0])} — ${fmtDay(days[n - 1])}, ${today.getFullYear()}`,
    };
  }
  if (range === '3M') {
    const weeks = [];
    for (let w = 12; w >= 0; w--) weeks.push(daysBack(7, w * 7));
    const all = weeks.flat();
    return {
      buckets: weeks.map((wk, i) => ({ label: fmtDay(wk[0]).replace(' ', ' '), full: `Week of ${fmtDay(wk[0])}`, values: sumRows(wk.map(dayKey)), highlight: i === weeks.length - 1 })),
      keys: all.map(dayKey), prevKeys: daysBack(91, 91).map(dayKey),
      label: `${fmtDay(all[0])} — ${fmtDay(today)}, ${today.getFullYear()}`,
    };
  }
  // 1Y — 12 calendar months ending this month
  const months = [];
  for (let m = 11; m >= 0; m--) {
    const start = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - m + 1, 0);
    const keys = [];
    for (let t = start.getTime(); t <= end.getTime() && t <= today.getTime(); t += DAY) keys.push(dayKey(t));
    months.push({ start, keys });
  }
  const allKeys = months.flatMap((m) => m.keys);
  return {
    buckets: months.map((m, i) => ({ label: MONTHS[m.start.getMonth()], full: `${MONTHS[m.start.getMonth()]} ${m.start.getFullYear()}`, values: sumRows(m.keys), highlight: i === 11 })),
    keys: allKeys, prevKeys: daysBack(365, allKeys.length).map(dayKey),
    label: `${MONTHS[months[0].start.getMonth()]} ${months[0].start.getFullYear()} — ${MONTHS[today.getMonth()]} ${today.getFullYear()}`,
  };
}
const total = (keys) => keys.reduce((s, k) => s + daySales(k), 0);
const pctChange = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : 0);

/* ================= HOME ================= */
const HomePage = {
  title: 'Dashboard',
  search: 'Search a product',
  render() {
    const data = buildBuckets(ui.range);
    const cur = total(data.keys), prev = total(data.prevKeys);
    const sums = sumRows(data.keys);
    const tk = dayKey(new Date()), yk = dayKey(Date.now() - DAY);
    const today = daySales(tk), yesterday = daySales(yk);
    const owing = state.customers.filter((c) => c.balance > 0).length;
    const low = lowStockProducts().slice(0, 5);
    const rangeWord = { '1D': 'yesterday', '7D': 'previous 7 days', '14D': 'previous 14 days', '1M': 'previous month', '3M': 'previous 3 months', '1Y': 'previous year' }[ui.range];

    return `
      <div class="page-head"><div><h1>Dashboard</h1><p class="muted">Here's how ${esc(state.profile.storeName)} is doing.</p></div></div>
      <div class="dash-grid">
        <section class="card chart-card">
          <div class="card-row">
            <div class="row gap-8"><h3>Sales overview</h3>${badge('PREMIUM', 'orange')}</div>
            <span class="muted sm">${esc(data.label)}</span>
          </div>
          <div class="row gap-8 wrap mt-12"><span class="big-num">${peso(cur)}</span>${changePill(pctChange(cur, prev))}<span class="muted sm">vs ${rangeWord}</span></div>
          <div class="legend">${SERIES.map((s) => `<span><i style="background:${s.color}"></i>${s.name} <b>${peso(sums[s.id], 0)}</b></span>`).join('')}</div>
          <div class="chart" id="salesChart"></div>
          <div class="chips mt-12">${['1D', '7D', '14D', '1M', '3M', '1Y'].map((r) => `<button class="chip chip-sm ${r === ui.range ? 'active' : ''}" data-range="${r}">${r}</button>`).join('')}</div>
        </section>
        <div class="dash-side">
          <section class="card stat-card">
            <span class="muted sm">Today's sales</span>
            <span class="stat-num">${peso(today)}</span>
            <div class="row gap-8">${changePill(pctChange(today, yesterday))}<span class="muted sm">vs yesterday</span></div>
          </section>
          <a class="card stat-card link-card" href="#/utang">
            <span class="muted sm">Utang to collect</span>
            <span class="stat-num">${peso(utangToCollect())}</span>
            <div class="row gap-8">${badge(`${owing} customer${owing === 1 ? '' : 's'}`, 'orange')}<span class="muted sm">pending balance</span></div>
          </a>
          <section class="card">
            <div class="card-row"><h3>Low stock</h3><a href="#/inventory" class="link">View all</a></div>
            <ul class="low-list">
              ${low.length ? low.map((p) => `<li>
                ${productThumb(p, 'thumb-sm')}
                <div class="grow"><strong>${esc(p.name)}</strong><span class="muted xs">${esc(getCategory(p.cat)?.short || '')}</span></div>
                ${p.stock === 0 ? badge('Out of stock', 'red') : badge(`${p.stock} left`, 'orange')}
              </li>`).join('') : '<li class="muted sm">All products are well stocked. 🎉</li>'}
            </ul>
          </section>
        </div>
      </div>`;
  },
  bind(root) {
    stackedChart(root.querySelector('#salesChart'), buildBuckets(ui.range).buckets, { animate: ui.chartAnim });
    ui.chartAnim = false;
    root.querySelectorAll('[data-range]').forEach((b) => (b.onclick = () => { ui.range = b.dataset.range; ui.chartAnim = true; rerender(); }));
  },
};

/* ================= PRODUCTS ================= */
const ProductsPage = {
  title: 'Products',
  search: 'Search a product',
  render() {
    const q = ui.query.toLowerCase();
    const list = state.products.filter((p) =>
      (ui.productCat === 'all' || p.cat === ui.productCat) && (!q || p.name.toLowerCase().includes(q)));
    return `
      <div class="page-head">
        <div><h1>Products</h1><p class="muted">Tap the red button to record a sale.</p></div>
        <div class="row gap-12"><span class="muted sm">${totalUnits()} units in stock</span>
          <button class="btn btn-primary btn-sm" data-act="new-product">${icon('plus')}Add product</button></div>
      </div>
      <div class="chips scroll-x">
        <button class="chip ${ui.productCat === 'all' ? 'active' : ''}" data-cat="all">All</button>
        ${state.categories.map((c) => `<button class="chip ${ui.productCat === c.id ? 'active' : ''}" data-cat="${c.id}">${esc(c.short)}</button>`).join('')}
      </div>
      <div class="product-grid">
        ${list.map((p) => `
          <article class="card product-card ${p.stock === 0 ? 'is-out' : ''}">
            ${stockBadge(p)}
            <button type="button" class="thumb-btn" data-edit-product="${p.id}" aria-label="Edit ${esc(p.name)}">${productThumb(p, 'thumb-lg')}<span class="thumb-edit">${icon('edit')}</span></button>
            <h4>${esc(p.name)}</h4>
            <span class="muted xs">${esc(getCategory(p.cat)?.short || '')}</span>
            <div class="card-row mt-auto">
              <span class="price">${peso(p.price)}</span>
              <button class="sell-btn" data-sell="${p.id}" ${p.stock === 0 ? 'disabled' : ''} aria-label="Record sale of ${esc(p.name)}">${icon('minus')}</button>
            </div>
          </article>`).join('') || `<div class="empty">${icon('search')}<p>No products match “${esc(ui.query)}”.</p></div>`}
      </div>`;
  },
  bind(root) {
    root.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { ui.productCat = b.dataset.cat; rerender(); }));
    if (ui.lastSold) {
      const card = root.querySelector(`[data-sell="${ui.lastSold}"]`)?.closest('.product-card');
      if (card) card.classList.add('sold');
      ui.lastSold = null;
    }
    root.querySelectorAll('[data-sell]').forEach((b) => (b.onclick = () => {
      const p = getProduct(b.dataset.sell);
      if (recordSale(p.id)) {
        floatText(b, '+' + peso(p.price, 0));
        ui.lastSold = p.id;
        toast('sale', `1x ${p.name} — ${peso(p.price)}`);
        if (p.stock === 0) toast('error', `${p.name} is now out of stock.`, 'Out of stock');
        else if (p.stock === state.settings.lowStock) toast('error', `${p.name} is running low (${p.stock} left).`, 'Low stock');
        rerender();
      }
    }));
    root.querySelectorAll('[data-edit-product]').forEach((b) => (b.onclick = () => productModal(null, b.dataset.editProduct)));
    root.querySelector('[data-act="new-product"]').onclick = () => productModal();
  },
};

function productModal(catId, editId) {
  const p = editId ? getProduct(editId) : null;
  if (!p && state.products.length >= state.profile.productLimit) {
    toast('error', `The ${state.profile.plan} plan allows ${state.profile.productLimit} products. Upgrade to Premium for expanded storage.`, 'Product limit reached');
    return;
  }
  const cat0 = p ? p.cat : catId || state.categories[0]?.id;
  // The picture being edited: a photo (data URL) or none, plus the chosen drawing
  const pic = { photo: p ? PHOTOS.get(p.id) || null : null, art: p ? p.art || defaultArtFor(p.cat) : defaultArtFor(cat0), picked: !!p };
  const { form } = openModal({
    title: p ? 'Edit product' : 'Add product',
    subtitle: p ? '' : `${state.products.length}/${state.profile.productLimit} products used`,
    submitLabel: p ? 'Save changes' : 'Add product',
    body: `
      <div class="photo-field">
        <div class="photo-preview thumb" data-preview></div>
        <div class="photo-actions">
          <span class="field-label">Product photo</span>
          <label class="btn btn-white btn-sm photo-pick">${icon('camera')}<span>Take or choose photo</span><input type="file" name="photo" accept="image/*" /></label>
          <button type="button" class="btn btn-ghost btn-sm" data-remove-photo>Remove photo</button>
          <p class="muted xs">A clear photo on a plain background works best.</p>
        </div>
      </div>
      <div class="field"><span>Or use a drawing</span>
        <div class="art-picker" role="radiogroup" aria-label="Drawings">${Object.entries(ART).map(([k, a]) => `<button type="button" class="art-opt" role="radio" data-art="${k}" title="${a.label}" aria-label="${a.label}">${artSVG(k)}</button>`).join('')}</div>
      </div>
      <label class="field"><span>Product name</span><input name="name" value="${p ? esc(p.name) : ''}" placeholder="e.g. Bear Brand Swak" maxlength="60" /></label>
      <label class="field"><span>Category</span><select name="cat">${state.categories.map((c) => `<option value="${c.id}" ${c.id === cat0 ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
      <div class="field-row">
        <label class="field"><span>Price (₱)</span><input name="price" type="number" min="0" step="0.25" value="${p ? p.price : ''}" placeholder="0.00" /></label>
        <label class="field"><span>${p ? 'Stock' : 'Starting stock'}</span><input name="stock" type="number" min="0" step="1" value="${p ? p.stock : 0}" /></label>
      </div>`,
    onSubmit(f) {
      const name = f.name.value.trim();
      const price = parseFloat(f.price.value), stock = parseInt(f.stock.value, 10);
      if (!name) return fieldError(f, 'name', 'Enter a product name.');
      if (!(price >= 0)) return fieldError(f, 'price', 'Enter a valid price.');
      if (!(stock >= 0)) return fieldError(f, 'stock', 'Enter a valid stock count.');
      const fields = { name, cat: f.cat.value, price, stock, art: pic.art };
      let id;
      if (p) { Object.assign(p, fields); id = p.id; }
      else { id = uid('p'); state.products.push({ id, ...fields }); }
      if (pic.photo) setPhoto(id, pic.photo); else removePhoto(id);
      saveState();
      if (p) toast('info', `${name} updated.`, 'Product saved');
      else toast('stock', `${name} added with ${stock} in stock.`, 'Product added');
      rerender();
    },
  });

  const preview = form.querySelector('[data-preview]');
  const removeBtn = form.querySelector('[data-remove-photo]');
  const paint = () => {
    const tint = getCategory(form.cat.value)?.tint || 'sky';
    preview.className = `photo-preview thumb tint-${tint} ${pic.photo ? 'is-photo' : ''}`;
    preview.innerHTML = pic.photo ? `<img class="photo" src="${pic.photo}" alt="" />` : artSVG(pic.art);
    removeBtn.hidden = !pic.photo;
    form.querySelectorAll('[data-art]').forEach((b) => {
      const on = !pic.photo && b.dataset.art === pic.art;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
  };
  form.photo.onchange = async () => {
    const file = form.photo.files[0];
    form.photo.value = '';
    if (!file) return;
    try { pic.photo = await shrinkImage(file); paint(); }
    catch (e) { toast('error', 'That file isn’t a picture we can open. Try a JPG or PNG.', 'Photo not added'); }
  };
  removeBtn.onclick = () => { pic.photo = null; paint(); };
  form.querySelectorAll('[data-art]').forEach((b) => (b.onclick = () => { pic.art = b.dataset.art; pic.picked = true; pic.photo = null; paint(); }));
  // New products follow the category's usual drawing until one is picked
  form.cat.onchange = () => { if (!pic.picked) pic.art = defaultArtFor(form.cat.value); paint(); };
  paint();
}

/* ================= INVENTORY ================= */
const InventoryPage = {
  title: 'Inventory',
  search: 'Search categories',
  render() {
    const q = ui.query.toLowerCase();
    const cats = state.categories.filter((c) => !q || c.name.toLowerCase().includes(q));
    return `
      <div class="page-head">
        <div><h1>Inventory</h1><p class="muted">Manage stock by category.</p></div>
        <button class="btn btn-primary btn-sm" data-act="add-cat">${icon('plus')}Add category</button>
      </div>
      <div class="cat-grid">
        ${cats.map((c) => {
          const items = state.products.filter((p) => p.cat === c.id);
          const units = items.reduce((s, p) => s + p.stock, 0);
          const low = items.filter((p) => p.stock <= state.settings.lowStock).length;
          return `<article class="cat-card tint-${c.tint}">
            <div class="cat-art">${categoryArt(c, items)}</div>
            <h4>${esc(c.name)}</h4>
            <p class="muted xs">${items.length} product${items.length === 1 ? '' : 's'} · ${units} units${low ? ` · <b class="warn">${low} low</b>` : ''}</p>
            <div class="cat-actions">
              <button class="btn btn-white btn-sm" data-edit="${c.id}">${icon('edit')}Edit</button>
              <button class="btn btn-primary btn-sm" data-add="${c.id}">${icon('plus')}Add stock</button>
            </div>
          </article>`;
        }).join('') || `<div class="empty">${icon('search')}<p>No categories match “${esc(ui.query)}”.</p></div>`}
      </div>`;
  },
  bind(root) {
    root.querySelector('[data-act="add-cat"]').onclick = () => categoryModal();
    root.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => categoryModal(b.dataset.edit)));
    root.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => addStockModal(b.dataset.add)));
  },
};

/* Up to 4 product pictures fanned out; drawings for an empty category. */
function categoryArt(c, items) {
  const pics = items.slice(0, 4).map((p) => ({ html: productPicture(p), photo: PHOTOS.has(p.id) }));
  const all = pics.length ? pics : (CATEGORY_ART[c.id] || ['box', 'candy']).slice(0, 3).map((k) => ({ html: artSVG(k), photo: false }));
  return all.map((x, i) => `<span class="cat-pic ${x.photo ? 'is-photo' : ''}" style="--i:${i - (all.length - 1) / 2}">${x.html}</span>`).join('');
}

const TINTS = ['green', 'peach', 'rose', 'lilac', 'butter', 'sky', 'mint'];
function categoryModal(id) {
  const c = id ? getCategory(id) : null;
  const items = c ? state.products.filter((p) => p.cat === c.id) : [];
  openModal({
    title: c ? 'Edit category' : 'Add category',
    submitLabel: c ? 'Save changes' : 'Add category',
    body: `
      <label class="field"><span>Category name</span><input name="name" value="${c ? esc(c.name) : ''}" placeholder="e.g. Frozen Goods" maxlength="40" /></label>
      <label class="field"><span>Short label</span><input name="short" value="${c ? esc(c.short) : ''}" placeholder="e.g. Frozen" maxlength="18" /></label>
      <label class="field"><span>Chart group</span><select name="series">${SERIES.map((s) => `<option value="${s.id}" ${c && c.series === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
      ${c ? `<div class="mini-list"><span class="muted xs">Products in this category</span>${items.map((p) => `
        <div class="mini-row">${productThumb(p, 'thumb-xs')}<span class="grow">${esc(p.name)}</span><span class="muted xs">${p.stock} left</span>
        <button type="button" class="icon-btn sm" data-edit-product="${p.id}" title="Edit product">${icon('edit')}</button>
        <button type="button" class="icon-btn sm" data-del-product="${p.id}" title="Remove product">${icon('trash')}</button></div>`).join('') || '<p class="muted xs">None yet.</p>'}
        <button type="button" class="btn btn-ghost btn-sm" data-new-product>${icon('plus')}Add product here</button></div>` : ''}`,
    onSubmit(f) {
      const name = f.name.value.trim();
      if (!name) return fieldError(f, 'name', 'Enter a category name.');
      const short = f.short.value.trim() || name.split(/[ &]/)[0];
      if (c) Object.assign(c, { name, short, series: f.series.value });
      else state.categories.push({ id: uid('c'), name, short, series: f.series.value, tint: TINTS[state.categories.length % TINTS.length] });
      saveState();
      toast('info', c ? `${name} updated.` : `${name} created.`, c ? 'Category saved' : 'Category added');
      rerender();
    },
  });
  const root = document.getElementById('modalRoot');
  root.querySelectorAll('[data-del-product]').forEach((b) => (b.onclick = () => {
    const p = getProduct(b.dataset.delProduct);
    if (b.dataset.confirm) {
      state.products = state.products.filter((x) => x.id !== p.id);
      removePhoto(p.id);
      saveState();
      b.closest('.mini-row').remove();
      toast('info', `${p.name} removed.`, 'Product removed');
      rerender();
    } else {
      b.dataset.confirm = '1';
      b.classList.add('confirm');
      b.title = 'Click again to remove';
      b.innerHTML = '<span class="xs">Remove?</span>';
    }
  }));
  root.querySelectorAll('[data-edit-product]').forEach((b) => (b.onclick = () => productModal(null, b.dataset.editProduct)));
  const np = root.querySelector('[data-new-product]');
  if (np) np.onclick = () => productModal(c.id);
}

function addStockModal(catId) {
  const items = state.products.filter((p) => p.cat === catId);
  const cat = getCategory(catId);
  if (!items.length) { productModal(catId); return; }
  openModal({
    title: 'Add stock',
    subtitle: cat.name,
    submitLabel: 'Add stock',
    body: `
      <label class="field"><span>Product</span><select name="product">${items.map((p) => `<option value="${p.id}">${esc(p.name)} (${p.stock} left)</option>`).join('')}</select></label>
      <label class="field"><span>Quantity received</span>
        <div class="stepper big"><button type="button" data-step="-1">${icon('minus')}</button><input name="qty" type="number" min="1" value="12" /><button type="button" data-step="1">${icon('plus')}</button></div>
      </label>`,
    onSubmit(f) {
      const qty = parseInt(f.qty.value, 10);
      if (!(qty > 0)) return fieldError(f, 'qty', 'Enter a quantity of at least 1.');
      const p = getProduct(f.product.value);
      addStock(p.id, qty);
      toast('stock', `+${qty} ${p.name} (now ${p.stock}).`);
      rerender();
    },
  });
  bindSteppers(document.getElementById('modalRoot'), 1);
}

function bindSteppers(root, min = 0) {
  root.querySelectorAll('.stepper').forEach((st) => {
    const input = st.querySelector('input');
    st.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => {
      input.value = Math.max(min, (parseInt(input.value, 10) || 0) + parseInt(b.dataset.step, 10));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }));
  });
}

/* ================= UTANG LEDGER ================= */
const UtangPage = {
  title: 'Utang Ledger',
  search: 'Search a customer',
  render() {
    const q = ui.query.toLowerCase();
    const owing = state.customers.filter((c) => c.balance > 0).length;
    const overdue = overdueTotal();
    const list = state.customers.filter((c) =>
      (ui.utangFilter === 'all' || customerStatus(c) === ui.utangFilter) && (!q || c.name.toLowerCase().includes(q)));
    const statusBadge = (s) => s === 'paid' ? badge('Paid', 'green') : s === 'overdue' ? badge('Overdue', 'red') : badge('Pending', 'orange');
    return `
      <div class="page-head">
        <div><h1>Utang Ledger</h1><p class="muted">Track who owes you and send reminders.</p></div>
        <button class="btn btn-primary btn-sm" data-act="new-utang">${icon('plus')}New utang</button>
      </div>
      <div class="two-col">
        <section class="card stat-card"><span class="muted sm">To collect</span><span class="stat-num">${peso(utangToCollect())}</span>
          <div>${badge(`${owing} customer${owing === 1 ? '' : 's'} with balance`, 'orange')}</div></section>
        <section class="card stat-card"><span class="muted sm">Overdue</span><span class="stat-num">${peso(overdue)}</span>
          <div>${overdue > 0 ? badge(`Unpaid over ${OVERDUE_DAYS} days`, 'red') : badge('All balances on time', 'green')}</div></section>
      </div>
      <div class="card-row mt-24 wrap gap-12">
        <h3>Customers</h3>
        <div class="seg">${['all', 'pending', 'overdue', 'paid'].map((f) => `<button class="${ui.utangFilter === f ? 'active' : ''}" data-filter="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div>
      </div>
      <div class="cust-list">
        ${list.map((c) => {
          const s = customerStatus(c);
          return `<article class="card cust-row">
            <span class="avatar av-${c.color}">${esc(initials(c.name))}</span>
            <div class="grow">
              <div class="row gap-8"><strong>${esc(c.name)}</strong><button class="icon-btn sm" data-edit-cust="${c.id}" aria-label="Edit ${esc(c.name)}" title="Edit customer">${icon('edit')}</button></div>
              <span class="muted xs cust-phone">${c.mobile ? `${icon('sms')}+63 ${esc(c.mobile)}` : `<span class="warn">No mobile number</span>`}</span>
              <span class="muted xs">${esc(c.items)}</span>
            </div>
            <div class="cust-money"><span class="amount">${peso(c.balance)}</span>${statusBadge(s)}</div>
            <div class="cust-actions">
              <button class="btn btn-soft btn-sm" data-pay="${c.id}" ${c.balance <= 0 ? 'disabled' : ''}>${icon('cash')}Record Payment</button>
              <button class="btn btn-primary btn-sm" data-sms="${c.id}" ${c.balance <= 0 ? 'disabled' : ''}>${icon('sms')}Send SMS</button>
            </div>
          </article>`;
        }).join('') || `<div class="empty">${icon('ledger')}<p>No customers here.</p></div>`}
      </div>
      <div class="banner mt-16">
        <span class="banner-ico">${icon('bell')}</span>
        <div class="grow"><strong>Auto SMS reminders ${state.settings.autoSms ? badge('On', 'green') : badge('Off', 'gray')}</strong>
          <span class="muted xs">Customers get a text after ${state.settings.remindAfter} days of unpaid balance. Change this anytime in Profile settings.</span></div>
        <a href="#/profile" class="link">Manage</a>
      </div>`;
  },
  bind(root) {
    root.querySelectorAll('[data-filter]').forEach((b) => (b.onclick = () => { ui.utangFilter = b.dataset.filter; rerender(); }));
    root.querySelector('[data-act="new-utang"]').onclick = () => utangModal();
    root.querySelectorAll('[data-pay]').forEach((b) => (b.onclick = () => paymentModal(b.dataset.pay)));
    root.querySelectorAll('[data-sms]').forEach((b) => (b.onclick = () => smsModal(b.dataset.sms)));
    root.querySelectorAll('[data-edit-cust]').forEach((b) => (b.onclick = () => customerModal(b.dataset.editCust)));
  },
};

const findCustomer = (name) => state.customers.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());

/* Returns an error message if the number is invalid or used by another customer. */
function mobileProblem(value, selfId) {
  if (!mobileDigits(value)) return 'Enter the customer’s mobile number so you can send SMS reminders.';
  if (!isValidMobile(value)) return 'Enter a valid PH mobile number, e.g. 912 345 6789.';
  const other = state.customers.find((c) => c.id !== selfId && c.mobile && mobileDigits(c.mobile) === mobileDigits(value));
  if (other) return `This number is already saved for ${other.name}.`;
  return '';
}

function utangModal() {
  openModal({
    title: 'New utang',
    subtitle: 'Add a balance for a new or existing customer.',
    submitLabel: 'Save utang',
    body: `
      <label class="field"><span>Customer name</span><input name="name" list="custNames" placeholder="e.g. Kuya Ben" maxlength="40" autocomplete="off" />
        <datalist id="custNames">${state.customers.map((c) => `<option value="${esc(c.name)}">`).join('')}</datalist></label>
      ${phoneField('mobile', 'Mobile number (required for SMS reminders)')}
      <label class="field"><span>Items</span><input name="items" placeholder="e.g. 2x Coke Mismo, 1x Skyflakes" maxlength="80" /></label>
      <label class="field"><span>Amount (₱)</span><input name="amount" type="number" inputmode="decimal" min="1" step="0.25" placeholder="0.00" /></label>`,
    onSubmit(f) {
      const name = f.name.value.trim(), amount = parseFloat(f.amount.value), items = f.items.value.trim();
      if (!name) return fieldError(f, 'name', 'Enter the customer name.');
      const existing = findCustomer(name);
      const bad = mobileProblem(f.mobile.value, existing?.id);
      if (bad) return fieldError(f, 'mobile', bad);
      if (!(amount > 0)) return fieldError(f, 'amount', 'Enter an amount greater than 0.');
      const mobile = formatMobile(f.mobile.value);
      if (existing) {
        if (existing.balance <= 0) { existing.since = Date.now(); existing.items = ''; }
        existing.balance += amount;
        existing.mobile = mobile;
        if (items) existing.items = existing.items ? `${existing.items}, ${items}` : items;
      } else {
        const colors = ['orange', 'blue', 'purple', 'green'];
        state.customers.unshift({ id: uid('c'), name, mobile, items: items || '—', balance: amount, color: colors[state.customers.length % 4], since: Date.now(), payments: [] });
      }
      saveState();
      toast('info', `${peso(amount)} added to ${name} (+63 ${mobile}).`, 'Utang saved');
      rerender();
    },
  });
  const form = document.querySelector('#modalRoot form');
  bindPhoneInput(form.mobile);
  // Picking an existing customer fills in their saved number
  form.name.addEventListener('input', () => {
    const c = findCustomer(form.name.value);
    if (c && c.mobile && !form.mobile.value) form.mobile.value = c.mobile;
  });
}

function customerModal(id) {
  const c = state.customers.find((x) => x.id === id);
  openModal({
    title: 'Edit customer',
    submitLabel: 'Save',
    body: `
      <label class="field"><span>Customer name</span><input name="name" value="${esc(c.name)}" maxlength="40" /></label>
      ${phoneField('mobile', 'Mobile number', c.mobile)}`,
    onSubmit(f) {
      const name = f.name.value.trim();
      if (!name) return fieldError(f, 'name', 'Enter the customer name.');
      const dup = findCustomer(name);
      if (dup && dup.id !== c.id) return fieldError(f, 'name', `${dup.name} is already in your ledger.`);
      const bad = mobileProblem(f.mobile.value, c.id);
      if (bad) return fieldError(f, 'mobile', bad);
      c.name = name; c.mobile = formatMobile(f.mobile.value);
      saveState(); toast('info', `${name} updated.`, 'Customer saved'); rerender();
    },
  });
  bindPhoneInput(document.querySelector('#modalRoot [name="mobile"]'));
}

function paymentModal(id) {
  const c = state.customers.find((x) => x.id === id);
  openModal({
    title: 'Record payment',
    subtitle: `${c.name} owes ${peso(c.balance)}`,
    submitLabel: 'Record payment',
    body: `
      <label class="field"><span>Amount paid (₱)</span><input name="amount" type="number" min="0.25" step="0.25" max="${c.balance}" value="${c.balance}" /></label>
      <div class="quick-amts">${[20, 50, 100].filter((v) => v < c.balance).map((v) => `<button type="button" class="chip chip-sm" data-amt="${v}">${peso(v, 0)}</button>`).join('')}
        <button type="button" class="chip chip-sm" data-amt="${c.balance}">Full</button></div>`,
    onSubmit(f) {
      const amt = parseFloat(f.amount.value);
      if (!(amt > 0)) return fieldError(f, 'amount', 'Enter an amount greater than 0.');
      if (amt > c.balance + 0.001) return fieldError(f, 'amount', `That's more than the balance of ${peso(c.balance)}.`);
      c.balance = Math.round((c.balance - amt) * 100) / 100;
      c.payments.push({ amount: amt, at: Date.now() });
      if (c.balance <= 0) c.items = 'Fully paid';
      saveState();
      toast('payment', `${c.name} paid ${peso(amt)}. ${c.balance > 0 ? `Remaining ${peso(c.balance)}.` : 'Balance cleared!'}`);
      rerender();
    },
  });
  document.querySelectorAll('#modalRoot [data-amt]').forEach((b) => (b.onclick = () => (document.querySelector('#modalRoot [name="amount"]').value = b.dataset.amt)));
}

function smsModal(id) {
  const c = state.customers.find((x) => x.id === id);
  const msg = reminderText(c);
  openModal({
    title: 'Send SMS reminder',
    subtitle: `To ${c.name}`,
    submitLabel: 'Send SMS',
    body: `${phoneField('mobile', 'Send to', c.mobile, c.mobile ? '' : 'This customer has no number yet — add one to send the reminder.')}
      <label class="field"><span>Message</span><textarea name="msg" rows="5" maxlength="320">${esc(msg)}</textarea></label>
      <p class="muted xs">This demo doesn't send real texts — connect an SMS gateway to go live.</p>`,
    onSubmit(f) {
      const bad = mobileProblem(f.mobile.value, c.id);
      if (bad) return fieldError(f, 'mobile', bad);
      if (!f.msg.value.trim()) return fieldError(f, 'msg', 'The message is empty.');
      const mobile = formatMobile(f.mobile.value);
      if (mobile !== c.mobile) { c.mobile = mobile; saveState(); rerender(); }
      toast('sms', `Reminder sent to ${c.name} (+63 ${mobile}).`);
    },
  });
  bindPhoneInput(document.querySelector('#modalRoot [name="mobile"]'));
}

/* ================= PROFILE ================= */
const ProfilePage = {
  title: 'Profile',
  search: 'Search',
  render() {
    const p = state.profile, s = state.settings;
    const used = state.products.length;
    const pct = Math.min(100, (used / p.productLimit) * 100);
    const step = (key, val) => `<div class="stepper"><button type="button" data-set-step="${key}" data-d="-1" aria-label="Decrease">${icon('minus')}</button><span>${val}</span><button type="button" data-set-step="${key}" data-d="1" aria-label="Increase">${icon('plus')}</button></div>`;
    return `
      <div class="page-head"><div><h1>Profile</h1><p class="muted">Your account and store settings.</p></div></div>
      <section class="card profile-card">
        <div class="avatar-lg">${icon('user')}</div>
        <div class="grow">
          <h2>${esc(p.ownerName)}</h2>
          <div class="row gap-8 wrap">${badge(p.plan, 'outline')}<span class="muted sm">${esc(p.storeName)} · ${esc(p.location)}</span></div>
          ${state.user ? `<span class="muted xs">+63 ${esc(state.user.mobile)}</span>` : ''}
        </div>
        <button class="btn btn-white btn-sm" data-act="edit-profile">${icon('edit')}Edit profile</button>
      </section>
      <div class="three-col mt-16">
        <section class="card stat-card"><span class="muted sm">Products</span><span class="stat-num sm">${used}/${p.productLimit}</span>
          <div class="progress"><i style="width:${pct}%"></i></div></section>
        <section class="card stat-card"><span class="muted sm">Customers</span><span class="stat-num sm">${state.customers.length}</span></section>
        <section class="card stat-card"><span class="muted sm">Utang to collect</span><span class="stat-num sm">${peso(utangToCollect())}</span></section>
      </div>
      <div class="profile-grid mt-16">
        <section class="card">
          <h3>Settings</h3>
          <div class="setting"><span class="set-ico">${icon('sms')}</span><div class="grow"><strong>Auto SMS reminders</strong><span class="muted xs">Text customers with overdue utang</span></div>
            <label class="switch"><input type="checkbox" data-toggle="autoSms" ${s.autoSms ? 'checked' : ''}/><i></i></label></div>
          <div class="setting"><span class="set-ico">${icon('globe')}</span><div class="grow"><strong>Language</strong><span class="muted xs">App language</span></div>
            <select class="select-sm" data-select="language">${['English', 'Filipino', 'Cebuano'].map((l) => `<option ${l === s.language ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <div class="setting"><span class="set-ico">${icon('alert')}</span><div class="grow"><strong>Low-stock alert</strong><span class="muted xs">Warn when stock is below this</span></div>${step('lowStock', s.lowStock)}</div>
          <div class="setting"><span class="set-ico">${icon('clock')}</span><div class="grow"><strong>Remind after (days)</strong><span class="muted xs">Days a balance stays unpaid before an SMS</span></div>${step('remindAfter', s.remindAfter)}</div>
        </section>
        <div class="stack-16">
          <section class="card dark-card">
            <div class="row gap-8">${icon('diamond', 'gem')}<h3>${esc(p.plan)} plan</h3></div>
            <p>₱199/month · Inventory, sales logging, utang ledger with SMS reminders, and daily &amp; weekly profit reports.</p>
            <button class="btn btn-light btn-block" data-action="premium">See Premium Features</button>
          </section>
          <section class="card">
            <h3>Account</h3>
            <div class="acct-row">${icon('store')}<span>${esc(p.storeName)}</span></div>
            <div class="acct-row">${icon('pin')}<span>${esc(p.location)}</span></div>
            <button class="btn btn-outline-danger btn-block mt-12" data-act="logout">${icon('logout')}Log out</button>
            <button class="btn btn-ghost btn-block btn-sm mt-8" data-act="reset">Reset demo data</button>
          </section>
        </div>
      </div>`;
  },
  bind(root) {
    const limits = { lowStock: [0, 99], remindAfter: [1, 60] };
    root.querySelectorAll('[data-set-step]').forEach((b) => (b.onclick = () => {
      const k = b.dataset.setStep, [lo, hi] = limits[k];
      state.settings[k] = Math.min(hi, Math.max(lo, state.settings[k] + parseInt(b.dataset.d, 10)));
      saveState(); rerender();
    }));
    root.querySelector('[data-toggle="autoSms"]').onchange = (e) => {
      state.settings.autoSms = e.target.checked; saveState();
      toast('info', `Auto SMS reminders turned ${e.target.checked ? 'on' : 'off'}.`, 'Settings saved');
    };
    root.querySelector('[data-select="language"]').onchange = (e) => {
      state.settings.language = e.target.value; saveState();
      applyLanguage();
      toast('info', `Language set to ${e.target.value}.`, 'Settings saved');
    };
    root.querySelectorAll('[data-act="edit-profile"]').forEach((b) => (b.onclick = editProfileModal));
    root.querySelector('[data-act="logout"]').onclick = () => {
      openModal({ title: 'Log out?', body: '<p class="muted">You can log back in anytime with your mobile number. Your data stays on this device.</p>', submitLabel: 'Log out', danger: true,
        onSubmit() { state.user = null; saveState(); location.hash = '#/login'; } });
    };
    root.querySelector('[data-act="reset"]').onclick = () => {
      openModal({ title: 'Reset demo data?', body: '<p class="muted">This restores the sample products, customers and sales, and takes you back to onboarding.</p>', submitLabel: 'Reset', danger: true,
        onSubmit() { resetState(); clearPhotos(); welcomeSeen = false; location.hash = '#/welcome'; route(); } });
    };
  },
};

function editProfileModal() {
  const p = state.profile;
  openModal({
    title: 'Edit profile',
    submitLabel: 'Save',
    body: `
      <label class="field"><span>Owner name</span><input name="ownerName" value="${esc(p.ownerName)}" maxlength="40" /></label>
      <label class="field"><span>Store name</span><input name="storeName" value="${esc(p.storeName)}" maxlength="40" /></label>
      <label class="field"><span>Location</span><input name="location" value="${esc(p.location)}" maxlength="40" /></label>`,
    onSubmit(f) {
      for (const k of ['ownerName', 'storeName', 'location']) if (!f[k].value.trim()) return fieldError(f, k, 'This field is required.');
      p.ownerName = f.ownerName.value.trim(); p.storeName = f.storeName.value.trim(); p.location = f.location.value.trim();
      saveState(); toast('info', 'Profile updated.', 'Saved'); rerender();
    },
  });
}

/* ================= ONBOARDING + LOGIN (full screen) ================= */
const SLIDES = [
  { kicker: 'Welcome to', title: 'TindaTrack!', text: "We're thrilled to have you on board! TindaTrack is designed specifically for sari-sari store and minimart owners like you to make managing your daily operations fast, effortless, and organized." },
  { kicker: 'Record sales', title: 'In one tap.', text: 'Tap a product to log a sale. Stock updates automatically, and your dashboard shows how the day is going.' },
  { kicker: 'Never forget', title: 'Any utang.', text: 'Keep a clean ledger of who owes what, record payments, and send friendly SMS reminders.' },
  { kicker: 'Stay stocked', title: 'Get alerts.', text: "See what's running low before it runs out, so your suki always find what they need." },
];

function renderOnboarding(screen) {
  let i = 0, timer;
  screen.innerHTML = `
    <div class="onboard">
      <div class="onboard-bg" aria-hidden="true">
        <div class="store-sign">${esc(state.profile.storeName.toUpperCase())}</div>
        <div class="shelves">${Array.from({ length: 4 }, () => `<div class="shelf">${'🥫🧃🍜🧴🍪🥤🍟🧼'.match(/./gu).sort(() => Math.random() - 0.5).map((e) => `<span>${e}</span>`).join('')}</div>`).join('')}</div>
      </div>
      <div class="onboard-content">
        <div class="slide" id="slide"></div>
        <div class="dots" id="dots">${SLIDES.map((_, k) => `<button aria-label="Slide ${k + 1}" data-k="${k}"></button>`).join('')}</div>
        <button class="btn btn-primary btn-lg" id="getStarted">Get Started</button>
      </div>
    </div>`;
  const show = (k) => {
    i = (k + SLIDES.length) % SLIDES.length;
    const s = SLIDES[i];
    const el = screen.querySelector('#slide');
    el.classList.remove('in'); void el.offsetWidth;
    el.innerHTML = `<p class="kicker">${s.kicker}</p><h1>${s.title}</h1><p class="lead">${s.text}</p>`;
    el.classList.add('in');
    screen.querySelectorAll('#dots button').forEach((d, n) => d.classList.toggle('active', n === i));
  };
  // Store photo from Figma (images/Onboarding photo.png)
  const photo = new Image();
  photo.onload = () => {
    const bg = screen.querySelector('.onboard-bg');
    if (bg) { bg.style.backgroundImage = `url('${photo.src}')`; bg.classList.add('has-photo'); }
  };
  photo.src = 'images/Onboarding%20photo.png';
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 4500); };
  screen.querySelectorAll('#dots button').forEach((d) => (d.onclick = () => { show(+d.dataset.k); auto(); }));
  screen.querySelector('#getStarted').onclick = () => {
    clearInterval(timer);
    welcomeSeen = true;
    location.hash = state.user ? '#/home' : '#/login';
  };
  show(0); auto();
  return () => clearInterval(timer);
}

function renderLogin(screen) {
  screen.innerHTML = `
    <div class="login">
      <section class="login-hero">
        <div class="logo-disc">${logoSVG(190)}</div>
        <h1>Track every sale.<br/>Manage every utang.</h1>
        <p>Inventory, sales and utang for your sari-sari store, all in one place.</p>
      </section>
      <section class="login-form-wrap">
        <form class="login-form" novalidate>
          <h2>Welcome back</h2>
          <p class="muted">Log in with your mobile number to continue.</p>
          <div class="field">
            <span>Mobile number</span>
            <div class="phone-input">${phFlag()}<b>+63</b><input name="mobile" inputmode="numeric" autocomplete="tel-national" placeholder="912 345 6789" maxlength="12" /></div>
          </div>
          <div class="field otp" hidden>
            <span>Verification code</span>
            <input name="otp" inputmode="numeric" maxlength="6" placeholder="6-digit code" />
            <small class="muted">Demo mode: use code <b>123456</b>.</small>
          </div>
          <button class="btn btn-primary btn-block btn-lg" type="submit">Continue</button>
          <p class="fine">By continuing, you agree to the Terms of Service and Privacy Policy of TindaTrack.</p>
        </form>
      </section>
    </div>`;
  const form = screen.querySelector('form');
  const mobile = form.mobile;
  mobile.addEventListener('input', () => {
    const d = mobile.value.replace(/\D/g, '').slice(0, 10);
    mobile.value = [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
    mobile.closest('.field').classList.remove('has-error');
  });
  let step = 1;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const digits = mobile.value.replace(/\D/g, '');
    if (step === 1) {
      if (!/^9\d{9}$/.test(digits)) return fieldError(form, 'mobile', 'Enter a valid PH mobile number, e.g. 912 345 6789.');
      step = 2;
      form.querySelector('.otp').hidden = false;
      form.querySelector('button[type=submit]').textContent = 'Verify & log in';
      mobile.readOnly = true;
      form.otp.focus();
      toast('sms', `Verification code sent to +63 ${mobile.value}.`, 'Code sent');
      return;
    }
    if (form.otp.value.trim() !== '123456') return fieldError(form, 'otp', 'Incorrect code. Try 123456.');
    state.user = { mobile: mobile.value };
    saveState();
    location.hash = '#/home';
  });
  setTimeout(() => mobile.focus(), 50);
}

const PAGES = { home: HomePage, products: ProductsPage, inventory: InventoryPage, utang: UtangPage, profile: ProfilePage };
