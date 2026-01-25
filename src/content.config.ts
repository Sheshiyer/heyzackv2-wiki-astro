import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    lastUpdated: z.union([z.string(), z.date()]).optional(),
  }),
});

export const collections = { docs };
