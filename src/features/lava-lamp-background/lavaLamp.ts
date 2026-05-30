import gsap from "gsap";

const COLORS = [
  "#1EA7B6",
  "#2E828B",
  "#00CAE1",
  "#305C61",
  "#35585C",
];

const BLOB_SIZE = 120;

interface BlobState {
  g: SVGGElement;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

function generateBlobPath(radius = BLOB_SIZE): string {
  const numPoints = 8 + Math.floor(Math.random() * 4);
  const irreg = 0.35 + Math.random() * 0.3;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const r = radius * (1 + (Math.random() - 0.5) * irreg);
    pts.push({
      x: radius + Math.cos(angle) * r,
      y: radius + Math.sin(angle) * r,
    });
  }

  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < numPoints; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % numPoints];
    const c = pts[(i + 2) % numPoints];
    const prev = pts[(i - 1 + numPoints) % numPoints];

    const cp1x = a.x + (b.x - prev.x) / 6;
    const cp1y = a.y + (b.y - prev.y) / 6;
    const cp2x = b.x - (c.x - a.x) / 6;
    const cp2y = b.y - (c.y - a.y) / 6;

    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)},${cp2x.toFixed(1)} ${cp2y.toFixed(1)},${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  d += "Z";
  return d;
}

export function createLavaLamp(container: HTMLElement) {
  const NS = "http://www.w3.org/2000/svg";
  let W = window.innerWidth;
  let H = window.innerHeight;

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "absolute inset-0 size-full");
  container.appendChild(svg);

  const defs = document.createElementNS(NS, "defs");
  svg.appendChild(defs);

  const filter = document.createElementNS(NS, "filter");
  filter.id = "ll-effect";

  const blur = document.createElementNS(NS, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", "20");
  blur.setAttribute("result", "softBlob");
  filter.appendChild(blur);

  const turb = document.createElementNS(NS, "feTurbulence");
  turb.setAttribute("type", "fractalNoise");
  turb.setAttribute("baseFrequency", "0.55");
  turb.setAttribute("numOctaves", "3");
  turb.setAttribute("result", "noise");
  filter.appendChild(turb);

  const cm = document.createElementNS(NS, "feColorMatrix");
  cm.setAttribute("type", "matrix");
  cm.setAttribute(
    "values",
    "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0",
  );
  cm.setAttribute("in", "noise");
  cm.setAttribute("result", "softNoise");
  filter.appendChild(cm);

  const blend = document.createElementNS(NS, "feBlend");
  blend.setAttribute("in", "softBlob");
  blend.setAttribute("in2", "softNoise");
  blend.setAttribute("mode", "screen");
  filter.appendChild(blend);

  defs.appendChild(filter);

  const blobs: BlobState[] = [];

  for (let i = 0; i < 5; i++) {
    const pathData = generateBlobPath(BLOB_SIZE);
    const color = COLORS[i];

    const grad = document.createElementNS(NS, "radialGradient");
    const gradId = `ll-grad-${i}`;
    grad.id = gradId;
    grad.setAttribute("cx", "50%");
    grad.setAttribute("cy", "50%");
    grad.setAttribute("r", "50%");

    const s1 = document.createElementNS(NS, "stop");
    s1.setAttribute("offset", "0%");
    s1.setAttribute("stop-color", color);
    s1.setAttribute("stop-opacity", "0.4");
    grad.appendChild(s1);

    const s2 = document.createElementNS(NS, "stop");
    s2.setAttribute("offset", "50%");
    s2.setAttribute("stop-color", color);
    s2.setAttribute("stop-opacity", "0.15");
    grad.appendChild(s2);

    const s3 = document.createElementNS(NS, "stop");
    s3.setAttribute("offset", "100%");
    s3.setAttribute("stop-color", color);
    s3.setAttribute("stop-opacity", "0");
    grad.appendChild(s3);

    defs.appendChild(grad);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("filter", "url(#ll-effect)");

    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", `url(#${gradId})`);
    g.appendChild(path);

    const x = Math.random() * (W + 400) - 200 - BLOB_SIZE;
    const y = Math.random() * (H + 400) - 200 - BLOB_SIZE;
    const s = 0.4 + Math.random() * 1.2;
    const r = Math.random() * 360;

    g.setAttribute("transform", `translate(${x},${y}) scale(${s}) rotate(${r})`);
    svg.appendChild(g);

    blobs.push({ g, x, y, scale: s, rotation: r });
  }

  function animateBlob(blob: BlobState) {
    gsap.to(blob, {
      x: Math.random() * (W + 400) - 200 - BLOB_SIZE,
      y: Math.random() * (H + 400) - 200 - BLOB_SIZE,
      scale: 0.4 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      duration: 8 + Math.random() * 10,
      ease: "sine.inOut",
      onComplete: () => animateBlob(blob),
    });
  }

  for (const blob of blobs) {
    animateBlob(blob);
  }

  const update = () => {
    for (const blob of blobs) {
      blob.g.setAttribute(
        "transform",
        `translate(${blob.x},${blob.y}) scale(${blob.scale}) rotate(${blob.rotation})`,
      );
    }
  };
  gsap.ticker.add(update);

  const onResize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
    gsap.ticker.remove(update);
    for (const blob of blobs) {
      gsap.killTweensOf(blob);
    }
    container.innerHTML = "";
  };
}
