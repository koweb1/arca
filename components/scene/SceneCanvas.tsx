"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SECTIONS } from "@/lib/content";
import { disposeScene } from "@/lib/three/dispose";
import { createEnvs, mixEnv, newEnv } from "@/lib/three/env";
import { computeScene, type SectionOffsets } from "@/lib/three/scrollStates";
import { applyBuilding, buildVilla } from "@/lib/three/villa";
import { createWorld } from "@/lib/three/world";
import { clamp } from "@/utils/math";
import { prefersReducedMotion } from "@/utils/scroll";

/** One fixed WebGL scene behind the page. The camera, light and building follow the scroll position. */
export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const veil = veilRef.current;
    if (!canvas || !veil) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.style.display = "none";
      document.body.dataset.noGl = "true";
      return () => {
        delete document.body.dataset.noGl;
      };
    }

    const reduce = prefersReducedMotion();
    const narrow = () => window.innerWidth < 900;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const world = createWorld(renderer, narrow() ? 1024 : 2048);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 900);
    const villa = buildVilla();
    world.scene.add(villa.group);

    const envs = createEnvs();
    const envOut = newEnv();
    const envTmp = newEnv();

    let offs = {} as SectionOffsets;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    function measure() {
      const next = {} as SectionOffsets;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next[s.id] = { top: r.top + window.scrollY, h: r.height };
      }
      offs = next;
      vw = window.innerWidth;
      vh = window.innerHeight;
    }

    function resize() {
      measure();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow() ? 1.5 : 1.75));
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.fov = vw < vh ? 62 : 40;
      camera.updateProjectionMatrix();
    }
    resize();

    let smoothY = window.scrollY;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    const t0 = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !offs.contact) return;

      const y = window.scrollY;
      smoothY += (y - smoothY) * (reduce ? 1 : 0.12);
      if (Math.abs(y - smoothY) < 0.2) smoothY = y;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      const c = computeScene(smoothY, offs, vh, narrow());
      const raw = computeScene(y, offs, vh, narrow());

      veil.style.opacity = String(c.vOp);
      const show = y < offs.work.top || y + vh > offs.process.top;
      if (!show) return;

      const st = c.st;
      const cam = st.cam;
      const t = (now - t0) / 1000;

      let a = cam.a + mx * 7 * st.mouse;
      if (!reduce && raw.hp < 0.9) a += Math.sin(t * 0.14) * 7 * (1 - raw.hp);
      const h = cam.h - my * 1.3 * st.mouse;
      const ar = (a * Math.PI) / 180;
      camera.position.set(cam.tx + Math.sin(ar) * cam.r, h, cam.tz + Math.cos(ar) * cam.r);
      camera.lookAt(cam.tx, cam.ty, cam.tz);
      if (!narrow() && st.shift) camera.setViewOffset(vw, vh, -st.shift * vw, 0, vw, vh);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();

      mixEnv(envTmp, envs.blue, envs.print, clamp(st.wB));
      mixEnv(envOut, envTmp, envs.set, clamp(st.wS));
      world.apply(envOut, st.B.fill);
      applyBuilding(villa, {
        form: st.B.form,
        fill: st.B.fill,
        edge: st.B.edge,
        explode: st.B.explode,
        glow: st.B.glow * Math.max(0.35, envOut.glow),
      });
      renderer.render(world.scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("load", measure);
      resizeObserver.disconnect();
      disposeScene(world.scene);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 block h-full w-full bg-ink"
      />
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[#05090b] opacity-0"
      />
    </>
  );
}