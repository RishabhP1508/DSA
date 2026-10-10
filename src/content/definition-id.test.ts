// @vitest-environment node
import {it,expect} from 'vitest';
// @ts-expect-error Build tooling helper is plain JavaScript.
import {definitionId} from '../../scripts/lib/definition-id.mjs';
it('finds quoted and unquoted top-level ids without scanning Python strings or exercise ids',()=>{
 expect(definitionId('const code = `id: "wrong"`; export const lesson = {"id":"right",exercises:[{id:"exercise"}]};')).toBe('right');
 expect(definitionId('// id: "comment"\nconst value={ id: "plain" };')).toBe('plain');
 expect(definitionId('export const code="id: wrong";')).toBeUndefined();
});
it('rejects ambiguous files instead of silently replacing another definition',()=>{expect(()=>definitionId('const a={id:"a"}; const b={id:"b"};')).toThrow(/More than one/);});
