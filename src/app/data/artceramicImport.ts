import type { Product } from "./types";
import artceramic from "./artceramic.json";

interface RawArtCeramicProduct {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  colorCategory: string | null;
  size: string;
  texture: string;
  types: string[];
  featured: boolean;
  image: string;
  tiles: string[];
}

function originalArtAsset(url: string) {
  return url.replace(/\/uploads\/(?:medium_|small_|thumbnail_)/i, "/uploads/");
}

function finishFromSource(value: string) {
  return value
    .split("/")
    .map((part) => part.trim())
    .find((part) => /^(matt|glossy)$/i.test(part));
}

function textureFromSource(value: string) {
  const parts = value.split("/").map((part) => part.trim()).filter(Boolean);
  return parts.find((part) => !/^(matt|glossy)$/i.test(part));
}

function usageFromSource(types: string[]) {
  const usage = types
    .map((value) => value.trim())
    .filter((value) => value && !/^(wall|floor)$/i.test(value));
  return usage.length ? [...new Set(usage)] : undefined;
}

function applicationFromSource(types: string[]) {
  const wall = types.some((value) => /wall/i.test(value));
  const floor = types.some((value) => /floor/i.test(value));
  if (wall && floor) return "Wall and Floor";
  if (wall) return "Wall";
  if (floor) return "Floor";
  return undefined;
}

/**
 * Art Ceramic's official site identifies the company and catalog as ceramic.
 * We preserve only fields present in the source export and do not invent
 * product codes, origin, translations or other missing specifications.
 */
function mapProduct(source: RawArtCeramicProduct): Product {
  const colors = source.color ? [source.color] : source.colorCategory ? [source.colorCategory] : [];
  const gallery = [...new Set([source.image, ...source.tiles].filter(Boolean).map(originalArtAsset))];

  return {
    id: source.id,
    slug: source.slug,
    name: { en: source.name, ar: source.name, fr: source.name },
    collection: "ceramics",
    brand: "Ceramica Art",
    model: source.name,
    type: "Ceramic",
    texture: textureFromSource(source.texture),
    finish: finishFromSource(source.texture),
    usage: usageFromSource(source.types),
    application: applicationFromSource(source.types),
    colors,
    sizes: [{ id: `${source.id}-size-1`, label: source.size }],
    image: originalArtAsset(source.image),
    gallery,
    family: source.slug,
    source: {
      provider: "Art Ceramic official catalog",
      recordId: source.id,
      reviewStatus: "source-imported",
      originalSurface: source.texture,
      sourceUrl: `https://www.artceramic-egypt.com/products/${source.id}`,
    },
    approved: true,
    status: "imported",
  };
}

export const ART_CERAMIC_PRODUCTS: Product[] = (artceramic as RawArtCeramicProduct[])
  .filter((record) => Boolean(record.image && record.size && record.name))
  .map(mapProduct);
