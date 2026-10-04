# Ceramic & Porcelain Catalog QA Report

Date: 2026-10-04
Branch: `qa/catalog-quality-pass`

## Public catalog totals

- Total public products: **2,109**
- Ceramic: **1,664**
- Porcelain: **445**
- Gemma: **512**
- Cleopatra: **628**
- Platino: **332**
- Innova: **162**
- Ceramica Art: **475**

## Structural data audit

Verified against the imported datasets and source URL index:

- Missing required fields in the 1,634 Mahgoub-derived products: **0**
- Ceramic/Porcelain type-to-category mismatches: **0**
- Missing exact source URLs: **0**
- Invalid imported image host/URL patterns: **0**
- Duplicate Mahgoub brand+code keys: **0**
- Duplicate IDs: **0**
- Duplicate slugs: **0**
- Art records missing name/size/image/id/slug: **0**
- Art duplicate IDs: **0**
- Art duplicate slugs: **0**

## Category safeguards

The storefront now normalizes category from verified material type:

- `type = Porcelain` => `collection = porcelain`
- `type = Ceramic` => `collection = ceramics`

Products missing publish-critical fields, a valid HTTPS image, or an exact source URL are excluded from the public catalog.

## Product-detail QA

Verified rendered detail pages for:

- Gemma / Prague / 1010014916 — Porcelain
- Cleopatra / Sevilla / 1010014910 — Ceramic
- Platino / Concrete / 1010014905 — Porcelain
- Innova / 1010014673 — Ceramic; no model is displayed because the source does not provide a reliable model name
- Ceramica Art / Manila / 95 — Ceramic

Checks passed:

- Correct category visible
- Brand visible
- Model shown only when reliable
- Item code shown when supplied by source
- Size visible
- Finish/application/color shown when supplied
- Exact source website link visible
- No public price exposed
- No duplicated Art `Wall` tag
- No Art color incorrectly displayed as grade

## Image quality QA

- Art Ceramic storefront images now request original assets instead of `medium_` derivatives.
- Original Art asset samples returned HTTP 200.
- Representative Mahgoub image URLs returned HTTP 200.
- Product card has a medium-image fallback for Art if an original asset fails.
- No generated replacement imagery is used.

## Source-link QA

Representative exact source pages returned HTTP 200:

- Mahgoub / Gemma
- Mahgoub / Cleopatra
- Mahgoub / Platino
- Mahgoub / Innova
- Art Ceramic official product page

## Filter cleanup

Color facets are sanitized to remove technical/design fragments accidentally parsed as colors, including values such as:

- Kitchen numbers
- Rectified
- Heavy Duty
- Farma / Forma
- Flower / Luster
- Wall Paper
- incomplete color combinations

The rendered color filter was rechecked after cleanup.

## Responsive/access QA

- Product list rendered successfully in desktop and mobile scrape modes.
- Product detail rendered successfully in desktop and mobile scrape modes.
- Vercel authentication is disabled for the public site.
- Footer now points to the actual public production address:
  `https://idea-website-five.vercel.app`

## Build QA

- Vite production build: **PASS**
- Modules transformed: **2,050**
- Build completed successfully.
- Non-blocking warning: the main JavaScript chunk is larger than Vite's 500 kB warning threshold because the catalog is currently bundled client-side. This is a performance optimization item, not a data-integrity failure.

## Data integrity policy

Missing source facts are not fabricated. In particular, an unknown model, origin, code, finish, texture, or grade remains unset rather than being guessed.
