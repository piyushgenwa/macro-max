"use client";

import { useState, useRef } from "react";
import { searchFoods } from "@/lib/food-db";
import { FoodEntry, FoodItem } from "@/types";

interface FoodInputProps {
  onAddEntries: (entries: FoodEntry[]) => void;
}

interface ParsedFoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function FoodInput({ onAddEntries }: FoodInputProps) {
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<"natural" | "search">("natural");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ParsedFoodItem[] | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    if (mode !== "natural") return;

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/parse-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (!data.items || data.items.length === 0) {
        setError("Couldn't identify any foods. Try being more specific.");
        return;
      }

      // Show preview so user can confirm
      setPreview(data.items);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function confirmPreview() {
    if (!preview) return;

    const entries: FoodEntry[] = preview.map((item) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: item.name,
      quantity: item.quantity,
      macros: {
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      },
      timestamp: new Date().toISOString(),
    }));

    onAddEntries(entries);
    setText("");
    setPreview(null);
  }

  function cancelPreview() {
    setPreview(null);
  }

  function handleSearchSelect(item: FoodItem) {
    const entry: FoodEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
    if (preview) setPreview(null);
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
          onClick={() => { setMode("natural"); setSearchResults([]); setPreview(null); }}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            mode === "natural" ? "bg-surface-3 text-text" : "text-text-muted hover:text-text"
          }`}
        >
          Type naturally
        </button>
        <button
          onClick={() => { setMode("search"); setPreview(null); }}
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
            className="absolute bottom-3 right-3 bg-accent text-bg px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                Parsing...
              </>
            ) : (
              "Add"
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 text-sm text-red bg-red/10 border border-red/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* AI Preview */}
      {preview && (
        <div className="mt-3 bg-surface-2 border border-accent/30 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-accent/10 border-b border-accent/20">
            <span className="text-xs font-medium text-accent">Parsed by AI — confirm to add</span>
          </div>
          {preview.map((item, i) => (
            <div
              key={i}
              className="px-4 py-3 border-b border-border last:border-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-text-muted">{item.quantity}</div>
                </div>
                <div className="text-right text-xs text-text-muted">
                  <div>{item.calories} kcal</div>
                  <div>P:{item.protein}g C:{item.carbs}g F:{item.fat}g</div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2 p-3">
            <button
              onClick={cancelPreview}
              className="flex-1 py-2 rounded-lg border border-border text-text-muted text-sm hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmPreview}
              className="flex-1 py-2 rounded-lg bg-accent text-bg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Confirm
            </button>
          </div>
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
