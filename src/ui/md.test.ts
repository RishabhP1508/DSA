// @vitest-environment node
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mdInline } from './md';

describe('learner-facing inline formatting', () => {
  it('escapes bold and code markers', () => {
    expect(mdInline('**hi**')).toBe('<strong>hi</strong>');
    expect(mdInline('`x`')).toBe('<code>x</code>');
  });
  it('escapes raw HTML angle brackets before formatting', () => {
    expect(mdInline('<script>')).toBe('&lt;script&gt;');
    expect(mdInline('a & b')).toBe('a &amp; b');
  });
  it('leaves metacharacter-free text unchanged (property)', () => {
    fc.assert(fc.property(fc.stringMatching(/^[A-Za-z0-9 .,;:!?()\-']*$/), s => {
      expect(mdInline(s)).toBe(s);
    }), { numRuns: 200 });
  });
  it('never emits raw angle brackets from arbitrary input (property)', () => {
    fc.assert(fc.property(fc.string(), s => {
      const withoutTags = mdInline(s).replace(/<\/?(?:strong|code|em)>/g, '');
      expect(withoutTags.includes('<')).toBe(false);
      expect(withoutTags.includes('>')).toBe(false);
    }), { numRuns: 200 });
  });
  it('renders emphasis and code while preserving Python operators', () => {
    expect(mdInline('Each value is an *object*. Use **identity**, not `a * b * c`.'))
      .toBe('Each value is an <em>object</em>. Use <strong>identity</strong>, not <code>a * b * c</code>.');
  });
  it('keeps escaped HTML safe in every formatted context', () => {
    const html = mdInline('**<script>** *<img onerror=x>* `<button>` & text');
    expect(html).toBe('<strong>&lt;script&gt;</strong> <em>&lt;img onerror=x&gt;</em> <code>&lt;button&gt;</code> &amp; text');
  });
  it('can render code within a bold explanation', () => {
    expect(mdInline('**`best = scores` shares an object**')).toBe('<strong><code>best = scores</code> shares an object</strong>');
  });
  it('does not turn unmatched asterisks or code markers into tags', () => {
    expect(mdInline('cost * count; an *unfinished note; `unfinished')).toBe('cost * count; an *unfinished note; `unfinished');
  });
});
