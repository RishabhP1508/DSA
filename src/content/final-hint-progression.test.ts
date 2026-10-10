import { describe, expect, it } from 'vitest';
import { lessons, patterns } from './registry';

describe('complete interactive hint progression', () => {
  it('offers at least five distinct hints before the explained solution', () => {
    const incomplete = [...lessons, ...patterns].flatMap(item => item.exercises
      .filter(exercise => exercise.tests || exercise.recognition)
      .filter(exercise => new Set(exercise.hints.map(hint => hint.trim()).filter(Boolean)).size < 5)
      .map(exercise => `${item.id}:${exercise.id}`));
    expect(incomplete).toEqual([]);
  });
});
