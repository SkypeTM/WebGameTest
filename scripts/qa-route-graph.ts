import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createExpeditionRoute } from '../lib/game';

// Pure game data only; no browser, account, database or network access.
const failures: {region:number;seed:number;error:string}[]=[];
let checked=0;
for(let region=0;region<7;region++) for(let seed=1;seed<=100;seed++) {
  try {
    const route=createExpeditionRoute(seed,region);
    const visited=new Set<string>();
    const visit=(id:string)=>{
      assert.ok(route[id],`unknown destination ${id}`);
      if(visited.has(id))return;
      visited.add(id);
      const room=route[id];
      assert.ok(Number.isFinite(room.x) && room.x!>=10 && room.x!<=90,`${id}: x out of bounds`);
      assert.ok(Number.isFinite(room.layer) && room.layer!>=0 && room.layer!<=6,`${id}: layer out of bounds`);
      assert.equal(new Set(room.next).size,room.next.length,`${id}: duplicate edges`);
      if(id!=='victory-rest')assert.ok(room.next.length,`${id}: dead end`);
      for(const enemy of room.enemies||[]) {
        const index=Number(enemy.slice(1));
        assert.ok(index>=region*8+1 && index<=region*8+8,`${id}: wrong region monster ${enemy}`);
      }
      for(const next of room.next) {
        assert.equal(route[next]?.layer,room.layer!+1,`${id}: non-forward edge ${next}`);
        visit(next);
      }
    };
    visit('entrance');
    assert.equal(visited.size,Object.keys(route).length,'unreachable rooms');
    assert.ok(visited.has('boss') && visited.has('victory-rest'),'missing finish');
    assert.deepEqual(route,createExpeditionRoute(seed,region),'non-deterministic route');
  } catch(error) {
    failures.push({region,seed,error:error instanceof Error?error.message:String(error)});
  }
  checked++;
}
await mkdir('storage/qa-bot',{recursive:true});
await writeFile('storage/qa-bot/routes.json',JSON.stringify({checked,passed:checked-failures.length,failures,visualValidation:false},null,2));
console.log(`${failures.length?'FAIL':'PASS'}: route graphs ${checked-failures.length}/${checked}; visual layout not tested`);
if(failures.length){console.error(failures.slice(0,5));process.exitCode=1;}
