import { useOutletContext } from 'react-router-dom';

export default function Avatar({ name }: { name: string }) {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Cores monocromáticas variadas baseadas no nome (para não ser sempre igual, mas mantendo a paleta P&B/Cinza)
  const colors = isDarkMode 
    ? ['bg-neutral-800 text-white', 'bg-neutral-700 text-neutral-200', 'bg-neutral-900 text-neutral-400'] 
    : ['bg-neutral-200 text-black', 'bg-neutral-300 text-neutral-800', 'bg-neutral-100 text-neutral-600'];
  
  const colorIndex = name ? name.length % colors.length : 0;
  const colorClass = colors[colorIndex];

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${colorClass} ${isDarkMode ? 'border-neutral-700' : 'border-neutral-300'}`}>
      {getInitials(name)}
    </div>
  );
}
