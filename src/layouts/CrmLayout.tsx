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
    <div className={`min-h-screen flex transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-xl shadow-neutral-200/50'}`}>
        <div className={`h-20 flex items-center px-8 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 1402 1122" className={`h-8 w-auto transition-all ${isDarkMode ? 'invert opacity-100' : 'opacity-100'}`}>
              <image href="/logo_master.svg" width="1402" height="1122" />
            </svg>
            <h1 className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>
              MASTER CRM
            </h1>
          </div>
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
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-300 group",
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
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-900' : 'text-neutral-500 hover:text-black hover:bg-neutral-100'}`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-semibold text-sm tracking-wide">Sair da Conta</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-20 border-b flex items-center justify-between px-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {navItems.find(i => location.pathname.includes(i.path))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-6">
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

        <div className="flex-1 overflow-auto p-10 relative">
           <Outlet context={{ isDarkMode }} />
        </div>
      </main>
    </div>
  );
}
