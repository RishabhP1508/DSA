import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync('docs/reviews/codex-b6-initial-effective.json','utf8'));
for (const item of [...d.lessons,...d.patterns].slice(Number(process.argv[2]??0),Number(process.argv[3]??2))) {
  delete item.evidence; delete item.references;
  console.log(JSON.stringify(item));
}
