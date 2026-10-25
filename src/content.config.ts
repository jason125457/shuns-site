import { defineCollection } from 'astro:content';
import { yamlList } from './lib/yaml-loader';
import { coverSchema, photoSchema, projectSchema } from './lib/schemas';

export const collections = {
  covers: defineCollection({ loader: yamlList('src/data/covers.yaml'), schema: coverSchema }),
  projects: defineCollection({
    loader: yamlList('src/data/projects.yaml'),
    schema: ({ image }) => projectSchema.extend({ screenshot: image().optional() }),
  }),
  photos: defineCollection({ loader: yamlList('src/data/photos.yaml'), schema: photoSchema }),
};
