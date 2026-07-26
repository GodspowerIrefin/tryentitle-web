/**
 * Small formatting helpers. Kept framework-agnostic and side-effect free.
 */

/** Format an ISO date as e.g. "23 Jul 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Machine-readable date for a <time datetime> attribute (YYYY-MM-DD). */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10)
}

/** "5 min read" from a minute count. */
export function readingLabel(minutes: number): string {
  return `${minutes} min read`
}
