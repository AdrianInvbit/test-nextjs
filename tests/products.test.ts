import { describe, expect, it } from "vitest";
import { getProductById, products } from "../lib/products";

describe("catálogo de productos", () => {
  it("define cinco productos locales con identificadores únicos", () => {
    expect(products).toHaveLength(5);

    const ids = products.map((product) => product.id);
    expect(new Set(ids).size).toBe(5);

    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeTruthy();
    }
  });

  it("devuelve un producto existente y nada si el identificador no existe", () => {
    const known = getProductById("cuaderno-liso");
    expect(known?.name).toBe("Cuaderno liso A5");
    expect(getProductById("no-existe")).toBeUndefined();
  });
});
