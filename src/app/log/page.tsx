"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getDayLog, addFoodEntry, removeFoodEntry } from "@/lib/storage";
import { calculateTargets } from "@/lib/targets";
import { todayStr } from "@/lib/utils";
import { UserProfile, DayLog, MacroTargets, FoodEntry } from "@/types";
import MacroRings from "@/components/MacroRings";
import FoodInput from "@/components/FoodInput";
import FoodLog from "@/components/FoodLog";
import NavBar from "@/components/NavBar";

export default function LogPage() {
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
        {/* Header with rings */}
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-4">Log Food</h1>
          <MacroRings current={dayLog.totals} targets={targets} size="sm" />
        </div>

        {/* Food Input - prominent */}
        <div className="mb-6">
          <FoodInput onAddEntries={handleAddEntries} />
        </div>

        {/* Today's Log */}
        <div>
          <h2 className="text-sm font-medium text-text-muted mb-3">
            Today ({dayLog.entries.length} items &middot; {dayLog.totals.calories} cal)
          </h2>
          <FoodLog entries={dayLog.entries} onRemove={handleRemoveEntry} />
        </div>
      </div>

      <NavBar />
    </div>
  );
}
