import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Users, Contact, UserCircle, LogOut, Search, Moon, Sun, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CrmLayout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', path: '/app/clientes', icon: Users },
    { name: 'Contatos', path: '/app/contatos', icon: Contact },
    { name: 'Usuários', path: '/app/usuarios', icon: UserCircle },
  ];

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${darkMode
      ? 'bg-black text-white'
      : 'bg-zinc-100 text-black'
      }`}>
      {/* Sidebar */}
      <aside className={`w-72 flex flex-col border-r transition-all duration-300 ${darkMode
        ? 'bg-zinc-950 border-zinc-800'
        : 'bg-white border-zinc-200'
        }`}>
        <div className={`h-20 flex items-center px-8 border-b ${darkMode
          ? 'border-zinc-800'
          : 'border-zinc-200'
          }`}>
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-wide">
            CRM Master
          </h1>
        </div>

        <nav className="flex-1 px-5 py-8 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group font-medium",
                  isActive
                    ? darkMode
                      ? "bg-white text-black shadow-lg"
                      : "bg-black text-white shadow-lg"
                    : darkMode
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-4 transition-all duration-300 group-hover:scale-110")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/login"
            className="flex items-center px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sair</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-20 px-8 flex items-center justify-between border-b transition-all duration-300 ${darkMode
          ? 'bg-zinc-950 border-zinc-800'
          : 'bg-white border-zinc-200'
          }`}
        >
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              type="text"
              placeholder="Buscar..."
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition-all duration-300 ${darkMode
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
                : 'bg-zinc-100 border-zinc-200 text-black'
                }`}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 ${darkMode
                ? 'bg-zinc-900 hover:bg-zinc-800'
                : 'bg-zinc-200 hover:bg-zinc-300'
                }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className={`p-3 rounded-xl transition-all duration-300 ${darkMode
                ? 'bg-zinc-900 hover:bg-zinc-800'
                : 'bg-zinc-200 hover:bg-zinc-300'
                }`}
            >
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100"
                alt="user"
                className="w-11 h-11 rounded-full object-cover"
              />

              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold">
                  Ariel
                </span>

                <span className="text-xs text-zinc-400">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-auto p-8 transition-all duration-300 ${darkMode
            ? 'bg-black'
            : 'bg-zinc-100'
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
