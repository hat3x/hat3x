const Hat3xLogo = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: { text: "text-lg", width: 100, height: 32 },
    md: { text: "text-2xl", width: 140, height: 42 },
    lg: { text: "text-4xl", width: 200, height: 56 },
  };
  const s = sizes[size];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <svg width={s.width} height={s.height} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wordmark HAT3X */}
        <text
          x="100"
          y="36"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="34"
          fill="white"
          letterSpacing="4"
        >
          HAT3X
        </text>
        {/* Saturn ring / ellipse crossing horizontally */}
        <ellipse
          cx="100"
          cy="28"
          rx="96"
          ry="14"
          stroke="url(#ring-gradient)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.85"
        />
        <ellipse
          cx="100"
          cy="28"
          rx="96"
          ry="14"
          stroke="url(#ring-gradient)"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
          strokeDasharray="4 6"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="28" x2="200" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(265 100% 60%)" stopOpacity="0.3" />
            <stop offset="30%" stopColor="hsl(265 100% 60%)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(32 100% 55%)" stopOpacity="1" />
            <stop offset="70%" stopColor="hsl(265 100% 60%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(265 100% 60%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Hat3xLogo;
