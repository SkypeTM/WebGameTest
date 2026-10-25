import test from 'node:test';
import assert from 'node:assert/strict';
import { initialGame } from './legacy-fixture';
import { companionStories } from '../lib/companion-stories';
test('companion chapters require both quest and faction reputation',()=>{
 const game=initialGame();
 assert.equal(companionStories(game,'AR1')[0].unlocked,true);
 assert.deepEqual(companionStories(game,'AR1')[1].lines,[]);
 game.completedQuests.push('Q02');
 assert.equal(companionStories(game,'AR1')[1].unlocked,false);
 game.reputation.AR=10;
 assert.equal(companionStories(game,'AR1')[1].unlocked,true);
 assert.ok(companionStories(game,'AR1')[1].lines.length);
 game.completedQuests=[];
 assert.equal(companionStories(game,'AR1')[1].unlocked,false);
 assert.deepEqual(companionStories(game,'VR1'),[]);
});
