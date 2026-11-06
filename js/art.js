/* ---------- Product illustrations ----------
   Flat drawings used as product pictures until the store owner adds a photo.
   Generic on purpose (no brand logos). Each is drawn on a 64×64 canvas. */

const SHADOW = '<ellipse cx="32" cy="59" rx="17" ry="2.6" fill="#1b1d2e" opacity=".09"/>';

const ART = {
  coffee: { label: 'Coffee sachet', svg: `
    <path d="M18 9h28l-1.5 46h-25z" fill="#7b4a2b"/>
    <path d="M18 9h28v5H18z" fill="#5b341d"/><path d="M18 9l2.3 2.5L22.7 9l2.3 2.5L27.3 9l2.3 2.5L32 9l2.3 2.5L36.7 9l2.3 2.5L41.3 9l2.3 2.5L46 9" fill="none" stroke="#3f2313" stroke-width="1"/>
    <path d="M19.4 50h25.2l-.2 5H19.6z" fill="#5b341d"/>
    <path d="M18.5 17h27v6h-27z" fill="#e9b24c"/>
    <path d="M25 31h13l-1.8 11h-9.4z" fill="#fff6e8"/><path d="M38 33h2.4a2.6 2.6 0 0 1 0 5.2H37" fill="none" stroke="#fff6e8" stroke-width="1.8"/>
    <path d="M29 28c-1.6-1.5 1.6-3 0-4.6M33.5 28c-1.6-1.5 1.6-3 0-4.6" fill="none" stroke="#f0cf9e" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M23 45h18" stroke="#e9b24c" stroke-width="2" stroke-linecap="round"/>` },

  soap: { label: 'Beauty bar', svg: `
    <path d="M10 33l22-9 22 9-22 9z" fill="#ffffff"/>
    <path d="M10 33v10l22 9V42z" fill="#e3ebf7"/><path d="M54 33v10l-22 9V42z" fill="#cbd9ee"/>
    <path d="M10 33l22 9 22-9" fill="none" stroke="#b9cbe6" stroke-width=".8"/>
    <ellipse cx="32" cy="33" rx="9" ry="3.6" fill="#8fb4e6"/>
    <ellipse cx="32" cy="32.6" rx="6" ry="2.2" fill="#d5e4f8"/>
    <circle cx="46" cy="18" r="4" fill="#fff" stroke="#9ec0ea" stroke-width="1.2"/><circle cx="52" cy="11" r="2.5" fill="#fff" stroke="#9ec0ea" stroke-width="1"/><circle cx="40" cy="12" r="1.8" fill="#fff" stroke="#9ec0ea" stroke-width="1"/>` },

  soapbox: { label: 'Soap box', svg: `
    <path d="M14 20h36v34H14z" fill="#f4f7f5"/>
    <path d="M14 20l6-7h30l-6 7z" fill="#ffffff"/><path d="M50 20l6-7v34l-6 7z" fill="#dfe6e2"/>
    <path d="M14 30h36v14H14z" fill="#2e8b57"/><path d="M50 30l6-7v14l-6 7z" fill="#24704a"/>
    <path d="M20 37a5 5 0 0 1 10 0a5 5 0 0 1-10 0z" fill="#fff"/><path d="M25 34v6M22 37h6" stroke="#2e8b57" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M33 35h12M33 39h8" stroke="#bfe5cf" stroke-width="2" stroke-linecap="round"/>` },

  cupnoodle: { label: 'Noodle cup', svg: `
    <path d="M14 18h36l-5 38H19z" fill="#fff8ee"/>
    <path d="M15.4 28h33.2l-1.3 10H16.7z" fill="#e8442e"/>
    <path d="M17.7 46h28.6" stroke="#f3b23c" stroke-width="3"/>
    <path d="M12 15h40v4H12z" fill="#d9d9df"/><path d="M12 15h40" stroke="#b9b9c3" stroke-width="1"/>
    <path d="M40 15c3-6 9-6 12-3l-4 3z" fill="#eeeef2"/>
    <path d="M21 33c2-2 4 2 6 0s4 2 6 0 4 2 6 0 4 2 4 0" fill="none" stroke="#ffd7a0" stroke-width="1.6" stroke-linecap="round"/>` },

  pancit: { label: 'Noodle pack', svg: `
    <path d="M9 16h46v34H9z" fill="#f28c28"/>
    <path d="M9 16h46v4H9zM9 46h46v4H9z" fill="#d9701a"/>
    <path d="M9 16l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2" fill="none" stroke="#b85d14" stroke-width=".8"/>
    <ellipse cx="38" cy="33" rx="12" ry="9" fill="#fff4dc"/>
    <path d="M29 31c2-2 4 2 6 0s4 2 6 0 3 2 5 0M29 35c2-2 4 2 6 0s4 2 6 0 3 2 5 0" fill="none" stroke="#e7b763" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="33" cy="29" r="1.4" fill="#4caf50"/><circle cx="43" cy="37" r="1.4" fill="#e8442e"/>
    <path d="M14 26h8M14 31h6M14 36h8" stroke="#ffe0b8" stroke-width="2" stroke-linecap="round"/>` },

  sardines: { label: 'Sardines can', svg: `
    <path d="M17 14h30v40H17z" fill="#c9ced8"/>
    <ellipse cx="32" cy="54" rx="15" ry="4" fill="#aeb4c1"/>
    <path d="M17 20h30v28H17z" fill="#d93a2b"/>
    <ellipse cx="32" cy="14" rx="15" ry="4" fill="#e3e6ec"/><ellipse cx="32" cy="14" rx="11" ry="2.6" fill="none" stroke="#b6bcc8" stroke-width="1"/>
    <path d="M21 34c4-5 13-5 17 0-4 5-13 5-17 0z" fill="#f4f6fa"/><path d="M38 34l5-4v8z" fill="#f4f6fa"/><circle cx="25" cy="33" r="1" fill="#d93a2b"/>
    <path d="M17 24h30M17 44h30" stroke="#f3c13a" stroke-width="1.6"/>` },

  tuna: { label: 'Tuna can', svg: `
    <path d="M10 28h44v20H10z" fill="#c9ced8"/>
    <ellipse cx="32" cy="48" rx="22" ry="6" fill="#aeb4c1"/>
    <path d="M10 31h44v14H10z" fill="#1f5fae"/>
    <ellipse cx="32" cy="28" rx="22" ry="6" fill="#e3e6ec"/><ellipse cx="32" cy="28" rx="17" ry="4" fill="none" stroke="#b6bcc8" stroke-width="1"/>
    <path d="M44 27h5v2h-5z" fill="#9aa1b0"/>
    <path d="M20 38c4-4 12-4 16 0-4 4-12 4-16 0z" fill="#e8f0fb"/><path d="M36 38l5-3v6z" fill="#e8f0fb"/><circle cx="24" cy="37.3" r=".9" fill="#1f5fae"/>` },

  chips: { label: 'Chips bag', svg: `
    <path d="M15 10h34c-2 6-2 38 0 44H15c2-6 2-38 0-44z" fill="#f6c026"/>
    <path d="M15 10h34v5H15zM15 49h34v5H15z" fill="#e0a810"/>
    <path d="M15 10l2.4 2 2.4-2 2.4 2 2.4-2 2.4 2 2.4-2 2.4 2 2.4-2 2.4 2 2.4-2 2.4 2 2.4-2 2.4 2 2.4-2" fill="none" stroke="#b9870b" stroke-width=".8"/>
    <path d="M18 24h28" stroke="#d93a2b" stroke-width="5"/>
    <ellipse cx="27" cy="37" rx="6" ry="4.5" fill="#f9e2a8" transform="rotate(-18 27 37)"/><ellipse cx="37" cy="40" rx="6" ry="4.5" fill="#f2cf73" transform="rotate(14 37 40)"/>
    <circle cx="26" cy="36" r=".8" fill="#d6a43a"/><circle cx="38" cy="39" r=".8" fill="#b9870b"/>` },

  liquor: { label: 'Liquor bottle', svg: `
    <path d="M28 6h8v5h-8z" fill="#c8a24a"/>
    <path d="M28.5 11h7v9c0 3 7.5 4 7.5 10v24a2 2 0 0 1-2 2H23a2 2 0 0 1-2-2V30c0-6 7.5-7 7.5-10z" fill="#7a3b16"/>
    <path d="M22 34h20v13H22z" fill="#f5e6c4"/><path d="M22 34h20M22 47h20" stroke="#c8a24a" stroke-width="1.4"/>
    <path d="M26 39h12M28 42.5h8" stroke="#7a3b16" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M25 52V31" stroke="#a65a2a" stroke-width="2" stroke-linecap="round" opacity=".7"/>` },

  beer: { label: 'Beer bottle', svg: `
    <path d="M28 5h8v4h-8z" fill="#e2342b"/>
    <path d="M29 9h6v10c0 2 6 4 6 10v25a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V29c0-6 6-8 6-10z" fill="#8a4b12"/>
    <path d="M23 34h18v13H23z" fill="#e2342b"/>
    <path d="M27 39h10M28.5 42.5h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M29 20h6" stroke="#f6d36b" stroke-width="2.4"/>
    <path d="M26.5 52V30" stroke="#b46a25" stroke-width="2" stroke-linecap="round" opacity=".8"/>` },

  soda: { label: 'Soda bottle', svg: `
    <path d="M28 6h8v4h-8z" fill="#d81f26"/>
    <path d="M29 10h6v6c4 4 6 7 4 13 3 6 3 15 0 21v4a2 2 0 0 1-2 2H27a2 2 0 0 1-2-2v-4c-3-6-3-15 0-21-2-6 0-9 4-13z" fill="#4a2414"/>
    <path d="M24.4 31h15.2v10H24.4z" fill="#d81f26"/>
    <path d="M27 36c3-3 6 3 10 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M28 48V44M28 27v-6" stroke="#8a5a3c" stroke-width="1.6" stroke-linecap="round"/>` },

  oil: { label: 'Cooking oil', svg: `
    <path d="M27 6h10v6H27z" fill="#2e9a4b"/>
    <path d="M27.5 12h9v5c5 2 7 5 7 10v26a3 3 0 0 1-3 3H23.5a3 3 0 0 1-3-3V27c0-5 2-8 7-10z" fill="#f7cf3b" opacity=".95"/>
    <path d="M20.5 26h23v2.4h-23z" fill="#fff3c2" opacity=".7"/>
    <path d="M22 36h20v12H22z" fill="#2e9a4b"/>
    <path d="M32 39c-3 3-3 6 0 6s3-3 0-6z" fill="#f7cf3b"/>
    <path d="M24.5 52V30" stroke="#fff6cf" stroke-width="2" stroke-linecap="round"/>` },

  eggs: { label: 'Eggs', svg: `
    <path d="M8 42h48l-4 12H12z" fill="#c9a77c"/><path d="M8 42h48" stroke="#a9875d" stroke-width="1.4"/>
    <path d="M14 46c2 3 6 3 8 0M28 46c2 3 6 3 8 0M42 46c2 3 6 3 8 0" fill="none" stroke="#a9875d" stroke-width="1.2"/>
    <ellipse cx="20" cy="34" rx="8" ry="10" fill="#f6e3c8"/><ellipse cx="44" cy="34" rx="8" ry="10" fill="#f1d7b2"/><ellipse cx="32" cy="30" rx="8.5" ry="11" fill="#fbeedd"/>
    <ellipse cx="29" cy="25" rx="2" ry="3.4" fill="#fff" opacity=".8"/><ellipse cx="17.5" cy="30" rx="1.6" ry="2.8" fill="#fff" opacity=".7"/><ellipse cx="41.5" cy="30" rx="1.6" ry="2.8" fill="#fff" opacity=".6"/>` },

  crackers: { label: 'Crackers', svg: `
    <path d="M10 18h44v32H10z" fill="#2f6fd6"/>
    <path d="M10 18h44v4H10zM10 46h44v4H10z" fill="#2459b0"/>
    <rect x="15" y="25" width="16" height="16" rx="2" fill="#efd29a"/><rect x="33" y="25" width="16" height="16" rx="2" fill="#e8c27e"/>
    <g fill="#c99a4c"><circle cx="19" cy="29" r=".9"/><circle cx="23" cy="29" r=".9"/><circle cx="27" cy="29" r=".9"/><circle cx="19" cy="33" r=".9"/><circle cx="23" cy="33" r=".9"/><circle cx="27" cy="33" r=".9"/><circle cx="19" cy="37" r=".9"/><circle cx="23" cy="37" r=".9"/><circle cx="27" cy="37" r=".9"/>
    <circle cx="37" cy="29" r=".9"/><circle cx="41" cy="29" r=".9"/><circle cx="45" cy="29" r=".9"/><circle cx="37" cy="33" r=".9"/><circle cx="41" cy="33" r=".9"/><circle cx="45" cy="33" r=".9"/><circle cx="37" cy="37" r=".9"/><circle cx="41" cy="37" r=".9"/><circle cx="45" cy="37" r=".9"/></g>` },

  pork: { label: 'Pork cracklings', svg: `
    <path d="M14 10h36c-2 6-2 38 0 44H14c2-6 2-38 0-44z" fill="#e8442e"/>
    <path d="M14 10h36v5H14zM14 49h36v5H14z" fill="#c33522"/>
    <ellipse cx="32" cy="34" rx="13" ry="10" fill="#fff4e0"/>
    <path d="M23 36c2-6 6-8 9-6 3-4 8-2 9 3 1 4-3 6-6 5-2 3-7 3-9 0-2 1-4 0-3-2z" fill="#e4a24a"/>
    <path d="M27 35c2-1 3 1 5 0M33 33c2-1 3 1 5 0" stroke="#fbe0a8" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M19 21h26" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>` },

  rice: { label: 'Rice sack', svg: `
    <path d="M16 18c-3 10-4 26-1 36h34c3-10 2-26-1-36z" fill="#f4ecdc"/>
    <path d="M18 18c4-4 24-4 28 0" fill="#e6dac2"/><path d="M22 14c3 2 17 2 20 0l-2 5H24z" fill="#d8c8a6"/>
    <path d="M17 31h30v12H17z" fill="#2e9a4b"/>
    <path d="M24 37c2-3 4 3 6 0s4 3 6 0 3 3 5 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` },

  milk: { label: 'Milk', svg: `
    <path d="M20 22h24v34H20z" fill="#ffffff"/><path d="M44 22l6-6v34l-6 6z" fill="#dde6f2"/>
    <path d="M20 22l6-10h18l-6 10z" fill="#eef3f9"/><path d="M26 12h18l6 4H32z" fill="#cdd9ea"/>
    <path d="M20 34h24v12H20z" fill="#2f6fd6"/><path d="M44 34l6-6v12l-6 6z" fill="#2459b0"/>
    <path d="M25 40c3-3 6 3 9 0s4 2 6 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>` },

  candy: { label: 'Candy', svg: `
    <path d="M10 26l10 6-10 6zM54 26l-10 6 10 6z" fill="#ff8fb1"/>
    <ellipse cx="32" cy="32" rx="13" ry="9" fill="#ff5c8a"/>
    <path d="M24 26c2 4 2 8 0 12M32 23c2 6 2 12 0 18M40 26c2 4 2 8 0 12" stroke="#ffd1df" stroke-width="2" fill="none"/>
    <ellipse cx="27" cy="28" rx="3" ry="1.4" fill="#fff" opacity=".6"/>` },

  bread: { label: 'Bread', svg: `
    <path d="M12 30c0-10 40-10 40 0v18a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#d99a4e"/>
    <path d="M14 30c0-7 36-7 36 0" fill="#e8b46d"/>
    <path d="M22 26l3 6M31 24l2 7M40 26l1 6" stroke="#f6d39b" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 40h40" stroke="#c2853c" stroke-width="1"/>` },

  shampoo: { label: 'Shampoo sachet', svg: `
    <path d="M18 8h28v48H18z" fill="#8e5bd6"/>
    <path d="M18 8l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2" fill="none" stroke="#6b3fb0" stroke-width=".8"/>
    <path d="M18 32h28" stroke="#6b3fb0" stroke-width="1" stroke-dasharray="2 2"/>
    <path d="M27 14c-3 5-3 8 0 8s3-3 0-8zM37 38c-3 5-3 8 0 8s3-3 0-8z" fill="#e7d8fb"/>
    <path d="M22 26h20M22 50h20" stroke="#cdb6f2" stroke-width="2" stroke-linecap="round"/>` },

  box: { label: 'Other item', svg: `
    <path d="M12 24l20-9 20 9-20 9z" fill="#f2c98f"/>
    <path d="M12 24v22l20 9V33z" fill="#e0a85e"/><path d="M52 24v22l-20 9V33z" fill="#c98d45"/>
    <path d="M22 19.5l20 9v8l-5 2v-8l-20-9z" fill="#fff1d8" opacity=".85"/>` },
};

/* Which drawing to use for products saved before illustrations existed. */
const EMOJI_TO_ART = {
  '☕': 'coffee', '🧼': 'soap', '🍜': 'cupnoodle', '🥫': 'sardines', '🍟': 'pork', '🍾': 'liquor', '🍺': 'beer',
  '🫒': 'oil', '🥚': 'eggs', '🍝': 'pancit', '🧴': 'soapbox', '🍪': 'crackers', '🥤': 'soda', '🐟': 'tuna',
};
const CATEGORY_ART = {
  beverages: ['soda', 'coffee', 'beer', 'liquor'], personal: ['soap', 'soapbox', 'shampoo'], canned: ['sardines', 'tuna'],
  noodles: ['pancit', 'cupnoodle'], snacks: ['chips', 'pork', 'candy'], biscuits: ['crackers', 'candy', 'bread'],
  pantry: ['eggs', 'oil', 'rice', 'milk'],
};

function artSVG(key, cls = 'art') {
  const a = ART[key] || ART.box;
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true">${SHADOW}${a.svg}</svg>`;
}
function defaultArtFor(catId) { return (CATEGORY_ART[catId] || ['box'])[0]; }
