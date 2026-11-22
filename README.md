# NIT Jalandhar AWS Builder Group  — Sponsorship Website

All editable copy and data is in `src/data.json`. Replace every value enclosed in square brackets. Enter verified counter and percentage values as JSON numbers (not quoted text) to activate the GSAP counters and Chart.js charts.

## Required images

Add the supplied transparent PNGs at:

- `public/assets/banners/banner-platinum.png`
- `public/assets/banners/banner-gold.png`
- `public/assets/banners/banner-bronze.png`

The site shows a clearly labelled asset state until they are present. Add confirmed logo files under `public/assets/images/` and list them in the matching `sponsors` array:

```json
{ "name": "Verified sponsor name", "logo": "/assets/images/logo.png", "url": "https://..." }
```

## Remaining placeholders

- Fest: name, edition, date, ISO countdown date, brochure URL and organising body
- Numbers: footfall, colleges, participants, social reach and last-edition footfall
- Events: participant counts and optional additional event
- Audience: branch names and branch/year percentages
- Tiers: amounts, benefits, placements, stall space, naming rights and passes
- Contact: Formspree endpoint, email, team names and phone numbers
- Social: Instagram, LinkedIn and Facebook URLs

Past Highlights stays hidden until `highlights.images` or `highlights.aftermovieUrl` has data. The inquiry form becomes live after `[FORMSPREE_ENDPOINT]` is replaced.

Run `pnpm build` for a production build.
