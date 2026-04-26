/** @param {unknown} raw */
export function parseMcOptions(raw) {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  if (raw && typeof raw === 'string') {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.map((x) => String(x)) : [];
    } catch {
      return [];
    }
  }
  return [];
}

const MIN_OPTS = 2;
const MAX_OPTS = 6;

export { MIN_OPTS, MAX_OPTS };
