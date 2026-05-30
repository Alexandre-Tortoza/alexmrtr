import gsap from "gsap";

const COLORS = ["#1EA7B6", "#FFFFFF", "#B489D1"];

interface Particle {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  color: string;
}

export function createStardust(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let W = window.innerWidth;
  let H = window.innerHeight;
  let particles: Particle[] = [];
  const numParticles = 600;
  const speed = 0.6;
  const fov = 120; // Field of view

  const spawnParticle = (p?: Particle, randomZ = false): Particle => {
    const particle = p || ({} as Particle);
    particle.x = (Math.random() - 0.5) * 2000;
    particle.y = (Math.random() - 0.5) * 2000;
    particle.z = randomZ ? Math.random() * 2000 : 2000;
    particle.prevZ = particle.z;
    particle.size = 1 + Math.random() * 2;
    particle.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return particle;
  };

  const init = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(spawnParticle(undefined, true));
    }
  };

  const draw = () => {
    ctx.fillStyle = "rgba(10, 10, 10, 0.4)"; // Slight tail effect
    ctx.fillRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.prevZ = p.z;
      p.z -= speed;

      if (p.z <= 1) {
        spawnParticle(p);
        continue;
      }

      // Projection from 3D to 2D
      const scale = fov / p.z;
      const x2d = centerX + p.x * scale;
      const y2d = centerY + p.y * scale;

      const prevScale = fov / p.prevZ;
      const px2d = centerX + p.x * prevScale;
      const py2d = centerY + p.y * prevScale;

      // Only draw if within bounds
      if (x2d < 0 || x2d > W || y2d < 0 || y2d > H) {
        // Optional: respawn if out of bounds to keep tunnel density
        // spawnParticle(p); 
        // continue;
      }

      const alpha = Math.min(1, (2000 - p.z) / 1000);

      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = alpha * 0.8;
      ctx.lineWidth = p.size * scale * 0.5;
      ctx.lineCap = "round";
      ctx.moveTo(x2d, y2d);
      ctx.lineTo(px2d, py2d);
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
  };

  gsap.ticker.add(draw);
  init();

  const handleResize = () => {
    init();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    gsap.ticker.remove(draw);
    window.removeEventListener("resize", handleResize);
  };
}
