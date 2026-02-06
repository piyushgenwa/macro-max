"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/storage";
import { calculateTargets } from "@/lib/targets";
import { UserProfile } from "@/types";

type Step = "basics" | "body" | "goal" | "summary";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                i <= stepIndex ? "w-8 bg-accent" : "w-4 bg-surface-3"
              }`}
            />
          ))}
        </div>

        {/* Step: Basics */}
        {step === "basics" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome to MacroMax</h1>
              <p className="text-text-muted mt-1">Let&apos;s set up your profile</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateForm("age", e.target.value)}
                  placeholder="25"
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Sex</label>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateForm("sex", s)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        form.sex === s
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-surface-2 text-text-muted hover:border-text-muted"
                      }`}
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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Your Body</h1>
              <p className="text-text-muted mt-1">Used to calculate your daily targets</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => updateForm("heightCm", e.target.value)}
                  placeholder="170"
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weightKg}
                  onChange={(e) => updateForm("weightKg", e.target.value)}
                  placeholder="70"
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Activity Level</label>
                <div className="space-y-2">
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
                      className={`w-full px-4 py-3 rounded-xl border text-left transition-colors ${
                        form.activityLevel === opt.value
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface-2 hover:border-text-muted"
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-text-muted">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Goal */}
        {step === "goal" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Your Goal</h1>
              <p className="text-text-muted mt-1">This adjusts your calorie target</p>
            </div>

            <div className="space-y-3">
              {[
                { value: "lose", label: "Lose Weight", desc: "-500 cal/day deficit", icon: "↓" },
                { value: "maintain", label: "Maintain Weight", desc: "Stay at maintenance", icon: "=" },
                { value: "gain", label: "Gain Weight", desc: "+400 cal/day surplus", icon: "↑" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateForm("goal", opt.value)}
                  className={`w-full px-4 py-4 rounded-xl border text-left transition-colors flex items-center gap-4 ${
                    form.goal === opt.value
                      ? "border-accent bg-accent/10"
                      : "border-border bg-surface-2 hover:border-text-muted"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-text-muted">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Summary */}
        {step === "summary" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Your Daily Targets</h1>
              <p className="text-text-muted mt-1">Based on your profile, here are your recommended macros</p>
            </div>

            <div className="bg-surface-2 border border-border rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-ring-cal">{targets.calories}</div>
                <div className="text-sm text-text-muted">calories / day</div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-xl font-bold text-ring-protein">{targets.protein}g</div>
                  <div className="text-xs text-text-muted">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-ring-carbs">{targets.carbs}g</div>
                  <div className="text-xs text-text-muted">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-ring-fat">{targets.fat}g</div>
                  <div className="text-xs text-text-muted">Fat</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-muted text-center">
              You can adjust these later in settings
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step !== "basics" && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text transition-colors"
            >
              Back
            </button>
          )}
          {step !== "summary" ? (
            <button
              onClick={nextStep}
              disabled={step === "basics" && (!form.name || !form.age)}
              className="flex-1 py-3 rounded-xl bg-accent text-bg font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 py-3 rounded-xl bg-accent text-bg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
