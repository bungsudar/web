import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stringList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => (Array.isArray(value) ? value : value ? [value] : []));

const sharedFields = {
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  keywords: stringList,
  draft: z.boolean().default(false),
  toc: z.boolean().optional(),
  comment: z.boolean().optional(),
  mermaid: z.boolean().optional(),
  lightgallery: z.boolean().optional(),
  layout: z.string().optional(),
  resources: z.array(z.record(z.string(), z.unknown())).optional(),
};

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    ...sharedFields,
    date: z.coerce.date(),
    tags: stringList,
    categories: stringList,
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    ...sharedFields,
    date: z.coerce.date().optional(),
    tags: stringList,
    categories: stringList,
  }),
});

export const collections = { posts, pages };
