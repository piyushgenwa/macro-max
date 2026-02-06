import { FoodEntry, Macros } from "@/types";
import { FOOD_DATABASE, FoodItem } from "./food-db";

interface ParsedItem {
  food: FoodItem;
  multiplier: number;
  quantityText: string;
}

const QUANTITY_PATTERNS = [
  // "2 cups of rice", "3 slices of bread"
  /(\d+(?:\.\d+)?)\s*(cups?|bowls?|plates?|pieces?|slices?|servings?|scoops?|tbsp|tablespoons?|oz|glasses?|cans?|bottles?)\s+(?:of\s+)?/i,
  // "2 eggs", "3 rotis"
  /(\d+(?:\.\d+)?)\s+/i,
  // "half", "a", etc.
  /^(half|a|an)\s+/i,
];

const WORD_NUMBERS: Record<string, number> = {
  half: 0.5,
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

export function parseNaturalInput(text: string): FoodEntry[] {
  // Split by common separators: "and", commas, newlines, "with"
  const segments = text
    .split(/(?:,|\band\b|\n|;|\bwith\b|\bplus\b)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  const entries: FoodEntry[] = [];

  for (const segment of segments) {
    const parsed = parseSegment(segment);
    if (parsed) {
      entries.push({
        id: generateId(),
        name: parsed.food.name,
        quantity: parsed.quantityText,
        macros: scaleMacros(parsed.food.macros, parsed.multiplier),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return entries;
}

function parseSegment(segment: string): ParsedItem | null {
  let remaining = segment.toLowerCase().trim();
  let multiplier = 1;
  let quantityText = "1 serving";

  // Try to extract quantity
  for (const pattern of QUANTITY_PATTERNS) {
    const match = remaining.match(pattern);
    if (match) {
      const rawQty = match[1];
      if (WORD_NUMBERS[rawQty]) {
        multiplier = WORD_NUMBERS[rawQty];
      } else {
        multiplier = parseFloat(rawQty) || 1;
      }
      quantityText = match[0].trim();
      remaining = remaining.replace(pattern, "").trim();
      break;
    }
  }

  // Try to find matching food
  const food = findBestMatch(remaining);
  if (!food) return null;

  if (quantityText === "1 serving") {
    quantityText = `${multiplier} x ${food.servingSize}`;
  }

  return { food, multiplier, quantityText };
}

function findBestMatch(query: string): FoodItem | null {
  const lower = query.trim();
  if (!lower) return null;

  // Exact keyword match first
  let best: FoodItem | null = null;
  let bestScore = 0;

  for (const item of FOOD_DATABASE) {
    let score = 0;

    // Exact keyword match
    for (const kw of item.keywords) {
      if (kw === lower) {
        score = 100;
      } else if (lower.includes(kw)) {
        score = Math.max(score, 60 + kw.length);
      } else if (kw.includes(lower)) {
        score = Math.max(score, 40 + lower.length);
      }
    }

    // Name match
    const nameLower = item.name.toLowerCase();
    if (nameLower === lower) {
      score = Math.max(score, 90);
    } else if (nameLower.includes(lower)) {
      score = Math.max(score, 50);
    } else if (lower.includes(nameLower)) {
      score = Math.max(score, 45);
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore >= 40 ? best : null;
}

function scaleMacros(macros: Macros, multiplier: number): Macros {
  return {
    calories: Math.round(macros.calories * multiplier),
    protein: Math.round(macros.protein * multiplier * 10) / 10,
    carbs: Math.round(macros.carbs * multiplier * 10) / 10,
    fat: Math.round(macros.fat * multiplier * 10) / 10,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
