import { getCollection } from 'astro:content';

/** Newest first. */
export async function getCovers() {
  const covers = await getCollection('covers');
  return covers.map((entry) => entry.data).sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** By `order`, then name, so ties stay stable. */
export async function getProjects() {
  const projects = await getCollection('projects');
  return projects
    .map((entry) => entry.data)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'zh-Hant'));
}

/** In the order they appear in photos.yaml. */
export async function getPhotos() {
  const photos = await getCollection('photos');
  return photos.map((entry) => entry.data);
}
