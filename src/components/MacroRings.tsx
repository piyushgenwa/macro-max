"use client";

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

export default function MacroRings({ current, targets, size = "md" }: MacroRingsProps) {
  const { ring, stroke } = SIZES[size];

  return (
    <div className="flex items-center justify-center gap-4">
      <ActivityRing
        progress={targets.calories > 0 ? current.calories / targets.calories : 0}
        size={ring}
        strokeWidth={stroke}
        color="var(--color-ring-cal)"
        label="Calories"
        value={`${current.calories}`}
        unit="kcal"
      />
      <ActivityRing
        progress={targets.protein > 0 ? current.protein / targets.protein : 0}
        size={ring}
        strokeWidth={stroke}
        color="var(--color-ring-protein)"
        label="Protein"
        value={`${Math.round(current.protein)}g`}
        unit={`/ ${targets.protein}g`}
      />
      <ActivityRing
        progress={targets.carbs > 0 ? current.carbs / targets.carbs : 0}
        size={ring}
        strokeWidth={stroke}
        color="var(--color-ring-carbs)"
        label="Carbs"
        value={`${Math.round(current.carbs)}g`}
        unit={`/ ${targets.carbs}g`}
      />
      <ActivityRing
        progress={targets.fat > 0 ? current.fat / targets.fat : 0}
        size={ring}
        strokeWidth={stroke}
        color="var(--color-ring-fat)"
        label="Fat"
        value={`${Math.round(current.fat)}g`}
        unit={`/ ${targets.fat}g`}
      />
    </div>
  );
}
