import gsap from "gsap";

interface Bit {
  x: number;
  y: number;
  char: string;
  baseOpacity: number;
  opacity: number;
  targetOpacity: number;
  twinkleSpeed: number;
  size: number;
}

export function createBinaryStars(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let bits: Bit[] = [];
  const bitColor = "#1EA7B6"; // matching text-mesh-1
  const fontSize = 8;
  const density = 0.0008; // Increased from 0.0005 to compensate for smaller font and scaling

  const init = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const numBits = Math.floor(canvas.width * canvas.height * density);
    bits = [];

    for (let i = 0; i < numBits; i++) {
      bits.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: Math.random() > 0.5 ? "0" : "1",
        baseOpacity: 0.05 + Math.random() * 0.1, // Increased from 0.02-0.07
        opacity: 0,
        targetOpacity: 0,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        size: fontSize * (0.8 + Math.random() * 0.4),
      });
      bits[i].opacity = bits[i].baseOpacity;
      bits[i].targetOpacity = bits[i].baseOpacity;
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    bits.forEach((bit) => {
      // Randomly trigger twinkle
      if (Math.random() < 0.001) {
        bit.targetOpacity = 0.4 + Math.random() * 0.4; // Increased from 0.2-0.5
      } else if (Math.abs(bit.opacity - bit.targetOpacity) < 0.01) {
        bit.targetOpacity = bit.baseOpacity;
      }

      // Smooth opacity transition
      bit.opacity += (bit.targetOpacity - bit.opacity) * bit.twinkleSpeed;

      ctx.fillStyle = bitColor;
      ctx.globalAlpha = bit.opacity;
      ctx.font = `${bit.size}px monospace`;
      ctx.fillText(bit.char, bit.x, bit.y);
    });

    ctx.globalAlpha = 1.0;
  };

  const animate = () => {
    draw();
  };

  gsap.ticker.add(animate);
  init();

  const handleResize = () => {
    init();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    gsap.ticker.remove(animate);
    window.removeEventListener("resize", handleResize);
  };
}
