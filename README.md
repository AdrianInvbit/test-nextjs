# ClonVercel Test Lab — `test-nextjs`

Aplicación Next.js de prueba, versión **v0.1.0**, para validar la detección del framework, la instalación de dependencias, la compilación, el despliegue y la ejecución de aplicaciones Node.js con renderizado en servidor (SSR) en ClonVercel.

## Objetivo

Disponer de una tienda ficticia sencilla, predecible y compilable que se pueda importar en ClonVercel como proyecto Next.js con App Router, sin base de datos y sin servicios externos.

## Tecnologías

- Next.js 16 con App Router
- React 19 y TypeScript
- CSS nativo
- Node.js 20.9 o superior (LTS compatible)
- Vitest y Testing Library para las pruebas locales
- Salida `standalone` para ejecución en contenedores

## Funcionalidades

1. **Inicio:** página renderizada en servidor con información de la aplicación y una marca temporal generada en cada petición.
2. **Productos:** listado de cinco productos ficticios definidos en código.
3. **Detalle de producto:** ruta dinámica `/productos/[id]`.
4. **Contador:** componente cliente interactivo con `useState`.
5. **API:** `GET /api/health` devuelve JSON con estado, nombre y versión.

Los productos no tienen imágenes ni persistencia. Un identificador inexistente responde **404**.

## Identificación del despliegue

La interfaz muestra, mediante un componente de servidor:

- Nombre `test-nextjs`
- Versión `v0.1.0`
- Framework y versión de Next.js
- Rama Git
- Identificador del commit
- Fecha de compilación

Rama, commit y fecha salen de variables de entorno **sin** prefijo `NEXT_PUBLIC_`, para no exponer secretos al navegador. Si faltan, la interfaz muestra **No disponible**. El código no inventa identificadores de Git.

## Estructura

```text
test-nextjs/
├── app/
│   ├── api/health/route.ts
│   ├── contador/page.tsx
│   ├── productos/[id]/page.tsx
│   ├── productos/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── public/
│   └── favicon.svg
├── scripts/
│   ├── copy-standalone-assets.mjs
│   └── start-standalone.mjs
├── tests/
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
└── README.md
```

## Requisitos

- Node.js **20.9** o superior
- npm 10 o el que acompaña a esa versión de Node.js

## Variables de entorno

Copiar `.env.example` a `.env.local` si se quiere probar la inyección local. Durante el despliegue, ClonVercel puede definir:

```bash
APP_NAME=test-nextjs
APP_VERSION=v0.1.0
GIT_BRANCH=
GIT_COMMIT=
BUILD_DATE=
PORT=3000
BIND_HOSTNAME=0.0.0.0
```

`PORT` configura el puerto HTTP. El servidor escucha en `0.0.0.0`. En Windows y en Docker la variable `HOSTNAME` ya existe como nombre de máquina; por eso el arranque standalone usa `BIND_HOSTNAME` (o fuerza `HOSTNAME=0.0.0.0`) para no heredar ese valor.

No hay secretos. No usar `NEXT_PUBLIC_` para datos que deban permanecer solo en el servidor.

## Ejecución local

```bash
npm ci
npm run dev
```

La URL habitual es `http://localhost:3000`. El proceso admite `PORT`.

## Compilación y producción

```bash
npm run build
npm run start
```

`next.config.ts` define `output: "standalone"`. Tras `npm run build`, el script `postbuild` copia `public/` y `.next/static` al directorio standalone. `npm run start` arranca `node .next/standalone/server.js` (Next.js 16 avisa que `next start` no es el modo adecuado con esta salida).

### Ejecución standalone (contenedores)

```bash
npm run start
```

Equivalente directo, incluyendo los estáticos que hay que copiar si se ejecuta `next build` sin el `postbuild` de npm:

```bash
node scripts/copy-standalone-assets.mjs
HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
```

Archivos que deben quedar junto a `server.js`:

- `public/` → `.next/standalone/public/`
- `.next/static/` → `.next/standalone/.next/static/`

No utilizar `next export` ni generar una web exclusivamente estática. Esta aplicación necesita un proceso Node.js.

## Pruebas

```bash
npm run build
npm test
```

Las pruebas comprueban:

- el renderizado SSR de inicio y que la marca temporal cambia entre peticiones
- el listado de productos
- las rutas dinámicas
- la respuesta 404 de un producto inexistente
- el funcionamiento del contador
- el endpoint `/api/health`
- la compilación de producción
- el arranque y la respuesta HTTP del servidor standalone

## Matriz de pruebas previstas para ClonVercel

| Caso | Resultado esperado |
| --- | --- |
| Importación Git del repositorio | El proyecto se reconoce como aplicación Next.js `test-nextjs`. |
| Instalación de dependencias | `npm ci` instala a partir de `package-lock.json`. |
| Compilación | `npm run build` genera `.next/` y `.next/standalone/`. |
| Ejecución Node.js | El proceso escucha en `0.0.0.0` y admite `PORT`. |
| SSR de inicio | `/` incluye una marca temporal distinta en cada petición. |
| Productos | `/productos` lista cinco productos locales. |
| Ruta dinámica | `/productos/cuaderno-liso` muestra el detalle. |
| Producto inexistente | `/productos/no-existe` responde 404. |
| Contador | Incrementar, decrementar y reiniciar actualizan el valor en el cliente. |
| Salud | `GET /api/health` devuelve `{"status":"ok","name":"test-nextjs","version":"v0.1.0"}`. |
| Metadatos sin inyección | Rama, commit y fecha aparecen como `No disponible`. |
| Metadatos con variables de servidor | Se muestran la rama, el commit y la fecha inyectados. |
| Standalone | `node .next/standalone/server.js` sirve HTML y `/api/health` tras copiar los estáticos. |

## Limitaciones conocidas

- No hay autenticación, base de datos ni servicios externos.
- El catálogo es estático en código.
- El contador se reinicia al recargar.
- Rama, commit y fecha de compilación permanecen en `No disponible` hasta que el proceso de despliegue inyecte las variables.

## Versión

- Aplicación: `v0.1.0`
- Commit: `No disponible`
