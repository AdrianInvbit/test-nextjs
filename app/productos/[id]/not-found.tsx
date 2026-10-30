import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="card" aria-labelledby="missing-product-title">
      <h2 id="missing-product-title">Producto no encontrado</h2>
      <p className="muted">
        El identificador solicitado no corresponde a ningún producto del
        catálogo local.
      </p>
      <p className="page-actions">
        <Link className="inline-link" href="/productos">
          Volver a productos
        </Link>
      </p>
    </section>
  );
}
