"use client";

import { useState, useRef } from "react";
import { parseNaturalInput } from "@/lib/parse-food";
import { searchFoods } from "@/lib/food-db";
import { FoodEntry, FoodItem } from "@/types";

interface FoodInputProps {
  onAddEntries: (entries: FoodEntry[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function FoodInput({ onAddEntries }: FoodInputProps) {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<"natural" | "search">("natural");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!text.trim() || loading) return;

    if (mode === "natural") {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/parse-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim() }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const entries: FoodEntry[] = (data.entries || []).map(
          (item: { name: string; quantity: string; macros: { calories: number; protein: number; carbs: number; fat: number } }) => ({
            id: generateId(),
            name: item.name,
            quantity: item.quantity,
            macros: item.macros,
            timestamp: new Date().toISOString(),
          })
        );

        if (entries.length > 0) {
          onAddEntries(entries);
          setText("");
        } else {
          setError("Couldn't identify any foods. Try being more specific.");
        }
      } catch {
        // Fallback to local parser if API fails
        const entries = parseNaturalInput(text);
        if (entries.length > 0) {
          onAddEntries(entries);
          setText("");
        } else {
          setError("Could not parse food. Try something like \"2 eggs and toast\".");
        }
      } finally {
        setLoading(false);
      }
    }
  }

  function handleSearchSelect(item: FoodItem) {
    const entry: FoodEntry = {
      id: generateId(),
      name: item.name,
      quantity: `1 x ${item.servingSize}`,
      macros: { ...item.macros },
      timestamp: new Date().toISOString(),
    };
    onAddEntries([entry]);
    setText("");
    setSearchResults([]);
  }

  function handleTextChange(val: string) {
    setText(val);
    setError(null);
    if (mode === "search" && val.trim()) {
      setSearchResults(searchFoods(val));
    } else {
      setSearchResults([]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && mode === "natural") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="w-full">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        <button
          onClick={() => { setMode("natural"); setSearchResults([]); }}
          className={`relative px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 btn-press ${
            mode === "natural"
              ? "text-text"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {mode === "natural" && (
            <div className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]" />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Natural
          </span>
        </button>
        <button
          onClick={() => setMode("search")}
          className={`relative px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 btn-press ${
            mode === "search"
              ? "text-text"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {mode === "search" && (
            <div className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]" />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </span>
        </button>
      </div>

      {/* Input area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent/20 via-ring-carbs/10 to-ring-protein/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "natural"
                ? "Describe what you ate... e.g. \"2 eggs, toast with avocado, and a coffee\""
                : "Search for a food... e.g. \"chicken breast\""
            }
            rows={mode === "natural" ? 3 : 1}
            disabled={loading}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-text placeholder:text-text-muted/40 resize-none transition-all duration-300 disabled:opacity-40"
          />

          {mode === "natural" && (
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className="absolute bottom-3 right-3 bg-accent text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-accent-light disabled:opacity-20 transition-all duration-300 btn-press"
              style={{
                boxShadow: text.trim() && !loading ? "0 0 20px -5px rgba(99, 102, 241, 0.5)" : "none",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : "Add"}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 text-xs text-red-light px-1 flex items-center gap-2 animate-fade-in-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-accent-light py-3 animate-fade-in-up">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          Analyzing your food with AI...
        </div>
      )}

      {/* Search results */}
      {mode === "search" && searchResults.length > 0 && (
        <div className="mt-2 glass rounded-xl overflow-hidden stagger-children">
          {searchResults.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSearchSelect(item)}
              className="w-full px-4 py-3.5 text-left hover:bg-white/[0.04] transition-all duration-200 border-b border-white/[0.04] last:border-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{item.servingSize}</div>
                </div>
                <div className="text-right text-[11px] space-y-0.5">
                  <div className="text-ring-cal font-semibold">{item.macros.calories} kcal</div>
                  <div className="text-text-muted flex gap-2">
                    <span className="text-ring-protein">P:{item.macros.protein}g</span>
                    <span className="text-ring-carbs">C:{item.macros.carbs}g</span>
                    <span className="text-ring-fat">F:{item.macros.fat}g</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === "search" && text.trim() && searchResults.length === 0 && (
        <div className="mt-3 text-xs text-text-muted text-center py-4">
          No foods found for &ldquo;{text}&rdquo;
        </div>
      )}
    </div>
  );
}
