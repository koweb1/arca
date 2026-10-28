"use client";

import dynamic from "next/dynamic";

// Three.js is large, so it loads in its own chunk after the page content has rendered.
const SceneCanvas = dynamic(() => import("@/components/scene/SceneCanvas"), { ssr: false });

export default function SceneLoader() {
  return <SceneCanvas />;
}