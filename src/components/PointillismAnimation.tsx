import { useEffect, useRef, useState } from 'react';

const WORDS = ['MASTER', 'CRM', 'INNOVA', 'GROW', 'FLOW'];
const PARTICLE_COUNT = 4000;
const BACKGROUNDS = ['/bg1.png', '/bg2.png', '/bg3.png'];

class Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  ease: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.size = Math.random() * 1.5 + 0.8; // dots size
    this.ease = Math.random() * 0.08 + 0.02;
    // Vary colors slightly to give a more textured pointillism effect
    const shades = ['#0f172a', '#1e293b', '#334155', '#475569'];
    this.color = shades[Math.floor(Math.random() * shades.length)];
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    
    // Add jitter to make it look like hand-drawn stippling
    const jitterX = (Math.random() - 0.5) * 1.5;
    const jitterY = (Math.random() - 0.5) * 1.5;

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

export default function PointillismAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let currentWordIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    // Initialize particles around the center
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle(width / 2 + (Math.random() - 0.5) * 100, height / 2 + (Math.random() - 0.5) * 100));
    }

    const getTextPoints = (text: string) => {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return [];

      offCtx.fillStyle = 'white';
      offCtx.fillRect(0, 0, width, height);

      offCtx.fillStyle = 'black';
      // Adjust font size based on screen width, max 180px
      const fontSize = Math.min(width * 0.15, 180);
      offCtx.font = `900 ${fontSize}px "Inter", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      
      // Draw text with a slight shadow to make the edges denser
      offCtx.shadowColor = 'black';
      offCtx.shadowBlur = 10;
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      const points = [];

      // Sample pixels, lowering density gives a more pointillism look
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const idx = (y * width + x) * 4;
          // If pixel is dark enough
          if (imageData[idx] < 150) {
            points.push({ x, y });
          }
        }
      }
      return points;
    };

    const scatterParticles = () => {
      particles.forEach((p) => {
        // Scatter them randomly within the screen bounds
        p.targetX = Math.random() * width;
        p.targetY = Math.random() * height;
        // Increase ease slightly to make scattering faster
        p.ease = Math.random() * 0.1 + 0.05;
      });

      timeoutId = setTimeout(() => {
        updateTargets();
      }, 1000); // 1 second of scattering before forming next word
    };

    const updateTargets = () => {
      const text = WORDS[currentWordIndex];
      const points = getTextPoints(text);

      if (points.length > 0) {
        particles.forEach((p, i) => {
          // Wrap around if fewer points than particles
          const target = points[i % points.length];
          // Spread points slightly around the text for stippling effect
          const spreadRadius = Math.random() * 15;
          const spreadAngle = Math.random() * Math.PI * 2;
          p.targetX = target.x + Math.cos(spreadAngle) * spreadRadius;
          p.targetY = target.y + Math.sin(spreadAngle) * spreadRadius;
          // Reset ease
          p.ease = Math.random() * 0.06 + 0.02;
        });
      }

      currentWordIndex = (currentWordIndex + 1) % WORDS.length;
      timeoutId = setTimeout(scatterParticles, 4000); // Show word for 4s, then scatter
    };

    const render = () => {
      // Clear canvas so the background images can show through
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      clearTimeout(timeoutId);
      currentWordIndex = (currentWordIndex === 0 ? WORDS.length - 1 : currentWordIndex - 1);
      updateTargets();
    };

    window.addEventListener('resize', handleResize);

    // Initial setup
    updateTargets();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-50">
      {BACKGROUNDS.map((bg, index) => (
        <div
          key={bg}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === bgIndex ? 'opacity-30' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${bg}')` }}
        />
      ))}
      <canvas
        ref={canvasRef}
        className="w-full h-full block relative z-10"
      />
    </div>
  );
}
