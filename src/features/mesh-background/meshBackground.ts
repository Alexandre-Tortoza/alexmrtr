import * as THREE from "three";
import gsap from "gsap";

const COLORS = [
  "#1EA7B6", "#2E828B", "#00CAE1", "#305C61", "#243536", "#2B3233",
];

const COVERAGE_MARGIN = 2.5;

export interface MeshBackgroundConfig {
  gridCols?: number
  gridRows?: number
  spacing?: number
  waveSpeed?: number
  waveAmplitude?: number
  mouseRadius?: number
  mouseStrength?: number
}

function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

function computeGridSize(
  camera: THREE.PerspectiveCamera,
  spacing: number,
  gridCols?: number,
  gridRows?: number,
) {
  if (gridCols && gridRows) {
    return { cols: gridCols, rows: gridRows };
  }

  const vFov = camera.fov * Math.PI / 180;
  const visibleHeight = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z);
  const visibleWidth = visibleHeight * camera.aspect;

  return {
    cols: Math.ceil((visibleWidth * COVERAGE_MARGIN) / spacing),
    rows: Math.ceil((visibleHeight * COVERAGE_MARGIN) / spacing),
  };
}

function createGrid(
  cols: number,
  rows: number,
  spacing: number,
  palette: THREE.Color[],
  circleTexture: THREE.CanvasTexture,
) {
  const totalPoints = cols * rows;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(totalPoints * 3);
  const basePositions = new Float32Array(totalPoints * 3);
  const colors = new Float32Array(totalPoints * 3);
  const sizes = new Float32Array(totalPoints);
  const baseSizes = new Float32Array(totalPoints);

  const gridWidth = (cols - 1) * spacing;
  const gridHeight = (rows - 1) * spacing;

  for (let i = 0; i < totalPoints; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const i3 = i * 3;

    const x = col * spacing - gridWidth / 2;
    const y = row * spacing - gridHeight / 2;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = 0;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = 0;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    const size = 0.5 + Math.random() * 1.5;
    sizes[i] = size;
    baseSizes[i] = size;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.3,
    map: circleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);

  return { geometry, material, particles, basePositions, baseSizes, colors, totalPoints };
}

export function createMeshBackground(
  canvas: HTMLCanvasElement,
  config: MeshBackgroundConfig = {},
) {
  const {
    gridCols: userCols,
    gridRows: userRows,
    spacing = 1.2,
    waveSpeed = 0.8,
    waveAmplitude = 1.5,
    mouseRadius = 12,
    mouseStrength = 3,
  } = config;

  const palette = COLORS.map((c) => new THREE.Color(c));
  const circleTexture = createCircleTexture();

  const scene = new THREE.Scene();

  const rect = canvas.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(
    60, rect.width / rect.height, 0.1, 1000,
  );
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(rect.width, rect.height);

  const { cols, rows } = computeGridSize(camera, spacing, userCols, userRows);

  let grid = createGrid(cols, rows, spacing, palette, circleTexture);
  scene.add(grid.particles);

  const mouseTarget = { x: 0, y: 0 };
  const mouseCurrent = { x: 0, y: 0 };
  const mouse3D = new THREE.Vector3();

  const onMouseMove = (e: MouseEvent) => {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  window.addEventListener("mousemove", onMouseMove);

  const smoothMouse = () => {
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.04;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.04;

    const vector = new THREE.Vector3(mouseCurrent.x, mouseCurrent.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    mouse3D.copy(camera.position).add(dir.multiplyScalar(distance));
  };

  gsap.ticker.add(smoothMouse);

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();
    const posAttr = grid.geometry.attributes.position;
    const sizeAttr = grid.geometry.attributes.size;
    const colorAttr = grid.geometry.attributes.color;

    const posArray = posAttr.array as Float32Array;
    const sizeArray = sizeAttr.array as Float32Array;

    for (let i = 0; i < grid.totalPoints; i++) {
      const i3 = i * 3;
      const bx = grid.basePositions[i3];
      const by = grid.basePositions[i3 + 1];

      const wave =
        Math.sin(bx * 0.25 + elapsed * waveSpeed) *
        Math.cos(by * 0.2 + elapsed * waveSpeed * 0.7) *
        waveAmplitude;

      let zOffset = wave;
      let sizeBoost = 0;
      let brightnessBoost = 0;

      const dx = bx - mouse3D.x;
      const dy = by - mouse3D.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius) {
        const strength = 1 - dist / mouseRadius;

        posArray[i3] = bx - dx * strength * 0.25;
        posArray[i3 + 1] = by - dy * strength * 0.25;

        zOffset += strength * mouseStrength;
        brightnessBoost = strength * 0.4;
        sizeBoost = strength * 2;
      } else {
        posArray[i3] = bx;
        posArray[i3 + 1] = by;
      }

      posArray[i3 + 2] = zOffset;

      sizeArray[i] = (grid.baseSizes[i] + sizeBoost) * 0.06;

      if (brightnessBoost > 0) {
        colorAttr.array[i3] = Math.min(1, grid.colors[i3] + brightnessBoost);
        colorAttr.array[i3 + 1] = Math.min(1, grid.colors[i3 + 1] + brightnessBoost);
        colorAttr.array[i3 + 2] = Math.min(1, grid.colors[i3 + 2] + brightnessBoost);
      } else {
        colorAttr.array[i3] = grid.colors[i3];
        colorAttr.array[i3 + 1] = grid.colors[i3 + 1];
        colorAttr.array[i3 + 2] = grid.colors[i3 + 2];
      }
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    camera.position.x = mouseCurrent.x * 2;
    camera.position.y = mouseCurrent.y * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    const { cols: newCols, rows: newRows } = computeGridSize(camera, spacing, userCols, userRows);
    const needsRebuild = newCols > cols || newRows > rows;

    if (needsRebuild) {
      scene.remove(grid.particles);
      grid.geometry.dispose();
      grid.material.dispose();

      grid = createGrid(newCols, newRows, spacing, palette, circleTexture);
      scene.add(grid.particles);
    }
  };

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    gsap.ticker.remove(smoothMouse);
    renderer.dispose();
    grid.geometry.dispose();
    grid.material.dispose();
  };
}
