import fs from 'node:fs';
const root='docs/design/faction-prologue-v1/';
const md=fs.readFileSync(root+'PROLOGUE_FACTION_AFFINITY_KO.md','utf8');
const blocks=md.split(/# 기억 [IVX]+ — /).slice(1);
const scenes=blocks.map((b,i)=>{const [title,...rest]=b.split('\n');const body=rest.join('\n').split(/# 결과 연출/)[0];const [scene,...choices]=body.split(/### 선택 [ABCD]/);return {id:`M${i+1}`,title:title.trim(),scene:scene.replace(/---/g,'').trim(),choices:choices.map(c=>({label:(c.match(/\*\*(.*?)\*\*/s)||[])[1],line:(c.match(/> “(.*?)”/s)||[])[1]}))};});
fs.writeFileSync('data/prologue_scenes.json',JSON.stringify(scenes,null,2));
