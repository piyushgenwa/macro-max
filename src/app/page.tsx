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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  const calPct = targets.calories > 0 ? Math.round((dayLog.totals.calories / targets.calories) * 100) : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 -left-20 w-60 h-60 rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-40 -right-20 w-48 h-48 rounded-full animate-float-delayed"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-40 left-1/3 w-40 h-40 rounded-full animate-float-slow"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Hey, <span className="gradient-text">{profile.name}</span>
              </h1>
              <p className="text-sm text-text-muted mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1.5 rounded-full text-xs font-semibold tabular-nums"
                style={{
                  background: calPct >= 100
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(99,102,241,0.1)",
                  color: calPct >= 100
                    ? "var(--color-green)"
                    : "var(--color-accent-light)",
                  border: `1px solid ${calPct >= 100 ? "rgba(34,197,94,0.2)" : "rgba(99,102,241,0.2)"}`,
                }}
              >
                {calPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Activity Rings Card */}
        <div
          className="glass rounded-3xl p-6 mb-4 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <MacroRings current={dayLog.totals} targets={targets} size="lg" />
        </div>

        {/* Macro Progress Bars */}
        <div
          className="glass rounded-2xl p-5 mb-8 space-y-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <MacroBar
            label="Calories"
            current={dayLog.totals.calories}
            target={targets.calories}
            color="var(--color-ring-cal)"
            glowColor="#f97316"
            unit=" kcal"
          />
          <MacroBar
            label="Protein"
            current={dayLog.totals.protein}
            target={targets.protein}
            color="var(--color-ring-protein)"
            glowColor="#06b6d4"
          />
          <MacroBar
            label="Carbs"
            current={dayLog.totals.carbs}
            target={targets.carbs}
            color="var(--color-ring-carbs)"
            glowColor="#a855f7"
          />
          <MacroBar
            label="Fat"
            current={dayLog.totals.fat}
            target={targets.fat}
            color="var(--color-ring-fat)"
            glowColor="#eab308"
          />
        </div>

        {/* Food Input */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-xs font-semibold text-text-muted mb-3 tracking-wider uppercase">Add Food</h2>
          <FoodInput onAddEntries={handleAddEntries} />
        </div>

        {/* Today's Log */}
        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <h2 className="text-xs font-semibold text-text-muted mb-3 tracking-wider uppercase">
            Today&apos;s Log
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
