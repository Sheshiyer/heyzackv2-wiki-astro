# Agent-Extractable Corpus And Ingestion System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the HeyZack Astro wiki easy for agents and ingestion pipelines to consume through canonical metadata, `llms.txt`, `llms-full.txt`, file-tree exports, and machine-readable manifests/chunks.

**Architecture:** Keep `src/content/docs/**/*.md` as the single source of truth. Normalize frontmatter there, then generate all agent-facing outputs into `public/` from one deterministic build script. Agents should ingest source Markdown or generated corpus exports first, and only fall back to rendered HTML when necessary.

**Tech Stack:** Astro 5, `astro:content`, Node/Bun build script, Markdown, JSON, NDJSON, optional `gray-matter` for standalone parsing.

---

## Design Summary

### What "agent extractable" means in this repo

Every document should have:

- a stable document ID
- a stable canonical URL
- a short summary for retrieval
- normalized category and audience metadata
- relationship metadata for related docs
- deterministic text exports that avoid HTML scraping

### What "clawable" should mean here

The corpus should be trivial to walk from either filesystem or HTTP:

1. Start with `/llms.txt`
2. Discover `/llms-full.txt` and `/ingest/manifest.json`
3. Read `/ingest/tree.json` for hierarchy
4. Pull `/ingest/docs.ndjson` or `/ingest/chunks.ndjson` for bulk ingestion
5. Optionally fetch `/ingest/documents/<slug>.md` for one-document retrieval

### Current gaps in this repo

- frontmatter is too thin for robust ingestion
- categories are inconsistent across files
- there is no stable machine-readable manifest
- there is no root-level `llms.txt`
- there is no pre-chunked export for embeddings or long-context ingestion

---

## Target File Tree

```text
docs/
  plans/
    2026-04-05-agent-extraction-ingestion.md

public/
  llms.txt
  llms-full.txt
  ingest/
    manifest.json
    tree.json
    tree.txt
    docs.ndjson
    chunks.ndjson
    relationships.json
    documents/
      index.md
      product/
        overview.md
        features.md
      brand/
        positioning.md
      heyzackv2/
        product.md

scripts/
  build-ingestion.mjs
  lib/
    build-doc-index.mjs
    chunk-doc.mjs
    render-llms-txt.mjs
    render-manifest.mjs

src/
  content.config.ts
  content/docs/**/*.md
```

---

## Metadata Contract

### Task 1: Expand the content schema

**Files:**
- Modify: `src/content.config.ts`
- Review examples: `src/content/docs/index.md`
- Review examples: `src/content/docs/product/overview.md`
- Review examples: `src/content/docs/heyzackv2/product.md`

**Step 1: Add canonical ingestion metadata fields**

Extend the docs schema with:

```ts
docId: z.string().optional(),
docType: z.enum(['landing', 'overview', 'persona', 'campaign', 'email', 'playbook', 'spec', 'slide', 'reference']).optional(),
audience: z.array(z.enum(['b2c', 'b2b', 'internal', 'all'])).optional(),
status: z.enum(['draft', 'active', 'archived']).optional(),
summary: z.string().optional(),
canonicalPath: z.string().optional(),
related: z.array(z.string()).optional(),
ingestPriority: z.number().min(1).max(5).optional(),
chunkStrategy: z.enum(['heading', 'paragraph', 'full']).optional(),
```

**Step 2: Normalize category semantics**

Use one of:

- `home`
- `getting-started`
- `product`
- `brand`
- `audience`
- `marketing`
- `heyzackv2`

Do not mix display labels and taxonomy values like `Foundation/Product`.

**Step 3: Backfill high-value documents first**

Start with:

- `src/content/docs/index.md`
- `src/content/docs/product/overview.md`
- `src/content/docs/product/features.md`
- `src/content/docs/product/specifications.md`
- `src/content/docs/heyzackv2/product.md`

Add `docId`, `summary`, `audience`, `docType`, `ingestPriority`, and `related`.

**Step 4: Verify schema compatibility**

Run: `npm run build`
Expected: Astro content sync passes with no schema errors

---

## Canonical Index Builder

### Task 2: Create one canonical document index

**Files:**
- Create: `scripts/lib/build-doc-index.mjs`
- Modify: `package.json`

**Step 1: Load all docs deterministically**

Collect every file under `src/content/docs/**/*.md` and derive:

- `docId`
- `slug`
- `title`
- `summary`
- `category`
- `audience`
- `tags`
- `canonicalUrl`
- `sourcePath`
- `hash`
- `lastUpdated`

**Step 2: Enforce fallbacks**

If fields are missing:

- `docId` defaults to slug
- `summary` defaults to `description`
- `canonicalPath` defaults to `/docs/${slug}/`, except `index` which maps to `/docs/`
- `chunkStrategy` defaults to `heading`

**Step 3: Export one in-memory shape for all downstream generators**

Example object:

```json
{
  "docId": "product-overview",
  "slug": "product/overview",
  "title": "Product Overview",
  "summary": "High-level overview of the HeyZack platform.",
  "category": "product",
  "audience": ["all"],
  "canonicalUrl": "https://heyzack.ai/docs/product/overview/",
  "sourcePath": "src/content/docs/product/overview.md",
  "hash": "sha256-...",
  "related": ["product/features", "brand/positioning"]
}
```

---

## LLMs.txt Outputs

### Task 3: Add `llms.txt` and `llms-full.txt`

**Files:**
- Create: `scripts/lib/render-llms-txt.mjs`
- Create: `public/llms.txt` via generator
- Create: `public/llms-full.txt` via generator

**Step 1: Generate `llms.txt` as a small routing document**

Keep it short. It should include:

- project title
- one-paragraph corpus description
- canonical site URL
- top sections with links
- a link to `llms-full.txt`
- a link to `ingest/manifest.json`

Recommended structure:

```md
# HeyZack Wiki

> Canonical source for HeyZack product, audience, brand, and campaign documentation.

## Core Docs
- [Docs Home](/docs/)
- [Product Overview](/docs/product/overview/)
- [Features](/docs/product/features/)
- [Specifications](/docs/product/specifications/)

## Machine-Readable Exports
- [Full corpus](/llms-full.txt)
- [Manifest](/ingest/manifest.json)
- [Chunk export](/ingest/chunks.ndjson)
```

**Step 2: Generate `llms-full.txt` as a bulk plain-text corpus**

Concatenate high-priority docs first, then all remaining docs in a stable order.

Per-doc format:

```md
# Document: Product Overview
URL: https://heyzack.ai/docs/product/overview/
Doc ID: product-overview
Category: product
Audience: all

<full markdown body>
```

**Step 3: Keep these generated, never hand-edited**

Add to README:

- source of truth is `src/content/docs/`
- `llms.txt` files are generated artifacts

Reference: [llmstxt.org](https://llmstxt.org/ed.html)

---

## Clawable Ingestion Exports

### Task 4: Build machine-readable ingestion files

**Files:**
- Create: `scripts/lib/render-manifest.mjs`
- Create: `scripts/lib/chunk-doc.mjs`
- Create: `public/ingest/manifest.json`
- Create: `public/ingest/tree.json`
- Create: `public/ingest/tree.txt`
- Create: `public/ingest/docs.ndjson`
- Create: `public/ingest/chunks.ndjson`
- Create: `public/ingest/relationships.json`
- Create: `public/ingest/documents/**/*.md`

**Step 1: `manifest.json`**

This is the main ingestion entrypoint.

Required top-level fields:

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-04-05T00:00:00Z",
  "site": "https://heyzack.ai",
  "llms": {
    "index": "/llms.txt",
    "full": "/llms-full.txt"
  },
  "documents": []
}
```

Each document entry should include:

- `docId`
- `slug`
- `title`
- `summary`
- `category`
- `audience`
- `canonicalUrl`
- `sourcePath`
- `documentPath`
- `hash`
- `chunkCount`
- `lastUpdated`

**Step 2: `tree.json` and `tree.txt`**

Produce both:

- `tree.json` for machine traversal
- `tree.txt` for quick human/agent scanning

`tree.txt` example:

```text
docs/
  index
  product/
    overview
    features
    specifications
  brand/
    positioning
    voice-tone
```

**Step 3: `docs.ndjson`**

One document per line. Good for bulk ingestion without loading one giant JSON file.

Per line:

```json
{"docId":"product-overview","slug":"product/overview","title":"Product Overview","markdown":"...","summary":"..."}
```

**Step 4: `chunks.ndjson`**

Chunk by headings first. Each record should include:

- `chunkId`
- `docId`
- `slug`
- `headingPath`
- `order`
- `tokenEstimate`
- `text`

This is the format most useful for embeddings, RAG, or agent memory layers.

**Step 5: `documents/**/*.md`**

Export one normalized markdown file per doc with:

- normalized frontmatter
- stable heading order
- no site chrome
- no HTML wrappers

This is the most clawable export because an agent can fetch just one document.

---

## Ingestion System Modes

### Task 5: Define three supported ingestion paths

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2026-04-05-agent-extraction-ingestion.md`

**Mode 1: Local filesystem ingestion**

Best for:

- Codex
- Claude Code
- repo-local automation

Read in this order:

1. `src/content/docs/**/*.md`
2. `public/ingest/manifest.json`
3. `public/ingest/chunks.ndjson`

**Mode 2: Remote HTTP ingestion**

Best for:

- external agents
- hosted RAG jobs
- scheduled crawlers

Read in this order:

1. `/llms.txt`
2. `/ingest/manifest.json`
3. `/ingest/documents/**/*.md` or `/ingest/docs.ndjson`

**Mode 3: Vector ingestion**

Best for:

- semantic retrieval
- long-context routing
- document search

Read:

- `/ingest/chunks.ndjson`

Store:

- embeddings keyed by `chunkId`
- metadata filters for `category`, `audience`, and `docId`

---

## Build Integration

### Task 6: Wire the generator into the repo lifecycle

**Files:**
- Modify: `package.json`
- Create: `scripts/build-ingestion.mjs`

**Step 1: Add scripts**

```json
{
  "scripts": {
    "build": "astro build",
    "build:ingest": "node scripts/build-ingestion.mjs",
    "build:site": "astro build",
    "build:all": "npm run build:site && npm run build:ingest"
  }
}
```

**Step 2: Decide build ownership**

Recommended:

- local dev uses `npm run build:all`
- deploy pipeline runs `build:all`
- generated outputs remain untracked in git

**Step 3: Fail fast on invalid metadata**

The ingestion build should exit non-zero if:

- a doc has no title
- duplicate `docId` values exist
- a `related` reference points to a missing slug

---

## Recommended First Implementation Slice

### Task 7: Deliver the minimum useful version first

**Files:**
- Modify: `src/content.config.ts`
- Modify: 5 high-value markdown docs
- Create: `scripts/build-ingestion.mjs`
- Create: `public/llms.txt`
- Create: `public/ingest/manifest.json`
- Create: `public/ingest/tree.json`
- Create: `public/ingest/docs.ndjson`

**Step 1: Implement schema and metadata normalization**

Do this first because every downstream output depends on it.

**Step 2: Generate only four outputs initially**

- `llms.txt`
- `manifest.json`
- `tree.json`
- `docs.ndjson`

This gives immediate value without overbuilding.

**Step 3: Add `llms-full.txt` and `chunks.ndjson` second**

These matter, but they depend on getting the canonical index right first.

---

## Verification

### Task 8: Verify the ingestion system, not just the website

**Files:**
- Test output: `public/llms.txt`
- Test output: `public/ingest/manifest.json`
- Test output: `public/ingest/tree.json`
- Test output: `public/ingest/docs.ndjson`

**Step 1: Site build**

Run: `npm run build`
Expected: Astro build passes

**Step 2: Ingestion build**

Run: `npm run build:ingest`
Expected: all exports are regenerated

**Step 3: Shape checks**

Run:

```bash
test -f public/llms.txt
test -f public/ingest/manifest.json
test -f public/ingest/tree.json
test -f public/ingest/docs.ndjson
```

Expected: exit code 0 for all

**Step 4: JSON validation**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('public/ingest/manifest.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('public/ingest/tree.json','utf8')); console.log('ok')"
```

Expected: `ok`

**Step 5: Data integrity checks**

Run:

```bash
node scripts/build-ingestion.mjs --check
```

Expected:

- no duplicate doc IDs
- every manifest doc has a generated markdown export
- every chunk references a valid document

---

## Recommendation

Recommended implementation order:

1. Normalize metadata contract
2. Build canonical doc index
3. Ship `llms.txt` + `manifest.json`
4. Ship `docs.ndjson` + tree exports
5. Ship chunking + `llms-full.txt`

This keeps one source of truth and avoids the common mistake of making agents scrape HTML when you already own the markdown source.
