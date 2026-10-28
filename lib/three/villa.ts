import * as THREE from "three";
import type { BuildingState } from "@/types/scene";
import { ramp } from "@/utils/math";

interface Part {
  m: THREE.Mesh;
  y: number;
  layer: number;
  glass: boolean;
}

export interface Villa {
  group: THREE.Group;
  parts: Part[];
  solids: THREE.MeshStandardMaterial[];
  glass: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  edgeMat: THREE.LineBasicMaterial;
  interior: THREE.Group;
  iMats: THREE.Material[];
  lights: [THREE.PointLight, THREE.PointLight];
}

/** The hero building. Assembled layer by layer, so scroll can grow it from line drawing to lit render. */
export function buildVilla(): Villa {
  const group = new THREE.Group();
  const parts: Part[] = [];

  const std = (o: THREE.MeshStandardMaterialParameters) =>
    new THREE.MeshStandardMaterial({ ...o, transparent: true });

  const concrete = std({ color: 0xb8bcbb, roughness: 0.85, metalness: 0 });
  const dark = std({ color: 0x1d2327, roughness: 0.55, metalness: 0.25 });
  const wood = std({ color: 0x9b6b43, roughness: 0.7, metalness: 0 });
  const glass = std({ color: 0x9fc8d6, roughness: 0.05, metalness: 0.5, emissive: 0xffb15e, emissiveIntensity: 0 });
  const water = std({ color: 0x2b7e92, roughness: 0.1, metalness: 0.5, emissive: 0x1a5a6a, emissiveIntensity: 0 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x8bd7ea, transparent: true, opacity: 1 });

  function part(
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    mat: THREE.MeshStandardMaterial,
    layer: number,
    isGlass = false,
  ) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    m.receiveShadow = true;
    m.castShadow = !isGlass;
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeMat));
    group.add(m);
    parts.push({ m, y, layer, glass: isGlass });
    return m;
  }

  part(26, 0.4, 16, 0, 0, 0, concrete, 0);
  part(12, 0.14, 3.6, 2.6, 0.4, 7.2, water, 0);
  part(7, 3.4, 8.4, -6.5, 0.4, -0.2, concrete, 1);
  part(10.2, 3.4, 8, 2.4, 0.4, 0, glass, 1, true);
  part(1.6, 2.7, 0.12, 2.6, 0.4, 4.05, dark, 5);
  part(20, 0.4, 11, 0, 3.8, 1, concrete, 2);
  part(0.5, 7.6, 6, -9.6, 0.4, -2, concrete, 2);
  part(9, 3.2, 6.4, -3.8, 4.2, -1.6, wood, 3);
  part(9.5, 3.2, 6.5, 4.6, 4.2, -1.4, glass, 3, true);
  for (let i = 0; i < 12; i++) part(0.1, 3.2, 0.5, -0.4 + i * 0.82, 4.2, 2.1, wood, 3);
  part(22, 0.4, 11.5, -0.2, 7.4, -0.8, dark, 4);

  /* Interior, visible through the glass */
  const interior = new THREE.Group();
  const iMats: THREE.Material[] = [];
  const im = (o: THREE.MeshStandardMaterialParameters | THREE.MeshBasicMaterialParameters, basic = false) => {
    const m = basic
      ? new THREE.MeshBasicMaterial(o as THREE.MeshBasicMaterialParameters)
      : new THREE.MeshStandardMaterial(o as THREE.MeshStandardMaterialParameters);
    m.transparent = true;
    iMats.push(m);
    return m;
  };
  const ib = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    b.position.set(x, y + h / 2, z);
    b.castShadow = false;
    interior.add(b);
    return b;
  };

  ib(10, 0.06, 7.6, 2.4, 0.42, 0, im({ color: 0x6e4f35, roughness: 0.6 }));
  ib(3.2, 0.75, 1.1, 0.6, 0.45, 0.6, im({ color: 0x2b3338, roughness: 0.9 }));
  ib(3.2, 0.9, 0.3, 0.6, 0.45, -0.05, im({ color: 0x2b3338, roughness: 0.9 }));
  ib(1.3, 0.4, 0.9, 2.2, 0.45, 2.1, im({ color: 0x9b6b43, roughness: 0.6 }));
  ib(5.2, 2.6, 0.3, 3.4, 0.45, -3.7, im({ color: 0x6c4a30, roughness: 0.7, emissive: 0x3a1d0a, emissiveIntensity: 0.5 }));
  ib(4, 0.05, 2.2, 5.2, 0.45, 1.5, im({ color: 0x2d3a3f, roughness: 1 }));
  ib(2.6, 0.5, 2, 6, 4.25, -2, im({ color: 0xcfc7bc, roughness: 0.9 }));

  const lampMat = im({ color: 0xffc98b }, true);
  ([[0.8, 3.1, 0.6], [3.4, 3.1, 0.6], [6, 3.1, 0.6]] as const).forEach((p) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), lampMat);
    s.position.set(p[0], p[1], p[2]);
    interior.add(s);
  });
  ib(8.6, 0.04, 0.14, 2.4, 3.74, -1.2, lampMat);
  ib(8.6, 0.04, 0.14, 2.4, 3.74, 2.2, lampMat);
  ib(6, 0.04, 0.14, 4.4, 7.35, -1.6, lampMat);

  const l1 = new THREE.PointLight(0xffb870, 0, 22, 2);
  l1.position.set(2.6, 2.8, 0.4);
  interior.add(l1);
  const l2 = new THREE.PointLight(0xffb870, 0, 16, 2);
  l2.position.set(4.6, 6.2, -1.4);
  interior.add(l2);

  group.add(interior);

  return {
    group, parts, glass, water, edgeMat, interior, iMats,
    lights: [l1, l2],
    solids: [concrete, dark, wood, water],
  };
}

export function applyBuilding(b: Villa, s: BuildingState): void {
  for (const p of b.parts) {
    const t = ramp(s.form, p.layer * 0.1, p.layer * 0.1 + 0.5);
    p.m.visible = t > 0.002;
    p.m.scale.y = Math.max(t, 0.001);
    p.m.position.y = p.y + s.explode * p.layer * 2.4;
    p.m.castShadow = !p.glass && s.fill > 0.55;
  }
  for (const m of b.solids) {
    m.opacity = s.fill;
    m.depthWrite = s.fill > 0.97;
    m.visible = s.fill > 0.003;
  }
  b.glass.opacity = s.fill * 0.34;
  b.glass.visible = s.fill > 0.003;
  b.glass.depthWrite = false;
  b.glass.emissiveIntensity = s.glow * 0.9;
  b.water.emissiveIntensity = s.glow * 0.7;
  b.edgeMat.opacity = s.edge;

  const iv = ramp(s.fill, 0.3, 0.8) * ramp(s.form, 0.4, 0.9);
  b.interior.visible = iv > 0.01;
  for (const m of b.iMats) m.opacity = iv;
  b.lights[0].intensity = s.glow * 1.5 * iv;
  b.lights[1].intensity = s.glow * 1.1 * iv;
}