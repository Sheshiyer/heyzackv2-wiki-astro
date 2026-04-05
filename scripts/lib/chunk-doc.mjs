function estimateTokens(text) {
  return Math.max(1, Math.ceil(text.length / 4));
}

function compactText(text) {
  return text.replace(/\s+\n/g, '\n').trim();
}

function splitLargeSection(text, maxChars) {
  if (text.length <= maxChars) {
    return [text];
  }

  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length > maxChars && current) {
      chunks.push(current.trim());
      current = paragraph;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function chunkDoc(doc, maxChars = 3200) {
  const lines = doc.body.split('\n');
  const sections = [];
  const headingStack = [];
  let currentHeading = 'Introduction';
  let currentLines = [];

  const flushSection = () => {
    const text = compactText(currentLines.join('\n'));
    if (!text) {
      return;
    }

    sections.push({
      headingPath: headingStack.length > 0 ? headingStack.join(' > ') : currentHeading,
      text,
    });
  };

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!match) {
      currentLines.push(line);
      continue;
    }

    flushSection();
    currentLines = [line];

    const depth = match[1].length;
    const heading = match[2].trim();
    headingStack.splice(depth - 1);
    headingStack[depth - 1] = heading;
    currentHeading = heading;
  }

  flushSection();

  if (sections.length === 0) {
    sections.push({
      headingPath: 'Document',
      text: compactText(doc.body),
    });
  }

  let order = 0;
  return sections.flatMap((section) => {
    const parts = splitLargeSection(section.text, maxChars);
    return parts.map((text, index) => {
      order += 1;
      return {
        chunkId: `${doc.docId}::${order}`,
        docId: doc.docId,
        slug: doc.slug,
        title: doc.title,
        category: doc.category,
        audience: doc.audience,
        headingPath: parts.length > 1 ? `${section.headingPath} (part ${index + 1})` : section.headingPath,
        order,
        tokenEstimate: estimateTokens(text),
        canonicalUrl: doc.canonicalUrl,
        text,
      };
    });
  });
}
