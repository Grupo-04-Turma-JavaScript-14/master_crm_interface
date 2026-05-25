import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Contact, UserCircle, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function CrmLayout() {
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('master_crm_theme') !== 'light';
  });

  useEffect(() => {
    localStorage.setItem('master_crm_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', path: '/app/clientes', icon: Users },
    { name: 'Contatos', path: '/app/contatos', icon: Contact },
    { name: 'Usuários', path: '/app/usuarios', icon: UserCircle },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-slate-100' : 'bg-[#fafafa] text-slate-800'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200 backdrop-blur-md shadow-lg'}`}>
        <div className={`h-16 flex items-center px-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 1402 1122" className={`h-8 w-auto transition-all ${isDarkMode ? 'invert opacity-90' : 'opacity-100'}`}>
              <image href="/logo_master.svg" width="1402" height="1122" />
            </svg>
            <h1 className={`text-lg font-bold bg-gradient-to-r ${isDarkMode ? 'from-purple-400 via-pink-400 to-yellow-400' : 'from-purple-600 via-pink-600 to-yellow-600'} bg-clip-text text-transparent`}>
              MASTER CRM
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? (isDarkMode ? "bg-purple-600/20 text-purple-400" : "bg-purple-600/10 text-purple-600")
                    : (isDarkMode ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800")
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3 transition-transform group-hover:scale-110", isActive && (isDarkMode ? "text-purple-400" : "text-purple-600"))} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <Link
            to="/login"
            className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sair</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-8 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md shadow-sm'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {navItems.find(i => location.pathname.includes(i.path))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
             <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isDarkMode ? 'border-neutral-800 text-white hover:bg-neutral-800 hover:border-neutral-600' : 'border-neutral-200 text-black hover:bg-neutral-100 hover:border-black'}`}
                title="Alternar Tema"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 shadow-lg border-2 border-transparent" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
           <Outlet context={{ isDarkMode }} />
        </div>
      </main>
    </div>
  );
}
