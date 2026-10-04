import type { CollectionSlug, Product } from "./types";
import { getMahgoubSourceUrl } from "./sourceUrls";

const MAHGOUB_BRANDS = new Set(["Gemma", "Cleopatra", "Platino", "Innova"]);

function clean(value?: string) {
  return value?.replace(/\s+/g, " ").trim();
}

function cleanList(values?: string[]) {
  return values
    ? [...new Set(values.map((value) => clean(value)).filter(Boolean) as string[])]
    : undefined;
}

function categoryFromMaterial(product: Product): CollectionSlug {
  const type = clean(product.type)?.toLowerCase() ?? "";
  if (/\bporcelain\b/.test(type)) return "porcelain";
  if (/\bceramic\b/.test(type)) return "ceramics";
  return product.collection;
}

function sourceUrl(product: Product) {
  const recordId = product.source?.recordId;
  if (!recordId) return product.source?.sourceUrl;

  if (MAHGOUB_BRANDS.has(product.brand)) {
    return getMahgoubSourceUrl(product.brand, recordId) ?? product.source?.sourceUrl;
  }

  if (product.brand === "Ceramica Art") {
    return `https://www.artceramic-egypt.com/products/${recordId}`;
  }

  return product.source?.sourceUrl;
}

export function normalizeCatalogProduct(product: Product): Product {
  const collection = categoryFromMaterial(product);
  const source = product.source
    ? { ...product.source, sourceUrl: sourceUrl(product) }
    : undefined;

  return {
    ...product,
    collection,
    name: {
      en: clean(product.name.en) ?? product.name.en,
      ar: clean(product.name.ar) ?? product.name.ar,
      fr: clean(product.name.fr) ?? product.name.fr,
    },
    brand: clean(product.brand) ?? product.brand,
    model: clean(product.model) ?? product.model,
    code: clean(product.code),
    origin: clean(product.origin),
    texture: clean(product.texture),
    finish: clean(product.finish),
    type: clean(product.type),
    variant: clean(product.variant),
    application: clean(product.application),
    usage: cleanList(product.usage),
    colors: cleanList(product.colors),
    sizes: product.sizes
      .map((size) => ({ ...size, label: clean(size.label) ?? size.label }))
      .filter((size) => Boolean(size.label)),
    gallery: product.gallery
      ? [...new Set(product.gallery.filter((url) => /^https:\/\//i.test(url)))]
      : undefined,
    source,
  };
}

function isPublishableSurfaceProduct(product: Product) {
  return (
    product.approved &&
    product.status !== "sample" &&
    (product.collection === "ceramics" || product.collection === "porcelain") &&
    Boolean(product.name.en && product.brand && product.model) &&
    product.sizes.length > 0 &&
    /^https:\/\//i.test(product.image) &&
    Boolean(product.source?.sourceUrl)
  );
}

function qualityScore(product: Product) {
  return [
    product.source?.sourceUrl,
    product.code,
    product.origin,
    product.type,
    product.finish,
    product.texture,
    product.application,
    product.colors?.length,
    product.gallery?.length,
  ].filter(Boolean).length;
}

export function buildPublicCatalog(groups: Product[][]) {
  const canonical = new Map<string, Product>();

  for (const raw of groups.flat()) {
    const product = normalizeCatalogProduct(raw);
    if (!isPublishableSurfaceProduct(product)) continue;

    const key = `${product.brand.toLowerCase()}|${product.code ?? product.id}`;
    const existing = canonical.get(key);
    if (!existing || qualityScore(product) > qualityScore(existing)) canonical.set(key, product);
  }

  return [...canonical.values()];
}
