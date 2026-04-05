# HeyZack Wiki Astro

Static Astro wiki for HeyZack product, brand, audience, and marketing documentation.

## Stack

- Astro 5
- Markdown content collections via `astro:content`
- Static build output in `dist/`

## Project Layout

```text
src/
  components/        Shared UI such as navigation, breadcrumbs, and TOC
  content/docs/      Markdown documentation content
  data/              Product catalog JSON used by product listing pages
  layouts/           Base and document page layouts
  pages/             Astro routes for the homepage, docs, and product pages
  styles/            Global and glassmorphism styles
public/              Static assets
```

## Local Development

Use the package manager you prefer. `bun` is a natural fit because the repo includes `bun.lock`, but `npm` works with the existing scripts too.

```bash
bun install
bun run dev
```

Equivalent `npm` commands:

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` or `bun run dev`: start the local Astro dev server
- `npm run build` or `bun run build`: generate the static site into `dist/`
- `npm run preview` or `bun run preview`: preview the production build locally

## Content Structure

The wiki content is organized under `src/content/docs/`:

- `product/`: product overview, features, and specifications
- `brand/`: positioning and voice
- `audience/`: B2C and B2B personas
- `marketing/`: templates and campaign materials
- `heyzackv2/`: extended launch, slide, persona, and messaging assets

The docs landing page now resolves at `/docs/`, while individual entries resolve from their collection slug under `/docs/...`.

## Repo Hygiene

- `node_modules/`, `dist/`, and macOS `.DS_Store` files should not be committed
- The generated site should be rebuilt locally or in CI instead of stored in git

## Verification

Latest local verification command:

```bash
npm run build
```
