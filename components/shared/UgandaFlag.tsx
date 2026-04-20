export function UgandaFlag({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Flag of Uganda"
    >
      {/* Rounded mask */}
      <defs>
        <clipPath id="ugRound">
          <rect width="36" height="36" rx="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#ugRound)">
        {/* Six equal horizontal stripes: black, yellow, red, black, yellow, red */}
        <rect width="36" height="6" y="0" fill="#000000" />
        <rect width="36" height="6" y="6" fill="#FCDC04" />
        <rect width="36" height="6" y="12" fill="#D90000" />
        <rect width="36" height="6" y="18" fill="#000000" />
        <rect width="36" height="6" y="24" fill="#FCDC04" />
        <rect width="36" height="6" y="30" fill="#D90000" />
        {/* Central white disc for crested crane */}
        <circle cx="18" cy="18" r="6.5" fill="#FFFFFF" />
        <g transform="translate(18 18)" fill="#4B5563">
          {/* Body */}
          <ellipse cx="0" cy="1.3" rx="2.8" ry="1.4" />
          {/* Neck */}
          <rect x="-0.5" y="-2.8" width="1" height="3.6" />
          {/* Head */}
          <circle cx="0" cy="-3" r="0.9" />
          {/* Crest tufts */}
          <path d="M-0.9 -3.9 L-0.3 -5.2 M0 -4 L0 -5.4 M0.9 -3.9 L0.3 -5.2" stroke="#4B5563" strokeWidth="0.45" fill="none" />
          {/* Legs */}
          <rect x="-0.2" y="2.4" width="0.4" height="2" />
        </g>
      </g>
    </svg>
  );
}
