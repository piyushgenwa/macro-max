"use client";

import { useEffect, useState } from "react";

interface ActivityRingProps {
  progress: number; // 0-1
  size: number;
  strokeWidth: number;
  color: string;
  glowColor?: string;
  bgColor?: string;
  label?: string;
  value?: string;
  unit?: string;
}

export default function ActivityRing({
  progress,
  size,
  strokeWidth,
  color,
  glowColor,
  bgColor = "rgba(255,255,255,0.04)",
  label,
  value,
  unit,
}: ActivityRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const capped = Math.min(animatedProgress, 1);
  const offset = circumference - capped * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const resolvedGlow = glowColor || color;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient glow behind ring */}
        {animatedProgress > 0 && (
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-1000"
            style={{
              background: `radial-gradient(circle, ${resolvedGlow} 0%, transparent 70%)`,
              opacity: Math.min(animatedProgress * 0.15, 0.15),
              transform: "scale(1.3)",
            }}
          />
        )}

        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress ring with glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: animatedProgress > 0
                ? `drop-shadow(0 0 4px ${resolvedGlow}) drop-shadow(0 0 8px ${resolvedGlow})`
                : "none",
            }}
          />
        </svg>

        {value !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-bold animate-count"
              style={{
                color,
                fontSize: size > 100 ? "1rem" : size > 70 ? "0.8rem" : "0.65rem",
              }}
            >
              {value}
            </span>
            {unit && (
              <span
                className="text-text-muted"
                style={{ fontSize: size > 100 ? "0.6rem" : "0.5rem" }}
              >
                {unit}
              </span>
            )}
          </div>
        )}
      </div>
      {label && (
        <span className="text-[11px] font-medium text-text-muted tracking-wide uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
