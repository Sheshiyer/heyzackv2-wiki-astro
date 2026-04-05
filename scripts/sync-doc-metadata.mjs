import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { buildDocIndex, parseFrontmatter } from './lib/build-doc-index.mjs';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const docsRoot = path.join(repoRoot, 'src', 'content', 'docs');
const siteUrl = 'https://heyzack.ai';

function sortKeys(existingData, normalizedData) {
  const preferredOrder = [
    'title',
    'description',
    'summary',
    'category',
    'docId',
    'docType',
    'audience',
    'status',
    'canonicalPath',
    'related',
    'ingestPriority',
    'chunkStrategy',
    'order',
    'tags',
    'sources',
    'lastUpdated',
  ];

  const merged = {
    ...existingData,
    ...normalizedData,
  };

  const orderedEntries = [];
  for (const key of preferredOrder) {
    if (merged[key] !== undefined) {
      orderedEntries.push([key, merged[key]]);
      delete merged[key];
    }
  }

  for (const key of Object.keys(merged)) {
    orderedEntries.push([key, merged[key]]);
  }

  return Object.fromEntries(orderedEntries);
}

function normalizeDocFrontmatter(doc, existingData) {
  return sortKeys(existingData, {
    title: doc.title,
    description: doc.description ?? existingData.description,
    summary: doc.summary,
    category: doc.category,
    docId: doc.docId,
    docType: doc.docType,
    audience: doc.audience,
    status: doc.status,
    canonicalPath: doc.canonicalPath,
    related: doc.related,
    ingestPriority: doc.ingestPriority,
    chunkStrategy: doc.chunkStrategy,
    order: existingData.order,
    tags: doc.tags.length > 0 ? doc.tags : existingData.tags,
    sources: doc.sources.length > 0 ? doc.sources : existingData.sources,
    lastUpdated: existingData.lastUpdated ?? doc.lastUpdated,
  });
}

function renderFrontmatter(data) {
  return yaml.dump(data, {
    noRefs: true,
    lineWidth: 1000,
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false,
  }).trim();
}

async function main() {
  const docs = await buildDocIndex({ docsRoot, siteUrl });

  for (const doc of docs) {
    const filePath = path.join(repoRoot, doc.sourcePath);
    const source = await fs.readFile(filePath, 'utf8');
    const { data: existingData, body } = parseFrontmatter(source);
    const frontmatter = normalizeDocFrontmatter(doc, existingData);
    const rendered = `---\n${renderFrontmatter(frontmatter)}\n---\n\n${body.trim()}\n`;
    await fs.writeFile(filePath, rendered, 'utf8');
  }

  console.log(`Synced explicit metadata for ${docs.length} docs.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
