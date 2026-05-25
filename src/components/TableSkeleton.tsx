import { useOutletContext } from 'react-router-dom';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  return (
    <div className="w-full">
      <div className={`border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} pb-4 mb-4 flex justify-between px-6 mt-4`}>
        {Array.from({ length: columns }).map((_, idx) => (
          <div key={idx} className={`h-4 w-24 rounded animate-pulse-slow ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
        ))}
      </div>
      
      <div className="space-y-4 px-6">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex justify-between items-center py-2">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div 
                key={colIdx} 
                className={`h-6 rounded animate-pulse-slow ${isDarkMode ? 'bg-neutral-800/60' : 'bg-neutral-100'} ${colIdx === 0 ? 'w-1/4' : 'w-1/5'}`} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
