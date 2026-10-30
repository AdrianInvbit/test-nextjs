import { connection } from "next/server";
import { getDeployMeta } from "@/lib/deploy-meta";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connection();

  const meta = getDeployMeta();
  const renderedAt = new Date().toISOString();

  return (
    <section className="card" aria-labelledby="home-title">
      <h2 id="home-title">Inicio</h2>
      <p className="lede">
        <strong>{meta.name}</strong> versión <strong>{meta.version}</strong>{" "}
        usa {meta.framework} con App Router y renderizado en servidor.
      </p>
      <p className="muted">
        Esta página se genera en cada petición. La marca temporal siguiente no
        debe quedar congelada como HTML estático durante la compilación.
      </p>
      <time
        id="ssr-timestamp"
        className="ssr-timestamp"
        dateTime={renderedAt}
      >
        {renderedAt}
      </time>
    </section>
  );
}
