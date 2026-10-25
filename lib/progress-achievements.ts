import type { Game } from "./game";
export const progressAchievements = [
  {id:"return-5",name:"익숙한 귀환길",tier:"실버",goal:5,metric:"returns"},
  {id:"return-20",name:"길을 남긴 탐험가",tier:"골드",goal:20,metric:"returns"},
  {id:"return-50",name:"심연의 등대",tier:"전설",goal:50,metric:"returns"},
  {id:"story-3",name:"기록을 잇는 자",tier:"브론즈",goal:3,metric:"stories"},
  {id:"story-7",name:"침묵의 증언자",tier:"실버",goal:7,metric:"stories"},
  {id:"story-14",name:"끝까지 들은 이야기",tier:"전설",goal:14,metric:"stories"},
  {id:"craft-1",name:"첫 불꽃",tier:"브론즈",goal:1,metric:"crafts"},
  {id:"craft-4",name:"영지의 장인",tier:"골드",goal:4,metric:"crafts"},
  {id:"veterans-4",name:"믿음직한 전열",tier:"실버",goal:4,metric:"veterans"},
  {id:"promoted-4",name:"한계를 넘은 동료들",tier:"골드",goal:4,metric:"promoted"},
] as const;
export function achievementProgress(game:Game,metric:string):number {
  switch(metric){
    case "returns":return game.runs;
    case "stories":return new Set(game.completedQuests.filter(id=>/^Q(0[1-9]|1[0-4])$/.test(id))).size;
    case "crafts":return new Set(game.craftedGear).size;
    case "veterans":return game.roster.filter(h=>h.level>=3).length;
    case "promoted":return game.roster.filter(h=>(h.promotion || 0)>0).length;
    default:return 0;
  }
}
