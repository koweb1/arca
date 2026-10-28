import type { SectionId } from "@/lib/content";
import type { BuildingState } from "@/types/scene";
import { clamp, lerp, ramp, smooth } from "@/utils/math";

export interface CamState {
  a: number;
  h: number;
  r: number;
  tx: number;
  ty: number;
  tz: number;
}

export interface SceneState {
  cam: CamState;
  B: BuildingState;
  wB: number;
  wS: number;
  shift: number;
  mouse: number;
}

export interface SectionBox {
  top: number;
  h: number;
}

export type SectionOffsets = Record<SectionId, SectionBox>;

function lerpObj<T extends object>(a: T, b: T, k: number): T {
  const out = {} as T;
  (Object.keys(a) as Array<keyof T>).forEach((key) => {
    out[key] = lerp(a[key] as number, b[key] as number, k) as T[keyof T];
  });
  return out;
}

function lerpState(a: SceneState, b: SceneState, k: number): SceneState {
  return {
    cam: lerpObj(a.cam, b.cam, k),
    B: lerpObj(a.B, b.B, k),
    wB: lerp(a.wB, b.wB, k),
    wS: lerp(a.wS, b.wS, k),
    shift: lerp(a.shift, b.shift, k),
    mouse: lerp(a.mouse, b.mouse, k),
  };
}

type Keyframe = [number, { a: number; h: number; r: number; ty: number }];

function keyed(p: number, keys: Keyframe[]) {
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
  const [p0, a] = keys[i];
  const [p1, b] = keys[i + 1];
  const t = smooth(clamp((p - p0) / (p1 - p0)));
  return {
    a: lerp(a.a, b.a, t),
    h: lerp(a.h, b.h, t),
    r: lerp(a.r, b.r, t),
    ty: lerp(a.ty, b.ty, t),
  };
}

function stateHero(hp: number): SceneState {
  const p1 = ramp(hp, 0, 0.72);
  const p2 = ramp(hp, 0.72, 1);
  return {
    cam: {
      a: lerp(lerp(38, 6, p1), 0, p2),
      h: lerp(lerp(8, 2.6, p1), 2.1, p2),
      r: lerp(lerp(34, 11, p1), 5, p2),
      tx: lerp(lerp(0, 2.6, p1), 2.6, p2),
      ty: lerp(lerp(3, 1.9, p1), 1.9, p2),
      tz: lerp(lerp(0, 2, p1), -2, p2),
    },
    B: { form: 1, fill: 1, edge: 0, explode: 0, glow: 1 },
    wB: 0,
    wS: 0,
    shift: 0,
    mouse: 1,
  };
}

function stateAbout(ap: number, narrow: boolean): SceneState {
  const fin = ramp(ap, 0.66, 0.95);
  return {
    cam: { a: lerp(-48, 36, ap), h: lerp(10, 6.5, ap), r: lerp(31, 25, ap), tx: 0, ty: 3.6, tz: 0 },
    B: {
      form: 1,
      fill: ramp(ap, 0.34, 0.66) * 0.55 + fin * 0.45,
      edge: lerp(0.95, 0.1, fin),
      explode: ramp(ap, 0.05, 0.3) * 0.65 - ramp(ap, 0.36, 0.62) * 0.65,
      glow: ramp(ap, 0.66, 0.98) * 0.95,
    },
    wB: 1 - fin * 0.9,
    wS: 0,
    shift: narrow ? 0 : 0.2,
    mouse: 1,
  };
}

const PROCESS_KEYS: Keyframe[] = [
  [0, { a: 20, h: 56, r: 14, ty: 0 }],
  [0.22, { a: -30, h: 15, r: 36, ty: 3 }],
  [0.5, { a: 10, h: 10, r: 30, ty: 3.4 }],
  [0.78, { a: 40, h: 5.5, r: 23, ty: 3 }],
  [1, { a: 0, h: 4.5, r: 50, ty: 3.6 }],
];

function stateProcess(pp: number): SceneState {
  const k = keyed(pp, PROCESS_KEYS);
  const vis = ramp(pp, 0.55, 0.78);
  const del = ramp(pp, 0.82, 0.95);
  return {
    cam: { a: k.a, h: k.h, r: k.r, tx: 0, ty: k.ty, tz: 0 },
    B: {
      form: ramp(pp, 0.14, 0.4),
      fill: vis * (1 - 0.65 * del),
      edge: lerp(lerp(0.95, 0.15, vis), 0.9, del),
      explode: ramp(pp, 0.4, 0.5) * 0.8 - ramp(pp, 0.5, 0.6) * 0.8,
      glow: ramp(pp, 0.62, 0.8) * (1 - del),
    },
    wB: clamp(1 - vis * 0.9 + del * 0.9, 0, 1),
    wS: 0,
    shift: 0,
    mouse: 0.5,
  };
}

function stateContact(cp: number, narrow: boolean): SceneState {
  const t = ramp(cp, 0.1, 1);
  return {
    cam: { a: lerp(22, 16, t), h: lerp(3.2, 13, t), r: lerp(17, 56, t), tx: 0, ty: lerp(2.8, 3, t), tz: 0 },
    B: { form: 1, fill: 1, edge: 0, explode: 0, glow: 1 },
    wB: 0,
    wS: ramp(cp, 0, 0.5),
    shift: narrow ? 0 : -0.18 * ramp(cp, 0.3, 1),
    mouse: 1,
  };
}

export function computeScene(y: number, o: SectionOffsets, vh: number, narrow: boolean) {
  const hp = clamp(y / (o.hero.h - vh));
  const aIn = clamp((y + vh - o.about.top) / vh);
  const ap = clamp((y - o.about.top) / (o.about.h - vh));
  const pp = clamp((y - o.process.top) / (o.process.h - vh));
  const cp = clamp((y + vh - o.contact.top) / o.contact.h);

  let vOp = 0;
  let st: SceneState;

  if (y + vh > o.contact.top) {
    st = lerpState(stateProcess(1), stateContact(cp, narrow), ramp(cp, 0, 0.4));
  } else if (y + vh > o.process.top) {
    st = stateProcess(pp);
  } else if (aIn <= 0) {
    st = stateHero(hp);
  } else {
    st = lerpState(stateHero(1), stateAbout(ap, narrow), ramp(aIn, 0, 0.9));
    if (aIn < 0.55) vOp = 0.55 * Math.sin((Math.PI * aIn) / 0.55);
  }

  return { st, vOp, hp };
}