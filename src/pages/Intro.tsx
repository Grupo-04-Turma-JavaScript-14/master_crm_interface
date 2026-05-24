import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react'; // 🌟 ArrowRight foi removido, dava erro de "never read"
import { useEffect, useRef, useState } from 'react';

export default function Intro() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States for the connection animation
  const [isFlashActive, setIsFlashActive] = useState(false);
  const isNavigatingRef = useRef(false);
  const touchProgressRef = useRef(0);
  const hasTouchedRef = useRef(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('master_crm_theme') === 'dark';
  });
  const isDarkModeRef = useRef(isDarkMode);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    isDarkModeRef.current = newTheme;
    localStorage.setItem('master_crm_theme', newTheme ? 'dark' : 'light');
  };

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
    imgLogo.src = '/logo_master.svg';
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
        // Transparent background
        fallbackCtx.clearRect(0, 0, 800, 450);

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
      const isMobile = canvas.width < 768;
      // On mobile, make hands relatively larger so they fill more of the portrait screen
      const imgTargetWidth = isMobile ? Math.max(canvas.width * 2.5, 800) : canvas.width * 1.2;
      let scale = 1;
      let imgTargetHeight = canvas.height;
      if (imgData) {
        scale = imgTargetWidth / img.width;
        imgTargetHeight = img.height * scale;
      }
      const offsetX = (canvas.width - imgTargetWidth) / 2;
      const offsetY = (canvas.height - imgTargetHeight) / 2;

      // Logo dimensions
      // On mobile, the logo should take up 85% of the screen width to be readable
      const logoMaxWidth = isMobile ? canvas.width * 0.85 : canvas.width * 0.4;
      const logoWidth = Math.min(logoMaxWidth, 600);
      let logoScale = 1;
      let logoHeight = logoWidth;
      if (imgLogoData) {
        logoScale = logoWidth / imgLogoData.width;
        logoHeight = imgLogoData.height * logoScale;
      }
      const logoOffsetX = (canvas.width - logoWidth) / 2;
      const logoOffsetY = (canvas.height - logoHeight) / 2 - (isMobile ? 80 : 40); // slightly higher on mobile

      // Intro Animation: Hands come together over 5 seconds
      const maxTime = 300;
      const progress = Math.min(1, time / maxTime);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Click Animation: Close the final gap quickly
      if (isNavigatingRef.current) {
        touchProgressRef.current += 0.025; // Faster: takes ~660ms to touch
        if (touchProgressRef.current >= 1 && !hasTouchedRef.current) {
          touchProgressRef.current = 1;
          hasTouchedRef.current = true;

          // Exactly when they touch, trigger the flash!
          setIsFlashActive(true);

          // Wait for the flash to cover the screen, then navigate rapidly
          setTimeout(() => {
            navigate('/login');
          }, 400);
        }
      }
      const touchEase = Math.pow(touchProgressRef.current, 2); // accelerate touching

      // The hands naturally stop with a 40px gap (Creation of Adam style). When clicked, gap goes to 0.
      const baseGap = isMobile ? 20 : 40; // smaller gap on mobile
      const currentGap = baseGap * (1 - touchEase);
      // adjust slide distance for mobile scale
      const maxSlide = isMobile ? 200 : 400;
      const slideDistance = (maxSlide * (1 - easeOut)) + currentGap;

      // Dynamic color based on theme
      const handsColor = isDarkModeRef.current ? '#e5e5e5' : '#404040';

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
            
            // 🌟 Se comentaron r, g, b porque no se usan para el renderizado final (se usa handsColor)
            // const r = imgData.data[index];
            // const g = imgData.data[index + 1];
            // const b = imgData.data[index + 2];
            const a = imgData.data[index + 3];

            // Calculate brightness using the raw data directly to avoid unused variable errors
            const brightness = (imgData.data[index] + imgData.data[index + 1] + imgData.data[index + 2]) / 3;
            if (a > 128 && brightness < 240) {
              const slideOffset = isLeftHand ? -slideDistance : slideDistance;
              const drawX = x + slideOffset;
              const drawY = y;

              const moveX = Math.sin(drawX * 0.003 + time * 0.02) * 8;
              const moveY = Math.cos(drawY * 0.003 + time * 0.02) * 8;

              // Suaviza as bordas externas para não haver corte abrupto quando as mãos deslizam
              let edgeFade = 1;
              const edgeThreshold = isMobile ? 150 : 350; 
              if (x < edgeThreshold) {
                  edgeFade = Math.max(0, x / edgeThreshold);
              } else if (x > canvas.width - edgeThreshold) {
                  edgeFade = Math.max(0, (canvas.width - x) / edgeThreshold);
              }

              const fadeAlpha = Math.min(1, time / 60) * edgeFade;
              ctx.globalAlpha = (isDarkModeRef.current ? 0.6 : 0.8) * fadeAlpha;
              ctx.fillStyle = handsColor;

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
              const a = imgLogoData.data[idx + 3];

              // Draw if pixel is not transparent
              if (a > 60) {
                const fadeAlpha = Math.min(1, time / 60);
                ctx.globalAlpha = 0.9 * fadeAlpha;
                ctx.fillStyle = isDarkModeRef.current ? '#ffffff' : '#000000'; // Pure white in dark mode, pure black in light mode

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
    <div className={`min-h-screen transition-colors duration-1000 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#fafafa]'} flex flex-col items-center justify-center relative overflow-hidden`}>

      {/* Flash Screen Overlay triggered exactly when hands touch */}
      <div
        className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 ease-in ${isFlashActive ? 'opacity-100' : 'opacity-0'} ${isDarkMode ? 'bg-black' : 'bg-white'}`}
      />

      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Navbar restored */}
      <header className="absolute top-0 left-0 w-full flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 z-20 animate-fade-in-down gap-4 sm:gap-0">
        <div className="flex items-center justify-center w-full sm:w-auto">
          <svg viewBox="0 0 1402 1122" className={`h-10 sm:h-12.5 w-auto transition-all ${isDarkMode ? 'invert opacity-90' : 'opacity-100'}`}>
            <defs>
              <pattern id="navDotMaskPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="8" fill="white" />
              </pattern>
              <mask id="navDotsMask">
                <rect width="100%" height="100%" fill="url(#navDotMaskPattern)" />
              </mask>
            </defs>
            <image href="/logo_master.svg" width="1402" height="1122" mask="url(#navDotsMask)" />
          </svg>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isDarkMode ? 'border-neutral-800 text-white hover:bg-neutral-900 hover:border-neutral-600' : 'border-neutral-200 text-black hover:bg-neutral-100 hover:border-black'}`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={handleAccess}
            className={`cursor-pointer text-xs sm:text-sm font-bold border-2 px-6 sm:px-8 py-2 sm:py-2.5 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto max-w-50 ${isDarkMode ? 'bg-black border-neutral-700 text-white hover:bg-neutral-900 hover:border-neutral-500' : 'bg-white border-black text-black hover:bg-neutral-50'
              }`}
          >
            Acessar Agora
          </button>
        </div>
      </header>

      {/* Footer with Participants Names */}
      <footer className="absolute bottom-6 left-0 w-full z-20 flex justify-center items-center px-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <p className={`text-xs sm:text-sm font-medium text-center tracking-wide px-4 py-1 rounded-full backdrop-blur-sm transition-colors duration-1000 ${isDarkMode ? 'bg-black/50 text-neutral-500' : 'bg-[#fafafa]/80 text-neutral-400'
          }`}>
          Desenvolvido por: <span className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>João Henrique, Mariana, Marlos, Mirelly, Samara & Henrique</span>
        </p>
      </footer>
    </div>
  );
}