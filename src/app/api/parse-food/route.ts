import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are MacroMax, a precise nutritional analysis engine. Your sole job is to parse natural-language food descriptions into structured macronutrient data.

RULES:
1. Parse every distinct food item from the user's input.
2. For each item, estimate calories (kcal), protein (g), carbs (g), and fat (g) based on standard USDA/nutritional reference data.
3. Respect quantities and units the user provides (e.g. "2 cups of rice", "3 eggs", "half an avocado"). If no quantity is given, assume 1 standard serving.
4. Handle common shorthand: "pb" = peanut butter, "oj" = orange juice, etc.
5. For composite/restaurant foods (e.g. "Big Mac", "chicken tikka masala"), estimate based on typical recipes.
6. If a food item is ambiguous or unrecognizable, make your best reasonable estimate and include it — never skip items.
7. Round calories to whole numbers. Round protein, carbs, and fat to 1 decimal place.
8. Return ONLY valid JSON — no markdown, no explanation, no extra text.

RESPONSE FORMAT (strict JSON object with "entries" key):
{
  "entries": [
    {
      "name": "Display name of the food",
      "quantity": "Human-readable quantity string (e.g. '2 large eggs', '1 cup cooked')",
      "macros": {
        "calories": 144,
        "protein": 12.0,
        "carbs": 0.8,
        "fat": 10.0
      }
    }
  ]
}

If the input contains no recognizable food items, return: {"entries": []}`;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Missing or empty text field" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text.trim() },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    // Parse the response — expect {"entries": [...]} but handle other wrappers
    const parsed = JSON.parse(content);
    let items: unknown[];
    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (Array.isArray(parsed.entries)) {
      items = parsed.entries;
    } else {
      // Fallback: find the first array value in the object
      const arr = Object.values(parsed).find((v) => Array.isArray(v));
      items = (arr as unknown[]) || [];
    }

    // Validate and sanitize each entry
    const entries = (items as Record<string, unknown>[]).map(
      (item: Record<string, unknown>) => {
        const macros = item.macros as Record<string, unknown> | undefined;
        return {
          name: String(item.name || "Unknown food"),
          quantity: String(item.quantity || "1 serving"),
          macros: {
            calories: Math.round(Number(macros?.calories) || 0),
            protein:
              Math.round((Number(macros?.protein) || 0) * 10) / 10,
            carbs: Math.round((Number(macros?.carbs) || 0) * 10) / 10,
            fat: Math.round((Number(macros?.fat) || 0) * 10) / 10,
          },
        };
      }
    );

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Parse food API error:", error);
    return NextResponse.json(
      { error: "Failed to parse food input" },
      { status: 500 }
    );
  }
}
