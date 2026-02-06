import { UserProfile, DayLog, FoodEntry, Macros } from "@/types";

const KEYS = {
  profile: "macromax_profile",
  logs: "macromax_logs",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(KEYS.profile);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function getAllLogs(): Record<string, DayLog> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem(KEYS.logs);
  return data ? JSON.parse(data) : {};
}

export function getDayLog(date: string): DayLog {
  const logs = getAllLogs();
  return logs[date] || { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
}

export function addFoodEntry(date: string, entry: FoodEntry): void {
  const logs = getAllLogs();
  const dayLog = logs[date] || { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };

  dayLog.entries.push(entry);
  dayLog.totals = recalcTotals(dayLog.entries);
  logs[date] = dayLog;

  if (isBrowser()) {
    localStorage.setItem(KEYS.logs, JSON.stringify(logs));
  }
}

export function removeFoodEntry(date: string, entryId: string): void {
  const logs = getAllLogs();
  const dayLog = logs[date];
  if (!dayLog) return;

  dayLog.entries = dayLog.entries.filter((e) => e.id !== entryId);
  dayLog.totals = recalcTotals(dayLog.entries);
  logs[date] = dayLog;

  if (isBrowser()) {
    localStorage.setItem(KEYS.logs, JSON.stringify(logs));
  }
}

function recalcTotals(entries: FoodEntry[]): Macros {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.macros.calories,
      protein: acc.protein + e.macros.protein,
      carbs: acc.carbs + e.macros.carbs,
      fat: acc.fat + e.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getRecentLogs(days: number): DayLog[] {
  const logs = getAllLogs();
  const result: DayLog[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    result.push(logs[dateStr] || { date: dateStr, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
  }

  return result;
}
