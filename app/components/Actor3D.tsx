"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const threeDimensionalActors = new Set([
  "AR1", "AR2", "AR3", "AR4",
  "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08",
  "BC2",
]);

const riggedModels: Record<string, string> = {
  BC2: "/assets/models/BC2/BC2_rigged.glb",
};

type Motion = "idle" | "attack" | "hit" | "death";

const palette: Record<string, [number, number, number]> = {
  AR1: [0x18253c, 0xd3a957, 0xf0eee7], AR2: [0x142c4d, 0xc89f54, 0xe7e5df],
  AR3: [0xe8e2d5, 0xb58b43, 0x27354a], AR4: [0x24334b, 0x9f3430, 0xc8a45b],
  M01: [0x264d78, 0xd09b4d, 0x17212d], M02: [0xa97939, 0x416b87, 0x26303a],
  M03: [0xa94c24, 0x58331e, 0xe09035], M04: [0xd9dce0, 0x315a88, 0xb58d49],
  M05: [0xd7d1bf, 0x3b5875, 0x9c753b], M06: [0x244872, 0xb88a42, 0x17212d],
  M07: [0x324765, 0xc8a052, 0xcbd1d6], M08: [0x384f68, 0xc49850, 0x73767b],
};

function mat(color: number, metalness = 0.35) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness });
}
function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(x, y, z);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}
function limb(radius: number, length: number, material: THREE.Material) {
  return mesh(new THREE.CapsuleGeometry(radius, length, 5, 10), material);
}

function humanoid(id: string, full: boolean) {
  const [primary, gold, cloth] = palette[id];
  const armor = mat(primary, 0.72), trim = mat(gold, 0.85), pale = mat(cloth, 0.15);
  const skin = mat(id === "AR1" || id === "AR4" ? 0x8b5a43 : 0xc89676, 0.05);
  const group = new THREE.Group();
  const headScale = full ? 0.34 : 0.48;
  const bodyHeight = full ? 1.2 : 0.78;
  const headY = full ? 1.82 : 1.34;
  group.add(mesh(new THREE.SphereGeometry(headScale, 24, 18), skin, 0, headY, 0));
  group.add(mesh(new THREE.CapsuleGeometry(0.43, bodyHeight, 6, 16), armor, 0, full ? 0.78 : 0.62, 0));
  const shoulderY = full ? 1.23 : 0.94;
  for (const side of [-1, 1]) {
    const arm = limb(0.13, full ? 0.72 : 0.48, armor);
    arm.position.set(side * 0.55, shoulderY, 0);
    arm.rotation.z = side * 0.16;
    group.add(arm);
    const leg = limb(0.15, full ? 0.9 : 0.48, pale);
    leg.position.set(side * 0.22, full ? -0.28 : -0.08, 0);
    group.add(leg);
  }
  const hair = mesh(new THREE.SphereGeometry(headScale * 1.04, 20, 14), mat(id === "AR1" ? 0xd4d1c8 : id === "AR4" ? 0x8f2d27 : id === "AR3" ? 0x5b3828 : 0x171517, 0.05), 0, headY + 0.08, -0.08);
  hair.scale.set(1, 0.92, 0.72); group.add(hair);
  const eye = mat(0x17151a, 0.05);
  for (const side of [-1, 1]) {
    const iris = mesh(new THREE.SphereGeometry(headScale * .055, 12, 8), eye, side * headScale * .34, headY + .035, headScale * .93);
    iris.scale.y = .72; group.add(iris);
    const shoulder = mesh(new THREE.SphereGeometry(.26, 14, 10), trim, side * .48, shoulderY + .04, .02);
    shoulder.scale.set(1.22, .68, 1); group.add(shoulder);
  }
  const nose = mesh(new THREE.ConeGeometry(headScale * .045, headScale * .13, 10), skin, 0, headY - .03, headScale * .98);
  nose.rotation.x = Math.PI / 2; group.add(nose);
  group.add(mesh(new THREE.BoxGeometry(.62, .1, .5), trim, 0, full ? .45 : .39, .04));
  const chest = mesh(new THREE.BoxGeometry(0.78, 0.18, 0.48), trim, 0, shoulderY, 0.04); group.add(chest);
  if (id === "AR1") {
    const shield = mesh(new THREE.BoxGeometry(0.62, 1.18, 0.16), armor, 0.72, 0.55, 0.12);
    shield.rotation.z = -0.08; group.add(shield);
  } else if (id === "AR2") {
    const spear = mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.55, 10), trim, -0.68, 0.5, 0);
    spear.rotation.z = -0.08; group.add(spear);
  } else if (id === "AR3") {
    const bag = mesh(new THREE.BoxGeometry(0.7, 0.48, 0.36), trim, 0.62, 0.18, 0.08); group.add(bag);
  } else {
    const blade = mesh(new THREE.BoxGeometry(0.13, 1.45, 0.13), trim, -0.62, 0.3, 0);
    blade.rotation.z = -0.3; group.add(blade);
  }
  return group;
}

function monster(id: string, full: boolean) {
  const [primary, gold, dark] = palette[id];
  const body = mat(primary, 0.76), trim = mat(gold, 0.8), joint = mat(dark, 0.5);
  const g = new THREE.Group();
  const s = full ? 1.18 : 0.9;
  if (id === "M02") {
    g.add(mesh(new THREE.SphereGeometry(0.42, 20, 14), body, 0, 0.65, 0));
    for (const side of [-1, 1]) {
      const wing = mesh(new THREE.ConeGeometry(0.58, 1.05, 3), trim, side * 0.64, 0.72, 0);
      wing.rotation.z = side * -1.1; wing.scale.z = 0.18; g.add(wing);
    }
  } else if (id === "M03") {
    g.add(mesh(new THREE.SphereGeometry(0.68, 24, 18), body, 0, 0.48, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.62, 18), joint, 0, 1.03, 0));
    for (const side of [-1, 1]) for (const y of [0.18, 0.5, 0.78]) {
      const leg = limb(0.075, 0.44, trim); leg.position.set(side * 0.64, y, 0); leg.rotation.z = side * 0.9; g.add(leg);
    }
  } else if (id === "M04") {
    for (const [x, y, r] of [[0, .54, .55], [-.42, .45, .34], [.42, .45, .34]] as number[][])
      g.add(mesh(new THREE.SphereGeometry(r, 18, 12), body, x, y, 0));
    g.add(mesh(new THREE.CylinderGeometry(.045, .045, 1.7, 10), trim, -.62, .55, 0));
  } else if (id === "M05" || id === "M08") {
    g.add(mesh(new THREE.BoxGeometry(id === "M08" ? 1.45 : 1.05, .72, .65), body, 0, .58, 0));
    g.add(mesh(new THREE.SphereGeometry(.34, 18, 14), trim, .62, .72, 0));
    for (const side of [-1, 1]) for (const x of [-.38, .38]) {
      const leg = limb(.11, .46, joint); leg.position.set(x, .05, side * .22); g.add(leg);
    }
    if (id === "M08") g.add(mesh(new THREE.BoxGeometry(1.1, .85, .58), joint, -.15, 1.22, 0));
  } else {
    g.add(mesh(new THREE.SphereGeometry(.62, 22, 18), body, 0, .66, 0));
    g.add(mesh(new THREE.SphereGeometry(.34, 18, 14), joint, 0, 1.2, 0));
    for (const side of [-1, 1]) {
      const leg = limb(.13, .42, trim); leg.position.set(side * .3, .05, 0); g.add(leg);
    }
    if (id === "M01" || id === "M06") {
      g.add(mesh(new THREE.BoxGeometry(.8, 1, .12), trim, .68, .58, .04));
      g.add(mesh(new THREE.BoxGeometry(.67, .86, .18), body, .68, .58, .11));
    }
    if (id === "M07") for (const side of [-1, 1]) {
      const blade = mesh(new THREE.BoxGeometry(.12, 1.05, .12), trim, side * .66, .45, 0); blade.rotation.z = side * .55; g.add(blade);
    }
  }
  const visor = mesh(new THREE.BoxGeometry(id === "M08" ? .62 : .52, .2, .2), mat(0x10161d, .75), id === "M05" || id === "M08" ? .7 : 0, id === "M05" || id === "M08" ? .78 : 1.2, .3);
  g.add(visor);
  const glow = new THREE.MeshStandardMaterial({ color: 0xffcf54, emissive: 0xffa820, emissiveIntensity: 2.6, roughness: .2 });
  for (const side of [-1, 1]) {
    g.add(mesh(new THREE.SphereGeometry(.055, 10, 8), glow, (id === "M05" || id === "M08" ? .7 : 0) + side * .14, id === "M05" || id === "M08" ? .79 : 1.2, .42));
  }
  g.scale.setScalar(s);
  return g;
}

export function Actor3D({ id, motion = "idle", full = false, label }: { id: string; motion?: Motion; full?: boolean; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !threeDimensionalActors.has(id)) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1.65, 1.65, 2.25, -1.25, .1, 30);
    camera.position.set(0, .8, 7); camera.lookAt(0, .65, 0);
    scene.add(new THREE.HemisphereLight(0xfff2d0, 0x15212b, 2.2));
    const key = new THREE.DirectionalLight(0xffd895, 3.8); key.position.set(3, 5, 5); scene.add(key);
    // Existing procedural actors remain a compatibility fallback while Blender
    // deliveries are migrated one character at a time.
    let actor = id.startsWith("M") ? monster(id, full) : humanoid(id === "BC2" ? "AR3" : id, full);
    scene.add(actor);
    let mixer: THREE.AnimationMixer | undefined;
    let disposed = false;
    const modelUrl = riggedModels[id];
    if (modelUrl) {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          if (disposed) return;
          scene.remove(actor);
          actor = gltf.scene;
          actor.name = `${id}-rigged-model`;
          actor.traverse((item) => {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });
          scene.add(actor);
          mixer = new THREE.AnimationMixer(actor);
          const clipName = motion === "idle" ? "Idle" : motion === "attack" ? "Attack" : motion === "hit" ? "Hit" : "Death";
          const clip = THREE.AnimationClip.findByName(gltf.animations, clipName);
          if (clip) mixer.clipAction(clip).reset().play();
        },
        undefined,
        () => { /* fallback actor stays visible if a future model is unavailable */ },
      );
    }
    let frame = 0;
    const startedAt = performance.now();
    let lastFrame = startedAt;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    const render = () => {
      const t = (performance.now() - startedAt) / 1000;
      mixer?.update((performance.now() - lastFrame) / 1000);
      lastFrame = performance.now();
      actor.position.y = Math.sin(t * 2.2) * .035;
      actor.rotation.y = Math.sin(t * .8) * .08;
      if (motion === "attack") {
        const phase = (t * 1.8) % 1;
        actor.position.x = Math.sin(phase * Math.PI) * .48;
        actor.rotation.z = Math.sin(phase * Math.PI) * -.12;
      } else if (motion === "hit") {
        actor.position.x = Math.sin(t * 28) * .08;
        actor.rotation.z = -.08;
      } else if (motion === "death") {
        actor.rotation.z = Math.min(1.45, t * .8);
        actor.position.y -= Math.min(.7, t * .35);
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame); observer.disconnect();
      mixer?.stopAllAction();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, [id, motion, full]);
  return <canvas ref={canvasRef} className={`actor-3d ${full ? "actor-3d-full" : "actor-3d-sd"}`} role="img" aria-label={label || `${id} 3D 모델`} />;
}
