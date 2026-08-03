# ComingSoonInCity

A directory of upcoming and newly-launched projects and businesses across Visakhapatnam, Vizianagaram & Srikakulam, Andhra Pradesh — real estate, ecommerce, loans, travel, furniture, jewellery and more.

**The board itself is public.** Clicking **Start** on a listing (to reach a
business's YouTube/Instagram/WhatsApp) requires sign-in and admin approval
first. See `SETUP.md` to configure this (you'll need a free Firebase project).

## Structure
- `index.html` — main page markup, public board + approval-gated connect modal
- `style.css` — all styling, including the connect-gate and admin screens
- `script.js` — city/category filtering + connect assistant modal (with the approval gate built in)
- `admin.html` / `admin.js` — admin-only page to approve/reject/revoke access
- `firebase-config.js` — your Firebase project credentials (fill in per SETUP.md)
- `firestore.rules` — security rules that actually enforce who can approve whom
- `SETUP.md` — step-by-step Firebase setup guide

## Running locally
Just open `index.html` in a browser, or serve the folder with any static server (e.g. VS Code Live Server).

## Editing listings
Each business is a `.card` block inside `#cardGrid` in `index.html`. Set `data-cat` and `data-city` to control filtering. "Online" businesses use a `.start-btn` with `data-youtube`, `data-instagram`, `data-wa-join`, and `data-wa-buy` attributes instead of the Notify/Details buttons.
