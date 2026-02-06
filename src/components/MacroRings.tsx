"use client";

import { useState } from "react";
import { Macros, MacroTargets } from "@/types";
import ActivityRing from "./ActivityRing";

interface MacroRingsProps {
  current: Macros;
  targets: MacroTargets;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { ring: 64, stroke: 5 },
  md: { ring: 90, stroke: 7 },
  lg: { ring: 120, stroke: 9 },
};

const VISIBLE_COUNT = 3;

export default function MacroRings({ current, targets, size = "md" }: MacroRingsProps) {
  const { ring, stroke } = SIZES[size];
  const [startIndex, setStartIndex] = useState(0);

  const rings = [
    {
      key: "calories",
      progress: targets.calories > 0 ? current.calories / targets.calories : 0,
      color: "var(--color-ring-cal)",
      label: "Calories",
      value: `${current.calories}`,
      unit: "kcal",
    },
    {
      key: "protein",
      progress: targets.protein > 0 ? current.protein / targets.protein : 0,
      color: "var(--color-ring-protein)",
      label: "Protein",
      value: `${Math.round(current.protein)}g`,
      unit: `/ ${targets.protein}g`,
    },
    {
      key: "carbs",
      progress: targets.carbs > 0 ? current.carbs / targets.carbs : 0,
      color: "var(--color-ring-carbs)",
      label: "Carbs",
      value: `${Math.round(current.carbs)}g`,
      unit: `/ ${targets.carbs}g`,
    },
    {
      key: "fat",
      progress: targets.fat > 0 ? current.fat / targets.fat : 0,
      color: "var(--color-ring-fat)",
      label: "Fat",
      value: `${Math.round(current.fat)}g`,
      unit: `/ ${targets.fat}g`,
    },
  ];

  const maxStart = rings.length - VISIBLE_COUNT;
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex < maxStart;
  const visibleRings = rings.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
        className="shrink-0 p-1 text-text-muted transition-opacity"
        style={{ opacity: canGoLeft ? 1 : 0, pointerEvents: canGoLeft ? "auto" : "none" }}
        aria-label="Show previous macros"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center justify-center gap-4">
        {visibleRings.map((r) => (
          <ActivityRing
            key={r.key}
            progress={r.progress}
            size={ring}
            strokeWidth={stroke}
            color={r.color}
            label={r.label}
            value={r.value}
            unit={r.unit}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
        className="shrink-0 p-1 text-text-muted transition-opacity"
        style={{ opacity: canGoRight ? 1 : 0, pointerEvents: canGoRight ? "auto" : "none" }}
        aria-label="Show next macros"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
