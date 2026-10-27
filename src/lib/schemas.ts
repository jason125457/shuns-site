import { z } from 'astro/zod';
import { parseInstagramPost } from './instagram';
import { parseYouTubeId } from './youtube';

// Plain zod schemas so they can be unit-tested; src/content.config.ts wires them to the YAML files.

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id 只能用小寫英文、數字和連字號，例如 when-the-sun-hits');

const httpsUrl = z.url({ protocol: /^https$/, error: '要用 https:// 開頭的完整網址' });

const youtubeVideo = z.string().transform((value, ctx) => {
  const videoId = parseYouTubeId(value);
  if (!videoId) {
    ctx.addIssue({ code: 'custom', message: `看不懂這個 YouTube 網址：${value}` });
    return z.NEVER;
  }
  return { id: videoId, url: `https://www.youtube.com/watch?v=${videoId}` };
});

const instagramPost = z.string().transform((value, ctx) => {
  const post = parseInstagramPost(value);
  if (!post) {
    ctx.addIssue({ code: 'custom', message: `看不懂這個 Instagram 貼文網址：${value}` });
    return z.NEVER;
  }
  return post;
});

export const coverSchema = z.strictObject({
  id,
  title: z.string().trim().min(1),
  /** 原唱 */
  artist: z.string().trim().min(1),
  youtube: youtubeVideo,
  date: z.coerce.date(),
  /** 一兩句心得；還沒寫的先留空，卡片就不顯示這一行 */
  note: z.string().trim().min(1).max(200).optional(),
});

export const projectSchema = z.strictObject({
  id,
  name: z.string().trim().min(1),
  summary: z.string().trim().min(1).max(300),
  tech: z.array(z.string().trim().min(1)).min(1),
  url: httpsUrl,
  /** Public repos only; leave out for private ones. */
  repo: httpsUrl
    .refine((value) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value), {
      message: 'repo 要是 https://github.com/帳號/專案 的格式',
    })
    .optional(),
  /** Lower comes first. */
  order: z.int().default(100),
});

export const photoSchema = z.strictObject({
  id,
  instagram: instagramPost,
  caption: z.string().trim().max(100).optional(),
});

export type Cover = z.output<typeof coverSchema>;
export type Project = z.output<typeof projectSchema>;
export type Photo = z.output<typeof photoSchema>;
