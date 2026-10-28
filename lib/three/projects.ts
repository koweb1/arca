import * as THREE from "three";
import type { GlowModel } from "@/types/scene";

export function buildTower(): GlowModel {
  const group = new THREE.Group();
  const concrete = new THREE.MeshStandardMaterial({ color: 0xb8bcbb, roughness: 0.85 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d2327, roughness: 0.5, metalness: 0.3 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x9fc8d6, roughness: 0.05, metalness: 0.55,
    transparent: true, opacity: 0.42, emissive: 0xffb15e, emissiveIntensity: 0,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 24), concrete);
  base.position.y = 0.25;
  base.receiveShadow = true;
  group.add(base);

  const core = new THREE.Mesh(new THREE.BoxGeometry(3.4, 36.8, 3.4), dark);
  core.position.y = 18.4 + 0.5;
  core.castShadow = true;
  group.add(core);

  const floors = 10;
  for (let i = 0; i < floors; i++) {
    const f = new THREE.Group();
    f.rotation.y = i * 0.075;
    f.position.y = 0.5 + i * 3.6;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(11, 0.45, 11), concrete);
    slab.castShadow = true;
    slab.receiveShadow = true;
    f.add(slab);

    const gl = new THREE.Mesh(new THREE.BoxGeometry(10.2, 3.0, 10.2), glass);
    gl.position.y = 1.95;
    f.add(gl);

    const fin = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.2, 11.2), dark);
    fin.position.y = 0.35;
    f.add(fin);

    group.add(f);
  }

  const roof = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 12), dark);
  roof.position.set(0, 0.5 + floors * 3.6 + 0.1, 0);
  roof.rotation.y = floors * 0.075;
  roof.castShadow = true;
  group.add(roof);

  const lamp = new THREE.PointLight(0xffb870, 0, 60, 2);
  lamp.position.set(0, 18, 0);
  group.add(lamp);

  return {
    group,
    setGlow(g: number) {
      glass.emissiveIntensity = g * 0.9;
      lamp.intensity = g * 3;
    },
  };
}

export function buildPavilion(): GlowModel {
  const group = new THREE.Group();
  const concrete = new THREE.MeshStandardMaterial({ color: 0xb8bcbb, roughness: 0.85 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d2327, roughness: 0.5, metalness: 0.3 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x9b6b43, roughness: 0.7 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x9fc8d6, roughness: 0.05, metalness: 0.5,
    transparent: true, opacity: 0.34, side: THREE.DoubleSide,
    emissive: 0xffb15e, emissiveIntensity: 0,
  });
  const water = new THREE.MeshStandardMaterial({
    color: 0x2b7e92, roughness: 0.08, metalness: 0.5, emissive: 0x1a5a6a, emissiveIntensity: 0,
  });

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.4, 64), concrete);
  platform.position.y = 0.2;
  platform.receiveShadow = true;
  group.add(platform);

  const pool = new THREE.Mesh(new THREE.TorusGeometry(10.4, 0.9, 6, 64), water);
  pool.rotation.x = Math.PI / 2;
  pool.position.y = 0.38;
  pool.scale.z = 0.18;
  group.add(pool);

  const wall = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 5, 64, 1, true), glass);
  wall.position.y = 2.9;
  group.add(wall);

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 5.6, 10), wood);
    c.position.set(Math.cos(a) * 8.6, 3.2, Math.sin(a) * 8.6);
    c.castShadow = true;
    group.add(c);
  }

  const roof = new THREE.Mesh(new THREE.CylinderGeometry(12.4, 12.4, 0.45, 64), dark);
  roof.position.y = 6.2;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  const skylight = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.5, 48), glass);
  skylight.position.y = 6.25;
  group.add(skylight);

  const pod = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 3.4, 40), concrete);
  pod.position.y = 2.1;
  pod.castShadow = true;
  group.add(pod);

  const seat = new THREE.Mesh(new THREE.TorusGeometry(5, 0.45, 8, 48), wood);
  seat.rotation.x = Math.PI / 2;
  seat.position.y = 0.9;
  group.add(seat);

  const lamp = new THREE.PointLight(0xffb870, 0, 30, 2);
  lamp.position.set(0, 3.6, 0);
  group.add(lamp);

  return {
    group,
    setGlow(g: number) {
      glass.emissiveIntensity = g * 0.9;
      water.emissiveIntensity = g * 0.8;
      lamp.intensity = g * 2.2;
    },
  };
}