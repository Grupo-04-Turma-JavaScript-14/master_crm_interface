import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Contact, UserCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CrmLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', path: '/app/clientes', icon: Users },
    { name: 'Contatos', path: '/app/contatos', icon: Contact },
    { name: 'Usuários', path: '/app/usuarios', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CRM Master
          </h1>
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
                    ? "bg-blue-600/20 text-blue-400" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3 transition-transform group-hover:scale-110", isActive && "text-blue-400")} />
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
        <header className="h-16 glass-panel border-b border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-200">
            {navItems.find(i => location.pathname.includes(i.path))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
