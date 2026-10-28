import * as THREE from "three";
import { gsap } from "gsap";
import { createEnvs, mixEnv, newEnv } from "@/lib/three/env";
import { disposeScene } from "@/lib/three/dispose";
import { buildPavilion, buildTower } from "@/lib/three/projects";
import { applyBuilding, buildVilla } from "@/lib/three/villa";
import { createWorld } from "@/lib/three/world";
import { clamp } from "@/utils/math";
import { isNarrow, prefersReducedMotion } from "@/utils/scroll";

export type ViewName = "ext" | "aer" | "ent";

export interface Viewer {
  setModel: (index: number) => void;
  setView: (view: ViewName) => void;
  setNight: (on: boolean) => void;
  dispose: () => void;
}

interface ViewerModel {
  group: THREE.Group;
  R: number;
  ty: number;
  set: (glow: number) => void;
}

const VIEWS: Record<ViewName, { el: number; k: number }> = {
  ext: { el: 14, k: 1 },
  aer: { el: 52, k: 1.18 },
  ent: { el: 6, k: 0.55 },
};

export function createViewer(canvas: HTMLCanvasElement): Viewer | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch {
    return null;
  }
  const reduce = prefersReducedMotion();

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const world = createWorld(renderer, isNarrow() ? 1024 : 2048);
  const sc = world.sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -44;
  sc.right = 44;
  sc.top = 44;
  sc.bottom = -44;
  sc.far = 160;
  sc.updateProjectionMatrix();

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 900);
  const envs = createEnvs();
  const env = newEnv();

  const villa = buildVilla();
  const tower = buildTower();
  const pavilion = buildPavilion();
  const models: ViewerModel[] = [
    {
      group: villa.group,
      R: 31,
      ty: 3.2,
      set: (g) => applyBuilding(villa, { form: 1, fill: 1, edge: 0, explode: 0, glow: g }),
    },
    { group: tower.group, R: 66, ty: 17, set: tower.setGlow },
    { group: pavilion.group, R: 40, ty: 3, set: pavilion.setGlow },
  ];
  models.forEach((m, i) => {
    m.group.visible = i === 0;
    world.scene.add(m.group);
  });

  const st = {
    idx: 0,
    az: 38,
    el: 14,
    rad: models[0].R,
    night: 0,
    view: "ext" as ViewName,
    auto: true,
    lastTouch: 0,
    vis: false,
  };

  function size() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isNarrow() ? 1.5 : 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 52 : 36;
    camera.updateProjectionMatrix();
  }
  size();
  const resizeObserver = new ResizeObserver(size);
  resizeObserver.observe(canvas);
  const visObserver = new IntersectionObserver(
    (entries) => {
      st.vis = entries[0].isIntersecting;
      if (st.vis) size();
    },
    { threshold: 0.01 },
  );
  visObserver.observe(canvas);

  /* drag to rotate */
  let dragging = false;
  let px = 0;
  let py = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    st.auto = false;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    st.az -= (e.clientX - px) * 0.4;
    if (e.pointerType === "mouse") st.el = clamp(st.el + (e.clientY - py) * 0.25, 3, 70);
    px = e.clientX;
    py = e.clientY;
    st.lastTouch = performance.now();
  };
  const onUp = () => {
    dragging = false;
    st.lastTouch = performance.now();
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  let raf = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!st.vis || document.hidden) return;
    if (!st.auto && now - st.lastTouch > 5000 && !dragging && !reduce) st.auto = true;
    if (st.auto && !reduce) st.az += 0.12;

    const m = models[st.idx];
    const ar = (st.az * Math.PI) / 180;
    const er = (st.el * Math.PI) / 180;
    camera.position.set(
      Math.sin(ar) * Math.cos(er) * st.rad,
      m.ty + Math.sin(er) * st.rad,
      Math.cos(ar) * Math.cos(er) * st.rad,
    );
    camera.lookAt(0, m.ty, 0);
    mixEnv(env, envs.day, envs.night, st.night);
    world.apply(env, 1);
    m.set(st.night);
    renderer.render(world.scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return {
    setView(view) {
      st.view = view;
      st.auto = false;
      st.lastTouch = performance.now();
      const m = models[st.idx];
      const t = VIEWS[view];
      const az = view === "ent" ? 0 : view === "ext" ? 38 : st.az;
      if (reduce) {
        st.az = az;
        st.el = t.el;
        st.rad = m.R * t.k;
      } else {
        gsap.to(st, { az, el: t.el, rad: m.R * t.k, duration: 1.1, ease: "power2.inOut" });
      }
    },
    setModel(index) {
      if (index === st.idx) return;
      models[st.idx].group.visible = false;
      st.idx = index;
      const m = models[index];
      m.group.visible = true;
      if (!reduce) {
        gsap.fromTo(
          m.group.scale,
          { x: 0.9, y: 0.9, z: 0.9 },
          { x: 1, y: 1, z: 1, duration: 0.8, ease: "power3.out" },
        );
      }
      const t = VIEWS[st.view];
      st.rad = m.R * t.k;
      st.el = t.el;
    },
    setNight(on) {
      if (reduce) st.night = on ? 1 : 0;
      else gsap.to(st, { night: on ? 1 : 0, duration: 1.2, ease: "power2.inOut" });
    },
    dispose() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visObserver.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      gsap.killTweensOf(st);
      models.forEach((m) => gsap.killTweensOf(m.group.scale));
      disposeScene(world.scene);
      renderer.dispose();
    },
  };
}