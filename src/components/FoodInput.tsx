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
      <div className="flex gap-1 mb-3 bg-surface-2 rounded-lg p-1 w-fit">
        <button
          onClick={() => { setMode("natural"); setSearchResults([]); }}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            mode === "natural" ? "bg-surface-3 text-text" : "text-text-muted hover:text-text"
          }`}
        >
          Type naturally
        </button>
        <button
          onClick={() => setMode("search")}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            mode === "search" ? "bg-surface-3 text-text" : "text-text-muted hover:text-text"
          }`}
        >
          Search foods
        </button>
      </div>

      {/* Input area */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "natural"
              ? "Type what you ate... e.g. \"2 eggs and toast with a cup of coffee\""
              : "Search for a food... e.g. \"chicken breast\""
          }
          rows={mode === "natural" ? 3 : 1}
          disabled={loading}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />

        {mode === "natural" && (
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="absolute bottom-3 right-3 bg-accent text-bg px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
          >
            {loading ? "Analyzing..." : "Add"}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-400 px-1">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mt-2 text-sm text-text-muted text-center py-2">
          Analyzing your food with AI...
        </div>
      )}

      {/* Search results */}
      {mode === "search" && searchResults.length > 0 && (
        <div className="mt-2 bg-surface-2 border border-border rounded-xl overflow-hidden">
          {searchResults.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSearchSelect(item)}
              className="w-full px-4 py-3 text-left hover:bg-surface-3 transition-colors border-b border-border last:border-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-text-muted">{item.servingSize}</div>
                </div>
                <div className="text-right text-xs text-text-muted">
                  <div>{item.macros.calories} kcal</div>
                  <div>P:{item.macros.protein}g C:{item.macros.carbs}g F:{item.macros.fat}g</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === "search" && text.trim() && searchResults.length === 0 && (
        <div className="mt-2 text-sm text-text-muted text-center py-3">
          No foods found for &ldquo;{text}&rdquo;
        </div>
      )}
    </div>
  );
}
