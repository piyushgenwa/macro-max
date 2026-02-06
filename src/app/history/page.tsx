"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getRecentLogs } from "@/lib/storage";
import { calculateTargets } from "@/lib/targets";
import { formatDate } from "@/lib/utils";
import { UserProfile, DayLog, MacroTargets } from "@/types";
import MacroRings from "@/components/MacroRings";
import WeekChart from "@/components/WeekChart";
import NavBar from "@/components/NavBar";

export default function HistoryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [weekLogs, setWeekLogs] = useState<DayLog[]>([]);
  const [monthLogs, setMonthLogs] = useState<DayLog[]>([]);
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
    setWeekLogs(getRecentLogs(7));
    setMonthLogs(getRecentLogs(30));
  }, [router]);

  if (!mounted || !profile || !targets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  // Weekly averages
  const daysWithData = weekLogs.filter((l) => l.entries.length > 0);
  const avgCalories = daysWithData.length > 0
    ? Math.round(daysWithData.reduce((s, l) => s + l.totals.calories, 0) / daysWithData.length)
    : 0;
  const avgProtein = daysWithData.length > 0
    ? Math.round(daysWithData.reduce((s, l) => s + l.totals.protein, 0) / daysWithData.length)
    : 0;

  // Streak calculation
  let streak = 0;
  for (let i = monthLogs.length - 1; i >= 0; i--) {
    if (monthLogs[i].entries.length > 0) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">History</h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">{streak}</div>
            <div className="text-xs text-text-muted">Day Streak</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-ring-cal">{avgCalories}</div>
            <div className="text-xs text-text-muted">Avg Cal/Day</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-ring-protein">{avgProtein}g</div>
            <div className="text-xs text-text-muted">Avg Protein</div>
          </div>
        </div>

        {/* Week chart */}
        <div className="bg-surface border border-border rounded-2xl p-4 mb-6">
          <h2 className="text-sm font-medium text-text-muted mb-4">This Week</h2>
          <WeekChart logs={weekLogs} targets={targets} />
        </div>

        {/* Day-by-day list */}
        <div>
          <h2 className="text-sm font-medium text-text-muted mb-3">Recent Days</h2>
          <div className="space-y-2">
            {[...weekLogs].reverse().map((log) => {
              const hasData = log.entries.length > 0;
              return (
                <div
                  key={log.date}
                  className="bg-surface-2 border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium">{formatDate(log.date)}</div>
                      <div className="text-xs text-text-muted">
                        {hasData ? `${log.entries.length} items logged` : "No data"}
                      </div>
                    </div>
                    {hasData && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-ring-cal">{log.totals.calories} cal</div>
                      </div>
                    )}
                  </div>
                  {hasData && (
                    <MacroRings current={log.totals} targets={targets} size="sm" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
