/**
 * Pure core of the human-review ledger generator (R5.3 / R6 amendment).
 *
 * Separated from gen_review_ledger.mjs so the "a new item must stay pending
 * unless a human explicitly signs it off" rule is unit-testable without writing
 * files. The evidence codemod (codemod_add_evidence.mjs) grants
 * `semanticReview: true` ONLY when an item's live content hash equals its ledger
 * `reviewedHash`. Therefore:
 *
 *   - A SIGNED item (its "<kind>:<id>" is in `reviewedNow`) is stamped at its
 *     live hash + the validated sign-off date → it will match → reviewed.
 *   - An UNCHANGED prior item keeps its recorded hash/date verbatim → it matches
 *     only if its content truly did not change.
 *   - A CHANGED prior item (live hash ≠ recorded) keeps the OLD recorded hash →
 *     it will NOT match → pending (review cannot survive a content edit).
 *   - A NEW item with NO prior entry and NOT signed off gets a SENTINEL
 *     reviewedHash that can never equal any real content hash → pending. (The
 *     previous bug recorded the live hash here, which silently granted review to
 *     a brand-new, unreviewed item.)
 *
 * `UNREVIEWED_SENTINEL` is deliberately not a 16-hex-char string, so it can
 * never collide with a real `contentHashOf` output.
 */

export const UNREVIEWED_SENTINEL = "unreviewed-pending-human-signoff";

/** ISO yyyy-mm-dd. Throws on anything else, so a sign-off date is validated. */
export function assertIsoDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`sign-off date must be ISO yyyy-mm-dd, got ${JSON.stringify(date)}`);
  }
  // Reject impossible calendar dates (e.g. 2026-13-40).
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    throw new Error(`sign-off date is not a real calendar date: ${date}`);
  }
  return date;
}

/**
 * Guard: a human sign-off cannot predate the content it reviews.
 *
 * The ledger records that a person READ an item at a specific content hash. That
 * reading necessarily happens no earlier than the content was last verified
 * (`evidence.verifiedAt`), because the hash being signed off is the hash produced
 * by that verification. A `reviewedAt` strictly before `verifiedAt` is therefore
 * incoherent — it is the signature of a stale/wrong clock (the bug that stamped
 * 2026-09-21 onto a lesson verified 2026-10-03). Reject it loudly rather than
 * recording an impossible timeline.
 *
 * Only enforced for items being signed off NOW and only when the item exposes a
 * verification date; patterns/items without `evidence.verifiedAt` are unaffected.
 * @param {string} key          "<kind>:<id>" for the error message
 * @param {{evidence?:{verifiedAt?:string}}} item
 * @param {string} signoffDate  validated ISO sign-off date
 */
export function assertSignoffNotBeforeVerified(key, item, signoffDate) {
  const verifiedAt = item?.evidence?.verifiedAt;
  // Only compare real ISO dates; a sentinel/absent verifiedAt is not a timeline.
  if (typeof verifiedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt)) return;
  if (signoffDate < verifiedAt) {
    throw new Error(
      `sign-off date ${signoffDate} for ${key} is BEFORE the content's verifiedAt ${verifiedAt}; ` +
        `a human review cannot predate the content it reviewed (check the clock used for SIGNOFF_DATE)`,
    );
  }
}

/**
 * Compute the ledger entry for one item.
 * @param {"lesson"|"pattern"} kind
 * @param {{id:string}} item
 * @param {number} batch
 * @param {string} liveHash   contentHashOf(item)
 * @param {object|undefined} prior  the prior ledger entry for this key, if any
 * @param {Set<string>} reviewedNow  keys ("<kind>:<id>") a human is signing off now
 * @param {string} signoffDate  validated ISO date to stamp on signed items
 */
export function ledgerEntryFor(kind, item, batch, liveHash, prior, reviewedNow, signoffDate) {
  const key = kind + ":" + item.id;

  // Explicit human sign-off NOW: stamp the live hash + the validated date.
  if (reviewedNow.has(key)) {
    // Guard: the sign-off date must not predate the content's verification date.
    assertSignoffNotBeforeVerified(key, item, signoffDate);
    return { id: item.id, kind, reviewedHash: liveHash, reviewedAt: signoffDate, batch };
  }

  // Prior entry exists: preserve it verbatim. If content changed, the preserved
  // (old) hash won't match the live hash → pending. If unchanged → still reviewed.
  if (prior) {
    return { id: item.id, kind, reviewedHash: prior.reviewedHash, reviewedAt: prior.reviewedAt, batch };
  }

  // New item, NOT signed off: record a sentinel hash that can never match a real
  // content hash, so semanticReview stays pending until a human signs it off.
  return { id: item.id, kind, reviewedHash: UNREVIEWED_SENTINEL, reviewedAt: UNREVIEWED_SENTINEL, batch };
}
