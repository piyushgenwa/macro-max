"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/storage";
import { calculateTargets } from "@/lib/targets";
import { UserProfile } from "@/types";

type Step = "basics" | "body" | "goal" | "summary";

const GOAL_ICONS: Record<string, React.ReactNode> = {
  lose: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  ),
  maintain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  ),
  gain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  ),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "male" as "male" | "female",
    heightCm: "",
    weightKg: "",
    activityLevel: "moderate" as UserProfile["activityLevel"],
    goal: "maintain" as UserProfile["goal"],
  });

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step === "basics") setStep("body");
    else if (step === "body") setStep("goal");
    else if (step === "goal") setStep("summary");
  }

  function prevStep() {
    if (step === "body") setStep("basics");
    else if (step === "goal") setStep("body");
    else if (step === "summary") setStep("goal");
  }

  function finish() {
    const profile: UserProfile = {
      name: form.name,
      age: parseInt(form.age),
      sex: form.sex,
      heightCm: parseFloat(form.heightCm),
      weightKg: parseFloat(form.weightKg),
      activityLevel: form.activityLevel,
      goal: form.goal,
      onboardedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    router.push("/");
  }

  const profile: UserProfile = {
    name: form.name || "User",
    age: parseInt(form.age) || 25,
    sex: form.sex,
    heightCm: parseFloat(form.heightCm) || 170,
    weightKg: parseFloat(form.weightKg) || 70,
    activityLevel: form.activityLevel,
    goal: form.goal,
    onboardedAt: "",
  };
  const targets = calculateTargets(profile);

  const STEPS: Step[] = ["basics", "body", "goal", "summary"];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Background ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-72 h-72 rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full animate-float-delayed"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Progress bar */}
        <div className="flex justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="relative">
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i <= stepIndex ? "2rem" : "1rem",
                  background: i <= stepIndex
                    ? "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: i <= stepIndex ? "0 0 10px -2px rgba(99,102,241,0.4)" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Step: Basics */}
        {step === "basics" && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to <span className="gradient-text">MacroMax</span>
              </h1>
              <p className="text-text-muted mt-2 text-sm">Let&apos;s set up your profile</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 tracking-wide uppercase">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-text placeholder:text-text-muted/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 tracking-wide uppercase">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateForm("age", e.target.value)}
                  placeholder="25"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-text placeholder:text-text-muted/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 tracking-wide uppercase">Sex</label>
                <div className="flex gap-3">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateForm("sex", s)}
                      className={`relative flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 btn-press ${
                        form.sex === s
                          ? "text-accent-light"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                      style={{
                        background: form.sex === s ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.sex === s ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
                        boxShadow: form.sex === s ? "0 0 20px -5px rgba(99,102,241,0.2)" : "none",
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Body */}
        {step === "body" && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="gradient-text">Your Body</span>
              </h1>
              <p className="text-text-muted mt-2 text-sm">Used to calculate your daily targets</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 tracking-wide uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => updateForm("heightCm", e.target.value)}
                  placeholder="170"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-text placeholder:text-text-muted/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 tracking-wide uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weightKg}
                  onChange={(e) => updateForm("weightKg", e.target.value)}
                  placeholder="70"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-text placeholder:text-text-muted/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-3 tracking-wide uppercase">Activity Level</label>
                <div className="space-y-2 stagger-children">
                  {[
                    { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
                    { value: "light", label: "Light", desc: "Exercise 1-3 days/week" },
                    { value: "moderate", label: "Moderate", desc: "Exercise 3-5 days/week" },
                    { value: "active", label: "Active", desc: "Exercise 6-7 days/week" },
                    { value: "very_active", label: "Very Active", desc: "Intense daily exercise" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateForm("activityLevel", opt.value)}
                      className={`w-full px-4 py-3.5 rounded-xl text-left transition-all duration-300 btn-press ${
                        form.activityLevel === opt.value
                          ? "text-text"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                      style={{
                        background: form.activityLevel === opt.value ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.activityLevel === opt.value ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
                        boxShadow: form.activityLevel === opt.value ? "0 0 20px -5px rgba(99,102,241,0.15)" : "none",
                      }}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Goal */}
        {step === "goal" && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="gradient-text">Your Goal</span>
              </h1>
              <p className="text-text-muted mt-2 text-sm">This adjusts your calorie target</p>
            </div>

            <div className="space-y-3 stagger-children">
              {[
                { value: "lose", label: "Lose Weight", desc: "-500 cal/day deficit" },
                { value: "maintain", label: "Maintain Weight", desc: "Stay at maintenance" },
                { value: "gain", label: "Gain Weight", desc: "+400 cal/day surplus" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateForm("goal", opt.value)}
                  className={`w-full px-5 py-5 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 btn-press ${
                    form.goal === opt.value
                      ? "text-text"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                  style={{
                    background: form.goal === opt.value ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.goal === opt.value ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: form.goal === opt.value ? "0 0 25px -5px rgba(99,102,241,0.2)" : "none",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: form.goal === opt.value ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                      color: form.goal === opt.value ? "var(--color-accent-light)" : "var(--color-text-muted)",
                    }}
                  >
                    {GOAL_ICONS[opt.value]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Summary */}
        {step === "summary" && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="gradient-text">Your Daily Targets</span>
              </h1>
              <p className="text-text-muted mt-2 text-sm">Based on your profile, here are your recommended macros</p>
            </div>

            <div className="glass rounded-3xl p-8 space-y-6 relative overflow-hidden">
              {/* Subtle glow behind calories */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }}
              />

              <div className="text-center relative">
                <div
                  className="text-5xl font-extrabold tabular-nums animate-count"
                  style={{ color: "var(--color-ring-cal)" }}
                >
                  {targets.calories}
                </div>
                <div className="text-xs text-text-muted mt-1 tracking-wide uppercase font-medium">calories / day</div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">
                <div className="text-center">
                  <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-ring-protein)" }}>
                    {targets.protein}g
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 tracking-wide uppercase font-medium">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-ring-carbs)" }}>
                    {targets.carbs}g
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 tracking-wide uppercase font-medium">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-ring-fat)" }}>
                    {targets.fat}g
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 tracking-wide uppercase font-medium">Fat</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center">
              You can adjust these later in settings
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-10">
          {step !== "basics" && (
            <button
              onClick={prevStep}
              className="flex-1 py-3.5 rounded-xl text-sm font-medium text-text-muted hover:text-text transition-all duration-300 btn-press"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Back
            </button>
          )}
          {step !== "summary" ? (
            <button
              onClick={nextStep}
              disabled={step === "basics" && (!form.name || !form.age)}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-20 transition-all duration-300 btn-press"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                boxShadow: "0 0 25px -5px rgba(99,102,241,0.4)",
              }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 btn-press"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                boxShadow: "0 0 25px -5px rgba(99,102,241,0.4)",
              }}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
