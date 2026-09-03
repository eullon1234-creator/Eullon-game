// src/components/common/ArcReactor.tsx
import React from 'react';

interface ArcReactorProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
  className?: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${sizeMap[size]} ${className}`}>
      {/* Glow externo difuso */}
      <div
        className={`absolute inset-0 rounded-full bg-cyan-400/30 blur-md transition-all duration-500 ${
          pulse ? 'scale-125 opacity-90 animate-pulse bg-cyan-300/50' : 'opacity-60'
        }`}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]"
      >
        {/* Anel Externo Fixo */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="2.5"
          opacity="0.8"
        />

        {/* Anel Giratório Externo com marcas */}
        <g className="animate-[spin_10s_linear_infinite] origin-center">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity="0.9"
          />
        </g>

        {/* Bobinas / Setores Energéticos (10 bobinas do Reator Arc) */}
        <g className="origin-center">
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
            <rect
              key={deg}
              x="47.5"
              y="12"
              width="5"
              height="8"
              rx="1.5"
              fill="#38bdf8"
              opacity="0.85"
              transform={`rotate(${deg} 50 50)`}
              className="drop-shadow-[0_0_3px_#00f2fe]"
            />
          ))}
        </g>

        {/* Anel Médio Contra-Giratório */}
        <g className="animate-[spin_6s_linear_infinite_reverse] origin-center">
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2"
            strokeDasharray="14 10"
            opacity="0.95"
          />
        </g>

        {/* Núcleo Central Triangular / Circular Radiante */}
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="rgba(0, 242, 254, 0.25)"
          stroke="#e0f2fe"
          strokeWidth="3"
          className="drop-shadow-[0_0_6px_#38bdf8]"
        />

        <circle
          cx="50"
          cy="50"
          r="10"
          fill="#ffffff"
          className="drop-shadow-[0_0_8px_#ffffff]"
        />

        {/* Tríade de nós triangulares internos */}
        <g className="animate-[spin_4s_linear_infinite] origin-center opacity-80">
          <polygon
            points="50,36 38,57 62,57"
            fill="none"
            stroke="#00f2fe"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
};
