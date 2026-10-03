/**
 * Pure helpers for the evidence generator's verification date (R9/B1 amendment).
 *
 * Separated from codemod_add_evidence.mjs so the date behaviour is unit-testable
 * WITHOUT running the whole codemod (which loads the curriculum and the bundled
 * runtime at import time).
 *
 * The rule: newly recorded or content-CHANGED evidence carries the actual run
 * date (TODAY); an UNCHANGED item (same content hash) keeps its previously
 * recorded verifiedAt. This prevents a single edit from bulk re-dating every
 * other, untouched item.
 */

/** Validate an ISO YYYY-MM-DD string that is also a real calendar date. */
export function assertIsoDate(d) {
  if (typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    throw new Error(`date must be ISO YYYY-MM-DD, got ${JSON.stringify(d)}`);
  }
  const [y, m, day] = d.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, day));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== day) {
    throw new Error(`date is not a real calendar date: ${d}`);
  }
  return d;
}

/**
 * Resolve the run date: a pinned ISO date (e.g. from VERIFIED_DATE) when given,
 * otherwise the real current date in ISO YYYY-MM-DD. Never a hard-coded constant.
 */
export function resolveToday(pinned, now = new Date()) {
  if (pinned !== undefined && pinned !== null && pinned !== "") return assertIsoDate(pinned);
  return now.toISOString().slice(0, 10);
}

/**
 * The verifiedAt to record for an item.
 * @param {{contentHash: string|null, verifiedAt: string|null}|null} prior  prior recorded evidence, if any
 * @param {string} liveHash  the item's current content hash
 * @param {string} today     the resolved run date (ISO)
 * @returns {string} prior.verifiedAt when the content hash is unchanged; else today
 */
export function verifiedAtFor(prior, liveHash, today) {
  if (prior && prior.contentHash === liveHash && prior.verifiedAt) return prior.verifiedAt;
  return today;
}
