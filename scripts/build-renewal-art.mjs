import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const require=createRequire(import.meta.url);
const sharp=require(require.resolve("sharp",{paths:[require.resolve("next")]}));
const manifest=[];
const actorPoses = {
 AR1: ["ready","windup","swing","strike","recover","guard","hit"],
 AR2: ["ready","windup","swing","strike","recover","hit","skill"],
 AR3: ["ready","windup","swing","strike","recover","heal","hit"],
 AR4: ["ready","windup","swing","strike","recover","hit","skill"],
};
for(const [id, names] of Object.entries(actorPoses)) for(const pose of names){
 const source=`art-source/renewal/${id}/${pose}.png`,path=`/assets/renewal/${id}/${pose}.webp`;
 const bytes=await fs.readFile(source), metadata=await sharp(bytes).metadata(), stats=await sharp(bytes).stats();
 if(!metadata.hasAlpha || stats.channels[3].min!==0) throw Error(`${pose} needs transparent background`);
 await sharp(bytes).webp({quality:95,alphaQuality:100}).toFile(`public${path}`);
 manifest.push({id,pose,source,path,width:metadata.width,height:metadata.height,alpha:true,sha256:createHash("sha256").update(bytes).digest("hex"),styleVersion:"silent-bell-anime-v2",status:"first-animation-slice"});
}
await fs.writeFile("data/renewal_actor_manifest.json",JSON.stringify(manifest,null,2)+"\n");
console.log(`Published ${manifest.length} transparent full-body poses`);
