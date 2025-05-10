import React, { ReactNode, useEffect, useState } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-sky-100 bg-white px-6 py-5 shadow-md transition-all duration-300 hover:shadow-sky-100">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 relative ${isAnimating ? 'animate-pulse' : ''}`}>
        {isAnimating && (
          <div className="absolute inset-0 rounded-full border-2 border-sky-300 animate-ping opacity-75"></div>
        )}
        <div className="text-sky-500">
          {children}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-xl font-bold text-sky-800">
            {total}
          </h4>
          <span className="text-sm font-medium text-sky-600">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp ? "text-emerald-500" : levelDown ? "text-red-500" : ""
          }`}
        >
          {rate}

          {levelUp && (
            <svg className="fill-emerald-500" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z" fill=""/>
            </svg>
          )}
          {levelDown && (
            <svg className="fill-red-500" width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z" fill=""/>
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
