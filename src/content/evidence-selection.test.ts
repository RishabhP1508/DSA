import { expect, it } from 'vitest';
// @ts-expect-error JavaScript generation helper.
import { evidenceSelection } from '../../scripts/lib/evidence-selection.mjs';
const lessons=[{id:'shared'}],patterns=[{id:'shared'}];
it('keeps full regeneration as the default',()=>expect(evidenceSelection(undefined,lessons,patterns)).toBeNull());
it('keeps lesson and pattern ids separate and deduplicates',()=>expect([...evidenceSelection('lesson:shared, pattern:shared,lesson:shared',lessons,patterns)]).toEqual(['lesson:shared','pattern:shared']));
it('rejects a misspelled target before generation',()=>expect(()=>evidenceSelection('lesson:unknown',lessons,patterns)).toThrow('Unknown'));
it('rejects an accidentally empty scoped run',()=>expect(()=>evidenceSelection(' , ',lessons,patterns)).toThrow('at least one'));
