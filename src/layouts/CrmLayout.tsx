import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Contact, UserCircle, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function CrmLayout() {
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('master_crm_theme') !== 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('master_crm_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', path: '/app/clientes', icon: Users },
    { name: 'Contatos', path: '/app/contatos', icon: Contact },
    { name: 'Usuários', path: '/app/usuarios', icon: UserCircle },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'}`}>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-xl shadow-neutral-200/50'}`}>
        <div className={`h-20 flex items-center justify-center px-6 md:px-8 border-b relative ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center justify-center">
            <svg 
              viewBox="390 120 660 610" 
              className={`h-10 w-auto transition-transform duration-300 hover:scale-110 cursor-pointer ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              <g transform="translate(0.000000,1122.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                <path d="M10025 9619 c-635 -511 -1475 -1196 -2041 -1664 -66 -55 -183 -152 -260 -215 -76 -63 -297 -245 -490 -406 l-350 -291 -59 91 c-32 50 -317 479 -632 953 -600 903 -596 898 -690 934 -15 6 -309 73 -652 150 -590 132 -628 139 -675 129 -64 -14 -124 -49 -154 -89 -55 -75 -52 89 -52 -2570 0 -1701 3 -2468 11 -2494 14 -50 73 -115 127 -139 24 -11 67 -20 96 -20 53 -1 59 1 1454 476 160 54 210 83 238 138 21 41 21 118 -1 155 -9 15 -141 118 -292 228 -223 162 -279 208 -301 245 l-27 45 -3 1018 c-2 703 1 1031 8 1058 12 43 44 83 63 76 11 -3 147 -187 580 -782 100 -137 223 -295 272 -350 103 -114 290 -328 484 -555 73 -85 141 -158 152 -162 33 -13 66 9 123 79 119 147 864 1063 930 1144 693 848 1237 1506 1606 1944 69 83 273 326 452 540 180 215 370 441 423 503 68 80 95 119 93 134 -2 12 -7 23 -13 24 -5 2 -194 -146 -420 -327z"/>
                <path d="M9768 8379 c-17 -6 -120 -125 -280 -322 -315 -388 -720 -885 -1025 -1254 -128 -156 -233 -287 -233 -292 0 -5 16 -15 35 -21 24 -8 45 -26 63 -53 l27 -41 5 -875 5 -876 25 -44 c14 -24 41 -57 60 -73 23 -18 271 -123 670 -283 574 -231 640 -255 693 -255 98 0 178 52 215 140 12 30 14 309 16 2060 l1 2025 -28 58 c-37 75 -84 107 -164 113 -32 2 -70 -1 -85 -7z"/>
              </g>
            </svg>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`absolute right-4 md:hidden p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-300 group cursor-pointer",
                  isActive 
                    ? (isDarkMode ? "bg-white text-black" : "bg-black text-white")
                    : (isDarkMode ? "text-neutral-500 hover:bg-neutral-900 hover:text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-black")
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110", isActive ? "" : "")} />
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-6 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <Link
            to="/login"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-300 cursor-pointer ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-900' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'}`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-semibold text-sm tracking-wide">Sair da Conta</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-20 border-b flex items-center justify-between px-4 md:px-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-2 -ml-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className={`text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {navItems.find(i => location.pathname.includes(i.path))?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isDarkMode ? 'border-neutral-800 text-white hover:bg-neutral-800 hover:border-neutral-600' : 'border-neutral-200 text-black hover:bg-neutral-100 hover:border-black'}`}
                title="Alternar Tema"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'}`}>
              <UserCircle className={`w-6 h-6 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-10 relative">
           <Outlet context={{ isDarkMode }} />
        </div>
      </main>
    </div>
  );
}
