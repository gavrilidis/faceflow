import React from "react";

interface FoviaLogoProps {
  className?: string;
  size?: number;
}

export const FoviaLogo: React.FC<FoviaLogoProps> = ({ className, size = 64 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yellow circle (top-right) — open arc with gap at bottom-left */}
      <path
        d="M385 95a155 155 0 1 1-155 155"
        stroke="#F5B731"
        strokeWidth="52"
        strokeLinecap="round"
        fill="none"
      />
      {/* Yellow inner dot */}
      <circle cx="310" cy="210" r="30" fill="#F5B731" />

      {/* Cyan circle (bottom-left) — open arc with gap at top-right */}
      <path
        d="M127 417a155 155 0 1 1 155-155"
        stroke="#30C5D2"
        strokeWidth="52"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cyan inner dot */}
      <circle cx="202" cy="302" r="30" fill="#30C5D2" />
    </svg>
  );
};
