import { getDeployMeta } from "@/lib/deploy-meta";

export function DeployMeta() {
  const meta = getDeployMeta();

  return (
    <section className="card deploy-card" aria-labelledby="deploy-title">
      <h2 id="deploy-title">Identificación del despliegue</h2>
      <dl className="meta-list">
        <div>
          <dt>Nombre</dt>
          <dd id="deploy-name">{meta.name}</dd>
        </div>
        <div>
          <dt>Versión</dt>
          <dd id="deploy-version">{meta.version}</dd>
        </div>
        <div>
          <dt>Framework</dt>
          <dd id="deploy-framework">{meta.framework}</dd>
        </div>
        <div>
          <dt>Rama Git</dt>
          <dd id="deploy-branch">{meta.branch}</dd>
        </div>
        <div>
          <dt>Commit</dt>
          <dd id="deploy-commit">{meta.commit}</dd>
        </div>
        <div>
          <dt>Fecha de compilación</dt>
          <dd id="deploy-build-date">{meta.buildDate}</dd>
        </div>
      </dl>
    </section>
  );
}
