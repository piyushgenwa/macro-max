"use client";

import { FoodEntry } from "@/types";

interface FoodLogProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
}

export default function FoodLog({ entries, onRemove }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-lg mb-1">No food logged yet</p>
        <p className="text-sm">Type what you ate above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-surface-2 border border-border rounded-xl px-4 py-3 flex items-center justify-between group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{entry.name}</span>
              <span className="text-xs text-text-muted shrink-0">{entry.quantity}</span>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-text-muted">
              <span className="text-ring-cal">{entry.macros.calories} cal</span>
              <span className="text-ring-protein">P: {entry.macros.protein}g</span>
              <span className="text-ring-carbs">C: {entry.macros.carbs}g</span>
              <span className="text-ring-fat">F: {entry.macros.fat}g</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(entry.id)}
            className="ml-3 text-text-muted hover:text-red opacity-0 group-hover:opacity-100 transition-opacity text-lg"
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
