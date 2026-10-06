Sistem web de JPDH
# Getting Started

Para ejecutar el proyecto se necesita:
  - Node.js
  - pnpm
  - wrangler
  - cloudflare cli

```bash
pnpm install
pnpm dev
```

# Producción
Aun no he hecho los scripts ni el CI/CD
apenas esten los colocare aqui

```bash
make build
```

## Despliegue en  Cloudflare Workers
guia para el despliegue manual, pronto ira a CI/CD
This project uses the Cloudflare Vite plugin (configured in `vite.config.ts`) and `wrangler.jsonc`:

1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Deploy: `npx wrangler deploy`

For production env vars, run `wrangler secret put MY_VAR` for each secret listed in `.env.example`. Public (non-secret) vars go in `wrangler.jsonc` under `vars`.

KV, D1, R2, and Durable Object bindings are configured in `wrangler.jsonc` — see https://developers.cloudflare.com/workers/wrangler/configuration/.



Authores:
  - Luis David Miranda Villalta




