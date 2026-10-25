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
 assert.deepEqual(companionStories(game,'unknown'),[]);
});

test('Velora stories require their own faction and harbor milestone',()=>{
 const game=initialGame();
 for(const id of ['VR1','VR2','VR3','VR4']) {
  assert.equal(companionStories(game,id)[0].unlocked,true);
  assert.deepEqual(companionStories(game,id)[1].lines,[]);
 }
 game.completedQuests.push('Q04');game.reputation.AR=100;
 assert.equal(companionStories(game,'VR1')[1].unlocked,false);
 game.reputation.VR=10;
 for(const id of ['VR1','VR2','VR3','VR4']) assert.equal(companionStories(game,id)[1].unlocked,true);
 game.completedQuests=[];
 assert.deepEqual(companionStories(game,'VR1')[1].lines,[]);
});
test('BC trust chapters keep dialogue hidden until both requirements are met',()=>{
 const game=initialGame();
 game.reputation.BC=10;
 for(const id of ['BC1','BC2','BC3','BC4']) {
  assert.equal(companionStories(game,id)[0].unlocked,true);
  assert.deepEqual(companionStories(game,id)[1].lines,[]);
 }
 game.completedQuests.push('Q06');
 for(const id of ['BC1','BC2','BC3','BC4']) assert.equal(companionStories(game,id)[1].unlocked,true);
 game.reputation.BC=9;
 assert.deepEqual(companionStories(game,'BC2')[1].lines,[]);
});
test('BK chapters require chapel completion and BK reputation',()=>{
 const game=initialGame();game.completedQuests.push('Q08');game.reputation.BC=100;
 for(const id of ['BK1','BK2','BK3','BK4']) {
  assert.equal(companionStories(game,id)[0].unlocked,true);
  assert.deepEqual(companionStories(game,id)[1].lines,[]);
 }
 game.reputation.BK=10;
 for(const id of ['BK1','BK2','BK3','BK4']) assert.equal(companionStories(game,id)[1].unlocked,true);
 game.completedQuests=[];
 assert.deepEqual(companionStories(game,'BK4')[1].lines,[]);
});
