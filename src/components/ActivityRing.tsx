"use client";

interface ActivityRingProps {
  progress: number; // 0-1
  size: number;
  strokeWidth: number;
  color: string;
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
  bgColor = "#2a2a2a",
  label,
  value,
  unit,
}: ActivityRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const capped = Math.min(progress, 1);
  const offset = circumference - capped * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
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
          {/* Progress ring */}
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
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {value !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold" style={{ color }}>
              {value}
            </span>
            {unit && <span className="text-[10px] text-text-muted">{unit}</span>}
          </div>
        )}
      </div>
      {label && <span className="text-xs text-text-muted">{label}</span>}
    </div>
  );
}
