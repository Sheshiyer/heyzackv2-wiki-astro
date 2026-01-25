# PROJECT MEMORY - HeyZack Wiki Full Ingestion

## Overview
Ingest all 35+ markdown files from /docs/heyzackv2/ into the Astro content collection at src/content/docs/heyzackv2/. Each file needs YAML frontmatter added with title, description, category, and tags.

## Completed Tasks

## Key Breakthroughs

## Error Patterns & Solutions

## Architecture Decisions
- Category structure: heyzackv2/{subfolder} maps to content/docs/heyzackv2/{subfolder}
- All files get category: "heyzackv2" for nav grouping
- Slides subfolder has nested structure - flatten with prefixed names
