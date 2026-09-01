# Art Ceramic import audit

## Verified source-export facts

- 475 distinct records in `src/app/data/artceramic.json`
- 475 records have an image, size, surface value, usage array and gallery tiles
- IDs and slugs are unique within this export

## Normalization rules

- Product name, image URLs, gallery images, size, colour and usage remain exactly as supplied.
- `Matt` and `Glossy` are mapped to **finish**. The original surface value is retained in product provenance.
- Product code, country of origin and certified material type are left blank because this export does not provide them.
- Arabic and French continue to display the original source name until approved translations are supplied.

## Review required

This export is not a PDF-backed approval record. Every product is marked `needs-human-review` in its provenance until the official catalogue or an approved source confirms material type, origin, code and localized names.
