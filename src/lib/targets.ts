import { UserProfile, MacroTargets } from "@/types";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 400,
};

export function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor equation
  let bmr: number;
  if (profile.sex === "male") {
    bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
  }

  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
}

export function calculateTargets(profile: UserProfile): MacroTargets {
  const tdee = calculateTDEE(profile);
  const targetCalories = tdee + GOAL_ADJUSTMENTS[profile.goal];

  // Standard macro split: 30% protein, 40% carbs, 30% fat
  const proteinCals = targetCalories * 0.3;
  const carbsCals = targetCalories * 0.4;
  const fatCals = targetCalories * 0.3;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(proteinCals / 4), // 4 cal/g
    carbs: Math.round(carbsCals / 4), // 4 cal/g
    fat: Math.round(fatCals / 9), // 9 cal/g
  };
}
