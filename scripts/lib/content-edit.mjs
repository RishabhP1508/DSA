// Authoring helper: edit only explicitly named top-level fields. No evidence or review grants.
import fs from 'node:fs';
import ts from 'typescript';
import { loadCurriculum } from './load-curriculum.mjs';
const { lessons, patterns } = await loadCurriculum();
export function get(kind, id) {
  const item = (kind === 'lesson' ? lessons : patterns).find(x => x.id === id);
  if (!item) throw Error(`Unknown ${kind}:${id}`);
  return structuredClone(item);
}
export function save(kind, id, item, keys, code) {
  const file = `src/content/${kind === 'lesson' ? 'lessons' : 'patterns'}/${id}.ts`;
  let source = fs.readFileSync(file, 'utf8');
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  let object, codeNode;
  function visit(n) {
    if (ts.isVariableDeclaration(n) && n.initializer) {
      if (ts.isObjectLiteralExpression(n.initializer) && n.initializer.properties.some(p => p.name?.getText(tree) === 'id')) object = n.initializer;
      if (['code', 'walkthroughCode'].includes(n.name.getText(tree))) codeNode = n.initializer;
    }
    ts.forEachChild(n, visit);
  }
  visit(tree);
  const edits = keys.map(key => {
    const p = object.properties.find(p => p.name?.getText(tree) === key);
    if (!p) throw Error(`Missing ${file}:${key}`);
    const a = p.initializer ?? p;
    return { start: a.getStart(tree), end: a.end, text: (p.initializer ? '' : key + ': ') + JSON.stringify(item[key], null, 2) };
  });
  if (code !== undefined) edits.push({ start: codeNode.getStart(tree), end: codeNode.end, text: '`' + code.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${') + '`' });
  for (const e of edits.sort((a,b) => b.start - a.start)) source = source.slice(0,e.start) + e.text + source.slice(e.end);
  fs.writeFileSync(file, source);
}
export function reference(url, title, section, claims, topic) {
  return { url, title, section, topic, purpose: 'Check the specific claims and conventions used here.', verifiedClaims: claims, accessDate: new Date().toISOString().slice(0,10) };
}
export function saveExerciseOverride(uid, field, value) {
  const file='src/content/exercise-tests-data.ts';
  let source=fs.readFileSync(file,'utf8');
  const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
  const edits=[];
  function visit(n) {
    if(ts.isPropertyAssignment(n) && ts.isStringLiteral(n.name) && n.name.text===uid &&
      (field==='recognition' ? ts.isObjectLiteralExpression(n.initializer) : field==='hints' && ts.isArrayLiteralExpression(n.initializer))) {
      edits.push({start:n.initializer.getStart(tree),end:n.initializer.end,text:JSON.stringify(value,null,2)});
    }
    ts.forEachChild(n,visit);
  }
  visit(tree);
  if(!edits.length) throw Error(`Missing ${field} override ${uid}`);
  for(const e of edits.sort((a,b)=>b.start-a.start)) source=source.slice(0,e.start)+e.text+source.slice(e.end);
  fs.writeFileSync(file,source);
}
