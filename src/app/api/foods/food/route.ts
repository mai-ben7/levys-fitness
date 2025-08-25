import { NextResponse } from "next/server";
import { getFoodById, getServingOptions, scalePerServing } from "@/lib/nutrition-db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const unit = searchParams.get("unit");   // optional: name of serving unit
  const gramsStr = searchParams.get("grams"); // optional: numeric grams

  if (!id) {
    return NextResponse.json({ error: "Missing ?id parameter" }, { status: 400 });
  }

  try {
    const food = getFoodById(id);
    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    const servings = getServingOptions(id);
    let perServing = null;

    if (gramsStr) {
      const g = Number(gramsStr);
      if (isFinite(g) && g > 0) {
        perServing = scalePerServing(food, g);
      }
    } else if (unit && servings.length) {
      const match = servings.find(s => s.unit === unit);
      if (match) {
        perServing = scalePerServing(food, match.grams);
      }
    }

    return NextResponse.json({
      success: true,
      food,
      servings,
      perServing,
      source: "hebrew_nutrition_db"
    });

  } catch (error) {
    console.error("Food details error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get food details",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
