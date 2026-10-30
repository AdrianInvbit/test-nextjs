import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  return {
    title: product ? product.name : "Producto no encontrado",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="card" aria-labelledby="product-title">
      <p className="product-category">{product.category}</p>
      <h2 id="product-title">{product.name}</h2>
      <p className="lede">{product.description}</p>
      <p className="product-price" id="product-price">
        {product.price}
      </p>
      <p className="muted">
        Identificador: <code id="product-id">{product.id}</code>
      </p>
      <p className="page-actions">
        <Link className="inline-link" href="/productos">
          Volver a productos
        </Link>
      </p>
    </section>
  );
}
