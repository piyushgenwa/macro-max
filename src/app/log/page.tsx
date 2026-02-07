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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
        {/* Header with compact rings */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">Log Food</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="tabular-nums font-semibold" style={{ color: "var(--color-ring-cal)" }}>
                {dayLog.totals.calories}
              </span>
              <span>cal today</span>
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <MacroRings current={dayLog.totals} targets={targets} size="sm" />
          </div>
        </div>

        {/* Food Input - prominent */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <FoodInput onAddEntries={handleAddEntries} />
        </div>

        {/* Today's Log */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-xs font-semibold text-text-muted mb-3 tracking-wider uppercase">
            Today
            {dayLog.entries.length > 0 && (
              <span className="ml-2 text-text-secondary font-normal normal-case tracking-normal">
                {dayLog.entries.length} items
              </span>
            )}
          </h2>
          <FoodLog entries={dayLog.entries} onRemove={handleRemoveEntry} />
        </div>
      </div>

      <NavBar />
    </div>
  );
}
