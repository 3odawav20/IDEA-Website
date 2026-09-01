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

function finishFromSource(value: string) {
  return value.split("/").map((part) => part.trim()).find((part) => /^(matt|glossy)$/i.test(part));
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
 * Normalizes only values present in the Art Ceramic source export. Fields the
 * export does not contain (product code, origin, certified material type and
 * translations) remain unset rather than being fabricated for the storefront.
 */
function mapProduct(source: RawArtCeramicProduct): Product {
  const colors = [...new Set([source.color, source.colorCategory].filter(Boolean) as string[])];
  const gallery = [source.image, ...source.tiles].filter(Boolean);

  return {
    id: source.id,
    slug: source.slug,
    name: { en: source.name, ar: source.name, fr: source.name },
    collection: "ceramics",
    brand: "Ceramica Art",
    model: source.name,
    finish: finishFromSource(source.texture),
    variant: source.color ?? undefined,
    usage: source.types,
    application: applicationFromSource(source.types),
    colors,
    sizes: [{ id: `${source.id}-size-1`, label: source.size }],
    image: source.image,
    gallery,
    family: source.slug,
    source: {
      provider: "Art Ceramic source export",
      recordId: source.id,
      reviewStatus: "needs-human-review",
      originalSurface: source.texture,
    },
    approved: true,
    status: "imported",
  };
}

export const ART_CERAMIC_PRODUCTS: Product[] = (artceramic as RawArtCeramicProduct[])
  .filter((record) => Boolean(record.image && record.size && record.name))
  .map(mapProduct);
