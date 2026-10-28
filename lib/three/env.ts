import * as THREE from "three";
import type { Env, EnvName } from "@/types/scene";

interface EnvRaw {
  top: number;
  bottom: number;
  fog: number;
  sunCol: number;
  sunInt: number;
  hemi: number;
  glow: number;
  grid: number;
  stars: number;
  ground: number;
  sun: [number, number, number];
}

const RAW: Record<EnvName, EnvRaw> = {
  blue: { top: 0x07121d, bottom: 0x35596f, fog: 0x16303e, sunCol: 0x9db8ff, sunInt: 0.6, hemi: 0.6, glow: 1, grid: 0, stars: 0.9, ground: 0x0f171b, sun: [-26, 20, 24] },
  print: { top: 0x060b0e, bottom: 0x0d171d, fog: 0x0a1217, sunCol: 0xbfd6e0, sunInt: 0.55, hemi: 0.75, glow: 0, grid: 0.55, stars: 0, ground: 0x0c1418, sun: [-24, 34, 20] },
  set: { top: 0x1a1d3a, bottom: 0xf08a55, fog: 0x7a4a55, sunCol: 0xffa564, sunInt: 1.6, hemi: 0.5, glow: 0.9, grid: 0, stars: 0.15, ground: 0x161a1d, sun: [40, 7, 22] },
  day: { top: 0x6fa8d0, bottom: 0xe6eef0, fog: 0xcfdde2, sunCol: 0xfff1dc, sunInt: 1.8, hemi: 1.05, glow: 0, grid: 0, stars: 0, ground: 0x8d9b95, sun: [-28, 32, 24] },
  night: { top: 0x03070b, bottom: 0x17293a, fog: 0x0c1822, sunCol: 0x7f9cff, sunInt: 0.4, hemi: 0.45, glow: 1, grid: 0, stars: 1, ground: 0x0e1519, sun: [-26, 20, 24] },
};

function toEnv(r: EnvRaw): Env {
  return {
    top: new THREE.Color(r.top),
    bottom: new THREE.Color(r.bottom),
    fog: new THREE.Color(r.fog),
    sunCol: new THREE.Color(r.sunCol),
    ground: new THREE.Color(r.ground),
    sun: new THREE.Vector3(r.sun[0], r.sun[1], r.sun[2]),
    sunInt: r.sunInt,
    hemi: r.hemi,
    glow: r.glow,
    grid: r.grid,
    stars: r.stars,
  };
}

export function createEnvs(): Record<EnvName, Env> {
  return {
    blue: toEnv(RAW.blue),
    print: toEnv(RAW.print),
    set: toEnv(RAW.set),
    day: toEnv(RAW.day),
    night: toEnv(RAW.night),
  };
}

export const newEnv = (): Env => toEnv(RAW.blue);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mixEnv(out: Env, a: Env, b: Env, t: number): Env {
  out.top.lerpColors(a.top, b.top, t);
  out.bottom.lerpColors(a.bottom, b.bottom, t);
  out.fog.lerpColors(a.fog, b.fog, t);
  out.sunCol.lerpColors(a.sunCol, b.sunCol, t);
  out.ground.lerpColors(a.ground, b.ground, t);
  out.sun.lerpVectors(a.sun, b.sun, t);
  out.sunInt = lerp(a.sunInt, b.sunInt, t);
  out.hemi = lerp(a.hemi, b.hemi, t);
  out.glow = lerp(a.glow, b.glow, t);
  out.grid = lerp(a.grid, b.grid, t);
  out.stars = lerp(a.stars, b.stars, t);
  return out;
}