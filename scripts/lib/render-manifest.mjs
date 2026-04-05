import yaml from 'js-yaml';

function sortChildren(children) {
  return children.sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === 'directory' ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

export function buildTree(docs) {
  const root = { name: 'docs', type: 'directory', children: [] };

  for (const doc of docs) {
    const segments = doc.slug.split('/');
    let current = root;

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      const isLeaf = index === segments.length - 1;

      if (isLeaf) {
        current.children.push({
          name: segment,
          type: 'document',
          title: doc.title,
          slug: doc.slug,
          docId: doc.docId,
          canonicalPath: doc.canonicalPath,
        });
        continue;
      }

      let child = current.children.find((entry) => entry.type === 'directory' && entry.name === segment);
      if (!child) {
        child = { name: segment, type: 'directory', children: [] };
        current.children.push(child);
      }

      current = child;
    }
  }

  const sortNode = (node) => {
    if (!node.children) {
      return node;
    }

    node.children.forEach(sortNode);
    node.children = sortChildren(node.children);
    return node;
  };

  return sortNode(root);
}

export function renderTreeText(tree, indent = '') {
  const lines = [`${indent}${tree.name}/`];

  for (const child of tree.children ?? []) {
    if (child.type === 'directory') {
      lines.push(renderTreeText(child, `${indent}  `));
      continue;
    }

    lines.push(`${indent}  ${child.name}`);
  }

  return lines.join('\n');
}

export function buildManifest({ docs, siteUrl, generatedAt, chunkCount }) {
  return {
    schemaVersion: '1.0',
    generatedAt,
    site: siteUrl,
    llms: {
      index: '/llms.txt',
      full: '/llms-full.txt',
    },
    exports: {
      manifest: '/ingest/manifest.json',
      tree: '/ingest/tree.json',
      treeText: '/ingest/tree.txt',
      documents: '/ingest/documents/',
      docsNdjson: '/ingest/docs.ndjson',
      chunksNdjson: '/ingest/chunks.ndjson',
      relationships: '/ingest/relationships.json',
    },
    counts: {
      documents: docs.length,
      chunks: chunkCount,
    },
    documents: docs.map((doc) => ({
      docId: doc.docId,
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      category: doc.category,
      docType: doc.docType,
      audience: doc.audience,
      status: doc.status,
      canonicalUrl: doc.canonicalUrl,
      canonicalPath: doc.canonicalPath,
      sourcePath: doc.sourcePath,
      documentPath: doc.documentPath,
      hash: doc.hash,
      related: doc.related,
      tags: doc.tags,
      chunkStrategy: doc.chunkStrategy,
      ingestPriority: doc.ingestPriority,
      lastUpdated: doc.lastUpdated,
    })),
  };
}

export function buildRelationships(docs) {
  return docs.map((doc) => ({
    docId: doc.docId,
    slug: doc.slug,
    related: doc.related,
  }));
}

export function renderNormalizedDocument(doc) {
  const frontmatter = {
    title: doc.title,
    summary: doc.summary,
    description: doc.description ?? undefined,
    category: doc.category,
    docId: doc.docId,
    docType: doc.docType,
    audience: doc.audience,
    status: doc.status,
    canonicalPath: doc.canonicalPath,
    canonicalUrl: doc.canonicalUrl,
    related: doc.related,
    tags: doc.tags,
    sources: doc.sources,
    ingestPriority: doc.ingestPriority,
    chunkStrategy: doc.chunkStrategy,
    lastUpdated: doc.lastUpdated ?? undefined,
  };

  const yamlBody = yaml.dump(frontmatter, {
    lineWidth: 1000,
    noRefs: true,
    skipInvalid: true,
  }).trim();

  return `---\n${yamlBody}\n---\n\n${doc.body.trim()}\n`;
}
