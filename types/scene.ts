import type * as THREE from "three";

export type EnvName = "blue" | "print" | "set" | "day" | "night";

export interface Env {
  top: THREE.Color;
  bottom: THREE.Color;
  fog: THREE.Color;
  sunCol: THREE.Color;
  ground: THREE.Color;
  sun: THREE.Vector3;
  sunInt: number;
  hemi: number;
  glow: number;
  grid: number;
  stars: number;
}

export interface BuildingState {
  form: number;
  fill: number;
  edge: number;
  explode: number;
  glow: number;
}

export interface World {
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  apply: (env: Env, fill?: number) => void;
}

export interface GlowModel {
  group: THREE.Group;
  setGlow: (g: number) => void;
}