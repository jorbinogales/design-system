export type CodeCharset = 'numeric' | 'alphanumeric';

/**
 * Cleans user input for codes and identifiers. Always returns a string, so leading zeros
 * survive ("0093" stays "0093"). Never store these values as numbers.
 * - numeric: keeps 0–9
 * - alphanumeric: keeps A–Z and 0–9, uppercased (pickup codes, plates)
 */
export function normalizeCode(raw: string, charset: CodeCharset = 'numeric', maxLength?: number): string {
  const cleaned = charset === 'numeric' ? raw.replace(/\D+/g, '') : raw.toUpperCase().replace(/[^A-Z0-9]+/g, '');
  return maxLength === undefined ? cleaned : cleaned.slice(0, maxLength);
}
