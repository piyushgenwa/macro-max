"use client";

import { Macros, MacroTargets } from "@/types";
import ActivityRing from "./ActivityRing";

interface MacroRingsProps {
  current: Macros;
  targets: MacroTargets;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { ring: 56, stroke: 4 },
  md: { ring: 80, stroke: 6 },
  lg: { ring: 110, stroke: 8 },
};

export default function MacroRings({ current, targets, size = "md" }: MacroRingsProps) {
  const { ring, stroke } = SIZES[size];

  const rings = [
    {
      key: "calories",
      progress: targets.calories > 0 ? current.calories / targets.calories : 0,
      color: "var(--color-ring-cal)",
      glowColor: "#f97316",
      label: "Calories",
      value: `${current.calories}`,
      unit: "kcal",
    },
    {
      key: "protein",
      progress: targets.protein > 0 ? current.protein / targets.protein : 0,
      color: "var(--color-ring-protein)",
      glowColor: "#06b6d4",
      label: "Protein",
      value: `${Math.round(current.protein)}g`,
      unit: `/ ${targets.protein}g`,
    },
    {
      key: "carbs",
      progress: targets.carbs > 0 ? current.carbs / targets.carbs : 0,
      color: "var(--color-ring-carbs)",
      glowColor: "#a855f7",
      label: "Carbs",
      value: `${Math.round(current.carbs)}g`,
      unit: `/ ${targets.carbs}g`,
    },
    {
      key: "fat",
      progress: targets.fat > 0 ? current.fat / targets.fat : 0,
      color: "var(--color-ring-fat)",
      glowColor: "#eab308",
      label: "Fat",
      value: `${Math.round(current.fat)}g`,
      unit: `/ ${targets.fat}g`,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-5 stagger-children">
      {rings.map((r) => (
        <ActivityRing
          key={r.key}
          progress={r.progress}
          size={ring}
          strokeWidth={stroke}
          color={r.color}
          glowColor={r.glowColor}
          label={size !== "sm" ? r.label : undefined}
          value={r.value}
          unit={size !== "sm" ? r.unit : undefined}
        />
      ))}
    </div>
  );
}
