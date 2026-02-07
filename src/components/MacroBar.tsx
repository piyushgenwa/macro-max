"use client";

import { useEffect, useState } from "react";

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  glowColor?: string;
  unit?: string;
}

export default function MacroBar({ label, current, target, color, glowColor, unit = "g" }: MacroBarProps) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const over = current > target;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(pct), 150);
    return () => clearTimeout(timer);
  }, [pct]);

  const resolvedGlow = glowColor || color;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-text-secondary tracking-wide">{label}</span>
        <div className="flex items-baseline gap-1">
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: over ? "var(--color-red)" : color }}
          >
            {Math.round(current)}
          </span>
          <span className="text-xs text-text-muted">
            / {target}{unit}
          </span>
        </div>
      </div>
      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{
            width: `${animatedPct}%`,
            background: over
              ? `linear-gradient(90deg, ${color}, var(--color-red))`
              : `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: animatedPct > 5 ? `0 0 12px -2px ${resolvedGlow}60` : "none",
          }}
        >
          {/* Shimmer effect on bar */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                animation: "shimmer 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
