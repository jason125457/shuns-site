import { describe, expect, it } from 'vitest';
import { coverSchema, photoSchema, projectSchema } from './schemas';

const cover = {
  id: 'sample-cover',
  title: '曲名',
  artist: '原唱',
  youtube: 'https://youtu.be/dQw4w9WgXcQ',
  date: '2026-10-01',
  note: '心得',
};

describe('coverSchema', () => {
  it('turns the YouTube link into an id and canonical url', () => {
    const parsed = coverSchema.parse(cover);
    expect(parsed.youtube).toEqual({
      id: 'dQw4w9WgXcQ',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
    expect(parsed.date).toBeInstanceOf(Date);
  });

  it('rejects a link that is not YouTube', () => {
    const result = coverSchema.safeParse({ ...cover, youtube: 'https://vimeo.com/1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain('YouTube');
  });

  it('keeps the note optional but rejects an empty one', () => {
    const withoutNote: Partial<typeof cover> = { ...cover };
    delete withoutNote.note;
    expect(coverSchema.parse(withoutNote).note).toBeUndefined();
    expect(coverSchema.safeParse({ ...cover, note: '   ' }).success).toBe(false);
  });

  it('rejects missing fields, bad ids, bad dates, and unknown keys', () => {
    const withoutArtist: Partial<typeof cover> = { ...cover };
    delete withoutArtist.artist;
    expect(coverSchema.safeParse(withoutArtist).success).toBe(false);
    expect(coverSchema.safeParse({ ...cover, id: 'Has Spaces' }).success).toBe(false);
    expect(coverSchema.safeParse({ ...cover, date: 'someday' }).success).toBe(false);
    expect(coverSchema.safeParse({ ...cover, artst: 'typo' }).success).toBe(false);
  });
});

const project = {
  id: 'guitar',
  name: 'Guitar 工具',
  summary: '介紹',
  tech: ['Astro'],
  url: 'https://guitar.shuns.site',
};

describe('projectSchema', () => {
  it('defaults the order and keeps repo optional', () => {
    const parsed = projectSchema.parse(project);
    expect(parsed.order).toBe(100);
    expect(parsed.repo).toBeUndefined();
  });

  it('accepts a GitHub repo link', () => {
    const repo = 'https://github.com/jason125457/guitar-idea-pad';
    expect(projectSchema.parse({ ...project, repo }).repo).toBe(repo);
  });

  it('rejects non-https site links, non-GitHub repos, and empty tech lists', () => {
    expect(projectSchema.safeParse({ ...project, url: 'http://guitar.shuns.site' }).success).toBe(
      false,
    );
    expect(projectSchema.safeParse({ ...project, url: 'javascript:alert(1)' }).success).toBe(false);
    expect(
      projectSchema.safeParse({ ...project, repo: 'https://gitlab.com/someone/thing' }).success,
    ).toBe(false);
    expect(projectSchema.safeParse({ ...project, tech: [] }).success).toBe(false);
  });
});

describe('photoSchema', () => {
  it('normalises the Instagram link', () => {
    const parsed = photoSchema.parse({
      id: 'first',
      instagram: 'https://www.instagram.com/p/C1a2B3c4D5e/?igsh=x',
    });
    expect(parsed.instagram.permalink).toBe('https://www.instagram.com/p/C1a2B3c4D5e/');
  });

  it('rejects links that are not Instagram posts', () => {
    expect(
      photoSchema.safeParse({ id: 'x', instagram: 'https://www.instagram.com/someone/' }).success,
    ).toBe(false);
  });
});
