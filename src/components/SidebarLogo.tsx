import { useEffect, useRef } from 'react';

interface SidebarLogoProps {
  isDarkMode: boolean;
}

class Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  color: string;

  constructor(x: number, y: number, isDarkMode: boolean) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    // slightly varied size for stippling texture
    this.size = Math.random() * 0.7 + 0.6; // dots size between 0.6px and 1.3px

    // Textured shades
    const shadesDark = ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];
    const shadesLight = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];
    const shades = isDarkMode ? shadesDark : shadesLight;
    this.color = shades[Math.floor(Math.random() * shades.length)];
  }

  update() {
    // Subtle jitter / floating stippling movement
    const jitterX = (Math.random() - 0.5) * 0.5;
    const jitterY = (Math.random() - 0.5) * 0.5;

    const dx = this.baseX - this.x;
    const dy = this.baseY - this.y;
    // Ease back to base coordinates slightly, combined with jitter
    this.x += dx * 0.08 + jitterX;
    this.y += dy * 0.08 + jitterY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SidebarLogo({ isDarkMode }: SidebarLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Update particle colors when theme changes
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      particlesRef.current.forEach((p) => {
        const shadesDark = ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];
        const shadesLight = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];
        const shades = isDarkMode ? shadesDark : shadesLight;
        p.color = shades[Math.floor(Math.random() * shades.length)];
      });
    }
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const targetWidth = 44;
    const targetHeight = 40;

    // Retina support scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let isLoaded = false;

    const img = new Image();
    img.src = '/logo_icon.svg';

    img.onload = () => {
      // Draw image onto an offscreen canvas to scan pixel data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data;

      const newParticles: Particle[] = [];
      const step = 2; // sample every 2nd pixel

      for (let y = 0; y < targetHeight; y += step) {
        for (let x = 0; x < targetWidth; x += step) {
          const idx = (y * targetWidth + x) * 4;
          const alpha = imgData[idx + 3];
          if (alpha > 80) {
            newParticles.push(new Particle(x, y, isDarkMode));
          }
        }
      }

      particlesRef.current = newParticles;
      isLoaded = true;
    };

    const render = () => {
      ctx.clearRect(0, 0, targetWidth, targetHeight);

      if (isLoaded) {
        particlesRef.current.forEach((p) => {
          p.update();
          p.draw(ctx);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '44px', height: '40px' }}
      className="block cursor-pointer transition-transform duration-300 hover:scale-110 relative z-10"
    />
  );
}
