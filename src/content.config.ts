import { defineCollection, z } from 'astro:content';

const categorySchema = z.enum([
  'home',
  'getting-started',
  'product',
  'brand',
  'audience',
  'marketing',
  'heyzackv2',
]);

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    category: categorySchema.optional(),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    docId: z.string().optional(),
    docType: z.enum([
      'landing',
      'overview',
      'persona',
      'campaign',
      'email',
      'playbook',
      'spec',
      'slide',
      'reference',
    ]).optional(),
    audience: z.array(z.enum(['b2c', 'b2b', 'internal', 'all'])).optional(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
    canonicalPath: z.string().optional(),
    related: z.array(z.string()).optional(),
    ingestPriority: z.number().min(1).max(5).optional(),
    chunkStrategy: z.enum(['heading', 'paragraph', 'full']).optional(),
    lastUpdated: z.union([z.string(), z.date()]).optional(),
  }),
});

export const collections = { docs };
