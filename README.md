# ClubSphere — Advanced UI Prototype (v2)

A polished, responsive college clubs discovery interface built with **plain HTML, CSS, and JavaScript**.

## Run locally
1. Extract the ZIP.
2. Keep `index.html`, `styles.css`, `script.js`, and the `assets` directory together.
3. Open `index.html` in a modern browser. No build tools or framework are required.
4. Internet is used only for Google Fonts; the interface itself is local.

## Features
- Responsive editorial-style landing page with animated visual treatment
- Four initial club cards: KAIZEN, NEX-CELL, MALHAR, Khel Society
- Khel Society card opens its team page, with a roster, search, filters, and member profiles
- User-provided logo assets for the first three clubs
- Search by club name, category, and interests
- Category filters and empty-search state
- Favourite clubs persisted in browser local storage
- Light/dark theme persisted in browser local storage
- Accessible dialogs, keyboard search shortcut (Ctrl/Cmd + K), toast messages
- Responsive mobile navigation
- Motion-reduction preference support
- Illustrative event section and prototype sign-in explanation

## Important: frontend prototype only
No real login, server, database, membership approval, event registration, notification delivery, admin dashboard, or authorization is implemented. Browser local storage is only used for demo favourites and theme preferences. Do not use this prototype to store private student data or treat demo dialogs as real registrations.

## Decisions carried into this prototype
- Membership requests require approval.
- Event registration policy is set per event (public guest registration or login-required).
- Public guest event registration must not create a student account, membership, or dashboard access.
- Four initial clubs are shown. The Khel Society logo is a designed text placeholder until the official logo is supplied.
- “ClubSphere” is the active brand name for this prototype.
