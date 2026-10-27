import test from 'node:test';
import assert from 'node:assert/strict';
import { initialGame } from './legacy-fixture';
import { reduceGame, normalizeGame } from '../lib/game';
import { promotionQuest } from '../lib/promotion';

test('only living participants earn personal wins and save resumes without duplication',()=>{
 let g=reduceGame(reduceGame(initialGame(),{type:'enter'},42),{type:'move',id:'l1-battle'},42);
 const r=g.run!;const b=r.battle!;
 r.heroes[1].hp=0;
 b.enemies.forEach(e=>e.hp=0);b.enemies[0].hp=1;
 b.hand=[{id:'finisher',owner:r.heroes[0].id,kind:'heavy'}];r.heroes[0].mana=99;
 g=reduceGame(g,{type:'play',id:'finisher',target:b.enemies[0].id},42);
 assert.equal(g.run!.mode,'reward');
 assert.equal(g.roster[0].combatWins,1);
 assert.equal(g.roster[1].combatWins,undefined);
 const resumed=normalizeGame(JSON.parse(JSON.stringify(g)));
 assert.equal(resumed.run!.heroes[0].combatWins,1);
 assert.equal(resumed.roster[0].combatWins,1);
 assert.throws(()=>reduceGame(resumed,{type:'play',id:'finisher',target:b.enemies[0].id},42));
 assert.equal(resumed.roster[0].combatWins,1);
});
test('personal promotion requirements cannot be satisfied by story progress alone',()=>{
 const h={id:'AR1',level:10,specialization:'bulwark',promotion:1,combatWins:7,bossWins:0};
 assert.equal(promotionQuest(h,['Q04']).eligible,false);
 h.combatWins=8;assert.equal(promotionQuest(h,['Q04']).eligible,false);
 h.bossWins=1;assert.equal(promotionQuest(h,['Q04']).eligible,true);
 const g=initialGame();g.roster[0].combatWins=-8;g.roster[0].bossWins=Infinity;
 const normalized=normalizeGame(g);assert.equal(normalized.roster[0].combatWins,undefined);assert.equal(normalized.roster[0].bossWins,undefined);
});
