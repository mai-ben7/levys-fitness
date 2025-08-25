import { readFileSync } from "fs";
import path from "path";

type Food = {
  id: string;
  name_he: string;
  category?: string;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  nutrients?: Record<string, any>;
};

type WeightMap = Record<string, { unit: string; grams: number }[]>;

let FOODS: Food[] | null = null;
let INDEX: { id: string; name_he: string; name_he_norm: string; category: string; kcal: number | null }[] | null = null;
let WEIGHTS: WeightMap | null = null;

function normHebrew(s: string) {
  return s.normalize("NFKC").replace(/[\u0591-\u05C7]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function loadNutrition() {
  if (FOODS && INDEX && WEIGHTS) return { FOODS, INDEX, WEIGHTS };

  try {
    const root = process.cwd();
    FOODS = JSON.parse(readFileSync(path.join(root, "data/processed/foods.json"), "utf8"));
    INDEX = JSON.parse(readFileSync(path.join(root, "data/processed/index.json"), "utf8"));
    WEIGHTS = JSON.parse(readFileSync(path.join(root, "data/processed/weights.json"), "utf8"));
  } catch (error) {
    console.error("Failed to load nutrition database:", error);
    // Return empty data if files don't exist yet
    FOODS = [];
    INDEX = [];
    WEIGHTS = {};
  }

  return { FOODS, INDEX, WEIGHTS };
}

export function searchFoods(query: string, limit = 25) {
  const { INDEX } = loadNutrition();
  const q = normHebrew(query);
  
  if (!q.trim()) return [];
  
  return INDEX!
    .filter(item => item.name_he_norm.includes(q))
    .slice(0, limit);
}

export function getFoodById(id: string) {
  const { FOODS } = loadNutrition();
  return FOODS!.find(f => f.id === id) || null;
}

export function getServingOptions(id: string) {
  const { WEIGHTS } = loadNutrition();
  return WEIGHTS![id] || [];
}

export function scalePerServing(food: Food, grams: number) {
  // nutrients are per 100g; scale linearly
  const factor = grams / 100;
  const out: Record<string, number> = {};
  if (typeof food.kcal === "number") out.kcal = +(food.kcal * factor).toFixed(2);
  if (typeof food.protein_g === "number") out.protein_g = +(food.protein_g * factor).toFixed(2);
  if (typeof food.carbs_g === "number") out.carbs_g = +(food.carbs_g * factor).toFixed(2);
  if (typeof food.fat_g === "number") out.fat_g = +(food.fat_g * factor).toFixed(2);
  return out;
}
