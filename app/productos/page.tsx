import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Productos",
};

export default function ProductsPage() {
  return (
    <section className="card" aria-labelledby="products-title">
      <h2 id="products-title">Productos</h2>
      <p className="muted">
        Listado local de cinco productos ficticios, sin imágenes ni
        persistencia.
      </p>
      <ul className="product-grid">
        {products.map((product) => (
          <li key={product.id}>
            <Link className="product-card" href={`/productos/${product.id}`}>
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p className="muted">{product.description}</p>
              <p className="product-price">{product.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
