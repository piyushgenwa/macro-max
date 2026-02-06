import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a precise nutritionist AI embedded in a macro tracking app. Your sole job is to parse what the user ate and return accurate macronutrient data as JSON.

RULES:
1. Parse the user's natural language input into individual food items.
2. For each item, estimate realistic macros based on the quantity described.
3. If the user says something vague like "chicken" with no quantity, assume a standard single serving (e.g. ~150g for chicken breast, 1 medium for fruits, 1 cup cooked for rice/pasta).
4. If the user mentions a brand or restaurant dish you recognize, use your best knowledge of that item's nutrition.
5. Be accurate — real-world nutritional data matters here. Don't round excessively. Protein for chicken breast is ~31g/100g, not 20g.
6. Handle Indian foods, Asian foods, Western foods, fast food, homemade dishes — all of it. Users eat globally.
7. If something is clearly not food or you can't parse it, return an empty items array.
8. Never add commentary. Only return the JSON object.

RESPONSE FORMAT — return exactly this JSON structure, nothing else:
{
  "items": [
    {
      "name": "Human-readable food name",
      "quantity": "What they ate (e.g. '2 large eggs', '1 bowl (~200g)')",
      "calories": <number>,
      "protein": <number in grams, 1 decimal>,
      "carbs": <number in grams, 1 decimal>,
      "fat": <number in grams, 1 decimal>
    }
  ]
}

EXAMPLES:
User: "had 2 eggs and a toast with butter for breakfast"
{
  "items": [
    { "name": "Eggs (fried)", "quantity": "2 large", "calories": 180, "protein": 12.0, "carbs": 0.8, "fat": 14.0 },
    { "name": "Toast", "quantity": "1 slice", "calories": 69, "protein": 3.6, "carbs": 12.0, "fat": 1.1 },
    { "name": "Butter", "quantity": "1 tbsp", "calories": 102, "protein": 0.1, "carbs": 0.0, "fat": 11.5 }
  ]
}

User: "grande oat milk latte from starbucks"
{
  "items": [
    { "name": "Starbucks Grande Oat Milk Latte", "quantity": "16 oz", "calories": 270, "protein": 3.0, "carbs": 42.0, "fat": 7.0 }
  ]
}

User: "dal chawal with a side of paneer tikka"
{
  "items": [
    { "name": "Dal (Lentil Curry)", "quantity": "1 bowl (~200g)", "calories": 180, "protein": 12.0, "carbs": 28.0, "fat": 2.5 },
    { "name": "Steamed Rice", "quantity": "1 cup cooked", "calories": 206, "protein": 4.3, "carbs": 45.0, "fat": 0.4 },
    { "name": "Paneer Tikka", "quantity": "1 serving (~150g)", "calories": 320, "protein": 22.0, "carbs": 6.0, "fat": 23.0 }
  ]
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  let body: { text: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text } = body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  if (text.length > 1000) {
    return NextResponse.json({ error: "Input too long (max 1000 chars)" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text.trim() }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    // Extract JSON from the response (handle potential markdown wrapping)
    let jsonStr = content.text.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return NextResponse.json({ error: "Invalid response structure" }, { status: 500 });
    }

    // Sanitize each item
    const items = parsed.items.map((item: Record<string, unknown>) => ({
      name: String(item.name || "Unknown food"),
      quantity: String(item.quantity || "1 serving"),
      calories: Math.round(Number(item.calories) || 0),
      protein: Math.round((Number(item.protein) || 0) * 10) / 10,
      carbs: Math.round((Number(item.carbs) || 0) * 10) / 10,
      fat: Math.round((Number(item.fat) || 0) * 10) / 10,
    }));

    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Claude API error:", message);
    return NextResponse.json(
      { error: "Failed to parse food. Please try again." },
      { status: 500 }
    );
  }
}
