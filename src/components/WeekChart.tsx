"use client";

import { useEffect, useState } from "react";
import { DayLog, MacroTargets } from "@/types";
import { formatDate } from "@/lib/utils";

interface WeekChartProps {
  logs: DayLog[];
  targets: MacroTargets;
}

export default function WeekChart({ logs, targets }: WeekChartProps) {
  const [animated, setAnimated] = useState(false);
  const maxCal = Math.max(targets.calories, ...logs.map((l) => l.totals.calories)) * 1.1;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-44">
        {logs.map((log, i) => {
          const calHeight = maxCal > 0 ? (log.totals.calories / maxCal) * 100 : 0;
          const targetHeight = maxCal > 0 ? (targets.calories / maxCal) * 100 : 0;
          const isToday = i === logs.length - 1;
          const overTarget = log.totals.calories > targets.calories;
          const hasData = log.totals.calories > 0;

          return (
            <div key={log.date} className="flex-1 flex flex-col items-center gap-1.5 h-full">
              {/* Bar container */}
              <div className="flex-1 w-full flex items-end justify-center relative">
                {/* Target line */}
                <div
                  className="absolute w-full"
                  style={{ bottom: `${targetHeight}%` }}
                >
                  <div className="w-full border-t border-dashed border-white/[0.08]" />
                </div>
                {/* Bar */}
                <div
                  className="w-full max-w-9 rounded-lg transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    height: animated ? `${calHeight}%` : "0%",
                    transitionDelay: `${i * 80}ms`,
                    background: hasData
                      ? overTarget
                        ? "linear-gradient(to top, #f97316, #ef4444)"
                        : isToday
                          ? "linear-gradient(to top, var(--color-accent-dim), var(--color-accent-light))"
                          : "linear-gradient(to top, rgba(99,102,241,0.3), rgba(99,102,241,0.5))"
                      : "rgba(255,255,255,0.02)",
                    boxShadow: hasData && isToday
                      ? "0 0 20px -5px rgba(99,102,241,0.4)"
                      : "none",
                  }}
                >
                  {/* Shimmer on today's bar */}
                  {isToday && hasData && (
                    <div className="absolute inset-0">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Label */}
              <div className="text-center">
                <div className={`text-[10px] font-medium ${
                  isToday ? "text-accent-light" : "text-text-muted"
                }`}>
                  {isToday ? "Today" : formatDate(log.date).split(",")[0].split(" ")[0].slice(0, 3)}
                </div>
                {hasData && (
                  <div className="text-[10px] text-text-muted tabular-nums">{log.totals.calories}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
