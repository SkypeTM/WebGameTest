import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { ensurePublicUid } from '../lib/public-profile';
import type { D1DatabaseLike } from '../lib/cloud';

test('public UIDs are stable, distinct, and survive collision and parallel issuance', async()=>{
 const sql=new DatabaseSync(':memory:');
 try {
 sql.exec('CREATE TABLE user(id TEXT PRIMARY KEY); INSERT INTO user VALUES (\'a\'),(\'b\'),(\'c\');');
 sql.exec(readFileSync(new URL('../migrations/0003_public_profiles.sql',import.meta.url),'utf8'));
 const db={prepare(query:string){return {bind(...args: (string|number)[]){return {async first(){return sql.prepare(query).get(...args)||null;},async run(){return sql.prepare(query).run(...args);}};}};}} as unknown as D1DatabaseLike;
 const a=await ensurePublicUid(db,'a');
 assert.match(a,/^SB-[A-F0-9]{32}$/);
 assert.equal(await ensurePublicUid(db,'a'),a);
 let calls=0;
 const b=await ensurePublicUid(db,'b',()=>++calls===1?a:'SB-'+'B'.repeat(32));
 assert.notEqual(a,b);
 const both=await Promise.all([ensurePublicUid(db,'c'),ensurePublicUid(db,'c')]);
 assert.equal(both[0],both[1]);
 assert.equal((sql.prepare('SELECT count(*) n FROM public_profiles').get() as {n:number}).n,3);
 } finally {sql.close();}
});
