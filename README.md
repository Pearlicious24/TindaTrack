# TindaTrack

Inventory, sales and utang tracker for sari-sari stores, built with plain HTML, CSS and JavaScript (no build step).

## Run it

Open `index.html` in a browser, or serve the folder:

```
npx http-server -p 5173
```

Then visit http://localhost:5173.

## Demo login

Any PH mobile number starting with 9 (e.g. `912 345 6789`), then verification code `123456`.

## Structure

```
index.html        App shell
css/styles.css    Layout and components (desktop → tablet → phone bottom nav)
css/motion.css    Hover-to-open sidebar, animations and effects
images/           Logo, onboarding photo, favicon.svg (tab icon)
js/icons.js       Inline SVG icons + logo
js/art.js         Product drawings (used until a photo is added)
js/photos.js      Product photos: resize + save in IndexedDB
js/data.js        Seed data, state, localStorage persistence
js/i18n.js        English / Filipino / Cebuano
js/ui.js          Navigation, toasts, modals, stacked bar chart
js/pages.js       Onboarding, Login, Dashboard, Products, Inventory, Utang Ledger, Profile
js/app.js         Hash router and global actions
```

## Product pictures

Every product starts with a drawing. To use a real photo, tap the product's picture on **Products** (or the pencil next to it in **Inventory → Edit**), then **Take or choose photo**. On a phone this opens the camera. Photos are shrunk to 480px and saved in the browser's IndexedDB, so they stay on that device only.

Data is saved in the browser's localStorage. Use **Profile → Reset demo data** to start over (this also removes photos).

## Not connected yet

- Login and SMS are simulated (no real OTP or SMS gateway).
- "Premium" shows the Standard (₱199/month) and Premium (₱299/month) plans, but payments aren't wired up.
- Photos are stored per browser; there is no cloud sync between devices yet.
