# Session Task - Repo Review And Publish

## Plan

- [x] Inspect repo status, docs structure, and project instructions
- [x] Review the current repo for publish blockers
- [x] Update repo docs and hygiene rules
- [x] Verify the site build after changes
- [x] Commit validated repo cleanup changes locally
- [x] Push validated changes to `main`

## Review Notes

- `node_modules/` is currently tracked in git even though it is generated dependency output.
- `dist/` is currently tracked in git even though it is generated build output.
- The docs home content currently builds under `/docs/index/`; routing should resolve the landing page at `/docs/`.

## Review Result

- Verified locally with `npm run build`
- Docs landing page now builds to `dist/docs/index.html`
- Generated directories are staged for removal from git tracking
- Local commit created: `3dccdbed`

## Session Task - Agent Extractability And Ingestion Plan

### Plan

- [x] Inspect current content structure and metadata model
- [x] Define a canonical agent-ingestible document contract
- [x] Specify `llms.txt`, manifest, tree, and chunk export outputs
- [x] Save the implementation plan under `docs/plans/`
- [x] Expand the content schema and normalize high-value docs
- [x] Implement the ingestion generator and export writers
- [x] Wire ingestion generation into repo build scripts and docs
- [x] Verify build and ingestion checks

### Result

- Plan saved to `docs/plans/2026-04-05-agent-extraction-ingestion.md`
- Recommended architecture: source markdown as truth, generated machine-readable exports in `public/`
- Implemented generator scripts under `scripts/`
- Verified `npm run build:ingest`, `npm run check:ingest`, and `npm run build`
- Verified shipped outputs in `dist/llms.txt` and `dist/ingest/`
