# JPDH — Sistema Web

Sitio web y sistema de gestión de **Jóvenes por los Derechos Humanos Costa Rica**.
Construido con TanStack Start (React), Tailwind CSS, Better Auth y Drizzle ORM, desplegado en **Cloudflare Workers**.

---

## Requisitos

| Herramienta | Versión sugerida | Descarga |
| --- | --- | --- |
| Node.js | 22 LTS o superior | https://nodejs.org |
| pnpm | 9 o superior | https://pnpm.io/installation |

> El despliegue a producción está automatizado con **GitHub Actions**.

---

## Puesta en marcha (local)

1. **Clona el repositorio e instala dependencias:**

   ```
   pnpm install
   ```

2. **Crea el archivo de variables de entorno** `.env` en la raíz del proyecto:

   ```
     BETTER_AUTH_SECRET=
     BETTER_AUTH_URL=
     CLOUDFLARE_ACCOUNT_ID=
     CLOUDFLARE_DATABASE_ID=
     CLOUDFLARE_D1_TOKEN=
     RESEND_API_KEY=
     # remitente de correos con Resend (dominio verificado en Resend)
     EMAIL_FROM="JPDH <no-reply@emails.jovenesporlosderechoshumanoscr.org>"
     BREVO_API_KEY=
     # id de la lista de contactos en brevo
     BREVO_LIST_ID=
     BREVO_SENDER_EMAIL=
     BREVO_SENDER_NAME=
     BREVO_REPLY_TO=
     # id del template activo para el doble opt-in debe tener el tag optin
     BREVO_DOI_TEMPLATE_ID=
     BREVO_DOI_REDIRECT_URL=https://localhost:3000/newsletter?status=ok
   ```

   - Para generar `BETTER_AUTH_SECRET` puedes usar `openssl rand -base64 32`.
   - Las variables públicas (URL, IDs de listas, plantillas y remitentes de correo) ya vienen configuradas en `wrangler.jsonc`, no es necesario duplicarlas en `.env`.

3. **Levanta el servidor de desarrollo:**

   ```
   pnpm dev
   ```

   La aplicación corre en **http://localhost:3000**.

---

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en el puerto 3000 |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm test` | Corre los tests con Vitest |
| `pnpm test:watch` | Tests en modo observador |
| `pnpm lint` | Revisa el código con ESLint |
| `pnpm format` | Formatea con Prettier y corrige errores de ESLint |
| `pnpm check` | Verifica el formateo sin modificar archivos |
| `pnpm generate-routes` | Regenera las rutas de TanStack Router |

---

## Producción

El despliegue está **completamente automatizado con GitHub Actions**: al hacer push (o merge) a la rama principal, el pipeline compila la aplicación y la publica en Cloudflare Workers. No se requiere ejecutar builds ni deploys manualmente.

Lo único que se configura una sola vez, desde la interfaz de GitHub (Settings → Secrets and variables → Actions), son los secretos del entorno de producción:

| Secreto | Uso |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token con permisos para publicar el Worker |
| `BETTER_AUTH_SECRET` | Secreto de Better Auth en producción |
| `RESEND_API_KEY` | Envío de correos transaccionales |
| `BREVO_API_KEY` | Contactos y doble opt-in del boletín |

Las variables no sensibles (URL pública, IDs de listas, remitentes) viven en `wrangler.jsonc` bajo `vars`, y los bindings de D1 y R2 (`jpdhdb`, `MEDIA`, `PLANTILLAS`) también están definidos ahí. Ver la [documentación de configuración de Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).

---

## Autores

- Luis David Miranda Villalta
