export function DomesticDominatorIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="dominatorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
          <stop offset="50%" style={{ stopColor: '#f0f0ff', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#e0e0ff', stopOpacity: 0.3 }} />
        </radialGradient>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff' }} />
          <stop offset="50%" style={{ stopColor: '#f8f8ff' }} />
          <stop offset="100%" style={{ stopColor: '#e8e8ff' }} />
        </linearGradient>
        <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffd700' }} />
          <stop offset="50%" style={{ stopColor: '#ffed4e' }} />
          <stop offset="100%" style={{ stopColor: '#ffd700' }} />
        </linearGradient>
      </defs>
      
      {/* Background glow circle */}
      <circle cx="50" cy="50" r="45" fill="url(#dominatorGlow)" opacity="0.6" />
      
      {/* Main body - beetle shape */}
      <ellipse cx="50" cy="55" rx="28" ry="35" fill="url(#bodyGradient)" stroke="#d0d0d0" strokeWidth="2" />
      
      {/* Head */}
      <ellipse cx="50" cy="28" rx="18" ry="15" fill="url(#bodyGradient)" stroke="#d0d0d0" strokeWidth="2" />
      
      {/* Crown on head */}
      <path
        d="M 40 22 L 43 15 L 46 20 L 50 12 L 54 20 L 57 15 L 60 22 Z"
        fill="url(#crownGradient)"
        stroke="#b8860b"
        strokeWidth="1.5"
      />
      
      {/* Eyes */}
      <circle cx="44" cy="28" r="3" fill="#4040ff" />
      <circle cx="56" cy="28" r="3" fill="#4040ff" />
      <circle cx="44" cy="28" r="1.5" fill="#ffffff" />
      <circle cx="56" cy="28" r="1.5" fill="#ffffff" />
      
      {/* Antennae */}
      <path
        d="M 42 20 Q 35 15 32 10"
        stroke="#c0c0c0"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 58 20 Q 65 15 68 10"
        stroke="#c0c0c0"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="32" cy="10" r="2.5" fill="#ffd700" />
      <circle cx="68" cy="10" r="2.5" fill="#ffd700" />
      
      {/* Wing pattern */}
      <ellipse cx="42" cy="55" rx="8" ry="18" fill="rgba(255,255,255,0.5)" stroke="#e0e0e0" strokeWidth="1" />
      <ellipse cx="58" cy="55" rx="8" ry="18" fill="rgba(255,255,255,0.5)" stroke="#e0e0e0" strokeWidth="1" />
      
      {/* Legs - 6 legs */}
      <path d="M 35 48 Q 25 50 20 55" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 35 58 Q 25 60 18 65" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 35 68 Q 25 72 20 78" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      <path d="M 65 48 Q 75 50 80 55" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 65 58 Q 75 60 82 65" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 65 68 Q 75 72 80 78" stroke="#b0b0b0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* Sparkle effects */}
      <circle cx="25" cy="25" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="75" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
      <circle cx="35" cy="85" r="1.5" fill="#ffffff" opacity="0.8" />
      <circle cx="65" cy="85" r="2" fill="#ffffff" opacity="0.8" />
      
      {/* Shield emblem on body */}
      <path
        d="M 50 48 L 45 50 L 45 60 Q 45 65 50 67 Q 55 65 55 60 L 55 50 Z"
        fill="url(#crownGradient)"
        stroke="#b8860b"
        strokeWidth="1"
        opacity="0.9"
      />
      
      {/* Secret mark - Question mark symbol */}
      <g opacity="0.7">
        {/* Background circle for the mark */}
        <circle cx="50" cy="55" r="6" fill="#ffffff" stroke="#b8860b" strokeWidth="0.8" />
        {/* Question mark */}
        <text
          x="50"
          y="59"
          fontFamily="Arial, sans-serif"
          fontSize="9"
          fontWeight="bold"
          fill="#8b4513"
          textAnchor="middle"
        >
          ?
        </text>
      </g>
    </svg>
  );
}