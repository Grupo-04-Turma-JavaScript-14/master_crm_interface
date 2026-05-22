import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Intro() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // States for the connection animation
  const [isFlashActive, setIsFlashActive] = useState(false);
  const isNavigatingRef = useRef(false);
  const touchProgressRef = useRef(0);
  const hasTouchedRef = useRef(false);

  const handleAccess = () => {
      // Just trigger the connection animation first
      isNavigatingRef.current = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Load the hands mask image
    const img = new Image();
    img.src = '/hands.png';
    let imgData: ImageData | null = null;

    img.onload = () => {
       const imgCanvas = document.createElement('canvas');
       imgCanvas.width = img.width;
       imgCanvas.height = img.height;
       const imgCtx = imgCanvas.getContext('2d', { willReadFrequently: true });
       if (imgCtx) {
           imgCtx.drawImage(img, 0, 0);
           imgData = imgCtx.getImageData(0, 0, img.width, img.height);
       }
    };

    // Load the logo image
    const imgLogo = new Image();
    imgLogo.src = '/logo.png';
    let imgLogoData: ImageData | null = null;
    
    imgLogo.onload = () => {
       const logoCanvas = document.createElement('canvas');
       logoCanvas.width = imgLogo.width;
       logoCanvas.height = imgLogo.height;
       const logoCtx = logoCanvas.getContext('2d', { willReadFrequently: true });
       if (logoCtx) {
           logoCtx.drawImage(imgLogo, 0, 0);
           imgLogoData = logoCtx.getImageData(0, 0, imgLogo.width, imgLogo.height);
       }
    };
    
    // Fallback if logo.png is not found (generates the dotted 'M' and 'MASTER CRM')
    imgLogo.onerror = () => {
       const fallbackCanvas = document.createElement('canvas');
       fallbackCanvas.width = 800;
       fallbackCanvas.height = 450;
       const fallbackCtx = fallbackCanvas.getContext('2d', { willReadFrequently: true });
       if (fallbackCtx) {
           fallbackCtx.fillStyle = '#000';
           fallbackCtx.fillRect(0, 0, 800, 450);
           
           // Colorful gradient for both M and Text
           const gradient = fallbackCtx.createLinearGradient(100, 50, 700, 400);
           gradient.addColorStop(0, '#a855f7'); // purple
           gradient.addColorStop(0.5, '#ec4899'); // pink
           gradient.addColorStop(1, '#eab308'); // yellow/orange
           
           // Draw M
           fallbackCtx.fillStyle = gradient;
           fallbackCtx.font = '900 240px sans-serif';
           fallbackCtx.textAlign = 'center';
           fallbackCtx.textBaseline = 'middle';
           fallbackCtx.fillText('M', 400, 180);
           
           // Draw MASTER CRM
           fallbackCtx.font = '900 64px sans-serif';
           // @ts-ignore
           fallbackCtx.letterSpacing = '5px';
           fallbackCtx.fillText('MASTER CRM', 400, 360);
           
           imgLogoData = fallbackCtx.getImageData(0, 0, 800, 450);
       }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 5; // even denser
      const cols = Math.floor(canvas.width / spacing) + 2;
      const rows = Math.floor(canvas.height / spacing) + 2;
      
      // Hands dimensions
      const imgTargetWidth = canvas.width * 1.2;
      let scale = 1;
      let imgTargetHeight = canvas.height;
      if (imgData) {
         scale = imgTargetWidth / img.width;
         imgTargetHeight = img.height * scale;
      }
      const offsetX = (canvas.width - imgTargetWidth) / 2;
      const offsetY = (canvas.height - imgTargetHeight) / 2;

      // Logo dimensions
      const logoWidth = Math.min(canvas.width * 0.4, 600); // restored original size
      let logoScale = 1;
      let logoHeight = logoWidth;
      if (imgLogoData) {
          logoScale = logoWidth / imgLogoData.width;
          logoHeight = imgLogoData.height * logoScale;
      }
      const logoOffsetX = (canvas.width - logoWidth) / 2;
      const logoOffsetY = (canvas.height - logoHeight) / 2 - 40; // centered, slightly up

      // Intro Animation: Hands come together over 5 seconds
      const maxTime = 300;
      const progress = Math.min(1, time / maxTime);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Click Animation: Close the final gap slowly
      if (isNavigatingRef.current) {
          touchProgressRef.current += 0.01; // Slower: takes ~1.6s to touch
          if (touchProgressRef.current >= 1 && !hasTouchedRef.current) {
              touchProgressRef.current = 1;
              hasTouchedRef.current = true;
              
              // Exactly when they touch, trigger the flash!
              setIsFlashActive(true);
              
              // Wait for the flash to cover the screen, then navigate
              setTimeout(() => {
                 navigate('/login');
              }, 800);
          }
      }
      const touchEase = Math.pow(touchProgressRef.current, 2); // accelerate touching
      
      // The hands naturally stop with a 40px gap (Creation of Adam style). When clicked, gap goes to 0.
      const baseGap = 40;
      const currentGap = baseGap * (1 - touchEase);
      const slideDistance = (400 * (1 - easeOut)) + currentGap;

      // PASS 1: Draw Hands (Layer 1)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          
          if (!imgData) continue;
          
          const imgX_base = (x - offsetX) / scale;
          const imgY = Math.floor((y - offsetY) / scale);
          
          const isLeftHand = imgX_base < (img.width / 2);
          const imgX = Math.floor(imgX_base);
          
          if (imgX >= 0 && imgX < img.width && imgY >= 0 && imgY < img.height) {
              const index = (imgY * img.width + imgX) * 4;
              const r = imgData.data[index];
              const g = imgData.data[index + 1];
              const b = imgData.data[index + 2];
              const a = imgData.data[index + 3];
              
              const brightness = (r + g + b) / 3;
              if (a > 128 && brightness < 240) {
                  const slideOffset = isLeftHand ? -slideDistance : slideDistance;
                  const drawX = x + slideOffset;
                  const drawY = y;
                  
                  const moveX = Math.sin(drawX * 0.003 + time * 0.02) * 8;
                  const moveY = Math.cos(drawY * 0.003 + time * 0.02) * 8;
                  
                  const fadeAlpha = Math.min(1, time / 60);
                  ctx.globalAlpha = 0.8 * fadeAlpha; 
                  ctx.fillStyle = '#404040';
                  
                  ctx.beginPath();
                  ctx.arc(drawX + moveX, drawY + moveY, 1.5, 0, Math.PI * 2);
                  ctx.fill();
              }
          }
        }
      }

      // PASS 2: Draw Logo (Layer 2)
      if (imgLogoData) {
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              const x = i * spacing;
              const y = j * spacing;
              
              const lx = Math.floor((x - logoOffsetX) / logoScale);
              const ly = Math.floor((y - logoOffsetY) / logoScale);
              if (lx >= 0 && lx < imgLogoData.width && ly >= 0 && ly < imgLogoData.height) {
                  const idx = (ly * imgLogoData.width + lx) * 4;
                  const r = imgLogoData.data[idx];
                  const g = imgLogoData.data[idx + 1];
                  const b = imgLogoData.data[idx + 2];
                  const brightness = (r + g + b) / 3;
                  
                  // Filter bright pixels for the logo
                  if (brightness > 60) {
                      const fadeAlpha = Math.min(1, time / 60);
                      ctx.globalAlpha = 0.9 * fadeAlpha; 
                      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                      
                      ctx.beginPath();
                      ctx.arc(x, y, 2.0, 0, Math.PI * 2); // No wobble for the logo
                      ctx.fill();
                  }
              }
            }
          }
      }
      
      time++;
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Flash Screen Overlay triggered exactly when hands touch */}
      <div 
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-700 ease-in ${isFlashActive ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none" 
      />
      
      {/* Navbar restored */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 z-20 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <svg width="220" height="36" viewBox="0 0 220 36">
            <defs>
              <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <pattern id="dotMaskPattern" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
                <circle cx="1.75" cy="1.75" r="1.4" fill="white" />
              </pattern>
              <mask id="dotsMask">
                <rect width="100%" height="100%" fill="url(#dotMaskPattern)" />
              </mask>
            </defs>
            <text x="0" y="28" fontSize="28" fontWeight="900" letterSpacing="2" fill="url(#textGrad)" mask="url(#dotsMask)">MASTER CRM</text>
          </svg>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-neutral-500">
          <span className="hover:text-black cursor-pointer transition-colors duration-300">Plataforma</span>
          <span className="hover:text-black cursor-pointer transition-colors duration-300">Benefícios</span>
          <span className="hover:text-black cursor-pointer transition-colors duration-300">Recursos</span>
        </div>
        
        <button 
          onClick={handleAccess}
          className="text-sm font-medium text-white bg-black px-8 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          Acessar Agora
        </button>
      </header>
      
      {/* Button floating over canvas */}
      <div className="absolute bottom-20 z-10 animate-fade-in-up">
        <div className="relative group inline-block">
          {/* Subtle Dark Glow Effect */}
          <div className="absolute -inset-1 bg-neutral-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-200"></div>
          
          <button
            onClick={handleAccess}
            className="relative flex items-center gap-3 px-10 py-4 bg-black hover:bg-neutral-800 text-white rounded-full font-medium text-lg hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Acessar o Sistema
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
