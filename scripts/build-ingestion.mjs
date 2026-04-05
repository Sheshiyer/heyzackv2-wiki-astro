import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildDocIndex } from './lib/build-doc-index.mjs';
import { chunkDoc } from './lib/chunk-doc.mjs';
import { renderLlmsTxt, renderLlmsFullTxt } from './lib/render-llms-txt.mjs';
import {
  buildManifest,
  buildRelationships,
  buildTree,
  renderNormalizedDocument,
  renderTreeText,
} from './lib/render-manifest.mjs';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const docsRoot = path.join(repoRoot, 'src', 'content', 'docs');
const publicRoot = path.join(repoRoot, 'public');
const ingestRoot = path.join(publicRoot, 'ingest');
const documentsRoot = path.join(ingestRoot, 'documents');
const checkMode = process.argv.includes('--check');

async function loadSiteUrl() {
  const configUrl = pathToFileURL(path.join(repoRoot, 'astro.config.mjs')).href;
  const config = await import(configUrl);
  return config.default?.site ? String(config.default.site) : 'https://heyzack.ai';
}

async function ensureCleanDirectory(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, 'utf8');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateOutputs() {
  const siteUrl = await loadSiteUrl();
  const generatedAt = new Date().toISOString();
  const docs = await buildDocIndex({ docsRoot, siteUrl });
  const chunks = docs.flatMap((doc) => chunkDoc(doc));
  const tree = buildTree(docs);
  const manifest = buildManifest({
    docs,
    siteUrl,
    generatedAt,
    chunkCount: chunks.length,
  });
  const relationships = buildRelationships(docs);

  if (checkMode) {
    const requiredFiles = [
      path.join(publicRoot, 'llms.txt'),
      path.join(publicRoot, 'llms-full.txt'),
      path.join(ingestRoot, 'manifest.json'),
      path.join(ingestRoot, 'tree.json'),
      path.join(ingestRoot, 'docs.ndjson'),
      path.join(ingestRoot, 'chunks.ndjson'),
    ];

    const missingFiles = [];
    for (const filePath of requiredFiles) {
      if (!(await fileExists(filePath))) {
        missingFiles.push(path.relative(repoRoot, filePath));
      }
    }

    for (const doc of docs) {
      const exportedDocPath = path.join(publicRoot, doc.documentPath.replace(/^\//, ''));
      if (!(await fileExists(exportedDocPath))) {
        missingFiles.push(path.relative(repoRoot, exportedDocPath));
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing generated ingestion files:\n- ${missingFiles.join('\n- ')}`);
    }

    const manifestJson = JSON.parse(await fs.readFile(path.join(ingestRoot, 'manifest.json'), 'utf8'));
    if (manifestJson.documents.length !== docs.length) {
      throw new Error(`Manifest document count mismatch: expected ${docs.length}, found ${manifestJson.documents.length}`);
    }

    console.log(`Ingestion check passed for ${docs.length} docs and ${chunks.length} chunks.`);
    return;
  }

  await fs.mkdir(publicRoot, { recursive: true });
  await ensureCleanDirectory(ingestRoot);

  await writeText(path.join(publicRoot, 'llms.txt'), renderLlmsTxt({ docs, siteUrl }));
  await writeText(path.join(publicRoot, 'llms-full.txt'), renderLlmsFullTxt(docs));
  await writeJson(path.join(ingestRoot, 'manifest.json'), manifest);
  await writeJson(path.join(ingestRoot, 'tree.json'), tree);
  await writeText(path.join(ingestRoot, 'tree.txt'), `${renderTreeText(tree)}\n`);
  await writeJson(path.join(ingestRoot, 'relationships.json'), relationships);
  await writeText(
    path.join(ingestRoot, 'docs.ndjson'),
    `${docs.map((doc) => JSON.stringify({
      docId: doc.docId,
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      category: doc.category,
      audience: doc.audience,
      canonicalUrl: doc.canonicalUrl,
      sourcePath: doc.sourcePath,
      markdown: doc.body,
    })).join('\n')}\n`,
  );
  await writeText(
    path.join(ingestRoot, 'chunks.ndjson'),
    `${chunks.map((chunk) => JSON.stringify(chunk)).join('\n')}\n`,
  );

  for (const doc of docs) {
    const outputPath = path.join(documentsRoot, `${doc.slug}.md`);
    await writeText(outputPath, renderNormalizedDocument(doc));
  }

  console.log(`Generated ingestion outputs for ${docs.length} docs and ${chunks.length} chunks.`);
}

generateOutputs().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
