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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-text-muted">Loading...</span>
        </div>
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

  const statCards = [
    {
      value: streak,
      label: "Day Streak",
      color: "var(--color-accent-light)",
      bgGlow: "rgba(99, 102, 241, 0.08)",
      borderGlow: "rgba(99, 102, 241, 0.15)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      value: avgCalories,
      label: "Avg Cal/Day",
      color: "var(--color-ring-cal)",
      bgGlow: "rgba(249, 115, 22, 0.08)",
      borderGlow: "rgba(249, 115, 22, 0.15)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      ),
    },
    {
      value: `${avgProtein}g`,
      label: "Avg Protein",
      color: "var(--color-ring-protein)",
      bgGlow: "rgba(6, 182, 212, 0.08)",
      borderGlow: "rgba(6, 182, 212, 0.15)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="gradient-text">History</span>
        </h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6 stagger-children">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="relative glass rounded-2xl p-4 text-center overflow-hidden"
              style={{
                boxShadow: `0 0 30px -10px ${stat.bgGlow}`,
              }}
            >
              {/* Subtle top glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.borderGlow}, transparent)` }}
              />
              <div className="flex justify-center mb-2" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold tabular-nums animate-count" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[10px] text-text-muted mt-1 font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Week chart */}
        <div className="glass rounded-2xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-text-muted tracking-wider uppercase">This Week</h2>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-[2px] rounded-full bg-white/[0.08]" />
                Target
              </span>
            </div>
          </div>
          <WeekChart logs={weekLogs} targets={targets} />
        </div>

        {/* Day-by-day list */}
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-xs font-semibold text-text-muted mb-3 tracking-wider uppercase">Recent Days</h2>
          <div className="space-y-2 stagger-children">
            {[...weekLogs].reverse().map((log) => {
              const hasData = log.entries.length > 0;
              return (
                <div
                  key={log.date}
                  className="glass rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium">{formatDate(log.date)}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        {hasData ? `${log.entries.length} items logged` : "No data"}
                      </div>
                    </div>
                    {hasData && (
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums" style={{ color: "var(--color-ring-cal)" }}>
                          {log.totals.calories}
                          <span className="text-[10px] font-normal text-text-muted ml-1">cal</span>
                        </div>
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
