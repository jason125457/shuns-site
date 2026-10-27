/** Film-edge style date, e.g. 2026.10.25. Uses UTC because YAML dates carry no time zone. */
export function formatFilmDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`;
}
