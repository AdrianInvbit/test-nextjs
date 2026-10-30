import Link from "next/link";

export default function NotFound() {
  return (
    <section className="card" aria-labelledby="not-found-title">
      <h2 id="not-found-title">Página no encontrada</h2>
      <p className="muted">El recurso solicitado no existe.</p>
      <p className="page-actions">
        <Link className="inline-link" href="/">
          Volver al inicio
        </Link>
      </p>
    </section>
  );
}
