import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { parse } from 'yaml';

/**
 * Parses a YAML data file that must be a list of entries with unique string ids.
 * Throws with a readable message instead of logging and carrying on, so bad data fails the build.
 */
export function parseYamlEntries(text: string, fileName: string): Record<string, unknown>[] {
  let data: unknown;
  try {
    data = parse(text);
  } catch (error) {
    throw new Error(`${fileName} 不是合法的 YAML：${(error as Error).message}`, { cause: error });
  }

  if (data == null) return [];
  if (!Array.isArray(data)) throw new Error(`${fileName} 最外層要是清單（每筆用 "- " 開頭）`);

  const seen = new Set<string>();
  return data.map((item, index) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`${fileName} 第 ${index + 1} 筆不是物件`);
    }
    const entry = item as Record<string, unknown>;
    if (typeof entry.id !== 'string' || entry.id === '') {
      throw new Error(`${fileName} 第 ${index + 1} 筆缺少 id`);
    }
    if (seen.has(entry.id)) throw new Error(`${fileName} 有重複的 id：${entry.id}`);
    seen.add(entry.id);
    return entry;
  });
}

/** Astro content loader for one YAML list file, strict counterpart of the built-in file() loader. */
export function yamlList(fileName: string): Loader {
  return {
    name: 'yaml-list',
    load: async ({ config, store, parseData, watcher, logger }) => {
      const filePath = fileURLToPath(new URL(fileName, config.root));

      async function sync() {
        const entries = parseYamlEntries(await readFile(filePath, 'utf-8'), fileName);
        const parsed = await Promise.all(
          entries.map(async (entry) => {
            const id = entry.id as string;
            return { id, data: await parseData({ id, data: entry, filePath }) };
          }),
        );
        store.clear();
        for (const { id, data } of parsed) store.set({ id, data, filePath: fileName });
        logger.info(`${fileName}: ${parsed.length} 筆`);
      }

      await sync();

      watcher?.add(filePath);
      watcher?.on('change', async (changed) => {
        if (changed !== filePath) return;
        try {
          await sync();
        } catch (error) {
          // In dev keep the last good data and show why the edit was rejected.
          logger.error((error as Error).message);
        }
      });
    },
  };
}
