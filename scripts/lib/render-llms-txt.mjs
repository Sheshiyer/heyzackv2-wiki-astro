function uniqueBySlug(docs) {
  const seen = new Set();
  return docs.filter((doc) => {
    if (seen.has(doc.slug)) {
      return false;
    }

    seen.add(doc.slug);
    return true;
  });
}

export function renderLlmsTxt({ docs, siteUrl }) {
  const featured = uniqueBySlug(docs)
    .filter((doc) => doc.ingestPriority >= 5)
    .slice(0, 8);

  const lines = [
    '# HeyZack Wiki',
    '',
    '> Canonical source for HeyZack product, brand, audience, campaign, and launch documentation.',
    '',
    `Site: ${siteUrl}`,
    '',
    '## Core Docs',
    ...featured.map((doc) => `- [${doc.title}](${doc.canonicalPath})`),
    '',
    '## Machine-Readable Exports',
    '- [Full corpus](/llms-full.txt)',
    '- [Manifest](/ingest/manifest.json)',
    '- [Tree](/ingest/tree.json)',
    '- [Documents NDJSON](/ingest/docs.ndjson)',
    '- [Chunks NDJSON](/ingest/chunks.ndjson)',
    '',
    '## Ingestion Guidance',
    '- Start with `llms.txt` for routing.',
    '- Read `manifest.json` for canonical document metadata.',
    '- Use `documents/**/*.md` for exact document retrieval.',
    '- Use `chunks.ndjson` for embeddings and retrieval-augmented generation.',
    '',
  ];

  return `${lines.join('\n')}\n`;
}

export function renderLlmsFullTxt(docs) {
  const sorted = [...docs].sort((left, right) => {
    if (left.ingestPriority !== right.ingestPriority) {
      return right.ingestPriority - left.ingestPriority;
    }

    return left.slug.localeCompare(right.slug);
  });

  return sorted.map((doc) => {
    const lines = [
      `# Document: ${doc.title}`,
      `URL: ${doc.canonicalUrl}`,
      `Doc ID: ${doc.docId}`,
      `Category: ${doc.category}`,
      `Audience: ${doc.audience.join(', ')}`,
      `Source: ${doc.sourcePath}`,
      '',
      doc.body.trim(),
      '',
    ];

    return lines.join('\n');
  }).join('\n');
}
