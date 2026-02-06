"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getDayLog, addFoodEntry, removeFoodEntry } from "@/lib/storage";
import { calculateTargets } from "@/lib/targets";
import { todayStr } from "@/lib/utils";
import { UserProfile, DayLog, MacroTargets, FoodEntry } from "@/types";
import MacroRings from "@/components/MacroRings";
import MacroBar from "@/components/MacroBar";
import FoodInput from "@/components/FoodInput";
import FoodLog from "@/components/FoodLog";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dayLog, setDayLog] = useState<DayLog | null>(null);
  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getProfile();
    if (!p) {
      router.push("/onboarding");
      return;
    }
    setProfile(p);
    setTargets(calculateTargets(p));
    setDayLog(getDayLog(todayStr()));
  }, [router]);

  function handleAddEntries(entries: FoodEntry[]) {
    const date = todayStr();
    entries.forEach((entry) => addFoodEntry(date, entry));
    setDayLog(getDayLog(date));
  }

  function handleRemoveEntry(id: string) {
    const date = todayStr();
    removeFoodEntry(date, id);
    setDayLog(getDayLog(date));
  }

  if (!mounted || !profile || !targets || !dayLog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">Hey, {profile.name}</h1>
          <p className="text-sm text-text-muted">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Activity Rings */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <MacroRings current={dayLog.totals} targets={targets} size="lg" />
        </div>

        {/* Macro Progress Bars */}
        <div className="bg-surface border border-border rounded-2xl p-4 mb-6 space-y-3">
          <MacroBar
            label="Calories"
            current={dayLog.totals.calories}
            target={targets.calories}
            color="var(--color-ring-cal)"
            unit=" kcal"
          />
          <MacroBar
            label="Protein"
            current={dayLog.totals.protein}
            target={targets.protein}
            color="var(--color-ring-protein)"
          />
          <MacroBar
            label="Carbs"
            current={dayLog.totals.carbs}
            target={targets.carbs}
            color="var(--color-ring-carbs)"
          />
          <MacroBar
            label="Fat"
            current={dayLog.totals.fat}
            target={targets.fat}
            color="var(--color-ring-fat)"
          />
        </div>

        {/* Food Input */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-text-muted mb-3">Add Food</h2>
          <FoodInput onAddEntries={handleAddEntries} />
        </div>

        {/* Today's Log */}
        <div>
          <h2 className="text-sm font-medium text-text-muted mb-3">
            Today&apos;s Log ({dayLog.entries.length} items)
          </h2>
          <FoodLog entries={dayLog.entries} onRemove={handleRemoveEntry} />
        </div>
      </div>

      <NavBar />
    </div>
  );
}
