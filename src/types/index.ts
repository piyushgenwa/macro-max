export interface UserProfile {
  name: string;
  age: number;
  sex: "male" | "female";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  onboardedAt: string;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroTargets extends Macros {}

export interface FoodEntry {
  id: string;
  name: string;
  quantity: string;
  macros: Macros;
  timestamp: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totals: Macros;
}

export interface FoodItem {
  name: string;
  servingSize: string;
  macros: Macros;
  keywords: string[];
}
