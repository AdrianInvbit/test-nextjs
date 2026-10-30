export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "cuaderno-liso",
    name: "Cuaderno liso A5",
    description:
      "Cuaderno de 80 hojas lisas, encuadernación cosida y tapa de cartón reciclado.",
    price: "4,50 €",
    category: "Papelería",
  },
  {
    id: "boligrafo-gel",
    name: "Bolígrafo de gel",
    description:
      "Tinta de gel negra de secado rápido, grip de goma y recambio estándar.",
    price: "1,80 €",
    category: "Papelería",
  },
  {
    id: "taza-ceramica",
    name: "Taza de cerámica",
    description:
      "Taza de 350 ml apta para lavavajillas, esmalte mate y asa ancha.",
    price: "9,90 €",
    category: "Hogar",
  },
  {
    id: "mochila-lona",
    name: "Mochila de lona",
    description:
      "Mochila de 18 litros con bolsillo interior y correas ajustables.",
    price: "29,00 €",
    category: "Accesorios",
  },
  {
    id: "lampara-escritorio",
    name: "Lámpara de escritorio",
    description:
      "Lámpara LED regulable con brazo articulado y base antideslizante.",
    price: "34,50 €",
    category: "Iluminación",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
