/* ---------- Product photos ----------
   Photos the store owner takes or picks are shrunk to 480px JPEGs and kept in
   the browser's IndexedDB (localStorage is too small for pictures).
   PHOTOS holds them in memory so pages can render synchronously. */

const PHOTOS = new Map();
const PHOTO_DB = 'tindatrack-photos';
let photoDb = null;

function openPhotoDb() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(PHOTO_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore('photos');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) { resolve(null); }
  });
}

/* Load every saved photo into PHOTOS. Resolves even if storage is blocked. */
async function loadPhotos() {
  photoDb = await openPhotoDb();
  if (!photoDb) return;
  await new Promise((resolve) => {
    try {
      const store = photoDb.transaction('photos').objectStore('photos');
      const req = store.openCursor();
      req.onsuccess = () => {
        const cur = req.result;
        if (!cur) return resolve();
        PHOTOS.set(cur.key, cur.value);
        cur.continue();
      };
      req.onerror = () => resolve();
    } catch (e) { resolve(); }
  });
}

function photoWrite(fn) {
  if (!photoDb) return;
  try { fn(photoDb.transaction('photos', 'readwrite').objectStore('photos')); } catch (e) { /* storage full / blocked */ }
}
function setPhoto(id, dataUrl) { PHOTOS.set(id, dataUrl); photoWrite((s) => s.put(dataUrl, id)); }
function removePhoto(id) { PHOTOS.delete(id); photoWrite((s) => s.delete(id)); }
function clearPhotos() { PHOTOS.clear(); photoWrite((s) => s.clear()); }

/* File from <input type="file"> → square-ish JPEG data URL, max 480px. */
function shrinkImage(file, max = 480) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('not-image'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // transparent PNGs get a white background
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
    img.src = url;
  });
}
