# Tao.Labs

Building...

## Highlights

- Pixel‑perfect layout system (single container, centered header/nav)
- Interactive particle logo (SVG-sampled, hover explode + smooth reassemble, reduced‑motion safe)
- Accessible full‑screen menu (MENU/CLOSE, aria‑modal, Esc to close)
- Theming with system/light/dark text toggle (hydration‑safe)
- Strong security headers (CSP, HSTS, Referrer‑Policy, X‑Content‑Type‑Options, Permissions‑Policy)
- Floating build badge with animated dots (set `NEXT_PUBLIC_SHOW_BUILD_BADGE=false` to hide)

## Develop

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` – start dev server
- `pnpm build` – production build
- `pnpm lint` – eslint

## Config & Env

- Security headers: `next.config.ts`
- Theme badge: `NEXT_PUBLIC_SHOW_BUILD_BADGE` (default shown)

## Deploy

Vercel recommended. Ensure env vars are set appropriately.

## License

MIT
