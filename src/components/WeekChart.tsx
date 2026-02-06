"use client";

import { DayLog, MacroTargets } from "@/types";
import { formatDate } from "@/lib/utils";

interface WeekChartProps {
  logs: DayLog[];
  targets: MacroTargets;
}

export default function WeekChart({ logs, targets }: WeekChartProps) {
  const maxCal = Math.max(targets.calories, ...logs.map((l) => l.totals.calories)) * 1.1;

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 h-40">
        {logs.map((log, i) => {
          const calHeight = maxCal > 0 ? (log.totals.calories / maxCal) * 100 : 0;
          const targetHeight = maxCal > 0 ? (targets.calories / maxCal) * 100 : 0;
          const isToday = i === logs.length - 1;
          const overTarget = log.totals.calories > targets.calories;

          return (
            <div key={log.date} className="flex-1 flex flex-col items-center gap-1 h-full">
              {/* Bar container */}
              <div className="flex-1 w-full flex items-end justify-center relative">
                {/* Target line */}
                <div
                  className="absolute w-full border-t border-dashed border-text-muted/30"
                  style={{ bottom: `${targetHeight}%` }}
                />
                {/* Bar */}
                <div
                  className={`w-full max-w-8 rounded-t-md transition-all duration-500 ${
                    isToday ? "opacity-100" : "opacity-70"
                  }`}
                  style={{
                    height: `${calHeight}%`,
                    background: overTarget
                      ? "linear-gradient(to top, var(--color-ring-cal), var(--color-red))"
                      : "linear-gradient(to top, var(--color-ring-cal), var(--color-accent))",
                  }}
                />
              </div>
              {/* Label */}
              <div className="text-center">
                <div className={`text-[10px] ${isToday ? "text-accent font-medium" : "text-text-muted"}`}>
                  {isToday ? "Today" : formatDate(log.date).split(",")[0].split(" ")[0]}
                </div>
                {log.totals.calories > 0 && (
                  <div className="text-[10px] text-text-muted">{log.totals.calories}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
