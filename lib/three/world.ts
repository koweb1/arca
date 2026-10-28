import * as THREE from "three";
import type { Env, World } from "@/types/scene";

/** Sky dome, stars, lights, ground, grid and trees. Shared by the page scene and the project viewer. */
export function createWorld(renderer: THREE.WebGLRenderer, shadowSize: number): World {
  const scene = new THREE.Scene();
  const fog = new THREE.Fog(0x16303e, 60, 190);
  scene.fog = fog;

  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color() },
      bottom: { value: new THREE.Color() },
    },
    vertexShader:
      "varying float vH;void main(){vH=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader:
      "uniform vec3 top;uniform vec3 bottom;varying float vH;void main(){float h=clamp(vH,0.0,1.0);gl_FragColor=vec4(mix(bottom,top,pow(h,0.55)),1.0);}",
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(320, 32, 16), skyMat);
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  scene.add(sky);

  const starPositions: number[] = [];
  for (let i = 0; i < 520; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(Math.random() * 0.92 + 0.08);
    starPositions.push(
      Math.sin(v) * Math.cos(u) * 300,
      Math.cos(v) * 300,
      Math.sin(v) * Math.sin(u) * 300,
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xdfeeff,
    size: 1.7,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
    fog: false,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  const hemi = new THREE.HemisphereLight(0xbcd8ff, 0x101820, 0.6);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  const sc = sun.shadow.camera;
  sc.left = -36;
  sc.right = 36;
  sc.top = 36;
  sc.bottom = -36;
  sc.near = 1;
  sc.far = 140;
  sc.updateProjectionMatrix();
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.06;
  scene.add(sun);
  scene.add(sun.target);

  const groundMat = new THREE.MeshStandardMaterial({ color: 0x121b1f, roughness: 1, metalness: 0 });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(170, 64), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(120, 60, 0x3a6a7a, 0x1f3944);
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  gridMat.opacity = 0;
  grid.position.y = 0.02;
  scene.add(grid);

  const treeMat = new THREE.MeshStandardMaterial({
    color: 0x35564a,
    roughness: 0.95,
    flatShading: true,
    transparent: true,
  });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b2f26, roughness: 1, transparent: true });
  const spots: Array<[number, number]> = [
    [-15, 6], [-13, -9], [14, -10], [17, 3], [-18, -2], [11, -14], [-6, -15], [20, -5],
    [-21, 10], [9, 16], [-10, 14], [23, 11], [-25, -9], [0, -19], [27, -12], [-30, 2],
  ];
  spots.forEach((p, i) => {
    const s = 0.8 + ((i * 37) % 10) / 16;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.26 * s, 2.2 * s, 6), trunkMat);
    trunk.position.set(p[0], 1.1 * s, p[1]);
    trunk.castShadow = true;
    scene.add(trunk);
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9 * s, 0), treeMat);
    crown.position.set(p[0], 3.5 * s, p[1]);
    crown.scale.y = 1.3;
    crown.castShadow = true;
    crown.receiveShadow = true;
    scene.add(crown);
  });

  return {
    scene,
    sun,
    apply(env: Env, fill = 1) {
      (skyMat.uniforms.top.value as THREE.Color).copy(env.top);
      (skyMat.uniforms.bottom.value as THREE.Color).copy(env.bottom);
      fog.color.copy(env.fog);
      hemi.intensity = env.hemi;
      sun.color.copy(env.sunCol);
      sun.intensity = env.sunInt;
      sun.position.copy(env.sun);
      groundMat.color.copy(env.ground);
      gridMat.opacity = env.grid;
      starMat.opacity = env.stars;
      treeMat.opacity = fill;
      trunkMat.opacity = fill;
      const visible = fill > 0.003;
      treeMat.visible = visible;
      trunkMat.visible = visible;
      renderer.setClearColor(env.bottom);
    },
  };
}