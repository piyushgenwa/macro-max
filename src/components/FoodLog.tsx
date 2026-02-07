"use client";

import { FoodEntry } from "@/types";

interface FoodLogProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
}

export default function FoodLog({ entries, onRemove }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text-secondary mb-1">No food logged yet</p>
        <p className="text-xs text-text-muted">Describe what you ate to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 stagger-children">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="group relative glass rounded-xl px-4 py-3.5 transition-all duration-300 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-medium text-sm truncate">{entry.name}</span>
                <span className="text-[11px] text-text-muted shrink-0 px-2 py-0.5 rounded-full bg-white/[0.04]">
                  {entry.quantity}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ring-cal" />
                  <span className="text-text-secondary">{entry.macros.calories} cal</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ring-protein" />
                  <span className="text-text-secondary">{entry.macros.protein}g</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ring-carbs" />
                  <span className="text-text-secondary">{entry.macros.carbs}g</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ring-fat" />
                  <span className="text-text-secondary">{entry.macros.fat}g</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => onRemove(entry.id)}
              className="ml-3 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red hover:bg-red/10 opacity-0 group-hover:opacity-100 transition-all duration-200 btn-press"
              title="Remove"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
