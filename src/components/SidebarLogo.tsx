import { useEffect, useRef } from 'react';

interface SidebarLogoProps {
  isDarkMode: boolean;
  bgIndex: number;
}

class Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  ease: number;
  color: string;
  isDarkMode: boolean;

  constructor(x: number, y: number, isDarkMode: boolean) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.size = Math.random() * 0.6 + 0.6; // dots size between 0.6px and 1.2px
    this.ease = Math.random() * 0.06 + 0.03;
    this.isDarkMode = isDarkMode;
    this.color = '';
    this.updateColor();
  }

  updateColor() {
    const shadesDark = ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];
    const shadesLight = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];
    const shades = this.isDarkMode ? shadesDark : shadesLight;
    this.color = shades[Math.floor(Math.random() * shades.length)];
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    // Subtle jitter / stippling vibration
    const jitterX = (Math.random() - 0.5) * 0.4;
    const jitterY = (Math.random() - 0.5) * 0.4;

    this.x += dx * this.ease + jitterX;
    this.y += dy * this.ease + jitterY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SidebarLogo({ isDarkMode, bgIndex }: SidebarLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const onlyMPointsRef = useRef<{ x: number; y: number }[]>([]);
  const mMasterPointsRef = useRef<{ x: number; y: number }[]>([]);
  const isLoadedRef = useRef(false);

  // Update colors when theme changes
  useEffect(() => {
    particlesRef.current.forEach((p) => {
      p.isDarkMode = isDarkMode;
      p.updateColor();
    });
  }, [isDarkMode]);

  // Handle transition when bgIndex changes
  useEffect(() => {
    if (!isLoadedRef.current) return;

    // Alternate states based on bgIndex
    // bgIndex 0, 2: Only M
    // bgIndex 1: M + MASTER CRM
    const state = bgIndex % 2 === 0 ? 0 : 1;
    const points = state === 0 ? onlyMPointsRef.current : mMasterPointsRef.current;

    if (points.length > 0) {
      particlesRef.current.forEach((p, i) => {
        const target = points[i % points.length];
        const offsetRadius = Math.random() * 1.2;
        const offsetAngle = Math.random() * Math.PI * 2;

        p.targetX = target.x + Math.cos(offsetAngle) * offsetRadius;
        p.targetY = target.y + Math.sin(offsetAngle) * offsetRadius;
        p.ease = Math.random() * 0.07 + 0.04; // Reset speed for fluid transition
      });
    }
  }, [bgIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const targetWidth = 180;
    const targetHeight = 40;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;

    const img = new Image();
    img.src = '/logo_icon.svg';

    img.onload = () => {
      // 1. Generate Only M points (Centered)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      const mWidth = 44;
      const mHeight = 40;
      const mx = (targetWidth - mWidth) / 2;
      const my = (targetHeight - mHeight) / 2;
      tempCtx.drawImage(img, mx, my, mWidth, mHeight);

      let imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data;
      const onlyM: { x: number; y: number }[] = [];
      const step = 2;

      for (let y = 0; y < targetHeight; y += step) {
        for (let x = 0; x < targetWidth; x += step) {
          const idx = (y * targetWidth + x) * 4;
          if (imgData[idx + 3] > 80) {
            onlyM.push({ x, y });
          }
        }
      }
      onlyMPointsRef.current = onlyM;

      // 2. Generate M + MASTER CRM points (Expanded side-by-side)
      tempCtx.clearRect(0, 0, targetWidth, targetHeight);
      
      // Draw M on the left
      const leftMWidth = 33;
      const leftMHeight = 30;
      const leftMx = 10;
      const leftMy = (targetHeight - leftMHeight) / 2;
      tempCtx.drawImage(img, leftMx, leftMy, leftMWidth, leftMHeight);

      // Draw text "ASTER CRM" on the right (so the stylized M logo acts as the M of MASTER)
      tempCtx.fillStyle = 'black';
      tempCtx.font = '900 14px "Inter", sans-serif';
      tempCtx.textAlign = 'left';
      tempCtx.textBaseline = 'middle';
      
      // @ts-ignore
      if (tempCtx.letterSpacing !== undefined) {
        // @ts-ignore
        tempCtx.letterSpacing = '2.5px';
      }
      tempCtx.fillText('ASTER CRM', 45, targetHeight / 2 + 1);

      imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight).data;
      const mMaster: { x: number; y: number }[] = [];

      for (let y = 0; y < targetHeight; y += step) {
        for (let x = 0; x < targetWidth; x += step) {
          const idx = (y * targetWidth + x) * 4;
          if (imgData[idx + 3] > 80) {
            mMaster.push({ x, y });
          }
        }
      }
      mMasterPointsRef.current = mMaster;

      // Initialize particles at "Only M" positions (Centered)
      const particleCount = 700;
      const initialPoints = onlyM;
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const point = initialPoints[i % initialPoints.length];
        const p = new Particle(point.x, point.y, isDarkMode);
        
        const offsetRadius = Math.random() * 1.2;
        const offsetAngle = Math.random() * Math.PI * 2;
        p.targetX = point.x + Math.cos(offsetAngle) * offsetRadius;
        p.targetY = point.y + Math.sin(offsetAngle) * offsetRadius;
        
        newParticles.push(p);
      }

      particlesRef.current = newParticles;
      isLoadedRef.current = true;
    };

    const render = () => {
      ctx.clearRect(0, 0, targetWidth, targetHeight);

      if (isLoadedRef.current) {
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
      style={{ width: '180px', height: '40px' }}
      className="block cursor-pointer transition-transform duration-300 hover:scale-105 relative z-10"
    />
  );
}
