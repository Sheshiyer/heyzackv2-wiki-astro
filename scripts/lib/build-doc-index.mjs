import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const CATEGORY_VALUES = new Set([
  'home',
  'getting-started',
  'product',
  'brand',
  'audience',
  'marketing',
  'heyzackv2',
]);

const HIGH_PRIORITY_SLUGS = new Set([
  'index',
  'product/overview',
  'product/features',
  'product/specifications',
  'brand/positioning',
  'brand/voice-tone',
  'heyzackv2/product',
]);

export async function collectMarkdownFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath);
    }

    return entry.isFile() && fullPath.endsWith('.md') ? [fullPath] : [];
  }));

  return files.flat().sort((left, right) => left.localeCompare(right));
}

function parseFrontmatter(source) {
  if (!source.startsWith('---\n')) {
    return { data: {}, body: source.trim() };
  }

  const end = source.indexOf('\n---\n', 4);
  if (end === -1) {
    return { data: {}, body: source.trim() };
  }

  const rawFrontmatter = source.slice(4, end);
  const body = source.slice(end + 5).trim();

  return {
    data: yaml.load(rawFrontmatter) ?? {},
    body,
  };
}

function slugFromFile(docsRoot, filePath) {
  return path.relative(docsRoot, filePath).replace(/\\/g, '/').replace(/\.md$/, '');
}

function titleFromSlug(slug) {
  return slug
    .split('/')
    .at(-1)
    ?.split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') ?? slug;
}

function normalizeStringArray(value) {
  if (!value) {
    return [];
  }

  const list = Array.isArray(value) ? value : [value];
  return list
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function normalizeCategory(category, slug) {
  if (category) {
    const normalized = String(category).trim().toLowerCase();
    if (CATEGORY_VALUES.has(normalized)) {
      return normalized;
    }

    for (const candidate of CATEGORY_VALUES) {
      if (normalized.includes(candidate)) {
        return candidate;
      }
    }

    if (normalized.includes('getting') && normalized.includes('start')) {
      return 'getting-started';
    }
  }

  if (slug === 'index') {
    return 'home';
  }

  const [firstSegment] = slug.split('/');
  return CATEGORY_VALUES.has(firstSegment) ? firstSegment : 'heyzackv2';
}

function deriveDocType(explicitType, slug) {
  if (explicitType) {
    return explicitType;
  }

  if (slug === 'index') return 'landing';
  if (slug.includes('/slides/') || slug.startsWith('heyzackv2/slides/')) return 'slide';
  if (slug.includes('persona')) return 'persona';
  if (slug.includes('campaign') || slug.includes('press-release')) return 'campaign';
  if (slug.includes('email') || slug.includes('sequence')) return 'email';
  if (slug.includes('playbook') || slug.includes('community-management') || slug.includes('review-responses') || slug.includes('short-form-hooks')) return 'playbook';
  if (slug.includes('specifications')) return 'spec';
  if (slug.includes('overview') || slug.endsWith('/product') || slug === 'product/overview') return 'overview';
  return 'reference';
}

function deriveAudience(explicitAudience, slug) {
  const normalized = normalizeStringArray(explicitAudience).map((value) => value.toLowerCase());
  if (normalized.length > 0) {
    return normalized;
  }

  if (slug.includes('b2b') || slug.includes('property-manager') || slug.includes('hospitality')) {
    return ['b2b'];
  }

  if (
    slug.includes('b2c') ||
    slug.includes('tech-savvy') ||
    slug.includes('energy-conscious') ||
    slug.includes('safety-focused') ||
    slug.includes('primary-persona') ||
    slug.includes('secondary-personas')
  ) {
    return ['b2c'];
  }

  return ['all'];
}

function deriveCanonicalPath(explicitPath, slug) {
  if (explicitPath) {
    return String(explicitPath).trim();
  }

  return slug === 'index' ? '/docs/' : `/docs/${slug}/`;
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstParagraph(body) {
  return body
    .split(/\n\s*\n/)
    .map((block) => stripMarkdown(block))
    .find(Boolean) ?? '';
}

function deriveSummary(data, body) {
  const candidate = data.summary ?? data.description ?? firstParagraph(body);
  return stripMarkdown(String(candidate)).slice(0, 280);
}

function deriveIngestPriority(explicitPriority, slug) {
  if (typeof explicitPriority === 'number') {
    return explicitPriority;
  }

  if (HIGH_PRIORITY_SLUGS.has(slug)) {
    return 5;
  }

  if (slug.startsWith('audience/') || slug.startsWith('brand/') || slug.startsWith('marketing/')) {
    return 4;
  }

  return 3;
}

function formatLastUpdated(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function validateDocIndex(docs) {
  const errors = [];
  const seenDocIds = new Map();
  const seenSlugs = new Map();

  for (const doc of docs) {
    if (!doc.title) {
      errors.push(`Missing title for slug "${doc.slug}"`);
    }

    if (seenDocIds.has(doc.docId)) {
      errors.push(`Duplicate docId "${doc.docId}" in "${doc.slug}" and "${seenDocIds.get(doc.docId)}"`);
    } else {
      seenDocIds.set(doc.docId, doc.slug);
    }

    if (seenSlugs.has(doc.slug)) {
      errors.push(`Duplicate slug "${doc.slug}"`);
    } else {
      seenSlugs.set(doc.slug, doc.docId);
    }
  }

  const slugSet = new Set(docs.map((doc) => doc.slug));
  for (const doc of docs) {
    for (const relatedSlug of doc.related) {
      if (!slugSet.has(relatedSlug)) {
        errors.push(`Related slug "${relatedSlug}" referenced by "${doc.slug}" does not exist`);
      }
    }
  }

  return errors;
}

export async function buildDocIndex({ docsRoot, siteUrl }) {
  const markdownFiles = await collectMarkdownFiles(docsRoot);

  const docs = await Promise.all(markdownFiles.map(async (filePath) => {
    const source = await fs.readFile(filePath, 'utf8');
    const { data, body } = parseFrontmatter(source);
    const slug = slugFromFile(docsRoot, filePath);
    const canonicalPath = deriveCanonicalPath(data.canonicalPath, slug);
    const category = normalizeCategory(data.category, slug);
    const docId = String(data.docId ?? slug.replace(/\//g, '-'));
    const title = String(data.title ?? titleFromSlug(slug));
    const summary = deriveSummary(data, body);
    const audience = deriveAudience(data.audience, slug);
    const docType = deriveDocType(data.docType, slug);
    const status = String(data.status ?? 'active');
    const tags = normalizeStringArray(data.tags);
    const sources = normalizeStringArray(data.sources);
    const related = normalizeStringArray(data.related);
    const chunkStrategy = String(data.chunkStrategy ?? 'heading');
    const ingestPriority = deriveIngestPriority(data.ingestPriority, slug);
    const lastUpdated = formatLastUpdated(data.lastUpdated);
    const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    return {
      docId,
      slug,
      title,
      description: data.description ? String(data.description) : null,
      summary,
      category,
      docType,
      audience,
      status,
      tags,
      sources,
      related,
      chunkStrategy,
      ingestPriority,
      canonicalPath,
      canonicalUrl: new URL(canonicalPath, siteUrl).toString(),
      lastUpdated,
      body,
      sourcePath,
      documentPath: `/ingest/documents/${slug}.md`,
      hash: sha256(`${canonicalPath}\n${body}`),
    };
  }));

  const errors = validateDocIndex(docs);
  if (errors.length > 0) {
    throw new Error(`Doc index validation failed:\n- ${errors.join('\n- ')}`);
  }

  return docs.sort((left, right) => {
    if (left.ingestPriority !== right.ingestPriority) {
      return right.ingestPriority - left.ingestPriority;
    }

    return left.slug.localeCompare(right.slug);
  });
}
