import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contador", label: "Contador" },
  { href: "/api/health", label: "Salud" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <p className="eyebrow">Laboratorio de pruebas</p>
      <h1>ClonVercel Test Lab</h1>
      <p className="lede">
        Aplicación Next.js con App Router para validar detección, compilación y
        ejecución Node.js con renderizado en servidor.
      </p>
      <nav className="site-nav" aria-label="Secciones de la aplicación">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
