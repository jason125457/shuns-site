import { describe, expect, it } from 'vitest';
import { parseYamlEntries } from './yaml-loader';

describe('parseYamlEntries', () => {
  it('reads a list of entries', () => {
    expect(parseYamlEntries('- id: a\n  title: A\n- id: b\n', 'x.yaml')).toEqual([
      { id: 'a', title: 'A' },
      { id: 'b' },
    ]);
  });

  it('treats an empty file or empty list as no entries', () => {
    expect(parseYamlEntries('', 'x.yaml')).toEqual([]);
    expect(parseYamlEntries('# only comments\n[]\n', 'x.yaml')).toEqual([]);
  });

  it('throws on broken YAML, a non-list root, missing ids, and duplicate ids', () => {
    expect(() => parseYamlEntries('- id: a\n  title: [unclosed', 'x.yaml')).toThrow('合法的 YAML');
    expect(() => parseYamlEntries('id: a\n', 'x.yaml')).toThrow('清單');
    expect(() => parseYamlEntries('- title: no id\n', 'x.yaml')).toThrow('缺少 id');
    expect(() => parseYamlEntries('- id: 42\n', 'x.yaml')).toThrow('缺少 id');
    expect(() => parseYamlEntries('- id: a\n- id: a\n', 'x.yaml')).toThrow('重複');
  });
});
