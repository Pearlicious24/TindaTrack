/* ---------- Seed data + persistent state (localStorage) ---------- */

const STORAGE_KEY = 'tindatrack:v1';
const LOW_STOCK_DEFAULT = 7;
const OVERDUE_DAYS = 14;

/* Chart series — each category rolls up into one of these. */
const SERIES = [
  { id: 'bev', name: 'Beverages', color: '#ff6a00' },
  { id: 'snk', name: 'Snacks', color: '#ffb020' },
  { id: 'can', name: 'Canned & Noodles', color: '#a3b1cc' },
  { id: 'pc', name: 'Personal Care', color: '#16182a' },
];

const SEED_CATEGORIES = [
  { id: 'beverages', name: 'Beverages & Instant Coffee', short: 'Beverages', series: 'bev', tint: 'green' },
  { id: 'personal', name: 'Personal Care & Hygiene', short: 'Personal Care', series: 'pc', tint: 'peach' },
  { id: 'canned', name: 'Canned Goods & Preserves', short: 'Canned Goods', series: 'can', tint: 'rose' },
  { id: 'noodles', name: 'Instant Noodles & Pasta', short: 'Instant Noodles', series: 'can', tint: 'lilac' },
  { id: 'snacks', name: 'Snacks & Chips', short: 'Snacks', series: 'snk', tint: 'butter' },
  { id: 'biscuits', name: 'Biscuits & Sweets', short: 'Biscuits', series: 'snk', tint: 'sky' },
  { id: 'pantry', name: 'Pantry & Cooking', short: 'Pantry', series: 'can', tint: 'mint' },
];

const SEED_PRODUCTS = [
  { id: 'p1', name: 'Kopiko 3 in 1', cat: 'beverages', price: 12, stock: 48, art: 'coffee' },
  { id: 'p2', name: 'Dove Beauty Bar White', cat: 'personal', price: 48, stock: 24, art: 'soap' },
  { id: 'p3', name: 'Nissin Yakisoba Spicy Chicken', cat: 'noodles', price: 16, stock: 12, art: 'cupnoodle' },
  { id: 'p4', name: 'Ligo Sardines', cat: 'canned', price: 28, stock: 6, art: 'sardines' },
  { id: 'p5', name: 'Cracklings', cat: 'snacks', price: 10, stock: 32, art: 'pork' },
  { id: 'p6', name: 'Tanduay Rhum', cat: 'beverages', price: 65, stock: 0, art: 'liquor' },
  { id: 'p7', name: 'Red Horse Beer', cat: 'beverages', price: 75, stock: 2, art: 'beer' },
  { id: 'p8', name: 'Cooking Oil (250ml)', cat: 'pantry', price: 35, stock: 3, art: 'oil' },
  { id: 'p9', name: 'Eggs', cat: 'pantry', price: 9, stock: 5, art: 'eggs' },
  { id: 'p10', name: 'Lucky Me Pancit Canton', cat: 'noodles', price: 18, stock: 40, art: 'pancit' },
  { id: 'p11', name: 'Safeguard Soap', cat: 'personal', price: 42, stock: 15, art: 'soapbox' },
  { id: 'p12', name: 'Skyflakes Crackers', cat: 'biscuits', price: 8, stock: 36, art: 'crackers' },
  { id: 'p13', name: 'Coca-Cola Mismo', cat: 'beverages', price: 20, stock: 30, art: 'soda' },
  { id: 'p14', name: 'Century Tuna', cat: 'canned', price: 38, stock: 18, art: 'tuna' },
];

const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Mang Jose', mobile: '917 123 4567', items: '2x San Miguel Pale, 1x Instant Noodles', balance: 250, color: 'orange', daysAgo: 3 },
  { id: 'c2', name: 'Aling Myrna', mobile: '928 765 4321', items: '1x Cooking Oil, 2x Egg', balance: 140, color: 'blue', daysAgo: 5 },
  { id: 'c3', name: "Ma'am Gly", mobile: '995 246 8135', items: '2x Red Horse, 1x Vout', balance: 660, color: 'purple', daysAgo: 8 },
];

/* PH mobile helpers: store as "9XX XXX XXXX" (shown with +63). */
const mobileDigits = (s) => String(s || '').replace(/\D/g, '').replace(/^(63|0)(?=9)/, '').slice(0, 10);
const isValidMobile = (s) => /^9\d{9}$/.test(mobileDigits(s));
const formatMobile = (s) => { const d = mobileDigits(s); return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' '); };

/* ---------- Date helpers ---------- */
const DAY = 86400000;
function dayKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/* Deterministic pseudo-random so the seeded history is stable. */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ~2 years of daily sales per series (so "1Y vs previous year" has data). */
function seedHistory() {
  const rand = mulberry32(20261027);
  const history = {};
  const today = startOfDay();
  for (let i = 760; i >= 1; i--) {
    const d = new Date(today.getTime() - i * DAY);
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 1.35 : 1;
    const wave = 1 + 0.25 * Math.sin(i / 9);
    const k = weekend * wave;
    history[dayKey(d)] = {
      bev: Math.round((420 + rand() * 420) * k),
      snk: Math.round((280 + rand() * 360) * k),
      can: Math.round((170 + rand() * 200) * k),
      pc: Math.round((80 + rand() * 120) * k),
    };
  }
  // A few sales already made today
  history[dayKey(today)] = { bev: 860, snk: 520, can: 330, pc: 150 };
  return history;
}

function defaultState() {
  const now = Date.now();
  return {
    onboarded: false,
    user: null, // { mobile }
    profile: {
      ownerName: 'Nena Dela Cruz',
      storeName: "Nanay's Sari Sari Store",
      location: 'Batangas 4200',
      plan: 'Standard',
      productLimit: 50,
    },
    settings: {
      autoSms: false,
      language: 'English',
      lowStock: LOW_STOCK_DEFAULT,
      remindAfter: 5,
    },
    categories: SEED_CATEGORIES.map((c) => ({ ...c })),
    products: SEED_PRODUCTS.map((p) => ({ ...p })),
    customers: SEED_CUSTOMERS.map((c) => ({
      id: c.id, name: c.name, mobile: c.mobile, items: c.items, balance: c.balance, color: c.color,
      since: now - c.daysAgo * DAY, payments: [],
    })),
    history: seedHistory(),
    notifications: [],
  };
}

let state;
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch (e) {
    state = defaultState();
  }
  // Older saved data: give sample customers their numbers, others an empty one
  state.customers.forEach((c) => {
    if (c.mobile === undefined) c.mobile = SEED_CUSTOMERS.find((s) => s.id === c.id)?.mobile || '';
  });
  // Older saved data: emoji pictures become drawings
  state.products.forEach((p) => {
    if (!p.art) p.art = EMOJI_TO_ART[p.emoji] || defaultArtFor(p.cat);
    delete p.emoji;
  });
  // Make sure today's row exists
  const k = dayKey(new Date());
  if (!state.history[k]) state.history[k] = { bev: 0, snk: 0, can: 0, pc: 0 };
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage full / blocked */ }
}
function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  loadState();
}

/* ---------- Queries ---------- */
const getCategory = (id) => state.categories.find((c) => c.id === id);
const getProduct = (id) => state.products.find((p) => p.id === id);
const totalUnits = () => state.products.reduce((s, p) => s + p.stock, 0);
const lowStockProducts = () =>
  state.products.filter((p) => p.stock <= state.settings.lowStock).sort((a, b) => a.stock - b.stock);

function customerStatus(c) {
  if (c.balance <= 0) return 'paid';
  return Date.now() - c.since > OVERDUE_DAYS * DAY ? 'overdue' : 'pending';
}
const utangToCollect = () => state.customers.reduce((s, c) => s + Math.max(0, c.balance), 0);
const overdueTotal = () =>
  state.customers.filter((c) => customerStatus(c) === 'overdue').reduce((s, c) => s + c.balance, 0);

function daySales(key) {
  const row = state.history[key] || {};
  return SERIES.reduce((s, x) => s + (row[x.id] || 0), 0);
}

/* ---------- Mutations ---------- */
function recordSale(productId, qty = 1) {
  const p = getProduct(productId);
  if (!p || p.stock < qty) return false;
  p.stock -= qty;
  const series = getCategory(p.cat)?.series || 'bev';
  const k = dayKey(new Date());
  state.history[k] = state.history[k] || { bev: 0, snk: 0, can: 0, pc: 0 };
  state.history[k][series] += p.price * qty;
  saveState();
  return true;
}
function addStock(productId, qty) {
  const p = getProduct(productId);
  if (!p) return;
  p.stock += qty;
  saveState();
}

/* ---------- Formatting ---------- */
const peso = (n, dec = 2) =>
  '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const initials = (name) =>
  name.replace(/[^A-Za-z\s']/g, '').split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join('');
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const uid = (p) => p + Math.random().toString(36).slice(2, 8);
