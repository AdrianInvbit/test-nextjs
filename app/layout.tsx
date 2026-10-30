import type { Metadata } from "next";
import { DeployMeta } from "@/components/DeployMeta";
import { SiteHeader } from "@/components/SiteHeader";
import { APP_NAME } from "@/lib/deploy-meta";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Aplicación Next.js de prueba para el laboratorio de ClonVercel.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <DeployMeta />
          </footer>
        </div>
      </body>
    </html>
  );
}
