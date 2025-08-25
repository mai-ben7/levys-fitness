import { NextResponse } from "next/server";
import { searchFoods } from "@/lib/nutrition-db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 25);
  
  if (!q.trim()) {
    return NextResponse.json({ 
      success: true,
      items: [],
      total: 0,
      source: "hebrew_nutrition_db"
    });
  }
  
  try {
    const items = searchFoods(q, limit);
    
    return NextResponse.json({
      success: true,
      items,
      total: items.length,
      source: "hebrew_nutrition_db"
    });
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json(
      { 
        error: "Failed to search for foods",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
